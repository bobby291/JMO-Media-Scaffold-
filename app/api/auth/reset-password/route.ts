import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db/prisma";
import { fail, handleRouteError, ok } from "@/lib/api";
import { hashPasswordResetToken } from "@/lib/auth/password-reset";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";
import { resetPasswordSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = resetPasswordSchema.parse(await request.json());
    const hashedToken = hashPasswordResetToken(payload.token);

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: payload.email,
          token: hashedToken,
        },
      },
    });

    if (!tokenRecord || tokenRecord.expires < new Date()) {
      return fail("This password reset link is invalid or has expired", 400);
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);

    await prisma.user.update({
      where: { email: payload.email },
      data: { passwordHash },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier: payload.email },
    });

    return ok({ message: "Password updated successfully." });
  } catch (error) {
    return handleRouteError(error);
  }
}
