import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Only used by the `prisma` CLI (migrate/generate/studio) — the app itself
// connects via the driver adapter in src/lib/prisma.ts, not this file.
//
// POSTGRES_URL_NON_POOLING (not POSTGRES_PRISMA_URL) — migrate needs a
// direct connection; DDL/advisory locks don't work reliably through a
// transaction-mode PgBouncer pooler. See src/lib/prisma.ts for why the app
// itself uses the same direct URL rather than the pooled one, for now.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("POSTGRES_URL_NON_POOLING"),
  },
});
