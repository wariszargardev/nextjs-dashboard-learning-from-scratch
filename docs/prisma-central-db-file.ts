// lib/db/prisma.ts
// ─────────────────────────────────────────────────────────────────────────────
// Single PrismaClient instance shared across the entire app.
//
// Why globalThis?
//   Next.js hot-reload in development re-evaluates modules, which would create
//   a new PrismaClient on every change and quickly exhaust DB connections.
//   Storing the instance on `globalThis` survives module re-evaluation.
//   In production there is no hot-reload, so we always create a fresh instance.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

// Extend the global type so TypeScript knows about our cached instance.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
