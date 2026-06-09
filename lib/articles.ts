import type { Prisma } from "@prisma/client";

import { featuredArticles, type StaticArticle } from "@/lib/content";
import { prisma } from "@/lib/db/prisma";
import { hasDatabaseUrl } from "@/lib/env";

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
  area?: string;
  level?: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
};

export function staticArticleToMarkdown(article: StaticArticle) {
  const blocks: string[] = [`# ${article.title}`, "", article.intro];

  article.sections.forEach((section, index) => {
    blocks.push("", `## ${section.heading}`, "", section.body);

    if (index === 0 && article.quote) {
      blocks.push("", `> ${article.quote}`);
    }

    if (section.bullets?.length) {
      blocks.push(
        "",
        ...section.bullets.map((bullet) => `- ${bullet}`),
      );
    }
  });

  return blocks.join("\n");
}

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

function categoryBadgeLabel(article: DbArticle) {
  const slug = article.category?.slug ?? "";

  switch (slug) {
    case "leadership-development":
      return "leadership";
    case "professional-business-development":
      return "professional-business";
    case "technological-development":
      return "technology";
    case "financial-development":
      return "economic-financial";
    case "educational-development":
      return "educational";
    case "environmental-sustainability":
      return "environmental";
    case "politics-governance":
      return "politics-governance";
    case "health-sciences":
      return "social-development";
    case "relationship-development":
      return "relationship";
    default:
      return article.category?.slug ?? article.type.toLowerCase();
  }
}

export function toArticlePreview(article: DbArticle): ArticlePreview {
  return {
    slug: article.slug,
    category: categoryBadgeLabel(article),
    area: article.category?.name ?? article.type,
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

export function mergeArticlePreviews(
  primary: ArticlePreview[],
  secondary: ArticlePreview[],
) {
  const seen = new Set<string>();

  return [...primary, ...secondary].filter((article) => {
    const key = article.slug.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function syncStaticArticles(authorId: string) {
  if (!hasDatabaseUrl()) {
    return;
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });

  const categoryIdByName = new Map(categories.map((category) => [category.name, category.id]));
  const existing = await prisma.article.findMany({
    select: { slug: true },
    where: { slug: { in: featuredArticles.map((article) => article.slug) } },
  });
  const existingSlugs = new Set(existing.map((article) => article.slug));

  const missingArticles = featuredArticles
    .filter((article) => !existingSlugs.has(article.slug))
    .map((article) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: staticArticleToMarkdown(article),
      coverImage: article.image,
      type: "ARTICLE" as const,
      status: "PUBLISHED" as const,
      publishedAt: new Date(article.date),
      authorId,
      categoryId: categoryIdByName.get(article.area) ?? null,
    }));

  if (!missingArticles.length) {
    return;
  }

  await prisma.article.createMany({
    data: missingArticles,
    skipDuplicates: true,
  });
}

export async function getUnifiedPublishedArticlePreviews(limit = 50) {
  const dbArticles = await getPublishedArticles(limit);
  const dbPreviews = dbArticles.map(toArticlePreview);

  return mergeArticlePreviews(
    dbPreviews,
    featuredArticles.map((article) => ({
      slug: article.slug,
      category: article.category,
      area: article.area,
      level: article.level,
      title: article.title,
      excerpt: article.excerpt,
      readTime: article.readTime,
      author: article.author,
      date: article.date,
      image: article.image,
    })),
  );
}

export async function getPublishedArticles(limit = 20) {
  if (!hasDatabaseUrl()) {
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
  if (!hasDatabaseUrl()) {
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
