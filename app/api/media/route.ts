import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { canWrite } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { mediaCreateSchema } from "@/lib/validation/media";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || !canWrite(session.user.role)) {
      return fail("Only editors and admins can access the media library", 403);
    }

    const media = await prisma.mediaAsset.findMany({
      orderBy: [{ createdAt: "desc" }],
      include: {
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      take: 100,
    });

    return ok({ media });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !canWrite(session.user.role)) {
      return fail("Only editors and admins can upload media assets", 403);
    }

    const payload = mediaCreateSchema.parse(await request.json());

    const media = await prisma.mediaAsset.create({
      data: {
        articleId: payload.articleId,
        uploadedById: session.user.id,
        type: payload.type,
        url: payload.url,
        thumbnailUrl: payload.thumbnailUrl,
        title: payload.title,
        caption: payload.caption,
        altText: payload.altText,
      },
      include: {
        article: {
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return ok({ media }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
