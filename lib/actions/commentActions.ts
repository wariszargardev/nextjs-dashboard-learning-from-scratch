// lib/actions/commentActions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server action backing both the inline "add comment" form on a post's detail
// page and the standalone "new comment" form. `returnTo` (a hidden field)
// tells it where to send the user back to if validation/creation fails.
// ─────────────────────────────────────────────────────────────────────────────

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as commentService from "@/lib/services/commentService";
import { logger } from "@/lib/logger";

export async function createCommentAction(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const postId = String(formData.get("postId") ?? "").trim();
  const authorId = String(formData.get("authorId") ?? "").trim();
  const returnTo = String(formData.get("returnTo") ?? "/dashboard/comments/new");

  if (!content) {
    redirect(`${returnTo}?error=${encodeURIComponent("Content is required")}`);
  }
  if (!postId) {
    redirect(`${returnTo}?error=${encodeURIComponent("Post is required")}`);
  }
  if (!authorId) {
    redirect(`${returnTo}?error=${encodeURIComponent("Author is required")}`);
  }

  try {
    const comment = await commentService.createComment({ content, postId, authorId });
    logger.info("action:createComment", "Comment created", { id: comment.id, postId, authorId });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2003") {
      logger.warn("action:createComment", "Rejected unknown postId/authorId", { postId, authorId });
      redirect(`${returnTo}?error=${encodeURIComponent("Selected post or author does not exist")}`);
    }
    logger.error("action:createComment", "Failed to create comment", error);
    redirect(`${returnTo}?error=${encodeURIComponent("Something went wrong")}`);
  }

  revalidatePath("/dashboard/comments");
  revalidatePath(`/dashboard/posts/${postId}`);
  redirect(`/dashboard/posts/${postId}`);
}
