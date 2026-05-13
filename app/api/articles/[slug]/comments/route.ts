import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";
import { commentCreateSchema } from "@/lib/validation/articles";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!article || article.status !== "PUBLISHED") {
      return fail("Article not found", 404);
    }

    const comments = await prisma.comment.findMany({
      where: { articleId: article.id, approved: true },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return ok({ comments });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return fail("Authentication required", 401);
    }

    const { slug } = await params;
    const payload = commentCreateSchema.parse(await request.json());
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!article || article.status !== "PUBLISHED") {
      return fail("Article not found", 404);
    }

    const comment = await prisma.comment.create({
      data: {
        articleId: article.id,
        authorId: session.user.id,
        body: payload.body,
      },
      include: {
        author: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return ok({ comment }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
