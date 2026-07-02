import {NextRequest, NextResponse} from "next/server";
import * as userService from "@/lib/services/userService";

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