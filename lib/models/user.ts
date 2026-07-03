// lib/models/user.ts
// ─────────────────────────────────────────────────────────────────────────────
// Domain-level types for the User entity.
// These sit on top of Prisma's auto-generated types and give us:
//   - a safe public shape to return from APIs (no raw DB types leaking out)
//   - filter types for list queries
// ─────────────────────────────────────────────────────────────────────────────

import { Role } from "@/app/generated/prisma/client";

/** Re-export Prisma's Role enum so app code only imports from lib/models. */
export type UserRole = Role; // 'USER' | 'ADMIN'

/**
 * The shape returned from every user query.
 * Deliberately omits internal or sensitive fields (e.g. password hash in future).
 */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

/**
 * Used in list views – includes an aggregated postsCount.
 */
export interface UserListItem extends PublicUser {
  postsCount: number;
}

/**
 * Filter shape accepted by userRepository.list() and userService.listUsers().
 *
 * search – case-insensitive match on name OR email
 * role   – exact match on role enum value
 */
export interface UserFilter {
  search?: string;
  role?: UserRole;
}