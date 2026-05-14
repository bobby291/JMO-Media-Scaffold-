import type { Prisma } from "@prisma/client";

import { featuredArticles } from "@/lib/content";
import { prisma } from "@/lib/db/prisma";

const articleInclude = {
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
  _count: { select: { comments: true } },
} satisfies Prisma.ArticleInclude;

export type DbArticle = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

export type ArticlePreview = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
};

export function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

export function formatArticleDate(date: Date | string | null | undefined) {
  if (!date) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function toArticlePreview(article: DbArticle): ArticlePreview {
  return {
    slug: article.slug,
    category: article.category?.slug ?? article.type.toLowerCase(),
    title: article.title,
    excerpt: article.excerpt ?? article.content.slice(0, 150),
    readTime: estimateReadTime(article.content),
    author: article.author.name ?? "JMO Media",
    date: formatArticleDate(article.publishedAt ?? article.createdAt),
    image:
      article.coverImage ??
      article.media.find((asset) => asset.type === "IMAGE")?.url ??
      featuredArticles[0].image,
  };
}

export async function getPublishedArticles(limit = 20) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: articleInclude,
      take: limit,
    });

    return articles;
  } catch (error) {
    console.error("Unable to load published articles", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    return await prisma.article.findUnique({
      where: { slug },
      include: articleInclude,
    });
  } catch (error) {
    console.error(`Unable to load article ${slug}`, error);
    return null;
  }
}
