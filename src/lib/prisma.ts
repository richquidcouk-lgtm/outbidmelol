import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton — without this, every hot-reload of
// a route module would open a fresh connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Direct connection (POSTGRES_URL_NON_POOLING), not the pooled
// POSTGRES_PRISMA_URL: @prisma/adapter-pg uses node-postgres's extended
// query protocol (real prepared statements), which breaks intermittently
// against PgBouncer in transaction-pooling mode. Fine at today's traffic;
// revisit (Supabase's session-mode pooler, or Prisma Accelerate) before
// this sees enough concurrent load to approach Postgres's connection limit.
const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
