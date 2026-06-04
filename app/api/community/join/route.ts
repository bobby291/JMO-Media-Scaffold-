import { z } from "zod";

import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";

const communityJoinSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  name: z.string().trim().min(2).max(120),
  interests: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
});

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = communityJoinSchema.parse(await request.json());
    const membership = await prisma.newsletterSubscription.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name,
        interests: payload.interests,
      },
      create: {
        email: payload.email,
        name: payload.name,
        interests: payload.interests,
      },
      select: { id: true, email: true, name: true, interests: true, createdAt: true },
    });

    return ok(
      {
        message: `Thank you for joining our community, ${payload.name}. Check your email for next steps and exclusive content.`,
        membership,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
