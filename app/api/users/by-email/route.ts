// app/api/users/by-email/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Maps GET /api/users/by-email?email=... to userController.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from "next/server";
import * as userController from "@/lib/controllers/userController";

export async function GET(request: NextRequest) {
  return userController.getUserByEmail(request);
}
