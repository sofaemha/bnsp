import { Briefcase, Shield, ShieldCheck, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming CardContent is also from ui/card

interface User {
  role: string;
  [key: string]: unknown;
}

interface SectionCardsProps {
  users: User[];
}

export function SectionCards({ users }: SectionCardsProps) {
  // Count users by role
  const totalKaryawan = users.filter((user) => user.role.toLowerCase() === "karyawan").length;
  const totalSupervisor = users.filter((user) => user.role.toLowerCase() === "supervisor").length;
  const totalManajer = users.filter((user) => user.role.toLowerCase() === "manajer").length;
  const totalDirektur = users.filter((user) => user.role.toLowerCase() === "direktur").length;
  const totalEksekutif = users.filter((user) => user.role.toLowerCase() === "eksekutif").length;
  const totalAdmin = users.filter((user) => user.role.toLowerCase() === "admin").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Total Karyawan */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Karyawan</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalKaryawan}</div>
          <p className="text-xs text-muted-foreground">
            {totalKaryawan === 1 ? "1 employee" : `${totalKaryawan} employees`}
          </p>
        </CardContent>
      </Card>

      {/* Total Supervisor */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Supervisor</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />{" "}
          {/* Using TrendingUp as a placeholder for UserCheck/UserCog */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSupervisor}</div>
          <p className="text-xs text-muted-foreground">
            {totalSupervisor === 1 ? "1 supervisor" : `${totalSupervisor} supervisors`}
          </p>
        </CardContent>
      </Card>

      {/* Total Manajer */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Manajer</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />{" "}
          {/* Using TrendingUp as a placeholder for UserCheck/UserCog */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalManajer}</div>
          <p className="text-xs text-muted-foreground">
            {totalManajer === 1 ? "1 manager" : `${totalManajer} managers`}
          </p>
        </CardContent>
      </Card>

      {/* Total Direktur */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Direktur</CardTitle>
          <Briefcase className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDirektur}</div>
          <p className="text-xs text-muted-foreground">
            {totalDirektur === 1 ? "1 director" : `${totalDirektur} directors`}
          </p>
        </CardContent>
      </Card>

      {/* Total Eksekutif */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Eksekutif</CardTitle>
          <Shield className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEksekutif}</div>
          <p className="text-xs text-muted-foreground">
            {totalEksekutif === 1 ? "1 executive" : `${totalEksekutif} executives`}
          </p>
        </CardContent>
      </Card>

      {/* Total Admin */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
          <ShieldCheck className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAdmin}</div>
          <p className="text-xs text-muted-foreground">{totalAdmin === 1 ? "1 admin" : `${totalAdmin} admins`}</p>
        </CardContent>
      </Card>
    </div>
  );
}
