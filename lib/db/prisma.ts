// lib/db/prisma.ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Maintain strict typing on globalThis
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
    adapter?: PrismaPg;
};

// 2. Wrap initialization in a clean single-execution fallback
if (!globalForPrisma.adapter) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.adapter = new PrismaPg(pool);
}

if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
        adapter: globalForPrisma.adapter,
    });
}

// 3. Export the cached single instances safely
export const adapter = globalForPrisma.adapter;
export const prisma = globalForPrisma.prisma;

export default prisma;
