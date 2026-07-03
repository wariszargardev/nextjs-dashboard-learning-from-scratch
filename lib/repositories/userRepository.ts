import prisma from "@/lib/db/prisma";
import { PublicUser, UserListItem, UserFilter } from "@/lib/models/user";
import {
  PaginatedResult,
  PaginationInput,
  OrderInput,
} from "@/lib/types/common";
// The Prisma select object we reuse for every "public user" query.
// Keeps the returned shape consistent and avoids selecting extra columns.
const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;
 
export async function findById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { id },
        select: PUBLIC_USER_SELECT
    })
};

export async function findByEmail( email: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { email },
        select: PUBLIC_USER_SELECT
    })
}

// ── List (with filter, pagination, ordering) ──────────────────────────────────
 
type ListOptions = PaginationInput &
  OrderInput<"name" | "email" | "createdAt"> & {
    filter?: UserFilter;
  };
 
export async function list({
  page = 1,
  perPage = 20,
  orderBy = "createdAt",
  orderDirection = "desc",
  filter = {},
}: ListOptions): Promise<PaginatedResult<UserListItem>> {
  // Build the `where` clause dynamically from the filter object.
  const where: Parameters<typeof prisma.user.findMany>[0]["where"] = {};
 
  if (filter.search) {
    // Case-insensitive search on name OR email using Prisma's `mode: 'insensitive'`
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { email: { contains: filter.search, mode: "insensitive" } },
    ];
  }
 
  if (filter.role) {
    where.role = filter.role;
  }
 
  const skip = (page - 1) * perPage;
 
  // Run count and data queries in parallel for efficiency.
  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        ...PUBLIC_USER_SELECT,
        // _count gives us aggregated relation counts without loading relations.
        _count: { select: { posts: true } },
      },
      orderBy: { [orderBy]: orderDirection },
      skip,
      take: perPage,
    }),
  ]);
 
  // Map _count.posts into postsCount to match UserListItem shape.
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
 

export async function create(input: {
  name: string;
  email: string;
  role?: PublicUser["role"];
}): Promise<PublicUser> {
  return prisma.user.create({
    data: input,
    select: PUBLIC_USER_SELECT,
  });
}
 
export async function update(
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
 
export async function deleteUser(id: string): Promise<void> {
  await prisma.user.delete({ where: { id } });
}