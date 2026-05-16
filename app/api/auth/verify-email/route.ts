import { prisma } from "@/lib/db/prisma";
import { fail, handleRouteError, ok } from "@/lib/api";
import {
  emailVerificationIdentifier,
  hashEmailVerificationToken,
} from "@/lib/auth/email-verification";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";
import { verifyEmailSchema } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = verifyEmailSchema.parse(await request.json());
    const identifier = emailVerificationIdentifier(payload.email);
    const hashedToken = hashEmailVerificationToken(payload.token);

    const tokenRecord = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token: hashedToken,
        },
      },
    });

    if (!tokenRecord || tokenRecord.expires < new Date()) {
      return fail("This verification link is invalid or has expired", 400);
    }

    await prisma.user.update({
      where: { email: payload.email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    return ok({ message: "Email verified successfully." });
  } catch (error) {
    return handleRouteError(error);
  }
}
