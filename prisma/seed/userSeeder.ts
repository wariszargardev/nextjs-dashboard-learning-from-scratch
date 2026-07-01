import { PrismaClient } from "@/app/generated/prisma/client";

export async function userSeeder(prisma: PrismaClient) {
    await prisma.user.deleteMany();

    const admin = await prisma.user.create({
        data: {
            email: "admin@admin.com",
            name: "Admin User",
            role: "ADMIN",
        }
    });

    const regular = await prisma.user.create({
        data: {
        name: "Bob User",
        email: "bob@example.com",
        role: "USER",
        },
    });

    console.log(`✅ Users seeded: ${admin.name}, ${regular.name}`);

    return { admin, regular };
}