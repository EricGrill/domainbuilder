"use client";

import * as React from "react";
import {
  User,
  Mail,
  Bell,
  Shield,
  Globe,
  Palette,
  CreditCard,
  LogOut,
  Save,
  Check,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser: {
  name: string;
  email: string;
  plan: "free" | "pro";
  avatar: string | null;
  createdAt: string;
} = {
  name: "Demo User",
  email: "demo@brandspark.io",
  plan: "free",
  avatar: null,
  createdAt: "2024-01-01",
};

type Theme = "light" | "dark" | "system";
type NotificationPrefs = {
  emailDigest: boolean;
  expirationAlerts: boolean;
  productUpdates: boolean;
  tips: boolean;
};

export default function SettingsPage() {
  const [user, setUser] = React.useState(mockUser);
  const [theme, setTheme] = React.useState<Theme>("light");
  const [defaultTlds, setDefaultTlds] = React.useState(["com", "io", "co"]);
  const [notifications, setNotifications] = React.useState<NotificationPrefs>({
    emailDigest: true,
    expirationAlerts: true,
    productUpdates: false,
    tips: true,
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Available TLDs
  const availableTlds = [
    "com",
    "io",
    "co",
    "net",
    "org",
    "app",
    "dev",
    "ai",
    "tech",
    "xyz",
  ];

  // Handle profile update
  const handleUpdateProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Toggle TLD
  const toggleTld = (tld: string) => {
    if (defaultTlds.includes(tld)) {
      if (defaultTlds.length > 1) {
        setDefaultTlds(defaultTlds.filter((t) => t !== tld));
      }
    } else {
      setDefaultTlds([...defaultTlds, tld]);
    }
  };

  // Toggle notification
  const toggleNotification = (key: keyof NotificationPrefs) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
              <span className="text-2xl font-semibold text-[var(--primary-dark)]">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Full Name
            </label>
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Email Address
            </label>
            <Input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="your@email.com"
              type="email"
            />
          </div>

          {/* Plan */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Current Plan
            </label>
            <div className="flex items-center gap-3">
              <Badge variant={user.plan === "pro" ? "pro" : "secondary"}>
                {user.plan === "pro" ? "Pro Plan" : "Free Plan"}
              </Badge>
              {user.plan === "free" && (
                <Button variant="outline" size="sm">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Search Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default TLDs */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Default TLDs
            </label>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Select which TLDs to check by default when searching
            </p>
            <div className="flex flex-wrap gap-2">
              {availableTlds.map((tld) => (
                <button
                  key={tld}
                  onClick={() => toggleTld(tld)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    defaultTlds.includes(tld)
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
                  )}
                >
                  .{tld}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Default Results Count
            </label>
            <select className="w-full border border-[var(--border)] rounded-lg px-3 py-2 bg-white text-sm">
              <option value="12">12 results</option>
              <option value="24">24 results</option>
              <option value="48">48 results</option>
              <option value="96">96 results (Pro)</option>
            </select>
          </div>

          {/* Auto-save searches */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Auto-save search history
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Automatically save your searches for easy repeat
              </p>
            </div>
            <button
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                true ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              )}
            >
              <span
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                  true ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              {[
                { value: "light" as Theme, icon: Sun, label: "Light" },
                { value: "dark" as Theme, icon: Moon, label: "Dark" },
                { value: "system" as Theme, icon: Monitor, label: "System" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                    theme === value
                      ? "border-[var(--primary)] bg-[var(--primary-light)] bg-opacity-30"
                      : "border-[var(--border)] hover:border-[var(--text-muted)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              key: "emailDigest" as const,
              title: "Weekly Email Digest",
              description: "Get a summary of your saved domains and new suggestions",
            },
            {
              key: "expirationAlerts" as const,
              title: "Expiration Alerts",
              description: "Be notified when your owned domains are expiring",
              pro: true,
            },
            {
              key: "productUpdates" as const,
              title: "Product Updates",
              description: "Learn about new features and improvements",
            },
            {
              key: "tips" as const,
              title: "Domain Tips & Insights",
              description: "Receive tips for finding great domain names",
            },
          ].map(({ key, title, description, pro }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
                  {title}
                  {pro && <Badge variant="pro">PRO</Badge>}
                </p>
                <p className="text-xs text-[var(--text-muted)]">{description}</p>
              </div>
              <button
                onClick={() => toggleNotification(key)}
                disabled={pro && user.plan !== "pro"}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  notifications[key] ? "bg-[var(--primary)]" : "bg-[var(--border)]",
                  pro && user.plan !== "pro" && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                    notifications[key] ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              Change Password
            </label>
            <div className="flex gap-2">
              <Input type="password" placeholder="Current password" />
              <Input type="password" placeholder="New password" />
              <Button variant="outline">Update</Button>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)]">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">
              Active Sessions
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Chrome on Windows
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Current session • Last active now
                  </p>
                </div>
                <Badge variant="available">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.plan === "free" ? (
            <div className="text-center py-6">
              <p className="text-[var(--text-secondary)]">
                You're on the Free plan
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Upgrade to Pro for unlimited searches and advanced features
              </p>
              <Button className="mt-4">
                Upgrade to Pro - $12/month
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Pro Plan
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    $12/month • Renews Jan 15, 2024
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Subscription
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[var(--error)] border-opacity-50">
        <CardHeader>
          <CardTitle className="text-lg text-[var(--error)]">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Delete Account
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="outline" size="sm" className="text-[var(--error)] border-[var(--error)]">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <p className="text-sm text-[var(--text-muted)]">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm text-[var(--success)] flex items-center gap-1">
              <Check className="h-4 w-4" />
              Settings saved
            </span>
          )}
          <Button onClick={handleUpdateProfile} disabled={isSaving}>
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
