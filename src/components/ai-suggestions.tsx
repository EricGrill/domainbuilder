"use client";

import * as React from "react";
import {
  Sparkles,
  Brain,
  Lightbulb,
  RefreshCw,
  ChevronDown,
  Info,
  Heart,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AISuggestion {
  name: string;
  score: number;
  source: string;
  reasoning?: string;
}

interface Industry {
  id: string;
  name: string;
  themes: string[];
}

interface AISuggestionsProps {
  keywords: string[];
  onSelectDomain: (name: string, tld: string) => void;
  onSaveDomain?: (name: string, tld: string) => void;
  savedDomains?: string[];
  isPro?: boolean;
}

const INDUSTRIES: Industry[] = [
  { id: "tech", name: "Technology", themes: ["innovation", "speed", "connection"] },
  { id: "health", name: "Health & Wellness", themes: ["wellness", "vitality", "balance"] },
  { id: "finance", name: "Finance", themes: ["trust", "growth", "security"] },
  { id: "creative", name: "Creative & Design", themes: ["creativity", "expression", "beauty"] },
  { id: "ecommerce", name: "E-Commerce", themes: ["convenience", "value", "selection"] },
  { id: "education", name: "Education", themes: ["knowledge", "growth", "discovery"] },
  { id: "food", name: "Food & Beverage", themes: ["flavor", "freshness", "quality"] },
  { id: "travel", name: "Travel", themes: ["adventure", "discovery", "freedom"] },
];

const DEFAULT_TLDS = ["com", "io", "co", "app", "dev"];

export function AISuggestions({
  keywords,
  onSelectDomain,
  onSaveDomain,
  savedDomains = [],
  isPro = false,
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>("");
  const [showIndustryDropdown, setShowIndustryDropdown] = React.useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = React.useState<string | null>(null);
  const [selectedTld, setSelectedTld] = React.useState("com");

  // Fetch AI suggestions
  const fetchSuggestions = React.useCallback(async () => {
    if (keywords.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords,
          industry: selectedIndustry || undefined,
          count: 12,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, selectedIndustry]);

  // Fetch on keywords change
  React.useEffect(() => {
    if (keywords.length > 0 && isPro) {
      fetchSuggestions();
    }
  }, [keywords, isPro, fetchSuggestions]);

  // Score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-[var(--success)]";
    if (score >= 70) return "text-[var(--warning)]";
    return "text-[var(--text-muted)]";
  };

  // Score background
  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-green-100";
    if (score >= 70) return "bg-amber-100";
    return "bg-gray-100";
  };

  // If not Pro, show upgrade prompt
  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-[var(--border)]">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            AI-Powered Suggestions
          </h3>
          <Badge variant="pro" className="mb-3">PRO</Badge>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Get intelligent, brandable domain name suggestions powered by AI.
            Includes industry-specific recommendations and name scoring.
          </p>
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-1.5" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Suggestions
            <Badge variant="pro">PRO</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchSuggestions}
            disabled={isLoading || keywords.length === 0}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-1", isLoading && "animate-spin")}
            />
            Regenerate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Industry Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-secondary)]">Industry:</span>
          <div className="relative">
            <button
              onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-sm hover:bg-[var(--muted)]"
            >
              {selectedIndustry
                ? INDUSTRIES.find((i) => i.id === selectedIndustry)?.name
                : "All Industries"}
              <ChevronDown className="h-4 w-4" />
            </button>
            {showIndustryDropdown && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-white rounded-lg shadow-lg border border-[var(--border)] py-1 min-w-[180px]">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--muted)]"
                  onClick={() => {
                    setSelectedIndustry("");
                    setShowIndustryDropdown(false);
                  }}
                >
                  All Industries
                </button>
                {INDUSTRIES.map((industry) => (
                  <button
                    key={industry.id}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-[var(--muted)]",
                      selectedIndustry === industry.id && "bg-[var(--muted)]"
                    )}
                    onClick={() => {
                      setSelectedIndustry(industry.id);
                      setShowIndustryDropdown(false);
                    }}
                  >
                    {industry.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TLD selector */}
          <div className="flex items-center gap-1 ml-auto">
            {DEFAULT_TLDS.slice(0, 4).map((tld) => (
              <button
                key={tld}
                onClick={() => setSelectedTld(tld)}
                className={cn(
                  "px-2 py-1 rounded text-xs font-medium transition-colors",
                  selectedTld === tld
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                )}
              >
                .{tld}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-[var(--text-muted)]">
              <Sparkles className="h-5 w-5 animate-pulse text-purple-500" />
              <span>Generating creative names...</span>
            </div>
          </div>
        )}

        {/* No keywords */}
        {!isLoading && keywords.length === 0 && (
          <div className="text-center py-6 text-[var(--text-muted)]">
            <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Enter keywords above to get AI suggestions</p>
          </div>
        )}

        {/* Suggestions Grid */}
        {!isLoading && suggestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestions.map((suggestion) => {
              const fullDomain = `${suggestion.name}.${selectedTld}`;
              const isSaved = savedDomains.includes(fullDomain);
              const isExpanded = expandedSuggestion === suggestion.name;

              return (
                <div
                  key={suggestion.name}
                  className={cn(
                    "p-3 rounded-lg border border-[var(--border)] hover:shadow-md transition-all cursor-pointer",
                    isExpanded && "ring-2 ring-[var(--primary)]"
                  )}
                  onClick={() =>
                    setExpandedSuggestion(isExpanded ? null : suggestion.name)
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-[var(--text-primary)]">
                        {suggestion.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        .{selectedTld}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        getScoreBg(suggestion.score),
                        getScoreColor(suggestion.score)
                      )}
                    >
                      {suggestion.score}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-[var(--border)]">
                      {suggestion.reasoning && (
                        <p className="text-xs text-[var(--text-secondary)] mb-3 flex items-start gap-1.5">
                          <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[var(--primary)]" />
                          {suggestion.reasoning}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDomain(suggestion.name, selectedTld);
                          }}
                        >
                          Check Availability
                        </Button>
                        {onSaveDomain && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSaveDomain(suggestion.name, selectedTld);
                            }}
                          >
                            <Heart
                              className={cn(
                                "h-4 w-4",
                                isSaved && "fill-current text-pink-500"
                              )}
                            />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://www.namecheap.com/domains/registration/results/?domain=${fullDomain}`,
                              "_blank"
                            );
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tips */}
        <div className="bg-[var(--muted)] rounded-lg p-3">
          <p className="text-xs text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text-secondary)]">
              Tip:
            </span>{" "}
            Select an industry to get more targeted suggestions. Higher scores
            indicate better brandability and memorability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
