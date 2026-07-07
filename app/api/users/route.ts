// app/api/users/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// This file only maps a URL + HTTP method to a controller function. Next.js
// requires route handlers to live in a file named route.ts under app/, so this
// is the smallest that file can be — all the real logic lives in userController.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as userController from "@/lib/controllers/userController";

// GET /api/users
export async function GET(request: NextRequest) {
  return userController.getUsers(request);
}

// POST /api/users
export async function POST(request: NextRequest) {
  return userController.createUser(request);
}
