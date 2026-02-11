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

// Roles that can delete other users (Manajer and above)
const CAN_DELETE_OTHERS = ["admin", "eksekutif", "manajer"];

// Validation schema for user deletion
const deleteUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  currentUserId: z.string().min(1, "Current user ID is required"),
  currentUserRole: z.string().min(1, "Current user role is required"),
});

/**
 * DELETE /api/clerk/delete
 * Deletes a user from Clerk with role-based authorization
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = deleteUserSchema.safeParse(body);
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

    const { userId, currentUserId, currentUserRole } = validationResult.data;

    // Get organization ID from environment variable
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

    const client = await clerkClient();

    // Check if user is trying to delete themselves
    const isSelfDelete = userId === currentUserId;

    // Get current user's role hierarchy level
    const currentUserLevel = ROLE_HIERARCHY[currentUserRole.toLowerCase()] || 0;

    // Supervisor and Karyawan can only delete themselves
    if (!CAN_DELETE_OTHERS.includes(currentUserRole.toLowerCase())) {
      if (!isSelfDelete) {
        return NextResponse.json(
          {
            success: false,
            message: `${currentUserRole} role can only delete their own account`,
          },
          { status: 403 },
        );
      }
    }

    // If not self-delete, check hierarchy permissions
    if (!isSelfDelete) {
      // Get target user's organization membership to check their role
      const memberships = await client.organizations.getOrganizationMembershipList({
        organizationId,
      });

      const targetMembership = memberships.data.find((m) => m?.publicUserData?.userId === userId);

      if (!targetMembership) {
        return NextResponse.json(
          {
            success: false,
            message: "Target user not found in organization",
          },
          { status: 404 },
        );
      }

      // Extract target user's role
      const targetRole = targetMembership.role.split(":")[1] || "";
      const targetUserLevel = ROLE_HIERARCHY[targetRole.toLowerCase()] || 0;

      // Check if current user has higher authority than target user
      if (currentUserLevel <= targetUserLevel) {
        return NextResponse.json(
          {
            success: false,
            message: `You cannot delete a user with equal or higher role (${targetRole})`,
          },
          { status: 403 },
        );
      }
    }

    // Delete the user
    await client.users.deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: {
        userId,
      },
    });
  } catch (error) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
