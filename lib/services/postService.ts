// lib/services/postService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Post Service — the only place that queries the database for posts.
// A Post always belongs to a User (authorId), so every post we return
// includes basic author info.
// ─────────────────────────────────────────────────────────────────────────────

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { PostWithAuthor, PostFilter } from "@/lib/models/post";
import { PaginatedResult, PaginationInput, OrderInput } from "@/lib/types/common";

// Columns + author info we return for every post.
const POST_WITH_AUTHOR_SELECT = {
  id: true,
  title: true,
  content: true,
  published: true,
  authorId: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true, email: true } },
} as const;

/**
 * Fetch a single post by ID.
 * Returns null if not found – the controller decides whether that's a 404.
 */
export async function getPostById(id: string): Promise<PostWithAuthor | null> {
  return prisma.post.findUnique({
    where: { id },
    select: POST_WITH_AUTHOR_SELECT,
  });
}

type ListPostsOptions = PaginationInput &
  OrderInput<"title" | "createdAt" | "updatedAt"> &
  PostFilter;

/**
 * Returns a paginated, filtered, sorted list of posts.
 * Defaults: page 1, 20 per page, newest first.
 */
export async function listPosts({
  page = 1,
  perPage = 20,
  orderBy = "createdAt",
  orderDirection = "desc",
  search,
  published,
  authorId,
}: ListPostsOptions = {}): Promise<PaginatedResult<PostWithAuthor>> {
  const where: Prisma.PostWhereInput = {};

  if (search) {
    // Case-insensitive search on title OR content.
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  if (published !== undefined) {
    where.published = published;
  }

  if (authorId) {
    where.authorId = authorId;
  }

  const skip = (page - 1) * perPage;

  const [total, data] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      select: POST_WITH_AUTHOR_SELECT,
      orderBy: { [orderBy]: orderDirection },
      skip,
      take: perPage,
    }),
  ]);

  return {
    data,
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
  };
}

/**
 * Create a new post. Must belong to an existing user (authorId).
 */
export async function createPost(input: {
  title: string;
  content: string;
  published?: boolean;
  authorId: string;
}): Promise<PostWithAuthor> {
  return prisma.post.create({
    data: input,
    select: POST_WITH_AUTHOR_SELECT,
  });
}

/**
 * Update an existing post.
 * Returns null if the post doesn't exist.
 */
export async function updatePost(
  id: string,
  input: Partial<Pick<PostWithAuthor, "title" | "content" | "published">>
): Promise<PostWithAuthor | null> {
  const exists = await prisma.post.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return null;

  return prisma.post.update({
    where: { id },
    data: input,
    select: POST_WITH_AUTHOR_SELECT,
  });
}

/**
 * Delete a post by ID.
 * Cascades to its comments via DB foreign keys.
 */
export async function deletePost(id: string): Promise<void> {
  await prisma.post.delete({ where: { id } });
}
