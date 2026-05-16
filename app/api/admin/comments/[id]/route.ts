import { z } from "zod";

import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

const commentUpdateSchema = z.object({
  approved: z.boolean().optional(),
});

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return fail("Only admins can moderate comments", 403);
    }

    const { id } = await params;
    const payload = commentUpdateSchema.parse(await request.json());

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        approved: payload.approved,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return ok({ comment });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return fail("Only admins can delete comments", 403);
    }

    const { id } = await params;
    await prisma.comment.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
