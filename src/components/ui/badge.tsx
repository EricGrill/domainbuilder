"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--primary)] text-white",
        secondary:
          "bg-[var(--muted)] text-[var(--text-secondary)]",
        available:
          "bg-[var(--success-light)] text-emerald-800",
        taken:
          "bg-[var(--error-light)] text-red-800",
        premium:
          "bg-[var(--warning-light)] text-amber-800",
        warning:
          "bg-orange-100 text-orange-800",
        pro:
          "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
        outline:
          "border border-[var(--border)] text-[var(--text-primary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
