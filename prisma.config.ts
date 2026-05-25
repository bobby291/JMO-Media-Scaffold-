import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

loadEnv({ path: ".env.local" });
loadEnv();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Prefer the pooled DATABASE_URL (recommended for deployments). Fall back to DIRECT_URL when DATABASE_URL is not set (e.g., some local setups).
    url: env("DATABASE_URL") || env("DIRECT_URL"),
  },
  migrations: {
    path: "prisma/migrations",
  },
});
