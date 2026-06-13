import { prisma } from "@/lib/db/prisma";
import { fail, handleRouteError, ok } from "@/lib/api";
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
      return fail(databaseConfigMessage(), 503);
    }

    if (process.env.NODE_ENV === "production" && !hasEmailProvider()) {
      return fail(emailConfigMessage(), 503);
    }

    const payload = forgotPasswordSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true, email: true },
    });

    if (!user) {
      console.info("Forgot-password request skipped because user was not found", {
        email: payload.email,
        configuredBaseUrl: process.env.NEXTAUTH_URL ?? null,
        requestOrigin: new URL(request.url).origin,
      });

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
      const delivery = await sendTransactionalEmail({
        to: user.email,
        subject,
        html,
        text,
      });

      console.info("Forgot-password email delivery accepted", {
        email: user.email,
        emailFrom: process.env.EMAIL_FROM ?? null,
        configuredBaseUrl: process.env.NEXTAUTH_URL ?? null,
        resolvedBaseUrl: appBaseUrl(request),
        resendId:
          delivery.result &&
          typeof delivery.result === "object" &&
          "data" in delivery.result &&
          delivery.result.data &&
          typeof delivery.result.data === "object" &&
          "id" in delivery.result.data
            ? delivery.result.data.id
            : null,
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

        return fail(
          "Password reset email delivery failed locally. Use the generated reset link below while email is being configured.",
          503,
          {
            resetUrl,
            deliveryStatus: "failed",
            deliveryError: message,
          },
        );
      }

      return fail(
        "Password reset email could not be delivered right now. Please try again in a few minutes.",
        503,
        {
          deliveryStatus: "failed",
        },
      );
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
