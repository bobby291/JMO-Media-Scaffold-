import { z } from "zod";

const articleTypes = ["ARTICLE", "NEWS", "EDITORIAL", "MEDIA"] as const;
const articleStatuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;
const mediaTypes = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "EMBED"] as const;

export const articleListQuerySchema = z.object({
  status: z.enum(articleStatuses).optional(),
  type: z.enum(articleTypes).optional(),
  authorId: z.string().optional(),
});

export const mediaAssetSchema = z.object({
  type: z.enum(mediaTypes),
  url: z.string().url(),
  title: z.string().trim().max(120).optional(),
  caption: z.string().trim().max(240).optional(),
  altText: z.string().trim().max(160).optional(),
});

export const articleCreateSchema = z.object({
  title: z.string().trim().min(4).max(160),
  slug: z.string().trim().min(4).max(100).optional(),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().trim().min(20),
  coverImage: z.string().url().optional(),
  type: z.enum(articleTypes).default("ARTICLE"),
  status: z.enum(articleStatuses).default("DRAFT"),
  categoryId: z.string().optional(),
  media: z.array(mediaAssetSchema).max(12).default([]),
});

export const articleUpdateSchema = articleCreateSchema.partial().extend({
  status: z.enum(articleStatuses).optional(),
});

export const commentCreateSchema = z.object({
  body: z.string().trim().min(2).max(1200),
});
