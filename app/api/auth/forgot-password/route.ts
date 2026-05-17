import { prisma } from "@/lib/db/prisma";
import { handleRouteError, ok } from "@/lib/api";
import {
  createPasswordResetToken,
  passwordResetIdentifier,
} from "@/lib/auth/password-reset";
import { databaseConfigMessage, emailConfigMessage, hasDatabaseUrl, hasEmailProvider } from "@/lib/env";
import { passwordResetEmailContent, sendTransactionalEmail } from "@/lib/email";
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

    await sendTransactionalEmail({
      to: user.email,
      subject,
      html,
      text,
    });

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
