// lib/controllers/userController.ts
// ─────────────────────────────────────────────────────────────────────────────
// User Controller — the actual request-handling logic for /api/users routes.
//
// This is where we:
//   - read the request (query params, URL params, JSON body)
//   - do basic input validation
//   - call userService to do the real work
//   - turn the result into an HTTP response (status code + JSON)
//
// The files under app/api/users/**/route.ts stay tiny — they just tell
// Next.js "when this URL is hit, call this controller function".
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import * as userService from "@/lib/services/userService";
import { UserRole } from "@/lib/models/user";
import { logger } from "@/lib/logger";

// Params for routes like /api/users/[id] — Next.js passes these in as a Promise.
type RouteContext = { params: Promise<{ id: string }> };

// ── GET /api/users ─────────────────────────────────────────────────────────
export async function getUsers(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Number(searchParams.get("page") ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 20);
    const search = searchParams.get("search") ?? undefined;
    const roleParam = searchParams.get("role");
    const role = (roleParam as UserRole) ?? undefined;

    const result = await userService.listUsers({ page, perPage, search, role });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("GET /api/users", "Failed to list users", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/users ────────────────────────────────────────────────────────
export async function createUser(request: NextRequest) {
  let email: string | undefined;
  try {
    const body = await request.json();
    const { name, role } = body as {
      name?: string;
      email?: string;
      role?: UserRole;
    };
    ({ email } = body);

    // Basic validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "valid email is required" }, { status: 400 });
    }

    const user = await userService.createUser({ name: name.trim(), email: email.trim(), role });

    logger.info("POST /api/users", "User created", { id: user.id });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    // Prisma unique constraint violation
    if (error?.code === "P2002") {
      logger.warn("POST /api/users", "Rejected duplicate email", { email });
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    logger.error("POST /api/users", "Failed to create user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/users/:id ──────────────────────────────────────────────────────
export async function getUserById(_request: NextRequest, { params }: RouteContext) {
  const { id: userId } = await params;

  try {
    if (!userId) {
      return NextResponse.json({ error: "User ID parameter is required" }, { status: 400 });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    logger.error(`GET /api/users/${userId}`, "Failed to fetch user", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ── PATCH /api/users/:id ─────────────────────────────────────────────────────
export async function updateUser(request: NextRequest, { params }: RouteContext) {
  const { id: userId } = await params;
  let email: string | undefined;

  try {
    const body = await request.json();
    const { name, role } = body as {
      name?: string;
      email?: string;
      role?: UserRole;
    };
    ({ email } = body);

    const updated = await userService.updateUser(userId, { name, email, role });

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    logger.info(`PATCH /api/users/${userId}`, "User updated", { id: userId });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === "P2002") {
      logger.warn(`PATCH /api/users/${userId}`, "Rejected duplicate email", { email });
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    logger.error(`PATCH /api/users/${userId}`, "Failed to update user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
export async function deleteUser(_request: NextRequest, { params }: RouteContext) {
  const { id: userId } = await params;

  try {
    await userService.deleteUser(userId);
    logger.info(`DELETE /api/users/${userId}`, "User deleted", { id: userId });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    // Prisma record-not-found error
    if (error?.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    logger.error(`DELETE /api/users/${userId}`, "Failed to delete user", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET /api/users/by-email?email=... ────────────────────────────────────────
export async function getUserByEmail(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    logger.error("GET /api/users/by-email", "Failed to fetch user by email", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
