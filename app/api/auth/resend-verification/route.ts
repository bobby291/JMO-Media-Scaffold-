import { prisma } from "@/lib/db/prisma";
import { handleRouteError, ok } from "@/lib/api";
import {
  createEmailVerificationToken,
  emailVerificationIdentifier,
} from "@/lib/auth/email-verification";
import { databaseConfigMessage, emailConfigMessage, hasDatabaseUrl, hasEmailProvider } from "@/lib/env";
import { sendTransactionalEmail, verificationEmailContent } from "@/lib/email";
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
      select: { id: true, email: true, emailVerified: true },
    });

    if (!user || user.emailVerified) {
      return ok({
        message:
          "If that email exists and still needs verification, a verification link has been prepared.",
      });
    }

    const { token, hashedToken, expires } = createEmailVerificationToken();
    const identifier = emailVerificationIdentifier(user.email);

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

    const { verifyUrl, subject, html, text } = verificationEmailContent(
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
        "If that email exists and still needs verification, a verification link has been prepared.",
      verificationUrl:
        process.env.NODE_ENV !== "production" ? verifyUrl : undefined,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
