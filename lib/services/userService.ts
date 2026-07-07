// lib/services/userService.ts
// ─────────────────────────────────────────────────────────────────────────────
// User Service — this is the ONLY place that talks to the database for users.
// It owns both the Prisma queries AND the business rules around them.
//
// Flow: app/api/users/**/route.ts (controller) → userService (this file) → prisma
//
// Every route handler imports functions from here instead of calling
// `prisma.user...` directly, so all user data-access logic stays in one place.
// ─────────────────────────────────────────────────────────────────────────────

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { PublicUser, UserListItem, UserFilter, UserRole } from "@/lib/models/user";
import { PaginatedResult, PaginationInput, OrderInput } from "@/lib/types/common";

// Columns we're allowed to return for a user. Selecting explicitly (instead of
// returning the raw Prisma row) keeps internal/sensitive columns from ever
// leaking out of the API, even if new columns get added to the table later.
const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

/**
 * Fetch a single user by ID.
 * Returns null if not found – the route decides whether that's a 404.
 */
export async function getUserById(id: string): Promise<PublicUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });
}

/**
 * Fetch a single user by email.
 * Returns null if not found – the route decides whether that's a 404.
 */
export async function getUserByEmail(email: string): Promise<PublicUser | null> {
  return prisma.user.findUnique({
    where: { email },
    select: PUBLIC_USER_SELECT,
  });
}

type ListUsersOptions = PaginationInput &
  OrderInput<"name" | "email" | "createdAt"> &
  UserFilter;

/**
 * Returns a paginated, filtered, sorted list of users.
 * Defaults: page 1, 20 per page, newest first.
 */
export async function listUsers({
  page = 1,
  perPage = 20,
  orderBy = "createdAt",
  orderDirection = "desc",
  search,
  role,
}: ListUsersOptions = {}): Promise<PaginatedResult<UserListItem>> {
  // Build the `where` clause dynamically from the filters that were passed in.
  const where: Prisma.UserWhereInput = {};

  if (search) {
    // Case-insensitive search on name OR email.
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const skip = (page - 1) * perPage;

  // Run the count and the page of data at the same time instead of one after another.
  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        ...PUBLIC_USER_SELECT,
        // _count gives us the number of related posts without loading them all.
        _count: { select: { posts: true } },
      },
      orderBy: { [orderBy]: orderDirection },
      skip,
      take: perPage,
    }),
  ]);

  // Flatten `_count.posts` into a plain `postsCount` field.
  const data: UserListItem[] = rows.map(({ _count, ...user }) => ({
    ...user,
    postsCount: _count.posts,
  }));

  return {
    data,
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}

/**
 * Create a new user.
 */
export async function createUser(input: {
  name: string;
  email: string;
  role?: UserRole;
}): Promise<PublicUser> {
  return prisma.user.create({
    data: input,
    select: PUBLIC_USER_SELECT,
  });
}

/**
 * Update an existing user.
 * Returns null if the user doesn't exist.
 */
export async function updateUser(
  id: string,
  input: Partial<Pick<PublicUser, "name" | "email" | "role">>
): Promise<PublicUser | null> {
  // Check existence first so we can return null instead of throwing.
  const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return null;

  return prisma.user.update({
    where: { id },
    data: input,
    select: PUBLIC_USER_SELECT,
  });
}

/**
 * Delete a user by ID.
 * Cascades to posts and comments via DB foreign keys.
 */
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}
