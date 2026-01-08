"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TLDOption {
  tld: string;
  label: string;
  popular?: boolean;
}

const DEFAULT_TLDS: TLDOption[] = [
  { tld: "com", label: ".com", popular: true },
  { tld: "io", label: ".io", popular: true },
  { tld: "co", label: ".co", popular: true },
  { tld: "net", label: ".net" },
  { tld: "org", label: ".org" },
  { tld: "ai", label: ".ai", popular: true },
  { tld: "app", label: ".app" },
  { tld: "dev", label: ".dev" },
  { tld: "xyz", label: ".xyz" },
  { tld: "tech", label: ".tech" },
];

interface TLDSelectorProps {
  selected: string[];
  onChange: (tlds: string[]) => void;
  tlds?: TLDOption[];
  maxSelections?: number;
  showLimit?: boolean;
}

export function TLDSelector({
  selected,
  onChange,
  tlds = DEFAULT_TLDS,
  maxSelections = 5,
  showLimit = true,
}: TLDSelectorProps) {
  const toggleTLD = (tld: string) => {
    if (selected.includes(tld)) {
      onChange(selected.filter((t) => t !== tld));
    } else if (selected.length < maxSelections) {
      onChange([...selected, tld]);
    }
  };

  const selectAll = () => {
    onChange(tlds.slice(0, maxSelections).map((t) => t.tld));
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Domain Extensions
        </label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={selectAll}
            className="text-[var(--primary)] hover:underline"
          >
            Select All
          </button>
          <span className="text-[var(--text-muted)]">|</span>
          <button
            type="button"
            onClick={clearAll}
            className="text-[var(--primary)] hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tlds.map((option) => {
          const isSelected = selected.includes(option.tld);
          const isDisabled = !isSelected && selected.length >= maxSelections;

          return (
            <button
              key={option.tld}
              type="button"
              onClick={() => toggleTLD(option.tld)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                isSelected
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--text-secondary)] hover:bg-[var(--border)]",
                isDisabled && "opacity-50 cursor-not-allowed",
                option.popular && !isSelected && "ring-1 ring-[var(--primary)] ring-opacity-30"
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
              {option.label}
            </button>
          );
        })}
      </div>

      {showLimit && (
        <p className="text-xs text-[var(--text-muted)]">
          {selected.length} of {maxSelections} selected
          {selected.length >= maxSelections && (
            <span className="text-[var(--warning)] ml-1">• Maximum reached</span>
          )}
        </p>
      )}
    </div>
  );
}
