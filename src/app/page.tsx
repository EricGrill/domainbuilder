"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Zap,
  Palette,
  FolderHeart,
  ArrowRight,
  Check,
} from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { DomainGrid } from "@/components/domain-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDomainSearch } from "@/hooks/use-domain-search";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Naming",
    description:
      "Get creative, brandable domain suggestions powered by advanced AI",
    pro: true,
  },
  {
    icon: Zap,
    title: "Real-Time Checking",
    description: "Instant availability verification across multiple TLDs",
    pro: false,
  },
  {
    icon: Palette,
    title: "Brand Preview",
    description:
      "See logo mockups and social media previews before you commit",
    pro: true,
  },
  {
    icon: FolderHeart,
    title: "Portfolio Management",
    description: "Save favorites, track owned domains, get expiration alerts",
    pro: true,
  },
];

const heroStats = [
  { value: "50K+", label: "Domains Generated" },
  { value: "10K+", label: "Happy Founders" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 2s", label: "Search Speed" },
];

export default function HomePage() {
  const router = useRouter();
  const { results, isLoading, error, stats, search } = useDomainSearch();
  const [hasSearched, setHasSearched] = React.useState(false);
  const [savedDomains, setSavedDomains] = React.useState<string[]>([]);

  const handleSearch = async (keywords: string[]) => {
    setHasSearched(true);
    await search({
      keywords,
      tlds: ["com", "io", "co"],
      count: 24,
      checkAvailability: true,
    });
  };

  const handleSave = (domain: { domain: string; tld: string }) => {
    const fullDomain = `${domain.domain}.${domain.tld}`;
    if (savedDomains.includes(fullDomain)) {
      setSavedDomains(savedDomains.filter((d) => d !== fullDomain));
    } else {
      setSavedDomains([...savedDomains, fullDomain]);
    }
  };

  const handleRegister = (domain: { domain: string; tld: string }) => {
    const fullDomain = `${domain.domain}.${domain.tld}`;
    window.open(
      `https://www.namecheap.com/domains/registration/results/?domain=${fullDomain}`,
      "_blank"
    );
  };

  // Convert API results to component format
  const domainResults = results.map((r) => ({
    domain: r.name,
    tld: r.tld,
    available: r.available === null ? ("checking" as const) : r.available,
    source: r.source,
    score: r.score,
  }));

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">
                Brandspark
              </span>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/search"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Advanced Search
              </Link>
              <a
                href="#features"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Pricing
              </a>
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Link href="/search">
                <Button size="sm">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[var(--secondary)]" />
            AI-Powered Domain Discovery
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
            Your brand deserves better than{" "}
            <span className="text-[var(--text-muted)] line-through">
              yourcompany2024.com
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
            Generate unique, brandable domain names with AI. See instant
            availability and visual brand previews. Launch faster.
          </p>

          {/* Search Input */}
          <div className="mt-10">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              20 free searches/day
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-[var(--success)]" />
              Instant results
            </span>
          </div>
        </div>
      </section>

      {/* Results Section (shown after search) */}
      {hasSearched && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[var(--muted)]">
          <div className="max-w-6xl mx-auto">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  Domain Results
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {stats.available} available
                  of {stats.total} checked
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  Sort by: Availability
                </Button>
              </div>
            </div>

            {/* Domain grid */}
            <DomainGrid
              domains={domainResults}
              onSave={handleSave}
              onRegister={handleRegister}
              savedDomains={savedDomains}
            />

            {/* Load more */}
            {domainResults.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  Generate More Ideas
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Everything you need to find the perfect domain
            </h2>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              Powerful features that make domain hunting actually enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] bg-opacity-30 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {feature.title}
                        </h3>
                        {feature.pro && <Badge variant="pro">PRO</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[var(--primary)]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-sm text-[var(--primary-light)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Ready to spark your brand?
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Join thousands of founders who found their perfect domain with
            Brandspark
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl">
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="xl">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-[var(--text-primary)]">
                Brandspark
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © 2026 Brandspark. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
              <a href="#" className="hover:text-[var(--text-primary)]">
                Privacy
              </a>
              <a href="#" className="hover:text-[var(--text-primary)]">
                Terms
              </a>
              <a href="#" className="hover:text-[var(--text-primary)]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
