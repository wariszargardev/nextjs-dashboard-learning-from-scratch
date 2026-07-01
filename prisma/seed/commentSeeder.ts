import prisma from "@/lib/db/prisma";
import { User, Post } from "@/app/generated/prisma/client";

export async function commentSeeder(admin: User, regular: User, post: Post) {
    await prisma.comment.deleteMany();

    await prisma.comment.createMany({
        data: [
             {
                content: "Great article! Very clear explanation.",
                postId: post.id,
                authorId: regular.id,
            },
            {
                content: "Thanks for sharing – the repository pattern makes a lot of sense here.",
                postId: post.id,
                authorId: admin.id,
            },
              {
                content: "Great article! Very clear explanation -1 ",
                postId: post.id,
                authorId: regular.id,
            },
            {
                content: "Thanks for sharing – the repository pattern makes a lot of sense here -1.",
                postId: post.id,
                authorId: admin.id,
            }
        ]
    })
}