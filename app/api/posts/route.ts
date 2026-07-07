// app/api/posts/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Wires GET/POST /api/posts to postController. No logic lives here.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as postController from "@/lib/controllers/postController";

// GET /api/posts
export async function GET(request: NextRequest) {
  return postController.getPosts(request);
}

// POST /api/posts
export async function POST(request: NextRequest) {
  return postController.createPost(request);
}
