import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { fail, handleRouteError, ok, slugify } from "@/lib/api";
import { canPublish, canWrite } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import {
  articleCreateSchema,
  articleListQuerySchema,
} from "@/lib/validation/articles";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = articleListQuerySchema.parse({
      status: url.searchParams.get("status") ?? undefined,
      type: url.searchParams.get("type") ?? undefined,
      authorId: url.searchParams.get("authorId") ?? undefined,
    });

    const articles = await prisma.article.findMany({
      where: {
        status: query.status ?? "PUBLISHED",
        type: query.type,
        authorId: query.authorId,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
        category: true,
        media: true,
        _count: { select: { comments: true } },
      },
      take: 50,
    });

    return ok({ articles });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Authentication required", 401);
    }

    if (!canWrite(session.user.role)) {
      return fail("Only editors and admins can create posts", 403);
    }

    const payload = articleCreateSchema.parse(await request.json());
    const wantsPublished = payload.status === "PUBLISHED";
    const status = wantsPublished && !canPublish(session.user.role) ? "REVIEW" : payload.status;
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

    const article = await prisma.article.create({
      data: {
        title: payload.title,
        slug,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        type: payload.type,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        categoryId: payload.categoryId,
        media: {
          create: payload.media,
        },
      },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
        category: true,
        media: true,
      },
    });

    return ok({ article }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fail("An article with this slug already exists", 409);
    }

    return handleRouteError(error);
  }
}
