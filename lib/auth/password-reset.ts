import { createHash, randomBytes } from "crypto";

const PASSWORD_RESET_PREFIX = "password-reset:";

export function createPasswordResetToken() {
  const token = randomBytes(32).toString("hex");
  const hashedToken = hashPasswordResetToken(token);
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  return { token, hashedToken, expires };
}

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function passwordResetIdentifier(email: string) {
  return `${PASSWORD_RESET_PREFIX}${email.toLowerCase()}`;
}
