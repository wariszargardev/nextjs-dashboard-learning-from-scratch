import prisma from "@/lib/db/prisma";
import { PublicUser } from "@/lib/models/user";

// The Prisma select object we reuse for every "public user" query.
// Keeps the returned shape consistent and avoids selecting extra columns.
const PUBLIC_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;
 
export async function findById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { id },
        select: PUBLIC_USER_SELECT
    })
};

export async function findByEmail( email: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({
        where: { email },
        select: PUBLIC_USER_SELECT
    })
}