import type { MediaType } from "@prisma/client";

import { auth } from "@/auth";
import { fail, handleRouteError, ok } from "@/lib/api";
import { canWrite } from "@/lib/auth/roles";
import { prisma } from "@/lib/db/prisma";
import { inferMediaTypeFromMime, saveUploadedFile } from "@/lib/media";

export const runtime = "nodejs";

const MAX_UPLOAD_SIZE = 25 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !canWrite(session.user.role)) {
      return fail("Only editors and admins can upload media assets", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("A file is required", 422);
    }

    if (file.size === 0) {
      return fail("The selected file is empty", 422);
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return fail("Files larger than 25 MB are not supported yet", 422);
    }

    const saved = await saveUploadedFile(file);
    const type = ((formData.get("type") as string | null) ??
      inferMediaTypeFromMime(file.type || "application/octet-stream")) as MediaType;

    const media = await prisma.mediaAsset.create({
      data: {
        articleId: (formData.get("articleId") as string | null) || undefined,
        uploadedById: session.user.id,
        type,
        url: saved.url,
        thumbnailUrl: (formData.get("thumbnailUrl") as string | null) || undefined,
        title: (formData.get("title") as string | null) || file.name,
        caption: (formData.get("caption") as string | null) || undefined,
        altText: (formData.get("altText") as string | null) || undefined,
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
