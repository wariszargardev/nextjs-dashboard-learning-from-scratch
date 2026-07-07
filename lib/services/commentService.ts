// lib/services/commentService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Comment Service — the only place that queries the database for comments.
// A Comment always belongs to both a Post (postId) and a User (authorId).
// ─────────────────────────────────────────────────────────────────────────────

import prisma from "@/lib/db/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { CommentWithAuthor, CommentFilter } from "@/lib/models/comment";
import { PaginatedResult, PaginationInput, OrderInput } from "@/lib/types/common";

// Columns + author info we return for every comment.
const COMMENT_WITH_AUTHOR_SELECT = {
  id: true,
  content: true,
  postId: true,
  authorId: true,
  createdAt: true,
  author: { select: { id: true, name: true, email: true } },
} as const;

/**
 * Fetch a single comment by ID.
 * Returns null if not found – the controller decides whether that's a 404.
 */
export async function getCommentById(id: string): Promise<CommentWithAuthor | null> {
  return prisma.comment.findUnique({
    where: { id },
    select: COMMENT_WITH_AUTHOR_SELECT,
  });
}

type ListCommentsOptions = PaginationInput & OrderInput<"createdAt"> & CommentFilter;

/**
 * Returns a paginated list of comments, optionally filtered by post or author.
 * Defaults: page 1, 20 per page, newest first.
 */
export async function listComments({
  page = 1,
  perPage = 20,
  orderBy = "createdAt",
  orderDirection = "desc",
  postId,
  authorId,
}: ListCommentsOptions = {}): Promise<PaginatedResult<CommentWithAuthor>> {
  const where: Prisma.CommentWhereInput = {};

  if (postId) {
    where.postId = postId;
  }

  if (authorId) {
    where.authorId = authorId;
  }

  const skip = (page - 1) * perPage;

  const [total, data] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      select: COMMENT_WITH_AUTHOR_SELECT,
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
 * Create a new comment. Must belong to an existing post and user.
 */
export async function createComment(input: {
  content: string;
  postId: string;
  authorId: string;
}): Promise<CommentWithAuthor> {
  return prisma.comment.create({
    data: input,
    select: COMMENT_WITH_AUTHOR_SELECT,
  });
}

/**
 * Update an existing comment's content.
 * Returns null if the comment doesn't exist.
 */
export async function updateComment(
  id: string,
  input: Partial<Pick<CommentWithAuthor, "content">>
): Promise<CommentWithAuthor | null> {
  const exists = await prisma.comment.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return null;

  return prisma.comment.update({
    where: { id },
    data: input,
    select: COMMENT_WITH_AUTHOR_SELECT,
  });
}

/**
 * Delete a comment by ID.
 */
export async function deleteComment(id: string): Promise<void> {
  await prisma.comment.delete({ where: { id } });
}
