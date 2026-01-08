"use client";

import * as React from "react";

export interface DomainResult {
  domain: string;
  name: string;
  tld: string;
  available: boolean | null;
  source: string;
  score?: number;
  error?: string;
}

export interface SearchOptions {
  keywords: string[];
  tlds: string[];
  prefixes?: string[];
  suffixes?: string[];
  metaphors?: string[];
  industry?: string | null;
  includeCombinations?: boolean;
  minLength?: number;
  maxLength?: number;
  count?: number;
  checkAvailability?: boolean;
}

export interface SearchResponse {
  results: DomainResult[];
  total: number;
  available_count: number;
  taken_count: number;
}

export interface UseDomainSearchReturn {
  results: DomainResult[];
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    available: number;
    taken: number;
    checking: number;
  };
  search: (options: SearchOptions) => Promise<void>;
  checkSingle: (name: string, tld: string) => Promise<DomainResult>;
  clear: () => void;
}

export function useDomainSearch(): UseDomainSearchReturn {
  const [results, setResults] = React.useState<DomainResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const stats = React.useMemo(() => {
    return {
      total: results.length,
      available: results.filter((r) => r.available === true).length,
      taken: results.filter((r) => r.available === false).length,
      checking: results.filter((r) => r.available === null).length,
    };
  }, [results]);

  const search = React.useCallback(async (options: SearchOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/domains/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keywords: options.keywords,
          tlds: options.tlds,
          prefixes: options.prefixes,
          suffixes: options.suffixes,
          metaphors: options.metaphors,
          industry: options.industry,
          include_combinations: options.includeCombinations ?? true,
          min_length: options.minLength ?? 4,
          max_length: options.maxLength ?? 15,
          count: options.count ?? 30,
          check_availability: options.checkAvailability ?? true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data: SearchResponse = await response.json();
      setResults(data.results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Search failed";
      setError(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkSingle = React.useCallback(
    async (name: string, tld: string): Promise<DomainResult> => {
      const response = await fetch("/api/domains/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, tld }),
      });

      if (!response.ok) {
        throw new Error("Check failed");
      }

      return response.json();
    },
    []
  );

  const clear = React.useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    stats,
    search,
    checkSingle,
    clear,
  };
}
