import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return fail("Authentication required", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return fail("User not found", 404);
  }

  return ok({ user });
}

const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    bio: z.string().trim().max(280).optional(),
    image: z.string().trim().url().optional(),
    currentPassword: z.string().min(8).optional(),
    newPassword: z.string().min(8).max(120).optional(),
  })
  .refine(
    (value) => {
      if (value.newPassword && !value.currentPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  );

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Authentication required", 401);
    }

    const payload = profileUpdateSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!existingUser) {
      return fail("User not found", 404);
    }

    let passwordHash: string | undefined;

    if (payload.newPassword) {
      if (!existingUser.passwordHash || !payload.currentPassword) {
        return fail("Current password is required to update your password", 400);
      }

      const valid = await bcrypt.compare(payload.currentPassword, existingUser.passwordHash);

      if (!valid) {
        return fail("Current password is incorrect", 400);
      }

      passwordHash = await bcrypt.hash(payload.newPassword, 12);
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: payload.name,
        bio: payload.bio,
        image: payload.image,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return ok({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
