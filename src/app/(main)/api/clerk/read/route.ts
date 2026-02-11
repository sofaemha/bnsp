import { NextResponse } from "next/server";

import { clerkClient } from "@clerk/nextjs/server";

/**
 * GET /api/clerk/read
 * Retrieves organization members from Clerk
 */
export async function GET() {
  try {
    const client = await clerkClient();

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

    // Get all organization members from Clerk
    const members = await client.organizations.getOrganizationMembershipList({
      organizationId,
    });

    return NextResponse.json({
      success: true,
      data: members.data,
      totalCount: members.totalCount,
    });
  } catch (error) {
    console.error("Error fetching organization members from Clerk:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch organization members",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
