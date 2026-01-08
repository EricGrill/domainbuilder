"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Search,
  Trash2,
  RotateCcw,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface SearchHistoryItem {
  id: string;
  keywords: string[];
  tlds: string[];
  filters: {
    includeHyphens: boolean;
    includeNumbers: boolean;
    maxLength: number;
  };
  resultsCount: number;
  availableCount: number;
  createdAt: string;
}

// Mock data
const mockHistory: SearchHistoryItem[] = [
  {
    id: "1",
    keywords: ["swift", "cloud", "sync"],
    tlds: ["com", "io", "co"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 15 },
    resultsCount: 45,
    availableCount: 12,
    createdAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    keywords: ["brand", "spark"],
    tlds: ["com", "io"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 12 },
    resultsCount: 32,
    availableCount: 8,
    createdAt: "2024-01-15T10:15:00Z",
  },
  {
    id: "3",
    keywords: ["tech", "startup", "hub"],
    tlds: ["com", "io", "app", "dev"],
    filters: { includeHyphens: true, includeNumbers: false, maxLength: 20 },
    resultsCount: 56,
    availableCount: 15,
    createdAt: "2024-01-14T16:45:00Z",
  },
  {
    id: "4",
    keywords: ["launch", "fast"],
    tlds: ["com", "co"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 10 },
    resultsCount: 28,
    availableCount: 6,
    createdAt: "2024-01-14T09:20:00Z",
  },
  {
    id: "5",
    keywords: ["data", "flow", "stream"],
    tlds: ["io", "dev"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 15 },
    resultsCount: 41,
    availableCount: 11,
    createdAt: "2024-01-13T15:00:00Z",
  },
  {
    id: "6",
    keywords: ["creative", "studio"],
    tlds: ["com", "co", "io"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 18 },
    resultsCount: 38,
    availableCount: 9,
    createdAt: "2024-01-12T11:30:00Z",
  },
  {
    id: "7",
    keywords: ["pixel", "art", "lab"],
    tlds: ["com", "io", "app"],
    filters: { includeHyphens: true, includeNumbers: false, maxLength: 14 },
    resultsCount: 52,
    availableCount: 14,
    createdAt: "2024-01-11T08:45:00Z",
  },
  {
    id: "8",
    keywords: ["code", "ninja"],
    tlds: ["com", "dev"],
    filters: { includeHyphens: false, includeNumbers: false, maxLength: 12 },
    resultsCount: 24,
    availableCount: 5,
    createdAt: "2024-01-10T17:00:00Z",
  },
];

export default function SearchHistoryPage() {
  const router = useRouter();
  const [history, setHistory] = React.useState<SearchHistoryItem[]>(mockHistory);
  const [filterPeriod, setFilterPeriod] = React.useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  // Filter history by period
  const filteredHistory = React.useMemo(() => {
    if (filterPeriod === "all") return history;

    const now = new Date();
    const cutoff = new Date();

    if (filterPeriod === "today") {
      cutoff.setHours(0, 0, 0, 0);
    } else if (filterPeriod === "week") {
      cutoff.setDate(now.getDate() - 7);
    } else if (filterPeriod === "month") {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return history.filter((item) => new Date(item.createdAt) >= cutoff);
  }, [history, filterPeriod]);

  // Group history by date
  const groupedHistory = React.useMemo(() => {
    const groups: { [key: string]: SearchHistoryItem[] } = {};

    filteredHistory.forEach((item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    return groups;
  }, [filteredHistory]);

  // Repeat search
  const handleRepeatSearch = (item: SearchHistoryItem) => {
    const query = item.keywords.join(",");
    const tlds = item.tlds.join(",");
    router.push(
      `/search?q=${encodeURIComponent(query)}&tlds=${encodeURIComponent(tlds)}`
    );
  };

  // Delete search
  const handleDeleteSearch = (id: string) => {
    setHistory(history.filter((item) => item.id !== id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  // Delete selected
  const handleDeleteSelected = () => {
    setHistory(history.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  // Clear all history
  const handleClearAll = () => {
    setHistory([]);
    setSelectedItems([]);
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Stats
  const totalSearches = history.length;
  const totalResults = history.reduce((sum, item) => sum + item.resultsCount, 0);
  const totalAvailable = history.reduce(
    (sum, item) => sum + item.availableCount,
    0
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Search History
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            View and repeat your previous domain searches
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 ? (
            <>
              <span className="text-sm text-[var(--text-secondary)]">
                {selectedItems.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Selected
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={history.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {totalSearches}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Total Searches
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {totalResults}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Domains Checked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {totalAvailable}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Available Found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[var(--text-secondary)]">Show:</span>
        {(["all", "today", "week", "month"] as const).map((period) => (
          <Button
            key={period}
            variant={filterPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPeriod(period)}
          >
            {period === "all"
              ? "All Time"
              : period === "today"
              ? "Today"
              : period === "week"
              ? "This Week"
              : "This Month"}
          </Button>
        ))}
      </div>

      {/* History List */}
      {Object.keys(groupedHistory).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 mx-auto text-[var(--text-muted)] opacity-50" />
            <p className="mt-4 text-[var(--text-secondary)]">
              No search history found
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Your domain searches will appear here
            </p>
            <Button className="mt-4" onClick={() => router.push("/search")}>
              Start Searching
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {date}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "hover:shadow-md transition-shadow",
                      selectedItems.includes(item.id) &&
                        "ring-2 ring-[var(--primary)]"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="mt-1 rounded border-[var(--border)]"
                        />

                        {/* Icon */}
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] bg-opacity-30 flex items-center justify-center flex-shrink-0">
                          <Search className="h-5 w-5 text-[var(--primary)]" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            {item.keywords.map((keyword) => (
                              <Badge key={keyword} variant="secondary">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                            <span>
                              TLDs:{" "}
                              <span className="text-[var(--text-secondary)]">
                                {item.tlds.map((t) => `.${t}`).join(", ")}
                              </span>
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3.5 w-3.5 text-[var(--success)]" />
                              {item.availableCount} available
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5 text-[var(--error)]" />
                              {item.resultsCount - item.availableCount} taken
                            </span>
                          </div>
                          {/* Filters summary */}
                          <div className="flex items-center gap-2 mt-2">
                            {item.filters.includeHyphens && (
                              <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--text-muted)]">
                                Hyphens
                              </span>
                            )}
                            {item.filters.includeNumbers && (
                              <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--text-muted)]">
                                Numbers
                              </span>
                            )}
                            <span className="text-xs px-2 py-0.5 rounded bg-[var(--muted)] text-[var(--text-muted)]">
                              Max {item.filters.maxLength} chars
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-muted)]">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRepeatSearch(item)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Repeat
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[var(--error)]"
                            onClick={() => handleDeleteSearch(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Limit notice */}
      <div className="text-center p-4 bg-[var(--muted)] rounded-lg">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium">Free Plan:</span> Last 10 searches saved
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Upgrade to Pro for unlimited search history
        </p>
      </div>
    </div>
  );
}
