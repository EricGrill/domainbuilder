"use client";

import * as React from "react";
import {
  TrendingUp,
  Type,
  Hash,
  Globe,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBreakdown {
  length: number;
  pronounceability: number;
  memorability: number;
  brandability: number;
  tldMatch: number;
}

interface NameScoreProps {
  name: string;
  tld: string;
  score?: number;
  breakdown?: ScoreBreakdown;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

// Calculate score breakdown from name
function calculateBreakdown(name: string, tld: string): ScoreBreakdown {
  const len = name.length;

  // Length score (optimal: 6-10 characters)
  let lengthScore = 100;
  if (len < 4) lengthScore = 50;
  else if (len < 6) lengthScore = 70;
  else if (len <= 10) lengthScore = 100;
  else if (len <= 12) lengthScore = 85;
  else if (len <= 15) lengthScore = 70;
  else lengthScore = 50;

  // Pronounceability (vowel/consonant ratio, no difficult patterns)
  const vowels = name.match(/[aeiou]/gi)?.length || 0;
  const consonants = len - vowels;
  const ratio = vowels / (consonants || 1);
  let pronounceScore = 70;
  if (ratio >= 0.3 && ratio <= 0.6) pronounceScore = 95;
  else if (ratio >= 0.2 && ratio <= 0.7) pronounceScore = 80;
  // Penalize difficult patterns
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(name)) pronounceScore -= 20;
  if (/(.)\1{2,}/.test(name)) pronounceScore -= 10;

  // Memorability (unique letters, no numbers, simple structure)
  const uniqueLetters = new Set(name.toLowerCase()).size;
  let memorabilityScore = Math.min(100, 60 + uniqueLetters * 3);
  if (/\d/.test(name)) memorabilityScore -= 15;
  if (/-/.test(name)) memorabilityScore -= 10;
  if (len <= 8) memorabilityScore += 10;

  // Brandability (starts with strong letter, has rhythm)
  let brandabilityScore = 75;
  if (/^[bcdgkpst]/i.test(name)) brandabilityScore += 10;
  if (name.endsWith("ly") || name.endsWith("ify") || name.endsWith("io"))
    brandabilityScore += 5;
  if (uniqueLetters >= len * 0.6) brandabilityScore += 10;
  if (/^[A-Z]/.test(name)) brandabilityScore += 5; // Proper capitalization

  // TLD match
  let tldScore = 80;
  const techTlds = ["io", "dev", "app", "tech", "ai"];
  const businessTlds = ["com", "co", "biz"];
  if (tld === "com") tldScore = 100;
  else if (techTlds.includes(tld)) tldScore = 90;
  else if (businessTlds.includes(tld)) tldScore = 85;

  return {
    length: Math.max(0, Math.min(100, lengthScore)),
    pronounceability: Math.max(0, Math.min(100, pronounceScore)),
    memorability: Math.max(0, Math.min(100, memorabilityScore)),
    brandability: Math.max(0, Math.min(100, brandabilityScore)),
    tldMatch: Math.max(0, Math.min(100, tldScore)),
  };
}

// Calculate overall score from breakdown
function calculateOverallScore(breakdown: ScoreBreakdown): number {
  const weights = {
    length: 0.15,
    pronounceability: 0.25,
    memorability: 0.25,
    brandability: 0.25,
    tldMatch: 0.1,
  };

  return Math.round(
    breakdown.length * weights.length +
      breakdown.pronounceability * weights.pronounceability +
      breakdown.memorability * weights.memorability +
      breakdown.brandability * weights.brandability +
      breakdown.tldMatch * weights.tldMatch
  );
}

export function NameScore({
  name,
  tld,
  score: providedScore,
  breakdown: providedBreakdown,
  showDetails = false,
  size = "md",
}: NameScoreProps) {
  const [isExpanded, setIsExpanded] = React.useState(showDetails);

  const breakdown = providedBreakdown || calculateBreakdown(name, tld);
  const score = providedScore || calculateOverallScore(breakdown);

  // Score color
  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-green-600";
    if (s >= 70) return "text-amber-600";
    if (s >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (s: number) => {
    if (s >= 85) return "bg-green-500";
    if (s >= 70) return "bg-amber-500";
    if (s >= 50) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Fair";
    return "Poor";
  };

  const scoreCategories = [
    {
      key: "length",
      label: "Length",
      icon: Hash,
      value: breakdown.length,
      tip: "Optimal domain length is 6-10 characters",
    },
    {
      key: "pronounceability",
      label: "Pronounceability",
      icon: Type,
      value: breakdown.pronounceability,
      tip: "Easy to say and spell out loud",
    },
    {
      key: "memorability",
      label: "Memorability",
      icon: Sparkles,
      value: breakdown.memorability,
      tip: "How easily people will remember it",
    },
    {
      key: "brandability",
      label: "Brandability",
      icon: TrendingUp,
      value: breakdown.brandability,
      tip: "Potential as a strong brand name",
    },
    {
      key: "tldMatch",
      label: "TLD Match",
      icon: Globe,
      value: breakdown.tldMatch,
      tip: "How well the TLD fits the name",
    },
  ];

  // Size variants
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="space-y-2">
      {/* Main Score */}
      <div
        className={cn(
          "flex items-center gap-3 cursor-pointer",
          size === "sm" && "gap-2"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div
          className={cn(
            "font-bold tabular-nums",
            sizeClasses[size],
            getScoreColor(score)
          )}
        >
          {score}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-medium",
                size === "sm" && "text-xs"
              )}
            >
              {getScoreLabel(score)}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
            )}
          </div>
          {/* Mini progress bar */}
          <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden mt-1">
            <div
              className={cn("h-full rounded-full transition-all", getScoreBg(score))}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pt-3 space-y-3 border-t border-[var(--border)]">
          {scoreCategories.map((category) => (
            <div key={category.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                  <button
                    className="group relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3 w-3 text-[var(--text-muted)]" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-[var(--text-primary)] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {category.tip}
                    </span>
                  </button>
                </div>
                <span className={cn("font-medium", getScoreColor(category.value))}>
                  {category.value}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    getScoreBg(category.value)
                  )}
                  style={{ width: `${category.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact inline score badge
export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const getScoreColor = (s: number) => {
    if (s >= 85) return "bg-green-100 text-green-700";
    if (s >= 70) return "bg-amber-100 text-amber-700";
    if (s >= 50) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <span
      className={cn(
        "rounded-full font-medium tabular-nums",
        sizeClasses[size],
        getScoreColor(score)
      )}
    >
      {score}
    </span>
  );
}
