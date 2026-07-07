// lib/controllers/postController.ts
// ─────────────────────────────────────────────────────────────────────────────
// Post Controller — reads the HTTP request, validates input, calls
// postService, and shapes the JSON response for every /api/posts route.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import * as postService from "@/lib/services/postService";

type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/posts ───────────────────────────────────────────────────────────
export async function getPosts(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 20);
    const search = searchParams.get("search") ?? undefined;
    const authorId = searchParams.get("authorId") ?? undefined;
    const publishedParam = searchParams.get("published");
    const published = publishedParam === null ? undefined : publishedParam === "true";

    const result = await postService.listPosts({ page, perPage, search, authorId, published });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/posts ──────────────────────────────────────────────────────────
export async function createPost(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, published, authorId } = body as {
      title?: string;
      content?: string;
      published?: boolean;
      authorId?: string;
    };

    // Basic validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json({ error: "content is required" }, { status: 400 });
    }
    if (!authorId || typeof authorId !== "string") {
      return NextResponse.json({ error: "authorId is required" }, { status: 400 });
    }

    const post = await postService.createPost({
      title: title.trim(),
      content: content.trim(),
      published,
      authorId,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    // Prisma foreign key violation – authorId doesn't match a real user
    if (error?.code === "P2003") {
      return NextResponse.json({ error: "authorId does not reference an existing user" }, { status: 400 });
    }
    console.error("[POST /api/posts]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/posts/:id ────────────────────────────────────────────────────────
export async function getPostById(_request: NextRequest, { params }: RouteContext) {
  const { id: postId } = await params;

  try {
    const post = await postService.getPostById(postId);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH /api/posts/:id ──────────────────────────────────────────────────────
export async function updatePost(request: NextRequest, { params }: RouteContext) {
  const { id: postId } = await params;

  try {
    const body = await request.json();
    const { title, content, published } = body as {
      title?: string;
      content?: string;
      published?: boolean;
    };

    const updated = await postService.updatePost(postId, { title, content, published });

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(`[PATCH /api/posts/${postId}]`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE /api/posts/:id ─────────────────────────────────────────────────────
export async function deletePost(_request: NextRequest, { params }: RouteContext) {
  const { id: postId } = await params;

  try {
    await postService.deletePost(postId);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    // Prisma record-not-found error
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    console.error(`[DELETE /api/posts/${postId}]`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
