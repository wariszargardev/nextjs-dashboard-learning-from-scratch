import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { userCollection, userResource } from "@/lib/resources/userResource";
// Get records
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    
    // 1. Clean and safe pagination numbers
    const page    = Math.max(1, Number(searchParams.get("page") ?? 1));
    const perPage = Math.max(1, Number(searchParams.get("perPage") ?? 3));

    const search = searchParams.get('search');
    const role   = searchParams.get('role');

    // 2. Fixed query object with corrected OR logic structure
    const where = {
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } }
            ]
        }),
        ...(role && {
            role: role as "USER" | "ADMIN"
        })
    };

    try {
        const total = await prisma.user.count({ where })
        const users = await prisma.user.findMany({
            where,
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: {
                createdAt: 'desc' // Fixed key string literal issue
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        comments: {
                            select: {
                                id: true,
                                content: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        posts: true,
                        comments: true
                    }
                },
            }
        })

        return NextResponse.json({
            message: "User listing",
            data: {
                count: total,
                users: userCollection(users)
            }
        });

    } catch (error) {
        console.error("Database Transaction Error:", error);
        return NextResponse.json(
            { message: "Internal server error", error: String(error) },
            { status: 500 }
        );
    }
}



// Store validation
export async function POST(request: NextRequest){
    let email: string | undefined;
    try {
        const body = await request.json()
        const {name, role, email} = body;

        // validation
        if (!name || typeof name !== "string" || name.trim() === "") {
            return NextResponse.json({ error: "name is required" }, { status: 400 });
        }
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json({ error: "valid email is required" }, { status: 400 });
        }
        if (role !== undefined && role !== "USER" && role !== "ADMIN") {
            return NextResponse.json({ error: "role must be USER or ADMIN" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim(),
                role
            },
        })

        return NextResponse.json({
            message: "User created",
            data: userResource(user)
        }, { status: 201 });

    } catch (error:any) {
        if (error?.code === "P2002") {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
        return NextResponse.json({ error: "Internal server error", errorMessage: error.message }, { status: 500 });

    }
}