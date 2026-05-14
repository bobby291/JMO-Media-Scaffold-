import { Prisma } from "@prisma/client";
import { z } from "zod";

import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

const newsletterSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

export async function POST(request: Request) {
  try {
    const payload = newsletterSchema.parse(await request.json());
    const subscription = await prisma.newsletterSubscription.create({
      data: { email: payload.email },
      select: { id: true, email: true, createdAt: true },
    });

    return ok({ subscription }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("This email is already subscribed", 409);
    }

    return handleRouteError(error);
  }
}
