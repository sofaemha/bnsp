import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

// Role hierarchy (highest to lowest)
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 5,
  eksekutif: 4,
  manajer: 3,
  supervisor: 2,
  karyawan: 1,
};

// Validation schema for user update
const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens (-), and underscores (_)")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  address: z.string().min(1, "Address is required").optional(),
  role: z.enum(["admin", "eksekutif", "manajer", "supervisor", "karyawan"]).optional(),
  currentUserRole: z.string().min(1, "Current user role is required"),
});

/**
 * PATCH /api/clerk/update
 * Updates a user in Clerk with role-based authorization
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = updateUserSchema.safeParse(body);
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

    const { userId, firstName, lastName, email, username, password, address, role, currentUserRole } =
      validationResult.data;

    const client = await clerkClient();

    // If role is being changed, check permissions
    if (role) {
      const organizationId = process.env.CLERK_ORGANIZATION_ID;
      if (!organizationId) {
        return NextResponse.json(
          {
            success: false,
            message: "Organization ID not configured",
          },
          { status: 400 },
        );
      }

      // Get current user's role hierarchy level
      const currentUserLevel = ROLE_HIERARCHY[currentUserRole.toLowerCase()] || 0;

      // Get target user's current role
      const memberships = await client.organizations.getOrganizationMembershipList({
        organizationId,
      });

      const targetMembership = memberships.data.find((m) => m?.publicUserData?.userId === userId);

      if (targetMembership) {
        const currentRole = targetMembership.role.split(":")[1] || "";
        const currentRoleLevel = ROLE_HIERARCHY[currentRole.toLowerCase()] || 0;
        const newRoleLevel = ROLE_HIERARCHY[role.toLowerCase()] || 0;

        // Check if current user has higher authority than target user's current role
        if (currentUserLevel <= currentRoleLevel) {
          return NextResponse.json(
            {
              success: false,
              message: `You cannot modify a user with equal or higher role (${currentRole})`,
            },
            { status: 403 },
          );
        }

        // Check if current user has higher authority than the new role they're trying to assign
        if (currentUserLevel <= newRoleLevel) {
          return NextResponse.json(
            {
              success: false,
              message: "You cannot assign a role equal to or higher than your own",
            },
            { status: 403 },
          );
        }

        // Update organization membership role
        await client.organizations.updateOrganizationMembership({
          organizationId,
          userId,
          role: `org:${role}`,
        });
      }
    }

    // Update user basic information
    const updateData: {
      firstName?: string;
      lastName?: string;
      username?: string;
      primaryEmailAddressId?: string;
    } = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;

    // Handle email update
    if (email !== undefined) {
      try {
        // Create new email address
        const emailAddress = await client.emailAddresses.createEmailAddress({
          userId,
          emailAddress: email,
          verified: true,
        });

        // Set as primary email
        updateData.primaryEmailAddressId = emailAddress.id;

        await client.users.updateUser(userId, updateData);

        // Notify user about email change (always true as requested)
        // This happens automatically when we set the new primary email
      } catch (error) {
        if (error instanceof Error && error.message.includes("already exists")) {
          return NextResponse.json(
            {
              success: false,
              message: "This email address is already in use",
            },
            { status: 400 },
          );
        }
        throw error;
      }
    } else if (Object.keys(updateData).length > 0) {
      // Update user if there's data to update (and no email change)
      await client.users.updateUser(userId, updateData);
    }

    // Handle password update
    if (password !== undefined) {
      await client.users.updateUser(userId, {
        password,
      });

      // Sign out of other sessions by getting all sessions and revoking them
      const sessions = await client.users.getUserList({
        userId: [userId],
      });

      if (sessions.data.length > 0) {
        const userSessions = await client.sessions.getSessionList({
          userId,
        });

        // Revoke all sessions to sign out from all devices
        for (const session of userSessions.data) {
          try {
            await client.sessions.revokeSession(session.id);
          } catch (error) {
            console.error(`Failed to revoke session ${session.id}:`, error);
          }
        }
      }
    }

    // Handle address update
    if (address !== undefined) {
      await client.users.updateUserMetadata(userId, {
        publicMetadata: { address },
      });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: {
        userId,
        updatedFields: {
          firstName: firstName !== undefined,
          lastName: lastName !== undefined,
          email: email !== undefined,
          username: username !== undefined,
          password: password !== undefined,
          address: address !== undefined,
          role: role !== undefined,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    // Check for username uniqueness error
    if (error instanceof Error && error.message.toLowerCase().includes("username")) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
