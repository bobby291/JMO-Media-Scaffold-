import { createHash, randomBytes } from "crypto";

const EMAIL_VERIFICATION_PREFIX = "verify-email:";

export function createEmailVerificationToken() {
  const token = randomBytes(32).toString("hex");
  const hashedToken = hashEmailVerificationToken(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  return { token, hashedToken, expires };
}

export function hashEmailVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function emailVerificationIdentifier(email: string) {
  return `${EMAIL_VERIFICATION_PREFIX}${email.toLowerCase()}`;
}
