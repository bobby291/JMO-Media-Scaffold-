import { prisma } from "@/lib/db/prisma";
import { handleRouteError, ok } from "@/lib/api";
import { createPasswordResetToken } from "@/lib/auth/password-reset";
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
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user?.passwordHash) {
      return ok({
        message:
          "If that email exists in the system, a password reset link has been prepared.",
      });
    }

    const { token, hashedToken, expires } = createPasswordResetToken();

    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: hashedToken,
        expires,
      },
    });

    const origin = new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?email=${encodeURIComponent(
      user.email,
    )}&token=${encodeURIComponent(token)}`;

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
