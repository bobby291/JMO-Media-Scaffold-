import { prisma } from "@/lib/db/prisma";
import { handleRouteError, ok } from "@/lib/api";
import {
  createEmailVerificationToken,
  emailVerificationIdentifier,
} from "@/lib/auth/email-verification";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return ok({
        message: databaseConfigMessage(),
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

    const origin = new URL(request.url).origin;
    const verificationUrl = `${origin}/verify-email?email=${encodeURIComponent(
      user.email,
    )}&token=${encodeURIComponent(token)}`;

    return ok({
      message:
        "If that email exists and still needs verification, a verification link has been prepared.",
      verificationUrl:
        process.env.NODE_ENV !== "production" ? verificationUrl : undefined,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
