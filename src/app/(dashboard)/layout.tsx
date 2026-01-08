"use client";

import * as React from "react";
import { Sidebar } from "@/components/sidebar";

// Mock user for now (will be replaced with Supabase auth)
const mockUser = {
  name: "Demo User",
  email: "demo@brandspark.io",
  plan: "free" as const,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar
        user={mockUser}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
