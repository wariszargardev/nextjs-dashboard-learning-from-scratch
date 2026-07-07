// app/api/comments/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wires GET/POST /api/comments to commentController. No logic lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as commentController from "@/lib/controllers/commentController";

// GET /api/comments?postId=...&authorId=...
export async function GET(request: NextRequest) {
  return commentController.getComments(request);
}

// POST /api/comments
export async function POST(request: NextRequest) {
  return commentController.createComment(request);
}
