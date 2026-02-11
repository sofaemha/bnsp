"use client";

import { useState } from "react";

import { redirect } from "next/navigation";

import type { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRootUser } from "@/data/users";

import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";
import { DeleteUserDialog } from "./delete-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import type { userSchema } from "./schema";
import { ROLE_COLORS, ViewProfileDialog } from "./view-profile-dialog";

type User = z.infer<typeof userSchema>;

// Actions cell component with state
function ActionsCell({ user }: { user: User }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const currentUser = useRootUser();

  return (
    <>
      <ViewProfileDialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen} user={user} />
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
        currentUserRole={currentUser.role}
        currentUserId={currentUser.id}
        onEditSuccess={() => {
          window.location.reload();
        }}
      />
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userId={user.uid}
        userName={user.fullName}
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
        onDeleteSuccess={async () => {
          // Refresh the page to update the user list
          window.location.reload();
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setIsViewProfileOpen(true)}>View Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit User</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-10">{row.original.id}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "uid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="UID" />,
    cell: ({ row }) => <div className="w-32 truncate">{row.original.uid}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    cell: ({ row }) => <div className="w-40">{row.original.fullName}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => <div className="w-32">{row.original.username}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <div className="w-48">{row.original.email}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColor = ROLE_COLORS[role.toLowerCase()] || ROLE_COLORS.karyawan;

      return (
        <div className="w-24">
          <span className={`inline-flex items-center rounded-md border px-2 py-1 font-medium text-xs ${roleColor}`}>
            {role}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "created",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.created}</div>,
    enableSorting: true,
    enableHiding: false,
  },

  {
    accessorKey: "updated",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.original.updated}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
