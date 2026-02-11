"use client";

import { LayoutControls } from "./layout-controls";
import { ThemeSwitcher } from "./theme-switcher";

export function DashboardHeader() {
  return (
    <div className="flex items-center gap-2">
      <LayoutControls />
      <ThemeSwitcher />
    </div>
  );
}
