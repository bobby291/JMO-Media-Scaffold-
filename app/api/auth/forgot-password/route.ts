import { prisma } from "@/lib/db/prisma";
import { handleRouteError, ok } from "@/lib/api";
import {
  createPasswordResetToken,
  passwordResetIdentifier,
} from "@/lib/auth/password-reset";
import {
  appBaseUrl,
  databaseConfigMessage,
  emailConfigMessage,
  hasDatabaseUrl,
  hasEmailProvider,
} from "@/lib/env";
import {
  EmailDeliveryError,
  passwordResetEmailContent,
  sendTransactionalEmail,
} from "@/lib/email";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return ok({
        message: databaseConfigMessage(),
      });
    }

    if (process.env.NODE_ENV === "production" && !hasEmailProvider()) {
      return ok({
        message: emailConfigMessage(),
      });
    }

    const payload = forgotPasswordSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return ok({
        message:
          "If that email exists in the system, a password reset link has been prepared.",
      });
    }

    const { token, hashedToken, expires } = createPasswordResetToken();
    const identifier = passwordResetIdentifier(user.email);

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token: hashedToken,
        expires,
      },
    });

    const { resetUrl, subject, html, text } = passwordResetEmailContent(
      user.email,
      token,
      request,
    );

    try {
      await sendTransactionalEmail({
        to: user.email,
        subject,
        html,
        text,
      });
    } catch (error) {
      const requestOrigin = new URL(request.url).origin;

      console.error("Forgot-password email delivery failed", {
        email: user.email,
        emailFrom: process.env.EMAIL_FROM ?? null,
        configuredBaseUrl: process.env.NEXTAUTH_URL ?? null,
        requestOrigin,
        resolvedBaseUrl: appBaseUrl(request),
        error,
      });

      if (process.env.NODE_ENV !== "production") {
        const message =
          error instanceof EmailDeliveryError ? error.message : "Email delivery failed";

        return ok({
          message:
            "Password reset email delivery failed locally. Use the generated reset link below while email is being configured.",
          resetUrl,
          deliveryStatus: "failed",
          deliveryError: message,
        });
      }

      return ok({
        message:
          "If that email exists in the system, a password reset link has been prepared.",
      });
    }

    return ok({
      message:
        "If that email exists in the system, a password reset link has been prepared.",
      resetUrl:
        process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
