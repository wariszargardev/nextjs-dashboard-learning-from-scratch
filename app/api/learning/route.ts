import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl
    const id = searchParams.get('id')
    return NextResponse.json({ message: "Hello, world!", id });
}

export async function POST(request: NextRequest){
    try {
        const body = await request.json()
        const {name, email, role} = body;

        // validation
        if (!name || name.trim() === "") {
            return NextResponse.json({ error: "name is required" }, { status: 400 });
        }
        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "valid email is required" }, { status: 400 });
        }

        const user =await prisma.user.create({
            data: {
                name,
                email,
                role
            },
            select: {
                name: true,
                email: true
            }
        })

        if (user) {
            return NextResponse.json({
                message: "User created",
                data: {
                    user
                }
            })
        }

    } catch (error:any) {
        return NextResponse.json({ error: "Internal server error", errorMessage: error.message }, { status: 500 });

    }
}