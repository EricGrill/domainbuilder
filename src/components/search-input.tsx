"use client";

import * as React from "react";
import { Search, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  onSearch: (keywords: string[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchInput({
  onSearch,
  isLoading = false,
  placeholder = "Enter keywords (e.g., swift, cloud, sync)",
}: SearchInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed) && keywords.length < 5) {
      setKeywords([...keywords, trimmed]);
      setInputValue("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addKeyword(inputValue);
      } else if (keywords.length > 0) {
        onSearch(keywords);
      }
    } else if (e.key === "," || e.key === " ") {
      e.preventDefault();
      if (inputValue.trim()) {
        addKeyword(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
    if (keywords.length > 0 || inputValue.trim()) {
      const allKeywords = inputValue.trim()
        ? [...keywords, inputValue.trim().toLowerCase()]
        : keywords;
      onSearch(allKeywords);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-3 rounded-xl border-2 bg-white shadow-lg transition-all",
          "border-[var(--border)] focus-within:border-[var(--primary)] focus-within:ring-4 focus-within:ring-[var(--primary-light)] focus-within:ring-opacity-20"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className="h-5 w-5 text-[var(--text-muted)] flex-shrink-0" />

        {/* Keyword chips */}
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--primary-light)] bg-opacity-30 text-[var(--primary-dark)] text-sm font-medium"
          >
            {keyword}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeKeyword(keyword);
              }}
              className="hover:bg-[var(--primary)] hover:bg-opacity-20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keywords.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          disabled={isLoading}
        />

        {/* Search button */}
        <Button
          onClick={handleSearch}
          disabled={isLoading || (keywords.length === 0 && !inputValue.trim())}
          isLoading={isLoading}
          size="lg"
          className="flex-shrink-0"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Find Domains
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-[var(--text-secondary)] mt-3">
        Press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)] text-xs font-mono">
          Space
        </kbd>{" "}
        or{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)] text-xs font-mono">
          ,
        </kbd>{" "}
        to add keywords •{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-[var(--muted)] text-xs font-mono">
          Enter
        </kbd>{" "}
        to search • Max 5 keywords
      </p>
    </div>
  );
}
