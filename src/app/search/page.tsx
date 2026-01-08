"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Filter,
  SortAsc,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { DomainGrid } from "@/components/domain-card";
import { TLDSelector } from "@/components/tld-selector";
import { FilterPanel, type FilterOptions } from "@/components/filter-panel";
import { AISuggestions } from "@/components/ai-suggestions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDomainSearch } from "@/hooks/use-domain-search";
import { cn } from "@/lib/utils";

type SortOption = "availability" | "score" | "length" | "name";

export default function SearchPage() {
  const { results, isLoading, error, stats, search, clear } = useDomainSearch();

  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [selectedTLDs, setSelectedTLDs] = React.useState<string[]>(["com"]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>("availability");
  const [savedDomains, setSavedDomains] = React.useState<string[]>([]);

  const [filters, setFilters] = React.useState<FilterOptions>({
    prefixes: ["go", "get", "try", "my"],
    suffixes: ["ly", "ify", "hub", "app"],
    metaphors: [],
    industry: null,
    minLength: 4,
    maxLength: 15,
    includeCombinations: true,
  });

  const handleSearch = async (newKeywords: string[]) => {
    setKeywords(newKeywords);

    await search({
      keywords: newKeywords,
      tlds: selectedTLDs,
      prefixes: filters.prefixes.length > 0 ? filters.prefixes : undefined,
      suffixes: filters.suffixes.length > 0 ? filters.suffixes : undefined,
      metaphors: filters.metaphors.length > 0 ? filters.metaphors : undefined,
      industry: filters.industry,
      includeCombinations: filters.includeCombinations,
      minLength: filters.minLength,
      maxLength: filters.maxLength,
      count: 50,
      checkAvailability: true,
    });
  };

  const handleSave = (domain: { domain: string; tld: string }) => {
    const fullDomain = `${domain.domain}`;
    if (savedDomains.includes(fullDomain)) {
      setSavedDomains(savedDomains.filter((d) => d !== fullDomain));
    } else {
      setSavedDomains([...savedDomains, fullDomain]);
    }
  };

  const handleRegister = (domain: { domain: string }) => {
    window.open(
      `https://www.namecheap.com/domains/registration/results/?domain=${domain.domain}`,
      "_blank"
    );
  };

  // Sort results
  const sortedResults = React.useMemo(() => {
    const sorted = [...results];

    switch (sortBy) {
      case "availability":
        sorted.sort((a, b) => {
          if (a.available === true && b.available !== true) return -1;
          if (a.available !== true && b.available === true) return 1;
          return 0;
        });
        break;
      case "score":
        sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case "length":
        sorted.sort((a, b) => a.name.length - b.name.length);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted;
  }, [results, sortBy]);

  // Convert results to the format expected by DomainGrid
  const domainResults = sortedResults.map((r) => ({
    domain: r.name,
    tld: r.tld,
    available: r.available === null ? ("checking" as const) : r.available,
    source: r.source,
    score: r.score,
  }));

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-[var(--text-primary)]">
                  Brandspark
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">Upgrade to Pro</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchInput
            onSearch={handleSearch}
            isLoading={isLoading}
            placeholder="Enter keywords for your domain..."
          />
        </div>

        {/* TLD Selector */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-[var(--border)]">
          <TLDSelector
            selected={selectedTLDs}
            onChange={setSelectedTLDs}
            maxSelections={5}
          />
        </div>

        {/* AI Suggestions (Pro Feature) */}
        {keywords.length > 0 && (
          <div className="mb-6">
            <AISuggestions
              keywords={keywords}
              onSelectDomain={(name, tld) => {
                // Check single domain
                search({
                  keywords: [name],
                  tlds: [tld],
                  count: 1,
                  checkAvailability: true,
                });
              }}
              onSaveDomain={(name, tld) => {
                const fullDomain = `${name}.${tld}`;
                if (!savedDomains.includes(fullDomain)) {
                  setSavedDomains([...savedDomains, fullDomain]);
                }
              }}
              savedDomains={savedDomains}
              isPro={false} // Set to true when user has Pro plan
            />
          </div>
        )}

        {/* Results Section */}
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside
            className={cn(
              "w-72 flex-shrink-0 transition-all",
              showFilters ? "block" : "hidden lg:block"
            )}
          >
            <FilterPanel options={filters} onChange={setFilters} />
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  Filters
                </Button>

                {results.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--text-secondary)]">
                      {stats.total} results
                    </span>
                    <Badge variant="available">{stats.available} available</Badge>
                    <Badge variant="taken">{stats.taken} taken</Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--text-secondary)]">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="availability">Availability</option>
                  <option value="score">Score</option>
                  <option value="length">Length</option>
                  <option value="name">Name (A-Z)</option>
                </select>

                {keywords.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(keywords)}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={cn(
                        "h-4 w-4 mr-1.5",
                        isLoading && "animate-spin"
                      )}
                    />
                    Refresh
                  </Button>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-[var(--error-light)] border border-[var(--error)] border-opacity-20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[var(--error)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[var(--error)]">
                      Search Error
                    </p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                    {error.includes("unavailable") && (
                      <p className="text-sm text-red-600 mt-2">
                        Make sure the Python API is running:{" "}
                        <code className="px-1.5 py-0.5 bg-red-100 rounded text-xs">
                          python services/python-api/main.py
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && results.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-[var(--text-muted)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Ready to find your perfect domain
                </h3>
                <p className="text-[var(--text-secondary)] mt-2 max-w-md mx-auto">
                  Enter keywords above to generate brandable domain name ideas
                  with real-time availability checking.
                </p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] bg-opacity-30 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Searching for domains...
                </h3>
                <p className="text-[var(--text-secondary)] mt-2">
                  Checking availability across {selectedTLDs.length} TLD
                  {selectedTLDs.length > 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <>
                <DomainGrid
                  domains={domainResults}
                  onSave={handleSave}
                  onRegister={handleRegister}
                  savedDomains={savedDomains}
                />

                {/* Load More */}
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg" disabled={isLoading}>
                    Generate More Ideas
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
