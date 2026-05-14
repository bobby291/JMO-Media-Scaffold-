import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString =
  process.env.DATABASE_URL ?? "postgresql://user:password@localhost:5432/jmo_media";

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Leadership Development",
    slug: "leadership-development",
    description: "Build essential leadership skills to inspire and guide teams effectively.",
  },
  {
    name: "Professional & Business Development",
    slug: "professional-business-development",
    description: "Advance your career and business acumen with proven strategies.",
  },
  {
    name: "Technological Development",
    slug: "technological-development",
    description: "Stay ahead with cutting-edge tech skills and digital innovation.",
  },
];

const articles = [
  {
    title: "The Art of Transformational Leadership in Modern Organizations",
    slug: "future-ready-leadership",
    excerpt:
      "Discover how to inspire and empower your team through authentic leadership practices that drive real change.",
    content:
      "Transformational leadership begins with clarity, trust, and consistent communication.\n\nModern organizations need leaders who can connect purpose to execution, invite feedback, and create environments where people can do meaningful work.\n\nStart by defining the mission, listening deeply, and turning values into repeatable team habits.",
    type: "ARTICLE" as const,
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1800&auto=format&fit=crop",
    categorySlug: "leadership-development",
  },
  {
    title: "Building a Personal Brand That Opens Doors",
    slug: "digital-skills-career-growth",
    excerpt:
      "Your personal brand is your professional superpower. Learn how to craft and communicate yours effectively.",
    content:
      "A strong personal brand is built through clarity, consistency, and credibility.\n\nDefine the problems you solve, share useful ideas, and make your work easy to understand. Your reputation compounds when your message and actions stay aligned.\n\nUse your channels to teach, document progress, and connect with communities that value your expertise.",
    type: "EDITORIAL" as const,
    coverImage:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop",
    categorySlug: "professional-business-development",
  },
];

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

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const article of articles) {
    const category = await prisma.category.findUnique({
      where: { slug: article.categorySlug },
    });

    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        type: article.type,
        coverImage: article.coverImage,
        status: "PUBLISHED",
        publishedAt: new Date("2026-04-15T09:00:00.000Z"),
        categoryId: category?.id,
      },
      create: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        type: article.type,
        coverImage: article.coverImage,
        status: "PUBLISHED",
        publishedAt: new Date("2026-04-15T09:00:00.000Z"),
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
