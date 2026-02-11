"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form validation schema
const editUserFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens (-), and underscores (_)"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required").optional().or(z.literal("")),
  role: z.enum(["admin", "eksekutif", "manajer", "supervisor", "karyawan"]),
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

// Role hierarchy mapping (highest to lowest)
const ROLE_HIERARCHY: Record<string, number> = {
  admin: 6,
  eksekutif: 5,
  direktur: 4,
  manajer: 3,
  supervisor: 2,
  karyawan: 1,
};

// Role display names
const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  eksekutif: "Eksekutif",
  direktur: "Direktur",
  manajer: "Manajer",
  supervisor: "Supervisor",
  karyawan: "Karyawan",
};

/**
 * Get available roles for editing based on:
 * 1. Current user's role (who is making the change)
 * 2. Target user's current role (who is being edited)
 * 3. Whether it's a self-edit
 *
 * Rules:
 * - Cannot change own role
 * - Supervisor and Karyawan cannot change any roles
 * - Can promote one step above target's current role (but not to current user's role)
 * - Can demote to any role below target's current role (no restriction)
 */
function getAvailableRoles(currentUserRole: string, targetUserRole: string, isSelfEdit: boolean): string[] {
  const currentUserLevel = ROLE_HIERARCHY[currentUserRole.toLowerCase()] || 0;
  const targetUserLevel = ROLE_HIERARCHY[targetUserRole.toLowerCase()] || 0;

  // Cannot change own role
  if (isSelfEdit) {
    return [targetUserRole.toLowerCase()];
  }

  // Supervisor and Karyawan cannot change any roles
  if (currentUserLevel <= 2) {
    return [targetUserRole.toLowerCase()];
  }

  // Cannot modify users with equal or higher role
  if (currentUserLevel <= targetUserLevel) {
    return [targetUserRole.toLowerCase()];
  }

  const availableRoles: string[] = [];

  // Get all roles sorted by hierarchy
  const allRoles = Object.entries(ROLE_HIERARCHY).sort((a, b) => a[1] - b[1]);

  for (const [role, level] of allRoles) {
    // Can always keep the same role
    if (level === targetUserLevel) {
      availableRoles.push(role);
      continue;
    }

    // Can demote to any role below target's current role (no restriction)
    if (level < targetUserLevel) {
      availableRoles.push(role);
      continue;
    }

    // Can promote ONE step above target's current role
    // BUT NOT to the current user's role level
    if (level === targetUserLevel + 1 && level < currentUserLevel) {
      availableRoles.push(role);
    }
  }

  return availableRoles;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    uid: string;
    fullName: string;
    email: string;
    username: string;
    address?: string;
    role: string;
  };
  currentUserRole?: string;
  currentUserId?: string;
  onEditSuccess?: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  currentUserRole = "karyawan",
  currentUserId,
  onEditSuccess,
}: EditUserDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if editing own profile
  const isSelfEdit = currentUserId === user.uid;

  // Split full name into first and last name
  const nameParts = user.fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      firstName,
      lastName,
      email: user.email,
      username: user.username,
      password: "",
      address: user.address || "",
      role: user.role.toLowerCase() as "admin" | "eksekutif" | "manajer" | "supervisor" | "karyawan",
    },
  });

  // Check if user is admin
  const isAdmin = currentUserRole.toLowerCase() === "admin";

  // Can edit basic info only if: editing self OR is admin
  const canEditBasicInfo = isSelfEdit || isAdmin;

  // Get available roles based on current user's role, target user's role, and self-edit status
  const availableRoles = getAvailableRoles(currentUserRole, user.role, isSelfEdit);
  const canChangeRole = availableRoles.length > 1;

  async function onSubmit(data: EditUserFormValues) {
    setIsSubmitting(true);

    try {
      // Prepare update data (only include changed fields)
      const updateData: Record<string, unknown> = {
        userId: user.uid,
        currentUserRole,
      };

      if (data.firstName !== firstName) updateData.firstName = data.firstName;
      if (data.lastName !== lastName) updateData.lastName = data.lastName;
      if (data.email !== user.email) updateData.email = data.email;
      if (data.username !== user.username) updateData.username = data.username;
      if (data.password && data.password.length > 0) updateData.password = data.password;
      if (data.role !== user.role.toLowerCase()) updateData.role = data.role;

      const response = await fetch("/api/clerk/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User updated successfully", {
          description: `${data.firstName} ${data.lastName}'s information has been updated.`,
        });
        form.reset();
        onOpenChange(false);
        onEditSuccess?.();
        router.refresh();
      } else {
        toast.error("Failed to update user", {
          description: result.message || "An error occurred",
        });
      }
    } catch {
      toast.error("Error", {
        description: "Failed to update user. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isSelfEdit ? "Edit Your Profile" : "Edit User"}</DialogTitle>
          <DialogDescription>
            {isSelfEdit
              ? "Update your profile information. Leave password empty to keep current password."
              : "Update user information. Leave password empty to keep current password."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} disabled={!canEditBasicInfo} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} disabled={!canEditBasicInfo} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} disabled={!canEditBasicInfo} />
                  </FormControl>
                  <FormDescription>User will be notified of email changes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Jl. Example Street No. 123" {...field} disabled={!canEditBasicInfo} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} disabled={!canEditBasicInfo} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave empty to keep current"
                      {...field}
                      disabled={!canEditBasicInfo}
                    />
                  </FormControl>
                  <FormDescription>User will be signed out of other sessions if password is changed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canChangeRole}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {!canEditBasicInfo
                      ? "Only admins can edit other users' information"
                      : isSelfEdit
                        ? "You cannot change your own role"
                        : !canChangeRole
                          ? "You don't have permission to change this user's role"
                          : "Can promote one step up (not to your level) or demote to any lower role"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
