"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/search-input";
import { useRouter } from "next/navigation";

// Mock data (will be replaced with Supabase queries)
const stats = [
  {
    name: "Saved Domains",
    value: "12",
    change: "+3 this week",
    icon: Heart,
    href: "/dashboard/saved",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    name: "Searches Today",
    value: "8",
    change: "12 remaining",
    icon: Search,
    href: "/search",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    name: "Available Found",
    value: "24",
    change: "This month",
    icon: TrendingUp,
    href: "/dashboard/history",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    name: "Portfolio Value",
    value: "$2.4k",
    change: "Estimated",
    icon: Sparkles,
    href: "/dashboard/portfolio",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    pro: true,
  },
];

const recentSearches = [
  {
    keywords: ["swift", "cloud", "sync"],
    results: 45,
    available: 12,
    date: "2 hours ago",
  },
  {
    keywords: ["brand", "spark"],
    results: 32,
    available: 8,
    date: "Yesterday",
  },
  {
    keywords: ["tech", "startup", "hub"],
    results: 56,
    available: 15,
    date: "2 days ago",
  },
];

const savedDomains = [
  { domain: "swiftcloud.io", available: true, score: 92 },
  { domain: "brandspark.co", available: true, score: 88 },
  { domain: "techhub.app", available: true, score: 85 },
  { domain: "cloudforge.io", available: true, score: 82 },
];

const expiringDomains = [
  { domain: "myoldproject.com", expiresIn: 7, registrar: "GoDaddy" },
  { domain: "sideproject.io", expiresIn: 14, registrar: "Namecheap" },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleQuickSearch = (keywords: string[]) => {
    const query = keywords.join(",");
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, Demo User
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Here's what's happening with your domains
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            Free Plan
          </Badge>
          <Link href="/dashboard/upgrade">
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Search</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchInput
            onSearch={handleQuickSearch}
            placeholder="Enter keywords to find available domains..."
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.pro && <Badge variant="pro">PRO</Badge>}
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {stat.name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Searches */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Searches</CardTitle>
            <Link href="/dashboard/history">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSearches.map((search, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--muted)] hover:bg-[var(--border)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] bg-opacity-30 flex items-center justify-center">
                      <Search className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {search.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-sm font-medium text-[var(--text-primary)]"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {search.results} results • {search.available} available
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">
                      {search.date}
                    </p>
                    <Button variant="ghost" size="sm" className="mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Repeat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved Domains */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Saved Domains</CardTitle>
            <Link href="/dashboard/saved">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedDomains.map((domain) => (
                <div
                  key={domain.domain}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="available" className="w-2 h-2 p-0 rounded-full" />
                    <span className="font-mono text-sm text-[var(--text-primary)]">
                      {domain.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">
                      {domain.score}
                    </span>
                    <ExternalLink className="h-3 w-3 text-[var(--text-muted)]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Domains Alert (Pro feature preview) */}
      <Card className="border-[var(--warning)] border-opacity-50 bg-[var(--warning-light)] bg-opacity-30">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--warning-light)] flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[var(--text-primary)]">
                  Expiring Soon
                </h3>
                <Badge variant="pro">PRO</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Track your owned domains and never miss a renewal. Upgrade to
                Pro to enable portfolio management.
              </p>
              <div className="flex items-center gap-4 mt-3">
                {expiringDomains.map((domain) => (
                  <div
                    key={domain.domain}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white"
                  >
                    <Calendar className="h-4 w-4 text-[var(--warning)]" />
                    <span className="font-mono text-sm">{domain.domain}</span>
                    <span className="text-xs text-[var(--warning)]">
                      {domain.expiresIn}d
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/dashboard/upgrade">
              <Button variant="outline" size="sm">
                Unlock Feature
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
