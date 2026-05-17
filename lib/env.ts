export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function databaseConfigMessage() {
  return "DATABASE_URL is not configured. Add your Neon connection string to .env.local before using auth, newsletter, or Prisma-backed APIs.";
}

export function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function blobConfigMessage() {
  return "BLOB_READ_WRITE_TOKEN is not configured. Add your Vercel Blob token before using persistent media uploads in production.";
}

export function hasEmailProvider() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function emailConfigMessage() {
  return "Email delivery is not configured. Set RESEND_API_KEY and EMAIL_FROM before using production verification or password reset emails.";
}

export function appBaseUrl(request?: Request) {
  return process.env.NEXTAUTH_URL ?? (request ? new URL(request.url).origin : "http://localhost:3000");
}
