import { Resend } from "resend";

import { appBaseUrl, emailConfigMessage, hasEmailProvider } from "@/lib/env";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export class EmailDeliveryError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
    this.name = "EmailDeliveryError";
  }
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(emailConfigMessage());
  }

  return new Resend(apiKey);
}

export async function sendTransactionalEmail(payload: EmailPayload) {
  if (!hasEmailProvider()) {
    if (process.env.NODE_ENV === "production") {
      throw new EmailDeliveryError(emailConfigMessage());
    }

    return { skipped: true };
  }

  const resend = getResendClient();
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  if (result && typeof result === "object" && "error" in result && result.error) {
    throw new EmailDeliveryError("Resend rejected the email request", result.error);
  }

  return { skipped: false, result };
}

export function verificationEmailContent(email: string, token: string, request?: Request) {
  const verifyUrl = `${appBaseUrl(request)}/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  return {
    verifyUrl,
    subject: "Verify your JMO Media account",
    text: `Verify your JMO Media account by opening this link: ${verifyUrl}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Verify your email</h1>
        <p>Your JMO Media account has been created. Confirm your email address to activate access.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="background:#7427b3;color:#ffffff;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
            Verify email
          </a>
        </p>
        <p>If the button does not open, use this link:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      </div>
    `,
  };
}

export function passwordResetEmailContent(email: string, token: string, request?: Request) {
  const resetUrl = `${appBaseUrl(request)}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  return {
    resetUrl,
    subject: "Reset your JMO Media password",
    text: `Reset your JMO Media password by opening this link: ${resetUrl}`,
    html: `
      <div style="font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Reset your password</h1>
        <p>A password reset was requested for your JMO Media account.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#7427b3;color:#ffffff;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">
            Reset password
          </a>
        </p>
        <p>If the button does not open, use this link:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  };
}
