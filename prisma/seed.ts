import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

import { developmentAreas, featuredArticles } from "../lib/content";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/jmo_media";

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const areaSlugByName = new Map(
  developmentAreas.map((area) => [area.title, area.slug]),
);

function buildArticleBody(article: (typeof featuredArticles)[number]) {
  const sectionText = article.sections
    .map((section) => {
      const bullets = section.bullets?.length
        ? `\n${section.bullets.map((bullet) => `- ${bullet}`).join("\n")}`
        : "";

      return `${section.heading}\n${section.body}${bullets}`;
    })
    .join("\n\n");

  return [
    article.intro,
    sectionText,
    article.quote ? `"${article.quote}"` : "",
    `About ${article.author}\n${article.authorBio}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function main() {
  const author = await prisma.user.upsert({
    where: { email: "editor@jmomedia.com" },
    update: { role: "EDITOR" },
    create: {
      email: "editor@jmomedia.com",
      name: "JMO Editorial Team",
      role: "EDITOR",
    },
  });

  for (const category of developmentAreas) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.title,
        description: category.description,
      },
      create: {
        name: category.title,
        slug: category.slug,
        description: category.description,
      },
    });
  }

  for (const article of featuredArticles) {
    const category = await prisma.category.findUnique({
      where: { slug: areaSlugByName.get(article.area) ?? "leadership-development" },
    });
    const content = buildArticleBody(article);
    const publishedAt = new Date(`${article.date} 09:00:00 UTC`);

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content,
        authorBio: article.authorBio,
        type: article.category === "technology" ? "NEWS" : "ARTICLE",
        coverImage: article.image,
        status: "PUBLISHED",
        publishedAt,
        categoryId: category?.id,
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content,
        authorBio: article.authorBio,
        type: article.category === "technology" ? "NEWS" : "ARTICLE",
        coverImage: article.image,
        status: "PUBLISHED",
        publishedAt,
        categoryId: category?.id,
        authorId: author.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
