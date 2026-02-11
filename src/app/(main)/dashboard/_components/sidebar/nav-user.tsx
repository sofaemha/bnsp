"use client";

import { useCallback, useEffect, useState } from "react";

import { SignOutButton } from "@clerk/nextjs";
import { CircleUser, EllipsisVertical, LogOut } from "lucide-react";

import { ViewProfileDialog } from "@/app/(main)/dashboard/overview/_components/view-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useRootUser } from "@/data/users";
import { getInitials } from "@/lib/utils";

type UserData = {
  id: number;
  uid: string;
  euid: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  created: string;
  updated: string;
  avatar: string;
};

export function NavUser({
  user,
}: {
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const rootUser = useRootUser();

  const fetchCurrentUserData = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/clerk/read`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const result = await response.json();
      if (result.success) {
        // Find current user in the list
        const currentUser = result.data.find(
          (member: { publicUserData: { userId: string } }) => member.publicUserData.userId === rootUser.id,
        );

        if (currentUser) {
          // Format data for ViewProfileDialog
          const roleRaw = currentUser.role || "";
          const rolePart = roleRaw.split(":")[1] || roleRaw;
          const roleFormatted = rolePart.charAt(0).toUpperCase() + rolePart.slice(1);

          const formatLongDate = (timestamp: number) => {
            const date = new Date(timestamp);
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
          };

          setCurrentUserData({
            id: 1,
            uid: currentUser.publicUserData.userId,
            euid: currentUser.publicUserData.identifier,
            fullName:
              `${currentUser.publicUserData.firstName || ""} ${currentUser.publicUserData.lastName || ""}`.trim() ||
              "N/A",
            username: rootUser.username,
            email: currentUser.publicUserData.identifier || "N/A",
            role: roleFormatted,
            created: formatLongDate(currentUser.createdAt),
            updated: formatLongDate(currentUser.updatedAt),
            avatar: currentUser.publicUserData.imageUrl || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  }, [rootUser.id, rootUser.username]);

  // Fetch current user data when dialog opens
  useEffect(() => {
    if (isProfileDialogOpen && !currentUserData) {
      fetchCurrentUserData();
    }
  }, [isProfileDialogOpen, currentUserData, fetchCurrentUserData]);

  return (
    <>
      {currentUserData && (
        <ViewProfileDialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen} user={currentUserData} />
      )}
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-muted-foreground text-xs">{user.email}</span>
                </div>
                <EllipsisVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-muted-foreground text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                  <CircleUser />
                  Account
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="my-1.5 py-0">
                <SignOutButton>
                  <span className="w-full">Logout</span>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
