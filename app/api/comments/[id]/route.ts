// app/api/comments/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wires GET/PATCH/DELETE /api/comments/:id to commentController. No logic here.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as commentController from "@/lib/controllers/commentController";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/comments/:id
export async function GET(request: NextRequest, context: RouteContext) {
  return commentController.getCommentById(request, context);
}

// PATCH /api/comments/:id
export async function PATCH(request: NextRequest, context: RouteContext) {
  return commentController.updateComment(request, context);
}

// DELETE /api/comments/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  return commentController.deleteComment(request, context);
}
