"use client";

import * as React from "react";
import { Heart, ExternalLink, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DomainResult {
  domain: string;
  tld: string;
  available: boolean | "checking" | "unknown";
  source?: string;
  score?: number;
}

interface DomainCardProps {
  domain: DomainResult;
  onSave?: (domain: DomainResult) => void;
  onRegister?: (domain: DomainResult) => void;
  isSaved?: boolean;
}

export function DomainCard({
  domain,
  onSave,
  onRegister,
  isSaved = false,
}: DomainCardProps) {
  const fullDomain = `${domain.domain}.${domain.tld}`;

  const getAvailabilityBadge = () => {
    if (domain.available === "checking") {
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Checking
        </Badge>
      );
    }
    if (domain.available === true) {
      return (
        <Badge variant="available" className="gap-1">
          <Check className="h-3 w-3" />
          Available
        </Badge>
      );
    }
    if (domain.available === false) {
      return (
        <Badge variant="taken" className="gap-1">
          <X className="h-3 w-3" />
          Taken
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        Unknown
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "group relative p-4 transition-all hover:shadow-md",
        domain.available === true && "border-[var(--success)] border-opacity-50",
        domain.available === false && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Domain name */}
          <h3 className="font-mono text-lg font-semibold text-[var(--text-primary)] truncate">
            {fullDomain}
          </h3>

          {/* Source tag */}
          {domain.source && (
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Generated from: {domain.source}
            </p>
          )}

          {/* Score */}
          {domain.score && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    domain.score >= 85 ? "bg-green-500" :
                    domain.score >= 70 ? "bg-amber-500" :
                    domain.score >= 50 ? "bg-orange-500" : "bg-red-500"
                  )}
                  style={{ width: `${domain.score}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
                domain.score >= 85 ? "text-green-600" :
                domain.score >= 70 ? "text-amber-600" :
                domain.score >= 50 ? "text-orange-600" : "text-red-600"
              )}>
                {domain.score}
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="flex-shrink-0">{getAvailabilityBadge()}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--border)]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave?.(domain)}
          className={cn(
            "flex-1",
            isSaved && "text-red-500 hover:text-red-600"
          )}
        >
          <Heart
            className={cn("h-4 w-4 mr-1.5", isSaved && "fill-current")}
          />
          {isSaved ? "Saved" : "Save"}
        </Button>

        {domain.available === true && (
          <Button
            variant="default"
            size="sm"
            onClick={() => onRegister?.(domain)}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-1.5" />
            Register
          </Button>
        )}
      </div>
    </Card>
  );
}

// Grid component for displaying multiple domain cards
interface DomainGridProps {
  domains: DomainResult[];
  onSave?: (domain: DomainResult) => void;
  onRegister?: (domain: DomainResult) => void;
  savedDomains?: string[];
}

export function DomainGrid({
  domains,
  onSave,
  onRegister,
  savedDomains = [],
}: DomainGridProps) {
  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">
          Enter keywords above to find available domains
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {domains.map((domain) => (
        <DomainCard
          key={`${domain.domain}.${domain.tld}`}
          domain={domain}
          onSave={onSave}
          onRegister={onRegister}
          isSaved={savedDomains.includes(`${domain.domain}.${domain.tld}`)}
        />
      ))}
    </div>
  );
}
