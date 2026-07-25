import prisma from "@/lib/db/prisma";
import { NextResponse, NextRequest } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
    const { id } = await params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                email: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        comments: {
                            select: {
                                id: true,
                                content: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        posts: true,
                        comments: true
                    }
                }
            },
        })

        return NextResponse.json({
            message: "User fetch successfully",
            user
        })
    } catch (error) {
        console.error(`[GET /api/learning/${id}]`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}