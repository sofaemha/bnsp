"use client";

import { useState } from "react";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  currentUserId: string;
  currentUserRole: string;
  onDeleteSuccess?: () => void;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  userId,
  userName,
  currentUserId,
  currentUserRole,
  onDeleteSuccess,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const isSelfDelete = userId === currentUserId;

  async function handleDelete() {
    if (!isAgreed) {
      toast.error("Please confirm deletion", {
        description: "You must check the agreement box to proceed",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/clerk/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentUserId,
          currentUserRole,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User deleted successfully", {
          description: isSelfDelete
            ? "Your account has been deleted"
            : `${userName}'s account has been permanently deleted`,
        });
        onOpenChange(false);
        setIsAgreed(false);
        onDeleteSuccess?.();

        // If self-delete, redirect to login after a delay
        if (isSelfDelete) {
          setTimeout(() => {
            window.location.href = "/auth/v2/login";
          }, 1500);
        }
      } else {
        toast.error("Failed to delete user", {
          description: result.message || "An error occurred",
        });
      }
    } catch {
      toast.error("Error", {
        description: "Failed to delete user. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            {isSelfDelete ? "Delete Your Account?" : "Delete User Account?"}
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <span className="font-semibold">
              {isSelfDelete
                ? "You are about to delete your own account."
                : `You are about to permanently delete ${userName}'s account.`}
            </span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm">This action cannot be undone. This will permanently:</p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Remove the user from the organization</li>
          <li>Delete all user data and permissions</li>
          <li>Revoke access to all resources</li>
          {isSelfDelete && <li className="font-semibold text-destructive">Sign you out immediately</li>}
        </ul>
        <div className="flex items-start space-x-3 rounded-md border border-destructive/30 bg-destructive/5 p-4 mt-3">
          <Checkbox
            id="delete-agreement"
            checked={isAgreed}
            onCheckedChange={(checked) => setIsAgreed(checked as boolean)}
          />
          <label
            htmlFor="delete-agreement"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I understand that this action is permanent and cannot be reversed
          </label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setIsAgreed(false);
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting || !isAgreed}>
            {isDeleting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSelfDelete ? "Delete My Account" : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
