"use client";
"use no memo";

import * as React from "react";

import { Search } from "lucide-react";
import type { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { DataTable as DataTableNew } from "../../../../../components/data-table/data-table";
import { DataTablePagination } from "../../../../../components/data-table/data-table-pagination";
import { DataTableViewOptions } from "../../../../../components/data-table/data-table-view-options";
import { withDndColumn } from "../../../../../components/data-table/table-utils";
import type { userSchema } from "./schema";
import { userColumns } from "./user-columns";

export function UserDataTable({ data: initialData }: { data: z.infer<typeof userSchema>[] }) {
  const [data, setData] = React.useState(() => initialData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchFilter, setSearchFilter] = React.useState<"role" | "name" | "email">("role");

  const columns = withDndColumn(userColumns);

  // Filter data based on search query and filter type
  const filteredData = React.useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((user) => {
      const query = searchQuery.toLowerCase();

      switch (searchFilter) {
        case "role":
          return user.role.toLowerCase().includes(query);
        case "name":
          return user.fullName.toLowerCase().includes(query);
        case "email":
          return user.email.toLowerCase().includes(query);
        default:
          return true;
      }
    });
  }, [data, searchQuery, searchFilter]);

  const table = useDataTableInstance({
    data: filteredData,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  // Set initial column visibility (hide specific columns)
  React.useEffect(() => {
    table.setColumnVisibility({
      id: false, // Hidden
      uid: false, // Hidden
      euid: false, // Hidden
      updated: false, // Hidden
      avatar: false, // Hidden
    });
  }, [table]);

  return (
    <Tabs defaultValue="users" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="users">
          <SelectTrigger className="flex @4xl/main:hidden w-fit" size="sm" id="view-selector">
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">All Users</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="@4xl/main:flex hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1">
          <TabsTrigger value="users">All Users</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder={`Search by ${searchFilter}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[200px] lg:w-[300px]"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={searchFilter} onValueChange={(value: "role" | "name" | "email") => setSearchFilter(value)}>
            <SelectTrigger className="w-[110px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">Role</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <DataTableViewOptions table={table} />
        </div>
      </div>
      <TabsContent value="users" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <DataTableNew dndEnabled table={table} columns={columns} onReorder={setData} />
        </div>
        <DataTablePagination table={table} />
      </TabsContent>
      <TabsContent value="active" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
      <TabsContent value="inactive" className="flex flex-col">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" />
      </TabsContent>
    </Tabs>
  );
}
