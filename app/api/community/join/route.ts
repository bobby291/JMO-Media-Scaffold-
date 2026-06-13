import bcrypt from "bcryptjs";
import { z } from "zod";

import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { databaseConfigMessage, hasDatabaseUrl } from "@/lib/env";

const communityJoinSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(120),
  interests: z.array(z.string().trim().min(1).max(80)).max(12).default([]),
});

export async function POST(request: Request) {
  try {
    if (!hasDatabaseUrl()) {
      return fail(databaseConfigMessage(), 503);
    }

    const payload = communityJoinSchema.parse(await request.json());
    const passwordHash = await bcrypt.hash(payload.password, 12);
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

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        role: true,
        passwordHash: true,
        emailVerified: true,
      },
    });

    if (existingUser && existingUser.role !== "READER") {
      console.info("Community join blocked by existing platform account", {
        email: payload.email,
        existingRole: existingUser.role,
        hasPassword: Boolean(existingUser.passwordHash),
        emailVerified: Boolean(existingUser.emailVerified),
        requestOrigin: new URL(request.url).origin,
      });

      return fail(
        "This email already has a platform access account. Sign in with that account or use password reset instead of joining the community again.",
        409,
      );
    }

    const user = existingUser
      ? await prisma.user.update({
          where: { email: payload.email },
          data: {
            name: payload.name,
            passwordHash,
            emailVerified: existingUser.emailVerified ?? new Date(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        })
      : await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name,
            passwordHash,
            role: "READER",
            emailVerified: new Date(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });

    console.info("Community reader access saved", {
      email: payload.email,
      userId: user.id,
      role: user.role,
      existingReaderUpdated: Boolean(existingUser),
      requestOrigin: new URL(request.url).origin,
    });

    return ok(
      {
        message: `Thank you for joining our community, ${payload.name}. Your reader access is ready and you can now sign in to comment on posts.`,
        membership,
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
