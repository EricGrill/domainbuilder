"use client";

import { SubscriptionProvider } from "@/hooks/use-subscription";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionProvider>
      {children}
    </SubscriptionProvider>
  );
}
