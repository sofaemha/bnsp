"use client";

import { Briefcase, Calendar, Mail, MapPin, Shield, User as UserIcon } from "lucide-react";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { userSchema } from "./schema";

type User = z.infer<typeof userSchema>;

interface ViewProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

// Role badge colors
export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  eksekutif: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  direktur: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  manajer: "bg-green-500/10 text-green-500 border-green-500/20",
  supervisor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  karyawan: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export function ViewProfileDialog({ open, onOpenChange, user }: ViewProfileDialogProps) {
  const roleColor = ROLE_COLORS[user.role.toLowerCase()] || ROLE_COLORS.karyawan;

  // Get initials from full name
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-6">
            <Avatar className="size-24 border-2 border-border">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">{initials}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{user.fullName}</h2>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              <Badge variant="outline" className={`${roleColor} font-medium`}>
                <Shield className="mr-1.5 size-3" />
                {user.role}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </h3>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Email Address</p>
                  <p className="truncate text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <UserIcon className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Username</p>
                  <p className="text-sm font-medium">@{user.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{user.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">User ID</p>
                  <p className="truncate text-sm font-mono">{user.uid}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account Details</h3>

            <div className="grid gap-3">
              <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Calendar className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Account Created</p>
                  <p className="text-sm font-medium">{user.created}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Calendar className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-medium">{user.updated}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
