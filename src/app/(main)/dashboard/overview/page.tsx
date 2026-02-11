import { clerkClient } from "@clerk/nextjs/server";

import { SectionCards } from "./_components/section-cards";
import { UserDataTable } from "./_components/user-data-table";

/**
 * Fetch all users from Clerk API
 */
async function getAllUsers() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/clerk/read`, {
      cache: "no-store", // Disable caching for fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
}

/**
 * Format date to long format: "Sunday, February 2nd 2026"
 */
function formatLongDate(timestamp: number): string {
  const date = new Date(timestamp);

  // Get ordinal suffix for day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const ordinal = getOrdinalSuffix(day);

  return `${weekday}, ${month} ${day}${ordinal} ${year}`;
}

/**
 * Transform Clerk organization membership data to match DataTable schema
 */
function transformClerkUsersToTableData(
  clerkMembers: Array<{
    id: string;
    role: string;
    publicUserData: {
      userId: string;
      identifier: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string;
      hasImage: boolean;
    };
    createdAt: number;
    updatedAt: number;
  }>,
) {
  return clerkMembers.map((member, index) => {
    // Extract role from "org:role" format and capitalize first letter
    const roleRaw = member.role || "";
    const rolePart = roleRaw.split(":")[1] || roleRaw;
    const roleFormatted = rolePart.charAt(0).toUpperCase() + rolePart.slice(1);

    // Extract address from public metadata (need to fetch full user data)
    const address = "N/A"; // Will be populated by getUserData

    return {
      id: index + 1, // Index + 1
      uid: member.publicUserData.userId, // Clerk User ID
      euid: member.publicUserData.identifier, // Email/identifier
      fullName: `${member.publicUserData.firstName || ""} ${member.publicUserData.lastName || ""}`.trim() || "N/A", // Full Name
      username: member.publicUserData.identifier.split("@")[0] || "N/A", // Username from email
      email: member.publicUserData.identifier || "N/A", // Email
      address, // Address from user metadata
      role: roleFormatted || "N/A", // Role (formatted)
      created: formatLongDate(member.createdAt), // Created date (long format)
      updated: formatLongDate(member.updatedAt), // Updated date (long format)
      avatar: member.publicUserData.imageUrl || "", // Avatar URL
    };
  });
}

/**
 * Fetch actual user data from Clerk by user ID
 */
async function getUserData(userId: string) {
  try {
    const client = await clerkClient();

    // Get user by ID
    const user = await client.users.getUser(userId);

    if (user) {
      // Get organization memberships to find role
      const organizationId = process.env.CLERK_ORGANIZATION_ID;
      if (organizationId) {
        const memberships = await client.organizations.getOrganizationMembershipList({
          organizationId,
        });

        const membership = memberships.data.find((m) => m?.publicUserData?.userId === userId);

        if (membership) {
          const roleRaw = membership.role || "";
          const rolePart = roleRaw.split(":")[1] || roleRaw;
          const roleFormatted = rolePart.charAt(0).toUpperCase() + rolePart.slice(1);

          return {
            role: roleFormatted,
            username: user.username || "N/A",
            address: (user.publicMetadata?.address as string) || "N/A",
          };
        }
      }
    }

    return {
      role: "N/A",
      username: "N/A",
    };
  } catch (error) {
    console.error(`Error fetching user data for ${userId}:`, error);
    return {
      role: "N/A",
      username: "N/A",
    };
  }
}

export default async function Page() {
  // Fetch users from Clerk API
  const usersResult = await getAllUsers();

  // Transform data for UserDataTable
  let userData: ReturnType<typeof transformClerkUsersToTableData> = [];

  // Log users to console
  if (usersResult?.success) {
    // Transform Clerk data to table format
    userData = transformClerkUsersToTableData(usersResult.data);

    // Fetch actual user data by ID and replace the role and username
    const updatedUserData = await Promise.all(
      userData.map(async (user) => {
        const userData = await getUserData(user.uid);
        return {
          ...user,
          role: userData.role,
          username: userData.username,
          address: userData.address || "N/A",
        };
      }),
    );

    userData = updatedUserData;
  } else {
    console.error("❌ Failed to fetch organization members from Clerk");
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards users={userData} />
      {userData.length > 0 ? (
        <UserDataTable data={userData} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No organization members found. Please check your Clerk configuration.</p>
        </div>
      )}
    </div>
  );
}
