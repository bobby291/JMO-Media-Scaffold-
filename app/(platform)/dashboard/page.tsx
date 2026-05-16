import Link from "next/link";

import { auth } from "@/auth";
import DashboardControlPanel from "@/components/DashboardControlPanel";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
        <Navbar showHero={false} />
        <section className="bg-[#7427b3] px-6 py-16 text-white md:px-10">
          <div className="mx-auto max-w-[1408px]">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
              Editorial dashboard
            </p>
            <h1 className="mt-5 text-5xl font-bold leading-tight md:text-7xl">
              Platform access required.
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-white/85">
              Sign in with an approved role account to manage content and platform activity.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1408px] px-6 py-16 md:px-10">
          <div className="rounded-2xl border border-[#e4e4e4] bg-white p-8 dark:border-white/10 dark:bg-[#222]">
            <h2 className="text-2xl font-bold">Authentication required</h2>
            <p className="mt-3 text-[#707070] dark:text-white/65">
              Login or create an account to access the contributor, editor, or admin workspace.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/login" className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white">
                Login
              </Link>
              <Link href="/signup" className="rounded-xl border border-[#7427b3] px-5 py-3 font-semibold text-[#7427b3]">
                Sign up
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const role = session.user.role;
  const canManageContent = role === "EDITOR" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  const [user, articles, categories, managedUsers, comments, articleStats, userStats, mediaAssets] =
    await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
          },
        },
      },
    }),
    canManageContent
      ? prisma.article.findMany({
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                comments: true,
              },
            },
          },
          take: 50,
        })
      : Promise.resolve([]),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    }),
    isAdmin
      ? prisma.user.findMany({
          orderBy: [{ createdAt: "desc" }],
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                articles: true,
                comments: true,
              },
            },
          },
          take: 100,
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.comment.findMany({
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
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.article.groupBy({
          by: ["status", "type"],
          _count: {
            _all: true,
          },
        })
      : Promise.resolve([]),
    isAdmin
      ? prisma.user.groupBy({
          by: ["role"],
          _count: {
            _all: true,
          },
        })
      : Promise.resolve([]),
    canManageContent
      ? prisma.mediaAsset.findMany({
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
        })
      : Promise.resolve([]),
  ]);

  if (!user) {
    return (
      <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
        <Navbar showHero={false} />
        <section className="mx-auto max-w-[1408px] px-6 py-20 md:px-10">
          <div className="rounded-2xl border border-[#e4e4e4] bg-white p-8 dark:border-white/10 dark:bg-[#222]">
            <h1 className="text-3xl font-bold">User not found</h1>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />

      <section className="bg-[#7427b3] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
            {role === "ADMIN"
              ? "Admin control panel"
              : role === "EDITOR"
                ? "Editorial control panel"
                : "Contributor workspace"}
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-7xl">
            {role === "ADMIN"
              ? "Manage the platform and publishing workflow."
              : role === "EDITOR"
                ? "Create, review, and publish content."
                : "Track your role profile and platform activity."}
          </h1>
          <p className="mt-6 max-w-4xl text-xl leading-9 text-white/85">
            Role-based access is enforced through NextAuth sessions, Prisma-backed APIs, and platform permissions.
          </p>
        </div>
      </section>

      <DashboardControlPanel
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          createdAt: user.createdAt.toISOString(),
          articleCount: user._count.articles,
          commentCount: user._count.comments,
        }}
        articles={articles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          coverImage: article.coverImage,
          status: article.status,
          type: article.type,
          createdAt: article.createdAt.toISOString(),
          updatedAt: article.updatedAt.toISOString(),
          publishedAt: article.publishedAt?.toISOString() ?? null,
          authorId: article.authorId,
          categoryId: article.categoryId,
          author: article.author,
          category: article.category,
          commentsCount: article._count.comments,
        }))}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          articleCount: category._count.articles,
        }))}
        managedUsers={managedUsers.map((managedUser) => ({
          id: managedUser.id,
          name: managedUser.name,
          email: managedUser.email,
          role: managedUser.role,
          bio: managedUser.bio,
          createdAt: managedUser.createdAt.toISOString(),
          articleCount: managedUser._count.articles,
          commentCount: managedUser._count.comments,
        }))}
        moderationComments={comments.map((comment) => ({
          id: comment.id,
          body: comment.body,
          approved: comment.approved,
          createdAt: comment.createdAt.toISOString(),
          author: comment.author,
          article: comment.article,
        }))}
        analytics={{
          totalUsers: managedUsers.length,
          totalCategories: categories.length,
          pendingComments: comments.filter((comment) => !comment.approved).length,
          publishedArticles: articles.filter((article) => article.status === "PUBLISHED").length,
          totalMediaAssets: mediaAssets.length,
          articleStats: articleStats.map((item) => ({
            status: item.status,
            type: item.type,
            count: item._count._all,
          })),
          userRoleStats: userStats.map((item) => ({
            role: item.role,
            count: item._count._all,
          })),
        }}
        mediaAssets={mediaAssets.map((asset) => ({
          id: asset.id,
          articleId: asset.articleId,
          type: asset.type,
          url: asset.url,
          thumbnailUrl: asset.thumbnailUrl,
          title: asset.title,
          caption: asset.caption,
          altText: asset.altText,
          createdAt: asset.createdAt.toISOString(),
          updatedAt: asset.updatedAt.toISOString(),
          article: asset.article,
          uploadedBy: asset.uploadedBy,
        }))}
      />
    </main>
  );
}
