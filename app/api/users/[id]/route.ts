// app/api/users/[id]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Maps GET/PATCH/DELETE for a single user (/api/users/:id) to userController.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as userController from "@/lib/controllers/userController";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/users/:id
export async function GET(request: NextRequest, context: RouteContext) {
  return userController.getUserById(request, context);
}

// PATCH /api/users/:id
export async function PATCH(request: NextRequest, context: RouteContext) {
  return userController.updateUser(request, context);
}

// DELETE /api/users/:id
export async function DELETE(request: NextRequest, context: RouteContext) {
  return userController.deleteUser(request, context);
}
