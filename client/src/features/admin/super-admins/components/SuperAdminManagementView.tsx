"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Ban,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSuperAdminsList } from "../../hooks/useAdmin";
import { SuperAdminGuard } from "../../components/SuperAdminGuard";
import { CreateSuperAdminModal } from "./CreateSuperAdminModal";
import { SuperAdminBlockDialog } from "./SuperAdminBlockDialog";
import type { AdminUserRecord } from "../../types/admin.types";

export function SuperAdminManagementView() {
  const { user: currentUser } = useAuth();
  const {
    data: superAdmins = [],
    isLoading,
    isFetching,
    refetch,
  } = useSuperAdminsList();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [targetSuperAdmin, setTargetSuperAdmin] =
    React.useState<AdminUserRecord | null>(null);
  const [blockMode, setBlockMode] = React.useState<"block" | "unblock" | null>(
    null,
  );

  const filteredSuperAdmins = React.useMemo(() => {
    let list = Array.isArray(superAdmins) ? superAdmins : [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (adm) =>
          (adm.name && adm.name.toLowerCase().includes(q)) ||
          adm.email.toLowerCase().includes(q) ||
          (adm.personalEmail && adm.personalEmail.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [superAdmins, searchQuery]);

  const formatDateSafe = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return isNaN(d.getTime()) ? "N/A" : format(d, "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <SuperAdminGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Super Administrator Governance
              </h1>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
                Root Authority
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Governance and lifecycle management of root-privileged Super Administrator accounts.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4" /> Provision Super Admin
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-xs">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search super administrators by name, organization email, or personal email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs sm:text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Super Administrator Accounts ({filteredSuperAdmins.length})
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                Active root governance: {superAdmins.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 sm:pt-0">
            {isLoading ? (
              <div className="space-y-3 p-4 sm:p-0">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredSuperAdmins.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  icon={ShieldCheck}
                  title="No super administrators found"
                  description={
                    searchQuery
                      ? `No super administrator accounts matched "${searchQuery}".`
                      : "No super administrator accounts found."
                  }
                />
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="p-3 font-semibold">Super Administrator</th>
                        <th className="p-3 font-semibold">Personal Email</th>
                        <th className="p-3 font-semibold">Account Status</th>
                        <th className="p-3 font-semibold">Security State</th>
                        <th className="p-3 font-semibold">Created</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSuperAdmins.map((adm) => {
                        const isSelf = currentUser?.id === adm.id;
                        const isBlocked = adm.status === "BLOCKED";
                        return (
                          <tr key={adm.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 font-semibold text-xs">
                                  {(adm.name || adm.email).slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-medium text-foreground truncate">
                                      {adm.name || "Super Administrator"}
                                    </p>
                                    {isSelf && (
                                      <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                                        Current Session (Protected)
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">{adm.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground text-xs font-mono">
                              {adm.personalEmail || "N/A"}
                            </td>
                            <td className="p-3">
                              <StatusBadge status={adm.status} />
                            </td>
                            <td className="p-3">
                              {adm.needPasswordChange ? (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                                  <KeyRound className="h-3 w-3" /> Initial Setup Required
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="h-3 w-3" /> Password Configured
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-muted-foreground">{formatDateSafe(adm.createdAt)}</td>
                            <td className="p-3 text-right">
                              {isSelf ? (
                                <span className="text-xs text-muted-foreground italic">
                                  Self-lockout disabled
                                </span>
                              ) : isBlocked ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  onClick={() => {
                                    setTargetSuperAdmin(adm);
                                    setBlockMode("unblock");
                                  }}
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Unblock
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                  onClick={() => {
                                    setTargetSuperAdmin(adm);
                                    setBlockMode("block");
                                  }}
                                >
                                  <Ban className="h-3.5 w-3.5 mr-1" /> Block
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View (< 640px) */}
                <div className="sm:hidden divide-y divide-border">
                  {filteredSuperAdmins.map((adm) => {
                    const isSelf = currentUser?.id === adm.id;
                    const isBlocked = adm.status === "BLOCKED";
                    return (
                      <div key={adm.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 font-semibold text-xs">
                              {(adm.name || adm.email).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {adm.name || "Super Administrator"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{adm.email}</p>
                            </div>
                          </div>
                          <StatusBadge status={adm.status} />
                        </div>

                        <div className="text-xs bg-muted/30 p-2.5 rounded-lg space-y-1">
                          <p className="text-muted-foreground">
                            Personal Email: <span className="font-mono text-foreground">{adm.personalEmail || "N/A"}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Created: <span className="text-foreground">{formatDateSafe(adm.createdAt)}</span>
                          </p>
                        </div>

                        {!isSelf && (
                          <div className="pt-1">
                            {isBlocked ? (
                              <Button
                                size="sm"
                                className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => {
                                  setTargetSuperAdmin(adm);
                                  setBlockMode("unblock");
                                }}
                              >
                                Unblock Super Admin
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full h-8 text-xs"
                                onClick={() => {
                                  setTargetSuperAdmin(adm);
                                  setBlockMode("block");
                                }}
                              >
                                Block Super Admin
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Create Modal */}
        <CreateSuperAdminModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => refetch()}
        />

        {/* Block Confirmation Dialog */}
        <SuperAdminBlockDialog
          superAdmin={targetSuperAdmin}
          mode={blockMode}
          open={Boolean(blockMode)}
          onClose={() => {
            setBlockMode(null);
            setTargetSuperAdmin(null);
          }}
          onSuccess={() => refetch()}
        />
      </div>
    </SuperAdminGuard>
  );
}

export default SuperAdminManagementView;
