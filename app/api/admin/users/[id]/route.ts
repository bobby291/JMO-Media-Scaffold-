import { z } from "zod";

import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

const userUpdateSchema = z.object({
  role: z.enum(["READER", "CONTRIBUTOR", "EDITOR", "ADMIN"]).optional(),
  bio: z.string().trim().max(280).optional(),
  name: z.string().trim().min(2).max(80).optional(),
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
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
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
