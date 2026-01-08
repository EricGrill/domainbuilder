"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface FilterOptions {
  prefixes: string[];
  suffixes: string[];
  metaphors: string[];
  industry: string | null;
  minLength: number;
  maxLength: number;
  includeCombinations: boolean;
}

interface FilterPanelProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  availableOptions?: {
    prefixes: Record<string, string[]>;
    suffixes: Record<string, string[]>;
    metaphors: Record<string, string[]>;
    industries: string[];
  };
}

const DEFAULT_AVAILABLE = {
  prefixes: {
    action: ["go", "get", "try", "use", "run"],
    possessive: ["my", "our", "the"],
    team: ["team", "crew", "squad"],
    time: ["daily", "now", "quick"],
  },
  suffixes: {
    app: ["ly", "ify", "io", "app"],
    hub: ["hub", "lab", "hq", "base"],
    bot: ["bot", "ai", "sync", "flow"],
  },
  metaphors: {
    speed: ["swift", "flash", "bolt", "dash"],
    growth: ["bloom", "rise", "thrive", "surge"],
    creation: ["forge", "craft", "build", "spark"],
    tech: ["byte", "pixel", "code", "cloud"],
  },
  industries: ["tech", "finance", "health", "education", "ecommerce", "creative"],
};

export function FilterPanel({
  options,
  onChange,
  availableOptions = DEFAULT_AVAILABLE,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    "prefixes",
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const togglePrefix = (category: string) => {
    const prefixes = availableOptions.prefixes[category] || [];
    const allSelected = prefixes.every((p) => options.prefixes.includes(p));

    if (allSelected) {
      onChange({
        ...options,
        prefixes: options.prefixes.filter((p) => !prefixes.includes(p)),
      });
    } else {
      onChange({
        ...options,
        prefixes: [...new Set([...options.prefixes, ...prefixes])],
      });
    }
  };

  const toggleSuffix = (category: string) => {
    const suffixes = availableOptions.suffixes[category] || [];
    const allSelected = suffixes.every((s) => options.suffixes.includes(s));

    if (allSelected) {
      onChange({
        ...options,
        suffixes: options.suffixes.filter((s) => !suffixes.includes(s)),
      });
    } else {
      onChange({
        ...options,
        suffixes: [...new Set([...options.suffixes, ...suffixes])],
      });
    }
  };

  const toggleMetaphor = (theme: string) => {
    if (options.metaphors.includes(theme)) {
      onChange({
        ...options,
        metaphors: options.metaphors.filter((m) => m !== theme),
      });
    } else {
      onChange({
        ...options,
        metaphors: [...options.metaphors, theme],
      });
    }
  };

  const resetFilters = () => {
    onChange({
      prefixes: ["go", "get", "try", "my"],
      suffixes: ["ly", "ify", "hub", "app"],
      metaphors: [],
      industry: null,
      minLength: 4,
      maxLength: 15,
      includeCombinations: true,
    });
  };

  const SectionHeader = ({
    title,
    section,
    count,
  }: {
    title: string;
    section: string;
    count: number;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--primary)]"
    >
      <span>
        {title}
        {count > 0 && (
          <span className="ml-2 text-xs text-[var(--primary)]">({count})</span>
        )}
      </span>
      {expandedSections.includes(section) ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </button>
  );

  const CategoryCheckbox = ({
    category,
    selected,
    items,
    onToggle,
  }: {
    category: string;
    selected: string[];
    items: string[];
    onToggle: (category: string) => void;
  }) => {
    const allSelected = items.every((item) => selected.includes(item));
    const someSelected =
      !allSelected && items.some((item) => selected.includes(item));

    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          onChange={() => onToggle(category)}
          className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
        />
        <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] capitalize">
          {category}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          ({items.slice(0, 3).join(", ")}...)
        </span>
      </label>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[var(--text-primary)]">Filters</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Reset
        </Button>
      </div>

      {/* Prefixes */}
      <div className="border-t border-[var(--border)] pt-3">
        <SectionHeader
          title="Prefixes"
          section="prefixes"
          count={options.prefixes.length}
        />
        {expandedSections.includes("prefixes") && (
          <div className="space-y-2 mt-2">
            {Object.entries(availableOptions.prefixes).map(
              ([category, items]) => (
                <CategoryCheckbox
                  key={category}
                  category={category}
                  selected={options.prefixes}
                  items={items}
                  onToggle={togglePrefix}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Suffixes */}
      <div className="border-t border-[var(--border)] pt-3">
        <SectionHeader
          title="Suffixes"
          section="suffixes"
          count={options.suffixes.length}
        />
        {expandedSections.includes("suffixes") && (
          <div className="space-y-2 mt-2">
            {Object.entries(availableOptions.suffixes).map(
              ([category, items]) => (
                <CategoryCheckbox
                  key={category}
                  category={category}
                  selected={options.suffixes}
                  items={items}
                  onToggle={toggleSuffix}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Metaphors */}
      <div className="border-t border-[var(--border)] pt-3">
        <SectionHeader
          title="Creative Themes"
          section="metaphors"
          count={options.metaphors.length}
        />
        {expandedSections.includes("metaphors") && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.keys(availableOptions.metaphors).map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => toggleMetaphor(theme)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all capitalize",
                  options.metaphors.includes(theme)
                    ? "bg-[var(--secondary)] text-white"
                    : "bg-[var(--muted)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                )}
              >
                {theme}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Industry */}
      <div className="border-t border-[var(--border)] pt-3">
        <SectionHeader
          title="Industry Focus"
          section="industry"
          count={options.industry ? 1 : 0}
        />
        {expandedSections.includes("industry") && (
          <div className="mt-2">
            <select
              value={options.industry || ""}
              onChange={(e) =>
                onChange({
                  ...options,
                  industry: e.target.value || null,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-white text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">No specific industry</option>
              {availableOptions.industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Length */}
      <div className="border-t border-[var(--border)] pt-3">
        <SectionHeader title="Length" section="length" count={0} />
        {expandedSections.includes("length") && (
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs text-[var(--text-muted)]">
                Min: {options.minLength} characters
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={options.minLength}
                onChange={(e) =>
                  onChange({
                    ...options,
                    minLength: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--muted)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">
                Max: {options.maxLength} characters
              </label>
              <input
                type="range"
                min="8"
                max="20"
                value={options.maxLength}
                onChange={(e) =>
                  onChange({
                    ...options,
                    maxLength: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--muted)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Combinations toggle */}
      <div className="border-t border-[var(--border)] pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.includeCombinations}
            onChange={(e) =>
              onChange({
                ...options,
                includeCombinations: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <span className="text-sm text-[var(--text-secondary)]">
            Include word combinations
          </span>
        </label>
      </div>
    </div>
  );
}
