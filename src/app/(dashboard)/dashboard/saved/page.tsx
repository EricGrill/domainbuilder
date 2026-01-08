"use client";

import * as React from "react";
import {
  Heart,
  Folder,
  FolderPlus,
  MoreVertical,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  Download,
  Filter,
  SortAsc,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface SavedDomain {
  id: string;
  domain: string;
  tld: string;
  folderId: string | null;
  score: number;
  savedAt: string;
  notes?: string;
  tags?: string[];
}

interface DomainFolder {
  id: string;
  name: string;
  color: string;
  count: number;
}

// Mock data
const mockFolders: DomainFolder[] = [
  { id: "all", name: "All Saved", color: "#6B7280", count: 12 },
  { id: "favorites", name: "Favorites", color: "#EF4444", count: 4 },
  { id: "startup-ideas", name: "Startup Ideas", color: "#0D9488", count: 5 },
  { id: "side-projects", name: "Side Projects", color: "#F97316", count: 3 },
];

const mockDomains: SavedDomain[] = [
  {
    id: "1",
    domain: "swiftcloud",
    tld: "io",
    folderId: "favorites",
    score: 92,
    savedAt: "2024-01-15",
    tags: ["tech", "saas"],
  },
  {
    id: "2",
    domain: "brandspark",
    tld: "co",
    folderId: "startup-ideas",
    score: 88,
    savedAt: "2024-01-14",
    tags: ["branding"],
  },
  {
    id: "3",
    domain: "techhub",
    tld: "app",
    folderId: "startup-ideas",
    score: 85,
    savedAt: "2024-01-13",
    tags: ["tech"],
  },
  {
    id: "4",
    domain: "cloudforge",
    tld: "io",
    folderId: "favorites",
    score: 82,
    savedAt: "2024-01-12",
    tags: ["tech", "cloud"],
  },
  {
    id: "5",
    domain: "launchpad",
    tld: "dev",
    folderId: "side-projects",
    score: 79,
    savedAt: "2024-01-11",
    tags: ["startup"],
  },
  {
    id: "6",
    domain: "nextstep",
    tld: "io",
    folderId: "startup-ideas",
    score: 77,
    savedAt: "2024-01-10",
  },
  {
    id: "7",
    domain: "sparkify",
    tld: "com",
    folderId: "favorites",
    score: 90,
    savedAt: "2024-01-09",
    tags: ["branding", "fun"],
  },
  {
    id: "8",
    domain: "buildfast",
    tld: "co",
    folderId: "side-projects",
    score: 75,
    savedAt: "2024-01-08",
  },
];

const folderColors = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#10B981",
  "#0D9488",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function SavedDomainsPage() {
  const [folders, setFolders] = React.useState<DomainFolder[]>(mockFolders);
  const [domains, setDomains] = React.useState<SavedDomain[]>(mockDomains);
  const [selectedFolder, setSelectedFolder] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "score" | "name">("date");
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const [editingFolder, setEditingFolder] = React.useState<string | null>(null);
  const [editFolderName, setEditFolderName] = React.useState("");
  const [selectedDomains, setSelectedDomains] = React.useState<string[]>([]);
  const [showFolderMenu, setShowFolderMenu] = React.useState<string | null>(
    null
  );

  // Filter domains based on folder and search
  const filteredDomains = React.useMemo(() => {
    let filtered = domains;

    // Filter by folder
    if (selectedFolder !== "all") {
      filtered = filtered.filter((d) => d.folderId === selectedFolder);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.domain.toLowerCase().includes(query) ||
          d.tld.toLowerCase().includes(query) ||
          d.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      } else if (sortBy === "score") {
        return b.score - a.score;
      } else {
        return a.domain.localeCompare(b.domain);
      }
    });

    return filtered;
  }, [domains, selectedFolder, searchQuery, sortBy]);

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: DomainFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      color: folderColors[folders.length % folderColors.length],
      count: 0,
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  // Rename folder
  const handleRenameFolder = (folderId: string) => {
    if (!editFolderName.trim()) return;

    setFolders(
      folders.map((f) =>
        f.id === folderId ? { ...f, name: editFolderName.trim() } : f
      )
    );
    setEditingFolder(null);
    setEditFolderName("");
  };

  // Delete folder
  const handleDeleteFolder = (folderId: string) => {
    if (folderId === "all") return;

    // Move domains from deleted folder to uncategorized
    setDomains(
      domains.map((d) => (d.folderId === folderId ? { ...d, folderId: null } : d))
    );
    setFolders(folders.filter((f) => f.id !== folderId));

    if (selectedFolder === folderId) {
      setSelectedFolder("all");
    }
  };

  // Remove domain
  const handleRemoveDomain = (domainId: string) => {
    setDomains(domains.filter((d) => d.id !== domainId));
    setSelectedDomains(selectedDomains.filter((id) => id !== domainId));
  };

  // Move domains to folder
  const handleMoveDomains = (targetFolderId: string) => {
    setDomains(
      domains.map((d) =>
        selectedDomains.includes(d.id)
          ? { ...d, folderId: targetFolderId === "all" ? null : targetFolderId }
          : d
      )
    );
    setSelectedDomains([]);
  };

  // Toggle domain selection
  const toggleDomainSelection = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId]
    );
  };

  // Select all visible domains
  const selectAllDomains = () => {
    if (selectedDomains.length === filteredDomains.length) {
      setSelectedDomains([]);
    } else {
      setSelectedDomains(filteredDomains.map((d) => d.id));
    }
  };

  // Get folder count
  const getFolderCount = (folderId: string) => {
    if (folderId === "all") return domains.length;
    return domains.filter((d) => d.folderId === folderId).length;
  };

  // Open registrar
  const handleRegister = (domain: string, tld: string) => {
    window.open(
      `https://www.namecheap.com/domains/registration/results/?domain=${domain}.${tld}`,
      "_blank"
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Saved Domains
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {domains.length} domains saved across {folders.length - 1} folders
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" />
            Export CSV
            <Badge variant="pro" className="ml-2">
              PRO
            </Badge>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Folders</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsCreatingFolder(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {/* Create folder input */}
              {isCreatingFolder && (
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") setIsCreatingFolder(false);
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCreateFolder}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsCreatingFolder(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Folder list */}
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group",
                    selectedFolder === folder.id
                      ? "bg-[var(--primary)] text-white"
                      : "hover:bg-[var(--muted)]"
                  )}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  {editingFolder === folder.id ? (
                    <div
                      className="flex items-center gap-2 flex-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameFolder(folder.id);
                          if (e.key === "Escape") setEditingFolder(null);
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleRenameFolder(folder.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="text-sm font-medium truncate">
                          {folder.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={cn(
                            "text-xs",
                            selectedFolder === folder.id
                              ? "text-white/70"
                              : "text-[var(--text-muted)]"
                          )}
                        >
                          {getFolderCount(folder.id)}
                        </span>
                        {folder.id !== "all" && (
                          <div className="relative">
                            <button
                              className={cn(
                                "p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                                selectedFolder === folder.id
                                  ? "hover:bg-white/20"
                                  : "hover:bg-[var(--border)]"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFolderMenu(
                                  showFolderMenu === folder.id
                                    ? null
                                    : folder.id
                                );
                              }}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </button>
                            {showFolderMenu === folder.id && (
                              <div className="absolute right-0 top-6 z-10 bg-white rounded-lg shadow-lg border border-[var(--border)] py-1 min-w-[120px]">
                                <button
                                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--muted)] flex items-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFolder(folder.id);
                                    setEditFolderName(folder.name);
                                    setShowFolderMenu(null);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                  Rename
                                </button>
                                <button
                                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--muted)] flex items-center gap-2 text-[var(--error)]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFolder(folder.id);
                                    setShowFolderMenu(null);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved domains..."
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortBy(
                    sortBy === "date"
                      ? "score"
                      : sortBy === "score"
                      ? "name"
                      : "date"
                  )
                }
              >
                <SortAsc className="h-4 w-4 mr-1.5" />
                {sortBy === "date"
                  ? "Date"
                  : sortBy === "score"
                  ? "Score"
                  : "Name"}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedDomains.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-[var(--primary-light)] bg-opacity-30 rounded-lg">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {selectedDomains.length} selected
              </span>
              <div className="flex items-center gap-2">
                <select
                  className="text-sm border border-[var(--border)] rounded-md px-2 py-1 bg-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleMoveDomains(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Move to folder...
                  </option>
                  {folders
                    .filter((f) => f.id !== "all")
                    .map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                </select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--error)]"
                  onClick={() => {
                    selectedDomains.forEach((id) => handleRemoveDomain(id));
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
              <button
                className="ml-auto text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => setSelectedDomains([])}
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Domain List */}
          <Card>
            <CardContent className="p-0">
              {/* Table header */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)] text-sm font-medium text-[var(--text-secondary)]">
                <input
                  type="checkbox"
                  checked={
                    selectedDomains.length === filteredDomains.length &&
                    filteredDomains.length > 0
                  }
                  onChange={selectAllDomains}
                  className="rounded border-[var(--border)]"
                />
                <span className="flex-1">Domain</span>
                <span className="w-20 text-center">Score</span>
                <span className="w-24 hidden sm:block">Folder</span>
                <span className="w-24 hidden md:block">Saved</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {/* Domain rows */}
              {filteredDomains.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto text-[var(--text-muted)] opacity-50" />
                  <p className="mt-4 text-[var(--text-secondary)]">
                    No saved domains found
                  </p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Search for domains and save your favorites
                  </p>
                </div>
              ) : (
                filteredDomains.map((domain) => {
                  const folder = folders.find((f) => f.id === domain.folderId);
                  return (
                    <div
                      key={domain.id}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--muted)] transition-colors",
                        selectedDomains.includes(domain.id) &&
                          "bg-[var(--primary-light)] bg-opacity-20"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(domain.id)}
                        onChange={() => toggleDomainSelection(domain.id)}
                        className="rounded border-[var(--border)]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-[var(--text-primary)]">
                            {domain.domain}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            .{domain.tld}
                          </Badge>
                        </div>
                        {domain.tags && domain.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {domain.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--text-muted)]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-20 text-center">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            domain.score >= 85
                              ? "text-[var(--success)]"
                              : domain.score >= 70
                              ? "text-[var(--warning)]"
                              : "text-[var(--text-muted)]"
                          )}
                        >
                          {domain.score}
                        </span>
                      </div>
                      <div className="w-24 hidden sm:block">
                        {folder ? (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: folder.color }}
                            />
                            <span className="text-xs text-[var(--text-secondary)] truncate">
                              {folder.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--text-muted)]">
                            —
                          </span>
                        )}
                      </div>
                      <div className="w-24 hidden md:block">
                        <span className="text-xs text-[var(--text-muted)]">
                          {new Date(domain.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-24 flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleRegister(domain.domain, domain.tld)
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-[var(--error)]"
                          onClick={() => handleRemoveDomain(domain.id)}
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

          {/* Pro Limit Notice */}
          <div className="text-center p-4 bg-[var(--muted)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium">Free Plan:</span> 20 saved domains,
              3 folders
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Upgrade to Pro for 500 domains, unlimited folders, and CSV export
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
