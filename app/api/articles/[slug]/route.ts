import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { fail, handleRouteError, ok, slugify } from "@/lib/api";
import { canManageArticle, canPublish } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { articleUpdateSchema } from "@/lib/validation/articles";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true, role: true, bio: true } },
        category: true,
        media: true,
        comments: {
          where: { approved: true },
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, image: true, role: true } },
          },
        },
      },
    });

    if (!article) {
      return fail("Article not found", 404);
    }

    if (article.status !== "PUBLISHED") {
      const session = await auth();
      const canViewDraft =
        session?.user?.id &&
        canManageArticle(
          { id: session.user.id, role: session.user.role },
          { authorId: article.authorId },
        );

      if (!canViewDraft) {
        return fail("Article not found", 404);
      }
    }

    return ok({ article });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Authentication required", 401);
    }

    const { slug } = await params;
    const existing = await prisma.article.findUnique({ where: { slug } });

    if (!existing) {
      return fail("Article not found", 404);
    }

    if (
      !canManageArticle(
        { id: session.user.id, role: session.user.role },
        { authorId: existing.authorId },
      )
    ) {
      return fail("You do not have permission to update this article", 403);
    }

    const payload = articleUpdateSchema.parse(await request.json());
    const nextStatus = payload.status ?? existing.status;

    if (nextStatus === "PUBLISHED" && !canPublish(session.user.role)) {
      return fail("Only editors and admins can publish articles", 403);
    }

    const article = await prisma.article.update({
      where: { slug },
      data: {
        title: payload.title,
        slug: payload.slug ? slugify(payload.slug) : undefined,
        excerpt: payload.excerpt,
        content: payload.content,
        coverImage: payload.coverImage,
        type: payload.type,
        status: nextStatus,
        publishedAt:
          nextStatus === "PUBLISHED" && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
        categoryId: payload.categoryId,
        media: payload.media
          ? {
              deleteMany: {},
              create: payload.media,
            }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
        category: true,
        media: true,
      },
    });

    return ok({ article });
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

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Authentication required", 401);
    }

    const { slug } = await params;
    const existing = await prisma.article.findUnique({ where: { slug } });

    if (!existing) {
      return fail("Article not found", 404);
    }

    if (
      !canManageArticle(
        { id: session.user.id, role: session.user.role },
        { authorId: existing.authorId },
      )
    ) {
      return fail("You do not have permission to delete this article", 403);
    }

    await prisma.article.delete({ where: { slug } });

    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
