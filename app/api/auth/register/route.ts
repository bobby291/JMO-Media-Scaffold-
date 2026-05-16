import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { ok, fail, handleRouteError } from "@/lib/api";
import {
  createEmailVerificationToken,
  emailVerificationIdentifier,
} from "@/lib/auth/email-verification";
import { prisma } from "@/lib/db/prisma";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = registerSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(payload.password, 12);
    const { token, hashedToken, expires } = createEmailVerificationToken();
    const identifier = emailVerificationIdentifier(payload.email);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          passwordHash,
          role: payload.role,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      await tx.verificationToken.deleteMany({
        where: { identifier },
      });

      await tx.verificationToken.create({
        data: {
          identifier,
          token: hashedToken,
          expires,
        },
      });

      return createdUser;
    });

    const origin = new URL(request.url).origin;
    const verificationUrl = `${origin}/verify-email?email=${encodeURIComponent(
      user.email,
    )}&token=${encodeURIComponent(token)}`;

    return ok(
      {
        user,
        requiresEmailVerification: true,
        verificationUrl:
          process.env.NODE_ENV !== "production" ? verificationUrl : undefined,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("A user with this email already exists", 409);
    }

    return handleRouteError(error);
  }
}
