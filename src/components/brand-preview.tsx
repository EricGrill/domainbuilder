"use client";

import * as React from "react";
import {
  Palette,
  Type,
  Globe,
  CreditCard,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Github,
  ExternalLink,
  RefreshCw,
  Lock,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  name: string;
}

interface LogoSuggestion {
  style: string;
  icon: string;
  description: string;
  fontStyle: string;
}

interface SocialHandle {
  platform: string;
  handle: string;
  available: boolean | null;
}

interface FontPairing {
  heading: string;
  body: string;
  style: string;
}

interface WebsiteMockup {
  header: {
    logo: string;
    nav: string[];
    cta: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryButton: string;
    secondaryButton: string;
  };
  colors: ColorPalette;
}

interface BrandPreviewData {
  domain: string;
  brandName: string;
  palette: ColorPalette;
  logos: LogoSuggestion[];
  socialHandles: SocialHandle[];
  websiteMockup: WebsiteMockup;
  fontPairings: FontPairing[];
}

interface BrandPreviewProps {
  domainName: string;
  tld: string;
  isPro?: boolean;
  onClose?: () => void;
}

const SocialIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    facebook: <Facebook className="h-4 w-4" />,
    github: <Github className="h-4 w-4" />,
    tiktok: <span className="text-xs font-bold">TT</span>,
  };
  return icons[platform] || <Globe className="h-4 w-4" />;
};

export function BrandPreview({
  domainName,
  tld,
  isPro = false,
  onClose,
}: BrandPreviewProps) {
  const [data, setData] = React.useState<BrandPreviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"colors" | "logos" | "mockup" | "social">("colors");

  // Fetch brand preview data
  const fetchPreview = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/brand/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: domainName, tld }),
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch brand preview:", error);
    } finally {
      setIsLoading(false);
    }
  }, [domainName, tld]);

  React.useEffect(() => {
    if (isPro && domainName) {
      fetchPreview();
    }
  }, [domainName, tld, isPro, fetchPreview]);

  // Copy color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // If not Pro, show upgrade prompt
  if (!isPro) {
    return (
      <Card className="border-dashed border-2 border-purple-200 bg-purple-50/50">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            Brand Preview
          </h3>
          <Badge variant="pro" className="mb-3">PRO</Badge>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            See how your brand could look with logo concepts, color palettes,
            and website mockups before you commit.
          </p>
          <Button size="sm">
            <Sparkles className="h-4 w-4 mr-1.5" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[var(--primary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">
            Generating brand preview...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            Brand Preview
            <Badge variant="pro">PRO</Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchPreview}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Preview for <span className="font-mono font-medium">{data.domain}</span>
        </p>
      </CardHeader>

      {/* Tabs */}
      <div className="border-b border-[var(--border)] px-4">
        <div className="flex gap-4">
          {[
            { id: "colors", label: "Colors", icon: Palette },
            { id: "logos", label: "Logos", icon: Type },
            { id: "mockup", label: "Website", icon: Globe },
            { id: "social", label: "Social", icon: Twitter },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-[var(--primary)] text-[var(--primary)]"
                  : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Color Palette Tab */}
        {activeTab === "colors" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-[var(--text-primary)]">
                {data.palette.name}
              </h4>
            </div>

            {/* Color swatches */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(data.palette)
                .filter(([key]) => key !== "name")
                .map(([name, color]) => (
                  <button
                    key={name}
                    onClick={() => copyColor(color as string)}
                    className="group relative"
                  >
                    <div
                      className="w-full aspect-square rounded-lg shadow-sm border border-[var(--border)] transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color as string }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {copiedColor === color ? (
                        <Check className="h-5 w-5 text-white drop-shadow" />
                      ) : (
                        <Copy className="h-5 w-5 text-white drop-shadow" />
                      )}
                    </div>
                    <p className="text-xs text-center mt-1 text-[var(--text-muted)] capitalize">
                      {name}
                    </p>
                    <p className="text-xs text-center text-[var(--text-muted)] font-mono">
                      {color as string}
                    </p>
                  </button>
                ))}
            </div>

            {/* Font Pairings */}
            <div className="pt-4 border-t border-[var(--border)]">
              <h4 className="font-medium text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Font Pairings
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {data.fontPairings.map((pairing, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--muted)] text-center"
                  >
                    <p
                      className="font-bold text-lg"
                      style={{ fontFamily: pairing.heading }}
                    >
                      {data.brandName}
                    </p>
                    <p
                      className="text-xs text-[var(--text-secondary)] mt-1"
                      style={{ fontFamily: pairing.body }}
                    >
                      {pairing.style}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      {pairing.heading} + {pairing.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logo Tab */}
        {activeTab === "logos" && (
          <div className="grid grid-cols-2 gap-4">
            {data.logos.map((logo, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[var(--border)] text-center"
                style={{ backgroundColor: data.palette.background }}
              >
                <div
                  className={cn(
                    "w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold text-white",
                    logo.fontStyle === "monospace" && "font-mono",
                    logo.fontStyle === "rounded" && "rounded-full"
                  )}
                  style={{ backgroundColor: data.palette.primary }}
                >
                  {logo.icon}
                </div>
                <p className="mt-3 font-medium text-sm capitalize" style={{ color: data.palette.text }}>
                  {logo.style}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {logo.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Website Mockup Tab */}
        {activeTab === "mockup" && (
          <div
            className="rounded-lg overflow-hidden border border-[var(--border)]"
            style={{ backgroundColor: data.websiteMockup.colors.background }}
          >
            {/* Browser chrome */}
            <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 font-mono">
                {data.domain}
              </div>
            </div>

            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ backgroundColor: data.websiteMockup.colors.background }}
            >
              <span
                className="font-bold text-lg"
                style={{ color: data.websiteMockup.colors.primary }}
              >
                {data.websiteMockup.header.logo}
              </span>
              <div className="flex items-center gap-4">
                {data.websiteMockup.header.nav.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="text-xs"
                    style={{ color: data.websiteMockup.colors.text }}
                  >
                    {item}
                  </span>
                ))}
                <button
                  className="px-3 py-1 rounded text-xs text-white"
                  style={{ backgroundColor: data.websiteMockup.colors.primary }}
                >
                  {data.websiteMockup.header.cta}
                </button>
              </div>
            </div>

            {/* Hero */}
            <div className="px-6 py-8 text-center">
              <h1
                className="text-2xl font-bold"
                style={{ color: data.websiteMockup.colors.text }}
              >
                {data.websiteMockup.hero.headline}
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: data.websiteMockup.colors.text, opacity: 0.7 }}
              >
                {data.websiteMockup.hero.subheadline}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  className="px-4 py-2 rounded text-sm text-white"
                  style={{ backgroundColor: data.websiteMockup.colors.primary }}
                >
                  {data.websiteMockup.hero.primaryButton}
                </button>
                <button
                  className="px-4 py-2 rounded text-sm border"
                  style={{
                    borderColor: data.websiteMockup.colors.primary,
                    color: data.websiteMockup.colors.primary,
                  }}
                >
                  {data.websiteMockup.hero.secondaryButton}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Suggested handles for {data.brandName}:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {data.socialHandles.map((handle) => (
                <div
                  key={handle.platform}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)]"
                >
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <SocialIcon platform={handle.platform} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-muted)] capitalize">
                      {handle.platform}
                    </p>
                    <p className="font-mono text-sm truncate">
                      {handle.handle}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Tip: Check availability on each platform before registering your domain
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
