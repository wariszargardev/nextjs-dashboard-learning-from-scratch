// lib/models/comment.ts
// ─────────────────────────────────────────────────────────────────────────────
// Domain-level types for the Comment entity.
// ─────────────────────────────────────────────────────────────────────────────
 
/**
 * Safe public shape for a comment.
 */
export interface PublicComment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  createdAt: Date;
}

export interface CommentWithAuthor extends PublicComment {
    author: {
        id: string;
        name: string;
        email: string;
    }
}
 
/**
 * Filter shape for commentRepository.list().
 *
 * postId   – return comments for a specific post
 * authorId – return comments by a specific user
 */
export interface CommentFilter {
  postId?: string;
  authorId?: string;
}