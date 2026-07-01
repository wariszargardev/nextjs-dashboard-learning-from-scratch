import prisma from "@/lib/db/prisma";
import { User } from "@/app/generated/prisma/client";

export async function postSeeder(admin: User) {
    await prisma.post.deleteMany();

    const post = await prisma.post.create({
        data: {
            title: "Getting Started with Next.js and Prisma",
            content: "This is a sample post that demonstrates the blog-like architecture.",
            published: true,
            authorId: admin.id,
        }
    });
    console.log(`✅ Post seeded: ${post.title}`);
    return { post };
}