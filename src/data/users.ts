"use client";

import { useOrganization, useUser } from "@clerk/nextjs";

/**
 * Hook to get the current signed-in user from Clerk (client-side)
 * Use this in client components only
 */
export function useRootUser() {
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();
  const { membership, isLoaded: orgLoaded } = useOrganization();

  const isLoaded = userLoaded && orgLoaded;

  if (!isLoaded || !isSignedIn || !user) {
    return {
      id: "unknown",
      name: "Guest User",
      username: "guest",
      email: "guest@example.com",
      avatar: "",
      role: "guest",
      isLoaded,
      isSignedIn,
    };
  }

  // Extract role from organization membership
  // Role format from Clerk: "org:role" (e.g., "org:admin", "org:karyawan")
  const roleRaw = membership?.role || "org:guest";
  const rolePart = roleRaw.split(":")[1] || "guest";

  return {
    id: user.id,
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
    username: user.username || user.emailAddresses[0]?.emailAddress.split("@")[0] || "user",
    email: user.emailAddresses[0]?.emailAddress || "no-email@example.com",
    avatar: user.imageUrl || "",
    role: rolePart, // Return lowercase role (admin, eksekutif, manajer, etc.)
    isLoaded,
    isSignedIn,
  };
}
