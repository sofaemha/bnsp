import { Briefcase, UserCheck, UserCog, Users } from "lucide-react";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  role: string;
  [key: string]: unknown;
}

interface SectionCardsProps {
  users: User[];
}

export function SectionCards({ users }: SectionCardsProps) {
  // Count users by role (excluding admin)
  const karyawanCount = users.filter((user) => user.role.toLowerCase() === "karyawan").length;
  const supervisorCount = users.filter((user) => user.role.toLowerCase() === "supervisor").length;
  const manajerCount = users.filter((user) => user.role.toLowerCase() === "manajer").length;
  const direkturCount = users.filter(
    (user) => user.role.toLowerCase() === "direktur" || user.role.toLowerCase() === "eksekutif",
  ).length;

  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card">
      {/* Karyawan Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Karyawan</CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">{karyawanCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {karyawanCount === 0 ? "No employees" : karyawanCount === 1 ? "1 employee" : `${karyawanCount} employees`}
          </div>
        </CardFooter>
      </Card>

      {/* Supervisor Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Supervisor</CardDescription>
            <UserCheck className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
            {supervisorCount}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {supervisorCount === 0
              ? "No supervisors"
              : supervisorCount === 1
                ? "1 supervisor"
                : `${supervisorCount} supervisors`}
          </div>
        </CardFooter>
      </Card>

      {/* Manajer Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Manajer</CardDescription>
            <UserCog className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">{manajerCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {manajerCount === 0 ? "No managers" : manajerCount === 1 ? "1 manager" : `${manajerCount} managers`}
          </div>
        </CardFooter>
      </Card>

      {/* Direktur Card */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Direktur</CardDescription>
            <Briefcase className="size-4 text-muted-foreground" />
          </div>
          <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">{direkturCount}</CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            {direkturCount === 0 ? "No directors" : direkturCount === 1 ? "1 director" : `${direkturCount} directors`}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
