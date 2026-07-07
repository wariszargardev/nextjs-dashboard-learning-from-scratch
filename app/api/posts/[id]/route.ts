// app/api/posts/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wires GET/PATCH/DELETE /api/posts/:id to postController. No logic lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as postController from "@/lib/controllers/postController";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/posts/:id
export async function GET(request: NextRequest, context: RouteContext) {
  return postController.getPostById(request, context);
}

// PATCH /api/posts/:id
export async function PATCH(request: NextRequest, context: RouteContext) {
  return postController.updatePost(request, context);
}

// DELETE /api/posts/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  return postController.deletePost(request, context);
}
