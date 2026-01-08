"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Search,
  Heart,
  FolderHeart,
  Clock,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    plan: "free" | "pro";
    avatar?: string;
  };
  collapsed?: boolean;
  onToggle?: () => void;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Search",
    href: "/search",
    icon: Search,
  },
  {
    name: "Saved Domains",
    href: "/dashboard/saved",
    icon: Heart,
    badge: "12",
  },
  {
    name: "My Portfolio",
    href: "/dashboard/portfolio",
    icon: FolderHeart,
    pro: true,
  },
  {
    name: "Search History",
    href: "/dashboard/history",
    icon: Clock,
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Upgrade",
    href: "/dashboard/upgrade",
    icon: CreditCard,
    highlight: true,
  },
];

export function Sidebar({ user, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white border-r border-[var(--border)] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold text-[var(--text-primary)]">
              Brandspark
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--text-muted)]"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[var(--muted)] text-[var(--text-secondary)]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.pro && <Badge variant="pro">PRO</Badge>}
                </>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-[var(--border)]" />

        {/* Secondary Navigation */}
        {secondaryNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                item.highlight
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                  : isActive
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-[var(--border)]">
        {user ? (
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--muted)] cursor-pointer",
              collapsed && "justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium text-[var(--primary-dark)]">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user.name}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </p>
              </div>
            )}
            {!collapsed && (
              <button className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--text-muted)]">
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
              "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]",
              collapsed && "justify-center px-2"
            )}
          >
            <Globe className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign In</span>}
          </Link>
        )}
      </div>
    </aside>
  );
}
