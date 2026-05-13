import { Prisma } from "@prisma/client";
import { z } from "zod";

import { auth } from "@/auth";
import { fail, handleRouteError, ok, slugify } from "@/lib/api";
import { canModerate } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(240).optional(),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { articles: true } },
    },
  });

  return ok({ categories });
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !canModerate(session.user.role)) {
      return fail("Only editors and admins can manage categories", 403);
    }

    const payload = categorySchema.parse(await request.json());
    const category = await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug ? slugify(payload.slug) : slugify(payload.name),
        description: payload.description,
      },
    });

    return ok({ category }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("A category with this slug already exists", 409);
    }

    return handleRouteError(error);
  }
}
