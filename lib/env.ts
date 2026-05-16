export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function databaseConfigMessage() {
  return "DATABASE_URL is not configured. Add your Neon connection string to .env.local before using auth, newsletter, or Prisma-backed APIs.";
}
