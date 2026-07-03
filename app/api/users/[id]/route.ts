import {NextRequest, NextResponse} from "next/server";
import * as userService from "@/lib/services/userService";
import { UserRole } from "@/lib/models/user";
 
// Next.js App Router passes dynamic route segments as `params`.
type RouteContext = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: userId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "User ID parameter is required" }, { status: 400 });
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// ── PATCH /api/users/:id ───────────────────────────────────────────────────
 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
const { id: userId } = await params;

  try {
    const body = await request.json();
    const { name, email, role } = body as {
      name?: string;
      email?: string;
      role?: UserRole;
    };
 
    const updated = await userService.updateUser(userId, { name, email, role });
 
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
 
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error(`[PATCH /api/users/${userId}]`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
 
// ── DELETE /api/users/:id ──────────────────────────────────────────────────
 
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params;

    try {
        await userService.deleteUser(userId);
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        // Prisma record-not-found error
        if (error?.code === "P2025") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.error(`[DELETE /api/users/${userId}]`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
 
