import { z } from "zod";

const mediaTypes = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "EMBED"] as const;

export const mediaCreateSchema = z.object({
  articleId: z.string().optional(),
  type: z.enum(mediaTypes),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  title: z.string().trim().max(120).optional(),
  caption: z.string().trim().max(240).optional(),
  altText: z.string().trim().max(160).optional(),
});

export const mediaUpdateSchema = mediaCreateSchema.partial();
