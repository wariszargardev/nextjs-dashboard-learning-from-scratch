import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Get records
export async function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    const role = searchParams.get('role')

    const page    = Number(searchParams.get("page")  ?? 1);
    const perPage = Number(searchParams.get("perPage") ?? 3);

    const where = {
        ...(search && {
            OR: [
                {
                    name: {contains: search, mode: "insensitive" as const},
                    email: {contains: search, mode: "insensitive" as const}
                }
            ]
        }),
        ...(role && {
            role: role as "USER" | "ADMIN"
        })
    }

    const users = await prisma.user.findMany({
        where,
        skip: (page-1) * perPage,
        take: perPage,
        orderBy: {
            'createdAt': 'desc'
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
    return NextResponse.json({ message: "Hello, world!", id, search, users });
}

// Store validation
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