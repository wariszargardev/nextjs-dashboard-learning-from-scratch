// lib/db/prisma.ts
// ─────────────────────────────────────────────────────────────────────────────
// This is the single PrismaClient instance the whole app uses to talk to
// PostgreSQL. Services (e.g. lib/services/userService.ts) import `prisma`
// from here — nothing outside `lib` should import this directly.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// In dev, Next.js reloads modules on every file change, which would normally
// create a brand new PrismaClient (and DB connection) each time. Stashing it
// on `global` re-uses the same client across reloads instead.
const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

// The adapter is what actually connects to Postgres using DATABASE_URL.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
