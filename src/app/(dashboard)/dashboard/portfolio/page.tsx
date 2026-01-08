"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderHeart,
  Plus,
  ExternalLink,
  AlertTriangle,
  Calendar,
  RefreshCw,
  Edit2,
  Trash2,
  MoreVertical,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Sparkles,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface OwnedDomain {
  id: string;
  domain: string;
  registrar: string;
  registeredAt: string;
  expiresAt: string;
  autoRenew: boolean;
  estimatedValue: number;
  notes?: string;
  status: "active" | "expiring" | "expired";
}

// Mock data
const mockOwnedDomains: OwnedDomain[] = [
  {
    id: "1",
    domain: "myawesomeproject.com",
    registrar: "GoDaddy",
    registeredAt: "2023-01-15",
    expiresAt: "2025-01-15",
    autoRenew: true,
    estimatedValue: 500,
    status: "active",
  },
  {
    id: "2",
    domain: "sideproject.io",
    registrar: "Namecheap",
    registeredAt: "2023-06-20",
    expiresAt: "2024-01-25",
    autoRenew: false,
    estimatedValue: 750,
    notes: "Consider selling",
    status: "expiring",
  },
  {
    id: "3",
    domain: "coolstartup.co",
    registrar: "Cloudflare",
    registeredAt: "2022-03-10",
    expiresAt: "2024-03-10",
    autoRenew: true,
    estimatedValue: 1200,
    status: "active",
  },
  {
    id: "4",
    domain: "brandname.app",
    registrar: "Google Domains",
    registeredAt: "2023-09-01",
    expiresAt: "2024-09-01",
    autoRenew: true,
    estimatedValue: 900,
    status: "active",
  },
];

// Mock user plan
const userPlan = "free" as "free" | "pro";

