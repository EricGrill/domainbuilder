"use client";

import * as React from "react";
import { PLAN_FEATURES, PRODUCTS, hasFeatureAccess, getFeatureLimit } from "@/lib/stripe";

interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
  subscriptionId?: string;
  subscriptionStatus?: "active" | "trialing" | "canceled" | "past_due";
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
}

interface SubscriptionContextValue {
  user: User | null;
  isLoading: boolean;
  isPro: boolean;
  isTrialing: boolean;
  hasFeature: (feature: keyof typeof PLAN_FEATURES.free) => boolean;
  getLimit: (feature: keyof typeof PLAN_FEATURES.free) => number;
  openCheckout: (billingPeriod: "monthly" | "yearly") => Promise<void>;
  refresh: () => Promise<void>;
}

const SubscriptionContext = React.createContext<SubscriptionContextValue | null>(null);

// Mock user for development
const MOCK_USER: User = {
  id: "user_demo",
  email: "demo@brandspark.io",
  name: "Demo User",
  plan: "free",
  subscriptionId: undefined,
  subscriptionStatus: undefined,
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load user data
  React.useEffect(() => {
    // In production, fetch user from API/Supabase
    // For now, use mock user
    const loadUser = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check localStorage for mock Pro status (for demo purposes)
        const mockPro = localStorage.getItem("brandspark_mock_pro");
        if (mockPro === "true") {
          setUser({ ...MOCK_USER, plan: "pro", subscriptionStatus: "active" });
        } else {
          setUser(MOCK_USER);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(MOCK_USER);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Check if user is Pro
  const isPro = user?.plan === "pro" &&
    (user?.subscriptionStatus === "active" || user?.subscriptionStatus === "trialing");

  // Check if user is in trial
  const isTrialing = user?.subscriptionStatus === "trialing";

  // Check feature access
  const hasFeature = React.useCallback(
    (feature: keyof typeof PLAN_FEATURES.free) => {
      if (!user) return false;
      return hasFeatureAccess(user.plan, feature);
    },
    [user]
  );

  // Get feature limit
  const getLimit = React.useCallback(
    (feature: keyof typeof PLAN_FEATURES.free) => {
      if (!user) return 0;
      return getFeatureLimit(user.plan, feature);
    },
    [user]
  );

  // Open checkout
  const openCheckout = React.useCallback(
    async (billingPeriod: "monthly" | "yearly") => {
      if (!user) return;

      try {
        const priceId = billingPeriod === "yearly"
          ? PRODUCTS.pro.yearly.priceId
          : PRODUCTS.pro.monthly.priceId;

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId,
            billingPeriod,
            userId: user.id,
            email: user.email,
          }),
        });

        const data = await response.json();

        if (data.url) {
          // In production, redirect to Stripe checkout
          // window.location.href = data.url;

          // For demo, simulate successful checkout
          const confirmed = window.confirm(
            `Demo Mode: Click OK to simulate Pro subscription.\n\n` +
            `Plan: Brandspark Pro\n` +
            `Price: ${data.product.amount}/${data.product.interval}\n` +
            `Trial: 7 days free`
          );

          if (confirmed) {
            localStorage.setItem("brandspark_mock_pro", "true");
            setUser({ ...user, plan: "pro", subscriptionStatus: "trialing" });
          }
        }
      } catch (error) {
        console.error("Checkout error:", error);
      }
    },
    [user]
  );

  // Refresh user data
  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // In production, re-fetch from API
      const mockPro = localStorage.getItem("brandspark_mock_pro");
      if (mockPro === "true") {
        setUser({ ...MOCK_USER, plan: "pro", subscriptionStatus: "active" });
      } else {
        setUser(MOCK_USER);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        isLoading,
        isPro,
        isTrialing,
        hasFeature,
        getLimit,
        openCheckout,
        refresh,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = React.useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}

// Helper component for feature gating
export function ProFeature({
  feature,
  children,
  fallback,
}: {
  feature: keyof typeof PLAN_FEATURES.free;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasFeature } = useSubscription();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

// Higher-order component for Pro-only pages
export function withProAccess<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<P>
) {
  return function ProProtectedComponent(props: P) {
    const { isPro, isLoading } = useSubscription();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
        </div>
      );
    }

    if (!isPro && fallback) {
      const Fallback = fallback;
      return <Fallback {...props} />;
    }

    if (!isPro) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">Pro Feature</h2>
            <p className="text-[var(--text-secondary)]">
              Upgrade to Pro to access this feature.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
