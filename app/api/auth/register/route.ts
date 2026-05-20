import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import { ok, fail, handleRouteError } from "@/lib/api";
import {
  createEmailVerificationToken,
  emailVerificationIdentifier,
} from "@/lib/auth/email-verification";
import { prisma } from "@/lib/db/prisma";
import { appBaseUrl, databaseConfigMessage, emailConfigMessage, hasDatabaseUrl, hasEmailProvider } from "@/lib/env";
import { sendTransactionalEmail, verificationEmailContent } from "@/lib/email";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    if (process.env.NODE_ENV === "production" && !hasEmailProvider()) {
      return fail(emailConfigMessage(), 503);
    }

    const payload = registerSchema.parse(await request.json());

    if (payload.role !== "CONTRIBUTOR") {
      return fail(
        "Public signup can only create Contributor accounts. Editor and Admin access must be issued internally by an administrator.",
        403,
      );
    }

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

    return ok(
      {
        user,
        requiresEmailVerification: true,
        verificationUrl:
          process.env.NODE_ENV !== "production" ? verifyUrl : undefined,
        verificationSentTo: user.email,
        nextStepUrl: `${appBaseUrl(request)}/verify-email?email=${encodeURIComponent(user.email)}`,
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
