import type { Role } from "@/types/user";

export function isSuperAdmin(
  user?: { role?: Role | string | null } | null,
): boolean {
  return user?.role === "SUPER_ADMIN";
}

export function isAdmin(
  user?: { role?: Role | string | null } | null,
): boolean {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}

export function canManageAdmins(
  user?: { role?: Role | string | null } | null,
): boolean {
  return user?.role === "SUPER_ADMIN";
}

export function canBlockUser(
  currentUser?: { id?: string; role?: Role | string | null } | null,
  targetUserId?: string,
): boolean {
  if (!currentUser || !targetUserId) return false;
  // Nobody can block their own account
  if (currentUser.id === targetUserId) return false;
  return currentUser.role === "SUPER_ADMIN";
}
