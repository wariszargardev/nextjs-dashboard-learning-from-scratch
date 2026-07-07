// lib/models/post.ts
// ─────────────────────────────────────────────────────────────────────────────
// Domain-level types for the Post entity. A Post always belongs to a User
// (the author) via authorId.
// ─────────────────────────────────────────────────────────────────────────────

export interface PublicPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Used when we also want the author's basic info alongside the post. */
export interface PostWithAuthor extends PublicPost {
    author: {
        id: string;
        name: string;
        email: string;
    }
}

/**
 * Filter shape accepted by postService.listPosts().
 *
 * search    – case-insensitive match on title OR content
 * published – exact match on published flag
 * authorId  – only posts written by this user
 */
export interface PostFilter {
    search?: string;
    published?: boolean;
    authorId?: string;
}