export default function PortfolioPage() {
  const [domains, setDomains] = React.useState<OwnedDomain[]>(mockOwnedDomains);
  const [isAddingDomain, setIsAddingDomain] = React.useState(false);
  const [newDomain, setNewDomain] = React.useState({
    domain: "",
    registrar: "",
    expiresAt: "",
  });
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);

  // If not Pro, show upgrade prompt
  if (userPlan !== "pro") {
    return (
      <div className="p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Portfolio Management
            </h1>
            <Badge variant="pro" className="mb-4">
              PRO Feature
            </Badge>
            <p className="text-[var(--text-secondary)] mb-6">
              Track all your owned domains in one place. Get expiration alerts,
              estimated valuations, and manage your entire domain portfolio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
              {[
                {
                  icon: FolderHeart,
                  title: "Track 500+ Domains",
                  desc: "Manage your entire portfolio",
                },
                {
                  icon: AlertTriangle,
                  title: "Expiration Alerts",
                  desc: "Never miss a renewal",
                },
                {
                  icon: DollarSign,
                  title: "Domain Valuations",
                  desc: "Know what your domains are worth",
                },
                {
                  icon: Shield,
                  title: "Auto-Renew Tracking",
                  desc: "Monitor renewal status",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 p-3 bg-[var(--muted)] rounded-lg"
                >
                  <feature.icon className="h-5 w-5 text-[var(--primary)] mt-0.5" />
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm">
                      {feature.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/upgrade">
              <Button size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Pro - $12/month
              </Button>
            </Link>
            <p className="text-xs text-[var(--text-muted)] mt-3">
              7-day free trial • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalValue = domains.reduce((sum, d) => sum + d.estimatedValue, 0);
  const expiringCount = domains.filter((d) => d.status === "expiring").length;
  const autoRenewCount = domains.filter((d) => d.autoRenew).length;

  // Days until expiration
  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  // Add domain
  const handleAddDomain = () => {
    if (!newDomain.domain || !newDomain.registrar || !newDomain.expiresAt) return;

    const domain: OwnedDomain = {
      id: `domain-${Date.now()}`,
      domain: newDomain.domain,
      registrar: newDomain.registrar,
      registeredAt: new Date().toISOString().split("T")[0],
      expiresAt: newDomain.expiresAt,
      autoRenew: false,
      estimatedValue: 100,
      status: getDaysUntilExpiry(newDomain.expiresAt) <= 30 ? "expiring" : "active",
    };

    setDomains([...domains, domain]);
    setNewDomain({ domain: "", registrar: "", expiresAt: "" });
    setIsAddingDomain(false);
  };

  // Delete domain
  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter((d) => d.id !== id));
    setSelectedDomain(null);
  };

  // Toggle auto-renew
  const toggleAutoRenew = (id: string) => {
    setDomains(
      domains.map((d) => (d.id === id ? { ...d, autoRenew: !d.autoRenew } : d))
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Domain Portfolio
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Track and manage your owned domains
          </p>
        </div>
        <Button onClick={() => setIsAddingDomain(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Domain
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <FolderHeart className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {domains.length}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Total Domains</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  ${totalValue.toLocaleString()}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Est. Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {expiringCount}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {autoRenewCount}
                </p>
                <p className="text-sm text-[var(--text-muted)]">Auto-Renew On</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Domain Form */}
      {isAddingDomain && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="domain.com"
                value={newDomain.domain}
                onChange={(e) =>
                  setNewDomain({ ...newDomain, domain: e.target.value })
                }
              />
              <select
                className="border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm"
                value={newDomain.registrar}
                onChange={(e) =>
                  setNewDomain({ ...newDomain, registrar: e.target.value })
                }
              >
                <option value="">Select Registrar</option>
                <option value="GoDaddy">GoDaddy</option>
                <option value="Namecheap">Namecheap</option>
                <option value="Cloudflare">Cloudflare</option>
                <option value="Google Domains">Google Domains</option>
                <option value="Porkbun">Porkbun</option>
                <option value="Other">Other</option>
              </select>
              <Input
                type="date"
                placeholder="Expires"
                value={newDomain.expiresAt}
                onChange={(e) =>
                  setNewDomain({ ...newDomain, expiresAt: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button onClick={handleAddDomain} className="flex-1">
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingDomain(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Soon Alert */}
      {expiringCount > 0 && (
        <Card className="border-[var(--warning)] border-opacity-50 bg-[var(--warning-light)] bg-opacity-30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  {expiringCount} domain{expiringCount > 1 ? "s" : ""} expiring
                  within 30 days
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Review and enable auto-renew to avoid losing your domains
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain List */}
      <Card>
        <CardContent className="p-0">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)] text-sm font-medium text-[var(--text-secondary)]">
            <span className="col-span-4">Domain</span>
            <span className="col-span-2">Registrar</span>
            <span className="col-span-2">Expires</span>
            <span className="col-span-2">Value</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {/* Domain rows */}
          {domains.length === 0 ? (
            <div className="p-8 text-center">
              <FolderHeart className="h-12 w-12 mx-auto text-[var(--text-muted)] opacity-50" />
              <p className="mt-4 text-[var(--text-secondary)]">
                No domains in your portfolio
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Add your first domain to start tracking
              </p>
              <Button className="mt-4" onClick={() => setIsAddingDomain(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Domain
              </Button>
            </div>
          ) : (
            domains.map((domain) => {
              const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt);
              return (
                <div
                  key={domain.id}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-4 py-4 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)] transition-colors items-center",
                    domain.status === "expiring" && "bg-orange-50"
                  )}
                >
                  {/* Domain */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-[var(--text-primary)]">
                        {domain.domain}
                      </span>
                      {domain.status === "expiring" && (
                        <Badge variant="warning">Expiring</Badge>
                      )}
                    </div>
                    {domain.notes && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {domain.notes}
                      </p>
                    )}
                  </div>

                  {/* Registrar */}
                  <div className="col-span-2">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {domain.registrar}
                    </span>
                  </div>

                  {/* Expires */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[var(--text-muted)]" />
                      <div>
                        <span
                          className={cn(
                            "text-sm",
                            daysUntilExpiry <= 30
                              ? "text-[var(--warning)] font-medium"
                              : "text-[var(--text-secondary)]"
                          )}
                        >
                          {daysUntilExpiry}d
                        </span>
                        <p className="text-xs text-[var(--text-muted)]">
                          {new Date(domain.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-[var(--success)]">
                      ${domain.estimatedValue.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleAutoRenew(domain.id)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs",
                        domain.autoRenew
                          ? "bg-green-100 text-green-700"
                          : "bg-[var(--muted)] text-[var(--text-muted)]"
                      )}
                    >
                      <RefreshCw className="h-3 w-3" />
                      {domain.autoRenew ? "Auto" : "Manual"}
                    </button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[var(--error)]"
                      onClick={() => handleDeleteDomain(domain.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Import notice */}
      <div className="text-center p-4 bg-[var(--muted)] rounded-lg">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium">Tip:</span> Import domains from CSV or
          connect your registrar for automatic syncing
        </p>
        <div className="flex justify-center gap-2 mt-3">
          <Button variant="outline" size="sm">
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            Connect Registrar
          </Button>
        </div>
      </div>
    </div>
  );
}
