export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_URL);
}

export function databaseConfigMessage() {
  return "DATABASE_URL or DIRECT_URL is not configured. Add your Neon connection string to .env.local before using auth, newsletter, or Prisma-backed APIs.";
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

export function platformAccessDomains() {
  return (process.env.PLATFORM_ACCESS_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

export function isApprovedPlatformEmail(email: string) {
  const domains = platformAccessDomains();

  if (domains.length === 0) {
    return false;
  }

  const [, domain = ""] = email.toLowerCase().split("@");
  return domains.includes(domain);
}

export function platformAccessDomainsMessage() {
  return "Set PLATFORM_ACCESS_EMAIL_DOMAINS to a comma-separated list of approved business domains before assigning Editor or Admin roles.";
}
