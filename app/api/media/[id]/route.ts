import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { canWrite } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { mediaUpdateSchema } from "@/lib/validation/media";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || !canWrite(session.user.role)) {
      return fail("Only editors and admins can update media assets", 403);
    }

    const { id } = await params;
    const payload = mediaUpdateSchema.parse(await request.json());

    const media = await prisma.mediaAsset.update({
      where: { id },
      data: {
        articleId: payload.articleId,
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

    return ok({ media });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await auth();

    if (!session?.user?.id || !canWrite(session.user.role)) {
      return fail("Only editors and admins can delete media assets", 403);
    }

    const { id } = await params;
    await prisma.mediaAsset.delete({ where: { id } });

    return ok({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
