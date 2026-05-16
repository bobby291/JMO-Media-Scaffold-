import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return fail("Only admins can access comment moderation", 403);
    }

    const comments = await prisma.comment.findMany({
      orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
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
      take: 100,
    });

    return ok({ comments });
  } catch (error) {
    return handleRouteError(error);
  }
}
