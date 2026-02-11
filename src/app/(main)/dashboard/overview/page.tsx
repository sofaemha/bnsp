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

    return {
      id: index + 1, // Index + 1
      uid: member.publicUserData.userId, // Clerk User ID
      euid: member.publicUserData.identifier, // Email/identifier
      fullName: `${member.publicUserData.firstName || ""} ${member.publicUserData.lastName || ""}`.trim() || "N/A", // Full Name
      username: member.publicUserData.identifier.split("@")[0] || "N/A", // Username from email
      email: member.publicUserData.identifier || "N/A", // Email
      role: roleFormatted || "N/A", // Role (formatted)
      created: formatLongDate(member.createdAt), // Created date (long format)
      updated: formatLongDate(member.updatedAt), // Updated date (long format)
      avatar: member.publicUserData.imageUrl || "", // Avatar URL
    };
  });
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
  } else {
    console.error("❌ Failed to fetch organization members from Clerk");
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards />
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
