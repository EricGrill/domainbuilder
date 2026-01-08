"use client";

import * as React from "react";
import {
  Check,
  Sparkles,
  Zap,
  Search,
  Heart,
  FolderHeart,
  Clock,
  Download,
  Palette,
  Brain,
  Shield,
  Bell,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Feature comparison
const features = [
  {
    name: "Daily Searches",
    free: "20",
    pro: "Unlimited",
    icon: Search,
  },
  {
    name: "Keywords per Search",
    free: "3",
    pro: "10",
    icon: Zap,
  },
  {
    name: "TLDs per Search",
    free: "3",
    pro: "All 20+",
    icon: Sparkles,
  },
  {
    name: "Saved Domains",
    free: "20",
    pro: "500",
    icon: Heart,
  },
  {
    name: "Folders",
    free: "3",
    pro: "Unlimited",
    icon: FolderHeart,
  },
  {
    name: "Search History",
    free: "10 searches",
    pro: "Unlimited",
    icon: Clock,
  },
  {
    name: "AI Name Generation",
    free: "—",
    pro: "✓",
    icon: Brain,
  },
  {
    name: "Brand Preview",
    free: "—",
    pro: "✓",
    icon: Palette,
  },
  {
    name: "Portfolio Management",
    free: "—",
    pro: "✓",
    icon: Shield,
  },
  {
    name: "Expiration Alerts",
    free: "—",
    pro: "✓",
    icon: Bell,
  },
  {
    name: "CSV Export",
    free: "—",
    pro: "✓",
    icon: Download,
  },
  {
    name: "Bulk Domain Check",
    free: "—",
    pro: "100 at once",
    icon: Zap,
  },
];

const testimonials = [
  {
    quote:
      "Brandspark helped me find the perfect domain for my startup in under 5 minutes. The AI suggestions were spot on!",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    avatar: "S",
  },
  {
    quote:
      "I've tried dozens of domain tools. Brandspark's brand preview feature alone is worth the Pro subscription.",
    author: "Marcus Johnson",
    role: "Creative Director",
    avatar: "M",
  },
  {
    quote:
      "Managing my 200+ domain portfolio has never been easier. The expiration alerts have saved me multiple times.",
    author: "Emily Rodriguez",
    role: "Domain Investor",
    avatar: "E",
  },
];

export default function UpgradePage() {
  const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "yearly">(
    "yearly"
  );

  const monthlyPrice = 12;
  const yearlyPrice = 99;
  const yearlySavings = monthlyPrice * 12 - yearlyPrice;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <Badge variant="pro" className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          PRO
        </Badge>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Unlock the Full Power of Brandspark
        </h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-xl mx-auto">
          Get unlimited searches, AI-powered suggestions, brand previews, and
          portfolio management tools.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            billingPeriod === "monthly"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
            billingPeriod === "yearly"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          Yearly
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              billingPeriod === "yearly"
                ? "bg-white/20 text-white"
                : "bg-green-100 text-green-700"
            )}
          >
            Save ${yearlySavings}
          </span>
        </button>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Free</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold text-[var(--text-primary)]">
                $0
              </span>
              <span className="text-[var(--text-muted)]">/forever</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Perfect for getting started with domain hunting
            </p>
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
            <ul className="space-y-3">
              {features.slice(0, 6).map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-center gap-3 text-sm"
                >
                  <feature.icon className="h-4 w-4 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">
                    {feature.name}
                  </span>
                  <span className="ml-auto font-medium text-[var(--text-primary)]">
                    {feature.free}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-[var(--primary)] border-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-xs px-3 py-1 rounded-bl-lg">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Pro
              <Badge variant="pro">PRO</Badge>
            </CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold text-[var(--text-primary)]">
                ${billingPeriod === "yearly" ? yearlyPrice : monthlyPrice}
              </span>
              <span className="text-[var(--text-muted)]">
                /{billingPeriod === "yearly" ? "year" : "month"}
              </span>
              {billingPeriod === "yearly" && (
                <p className="text-sm text-[var(--success)] mt-1">
                  = $8.25/month (save ${yearlySavings})
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Everything you need to find and manage domains like a pro
            </p>
            <Button className="w-full" size="lg">
              Start 7-Day Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-center gap-3 text-sm"
                >
                  <feature.icon className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-[var(--text-secondary)]">
                    {feature.name}
                  </span>
                  <span className="ml-auto font-medium text-[var(--text-primary)]">
                    {feature.pro}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">
                    Feature
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">
                    Free
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-[var(--text-secondary)]">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr
                    key={feature.name}
                    className={cn(
                      "border-b border-[var(--border)] last:border-b-0",
                      idx % 2 === 0 && "bg-[var(--muted)] bg-opacity-50"
                    )}
                  >
                    <td className="py-3 px-4 text-sm text-[var(--text-primary)] flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-[var(--text-muted)]" />
                      {feature.name}
                    </td>
                    <td className="text-center py-3 px-4 text-sm text-[var(--text-secondary)]">
                      {feature.free === "—" ? (
                        <span className="text-[var(--text-muted)]">—</span>
                      ) : (
                        feature.free
                      )}
                    </td>
                    <td className="text-center py-3 px-4 text-sm font-medium text-[var(--primary)]">
                      {feature.pro === "✓" ? (
                        <Check className="h-4 w-4 mx-auto text-[var(--success)]" />
                      ) : (
                        feature.pro
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] text-center mb-6">
          Loved by Founders & Domain Investors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <CardContent className="p-5">
                <p className="text-sm text-[var(--text-secondary)] italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                    <span className="font-medium text-[var(--primary-dark)]">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
            },
            {
              q: "What happens to my saved domains if I downgrade?",
              a: "Your saved domains are kept, but you'll only be able to access the first 20. Portfolio management features will be locked.",
            },
            {
              q: "Do you offer refunds?",
              a: "We offer a full refund within the first 7 days if you're not satisfied with Pro.",
            },
            {
              q: "Is my payment information secure?",
              a: "Absolutely. We use Stripe for payment processing and never store your credit card details on our servers.",
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-[var(--border)] pb-4 last:border-b-0">
              <h4 className="font-medium text-[var(--text-primary)]">
                {faq.q}
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {faq.a}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Final CTA */}
      <div className="text-center py-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-xl text-white">
        <h2 className="text-2xl font-bold">Ready to Spark Your Brand?</h2>
        <p className="mt-2 text-white/80">
          Join thousands of founders finding their perfect domain
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-6 bg-white text-[var(--primary)] hover:bg-white/90"
        >
          Start 7-Day Free Trial
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-sm text-white/60 mt-3">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}
