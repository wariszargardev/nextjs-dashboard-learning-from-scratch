import prisma from "@/lib/db/prisma";
import { userResource } from "@/lib/resources/userResource";
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
            user: userResource(user)
        })
    } catch (error) {
        console.error(`[GET /api/learning/${id}]`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
    const {id} = await params
    const body = await req.json()
    const {name, email, role} = body

    const userExists  = await prisma.user.findUnique({
        where: { id },
        select: {id: true}
    })

    if (!userExists) {
        return NextResponse.json({
            error: "User not found"
        })
    }

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            ...(name  && { name:  name.trim() }),
            ...(email && { email: email.trim() }),
            ...(role  && { role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    })

    return NextResponse.json({ data: userResource(user) });
}

export async function DELETE(req: NextRequest, {params}: RouteContext) {
    const {id}  = await params

    try {
        await prisma.user.delete({
            where: {
                id
            }
        })

        return new NextResponse(null, { status: 204 });
    } catch(error) {
        console.error(`[DELETE /api/learning/${id}]`, error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}