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
// node-postgres's own TLS validation rejects Supabase's certificate chain
// as self-signed under Node's default strict checking, even though the
// connection is still encrypted — a known, common friction point connecting
// `pg` (rather than Prisma's own engine, which handles it fine — that's why
// `prisma migrate deploy` above didn't need this) to Supabase specifically.
const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: { rejectUnauthorized: false },
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
