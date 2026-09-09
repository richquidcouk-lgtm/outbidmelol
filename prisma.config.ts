import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Only used by the `prisma` CLI (migrate/generate/studio) — the app itself
// connects via the driver adapter in src/lib/prisma.ts, not this file.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
