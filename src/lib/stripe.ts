// Stripe configuration and helpers
// Note: In production, use actual Stripe SDK with STRIPE_SECRET_KEY

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
};

// Product/Price IDs - set these in Stripe Dashboard
export const PRODUCTS = {
  pro: {
    monthly: {
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_pro_monthly",
      amount: 1200, // $12.00
      interval: "month" as const,
    },
    yearly: {
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_pro_yearly",
      amount: 9900, // $99.00
      interval: "year" as const,
    },
  },
};

// Plan features for tier comparison
export const PLAN_FEATURES = {
  free: {
    name: "Free",
    dailySearches: 20,
    keywordsPerSearch: 3,
    tldsPerSearch: 3,
    savedDomains: 20,
    folders: 3,
    searchHistory: 10,
    aiGeneration: false,
    brandPreview: false,
    portfolioManagement: false,
    expirationAlerts: false,
    csvExport: false,
    bulkCheck: false,
  },
  pro: {
    name: "Pro",
    dailySearches: Infinity,
    keywordsPerSearch: 10,
    tldsPerSearch: 20,
    savedDomains: 500,
    folders: Infinity,
    searchHistory: Infinity,
    aiGeneration: true,
    brandPreview: true,
    portfolioManagement: true,
    expirationAlerts: true,
    csvExport: true,
    bulkCheck: true,
  },
};

// Check if user has access to a feature
export function hasFeatureAccess(
  plan: "free" | "pro",
  feature: keyof typeof PLAN_FEATURES.free
): boolean {
  const features = PLAN_FEATURES[plan];
  const value = features[feature];

  if (typeof value === "boolean") {
    return value;
  }

  return true;
}

// Get feature limit for a plan
export function getFeatureLimit(
  plan: "free" | "pro",
  feature: keyof typeof PLAN_FEATURES.free
): number {
  const features = PLAN_FEATURES[plan];
  const value = features[feature];

  if (typeof value === "number") {
    return value;
  }

  return 0;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

// Calculate savings for yearly plan
export function calculateYearlySavings(): number {
  const monthlyTotal = PRODUCTS.pro.monthly.amount * 12;
  const yearlyTotal = PRODUCTS.pro.yearly.amount;
  return monthlyTotal - yearlyTotal;
}
