import { z } from "zod";

import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

const userUpdateSchema = z.object({
  role: z.enum(["READER", "CONTRIBUTOR", "EDITOR", "ADMIN"]).optional(),
  bio: z.string().trim().max(280).optional(),
  name: z.string().trim().min(2).max(80).optional(),
  image: z.string().trim().url().optional(),
  emailVerified: z.boolean().optional(),
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return fail("Only admins can update users", 403);
    }

    const { id } = await params;
    const payload = userUpdateSchema.parse(await request.json());

    if (session.user.id === id && payload.role && payload.role !== "ADMIN") {
      return fail("Admins cannot remove their own admin access here", 400);
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: payload.role,
        bio: payload.bio,
        name: payload.name,
        image: payload.image,
        emailVerified:
          payload.emailVerified === undefined
            ? undefined
            : payload.emailVerified
              ? new Date()
              : null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
          },
        },
      },
    });

    return ok({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return fail("Only admins can delete users", 403);
    }

    const { id } = await params;

    if (session.user.id === id) {
      return fail("Admins cannot delete their own account from the dashboard", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return fail("User not found", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.verificationToken.deleteMany({
        where: {
          identifier: {
            in: [
              `verify-email:${user.email.toLowerCase()}`,
              `password-reset:${user.email.toLowerCase()}`,
            ],
          },
        },
      });

      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return ok({ deleted: true, userId: user.id, email: user.email });
  } catch (error) {
    return handleRouteError(error);
  }
}
