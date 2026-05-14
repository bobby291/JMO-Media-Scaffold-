import { z } from "zod";

import { handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

const newsletterSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  name: z.string().trim().min(2).max(120).optional(),
  interests: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
});

export async function POST(request: Request) {
  try {
    const payload = newsletterSchema.parse(await request.json());
    const subscription = await prisma.newsletterSubscription.upsert({
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

    return ok({ subscription }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
