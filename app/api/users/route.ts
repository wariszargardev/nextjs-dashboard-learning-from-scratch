import {NextRequest, NextResponse} from "next/server";
import * as userService from "@/lib/services/userService";
import { UserRole } from "@/lib/models/user";

// ── GET /api/users ─────────────────────────────────────────────────────────
 
export async function GET(request: NextRequest) {
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
    console.error("[GET /api/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



// ── POST /api/users ────────────────────────────────────────────────────────
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role } = body as {
      name?: string;
      email?: string;
      role?: UserRole;
    };
 
    // Basic validation
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "valid email is required" }, { status: 400 });
    }
 
    const user = await userService.createUser({ name: name.trim(), email: email.trim(), role });
 
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    // Prisma unique constraint violation
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error("[POST /api/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
