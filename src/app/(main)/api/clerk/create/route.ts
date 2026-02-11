import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

// Validation schema for user creation
const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().min(1, "Address is required"),
  role: z.enum(["admin", "eksekutif", "manajer", "supervisor", "karyawan"]),
});

/**
 * POST /api/clerk/create
 * Creates a new user in Clerk and adds them to the organization
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const { firstName, lastName, email, username, password, address, role } = validationResult.data;

    // Get organization ID from environment variable
    const organizationId = process.env.CLERK_ORGANIZATION_ID;

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Organization ID not configured. Please set CLERK_ORGANIZATION_ID in your environment variables.",
        },
        { status: 400 },
      );
    }

    const client = await clerkClient();

    // Check if email already exists
    try {
      const existingUsersByEmail = await client.users.getUserList({
        emailAddress: [email],
      });

      if (existingUsersByEmail.data.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already exists",
            error: `A user with email "${email}" already exists in the system.`,
          },
          { status: 409 },
        );
      }
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
    }

    // Check if username already exists
    try {
      const existingUsersByUsername = await client.users.getUserList({
        username: [username],
      });

      if (existingUsersByUsername.data.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Username already exists",
            error: `Username "${username}" is already taken. Please choose a different username.`,
          },
          { status: 409 },
        );
      }
    } catch (error) {
      console.error("Error checking username uniqueness:", error);
    }

    // Create user in Clerk
    const user = await client.users.createUser({
      emailAddress: [email],
      username,
      firstName,
      lastName,
      password,
      publicMetadata: {
        address: address,
      },
    });

    // Add user to organization with role
    const membership = await client.organizations.createOrganizationMembership({
      organizationId,
      userId: user.id,
      role: `org:${role}`, // Format: org:admin, org:eksekutif, etc.
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: {
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        username: user.username,
        fullName: `${user.firstName} ${user.lastName}`,
        role: membership.role,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle specific Clerk errors
    if (error instanceof Error) {
      // Check for duplicate email/username errors
      if (error.message.includes("already exists")) {
        return NextResponse.json(
          {
            success: false,
            message: "A user with this email or username already exists",
            error: error.message,
          },
          { status: 409 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
