// lib/controllers/commentController.ts
// ─────────────────────────────────────────────────────────────────────────────
// Comment Controller — reads the HTTP request, validates input, calls
// commentService, and shapes the JSON response for every /api/comments route.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import * as commentService from "@/lib/services/commentService";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/comments?postId=...&authorId=... ────────────────────────────────
export async function getComments(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 20);
    const postId = searchParams.get("postId") ?? undefined;
    const authorId = searchParams.get("authorId") ?? undefined;

    const result = await commentService.listComments({ page, perPage, postId, authorId });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/comments]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/comments ────────────────────────────────────────────────────────
export async function createComment(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, postId, authorId } = body as {
      content?: string;
      postId?: string;
      authorId?: string;
    };

    // Basic validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }
    if (!postId || typeof postId !== "string") {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }
    if (!authorId || typeof authorId !== "string") {
      return NextResponse.json({ error: "authorId is required" }, { status: 400 });
    }

    const comment = await commentService.createComment({ content: content.trim(), postId, authorId });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    // Prisma foreign key violation – postId or authorId doesn't match a real record
    if (error?.code === "P2003") {
      return NextResponse.json(
        { error: "postId or authorId does not reference an existing record" },
        { status: 400 }
      );
    }
    console.error("[POST /api/comments]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/comments/:id ───────────────────────────────────────────────────────
export async function getCommentById(_request: NextRequest, { params }: RouteContext) {
  const { id: commentId } = await params;

  try {
    const comment = await commentService.getCommentById(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error fetching comment by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH /api/comments/:id ─────────────────────────────────────────────────────
export async function updateComment(request: NextRequest, { params }: RouteContext) {
  const { id: commentId } = await params;

  try {
    const body = await request.json();
    const { content } = body as { content?: string };

    const updated = await commentService.updateComment(commentId, { content });

    if (!updated) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`[PATCH /api/comments/${commentId}]`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE /api/comments/:id ────────────────────────────────────────────────────
export async function deleteComment(_request: NextRequest, { params }: RouteContext) {
  const { id: commentId } = await params;

  try {
    await commentService.deleteComment(commentId);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    // Prisma record-not-found error
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    console.error(`[DELETE /api/comments/${commentId}]`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
