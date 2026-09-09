import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Standard Next.js dev-mode singleton — without this, every hot-reload of
// a route module would open a fresh connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * pg-connection-string's newer versions alias sslmode=require (what
 * Supabase's connection string specifies) to strict verify-full unless
 * uselibpqcompat=true is also present — without it, Supabase's certificate
 * chain gets rejected as self-signed even though the connection is
 * genuinely encrypted. This has to go in the connection string itself: pg's
 * ConnectionParameters does `Object.assign({}, config, parse(connectionString))`,
 * so anything parsed from the string (including its own derived `ssl`)
 * overwrites a same-named option passed alongside `connectionString` —
 * an `ssl: {...}` option next to `connectionString` is silently discarded.
 */
function withLibpqCompat(connectionString: string | undefined): string | undefined {
  if (!connectionString) return connectionString;
  const url = new URL(connectionString);
  url.searchParams.set("uselibpqcompat", "true");
  url.searchParams.set("sslmode", "require");
  return url.toString();
}

// POSTGRES_PRISMA_URL (Supavisor transaction-mode pooler), not
// POSTGRES_URL_NON_POOLING: every serverless cold start opens its own fresh
// pg.Pool, and the direct/session-mode connection caps out at 15 total
// clients — this broke the live site under a single person's normal use,
// not just under real concurrent load. The pooler is built for exactly
// this many-short-lived-connections pattern. @prisma/adapter-pg doesn't
// cache/reuse prepared statement names unless a statementNameGenerator is
// explicitly provided (see PrismaPgOptions), which avoids the classic
// prepared-statement-vs-transaction-pooling failure mode.
const adapter = new PrismaPg({
  connectionString: withLibpqCompat(process.env.POSTGRES_PRISMA_URL),
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
