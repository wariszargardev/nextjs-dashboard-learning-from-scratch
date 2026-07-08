// lib/actions/postActions.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server action backing the dashboard's "new post" form.
// ─────────────────────────────────────────────────────────────────────────────

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import * as postService from "@/lib/services/postService";
import { logger } from "@/lib/logger";

export async function createPostAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorId = String(formData.get("authorId") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) {
    redirect(`/dashboard/posts/new?error=${encodeURIComponent("Title is required")}`);
  }
  if (!content) {
    redirect(`/dashboard/posts/new?error=${encodeURIComponent("Content is required")}`);
  }
  if (!authorId) {
    redirect(`/dashboard/posts/new?error=${encodeURIComponent("Author is required")}`);
  }

  let postId: string;
  try {
    const post = await postService.createPost({ title, content, published, authorId });
    logger.info("action:createPost", "Post created", { id: post.id, authorId });
    postId = post.id;
  } catch (error) {
    if ((error as { code?: string })?.code === "P2003") {
      logger.warn("action:createPost", "Rejected unknown authorId", { authorId });
      redirect(`/dashboard/posts/new?error=${encodeURIComponent("Selected author does not exist")}`);
    }
    logger.error("action:createPost", "Failed to create post", error);
    redirect(`/dashboard/posts/new?error=${encodeURIComponent("Something went wrong")}`);
  }

  revalidatePath("/dashboard/posts");
  redirect(`/dashboard/posts/${postId}`);
}
