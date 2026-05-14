import { Clock } from "lucide-react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import { featuredArticles } from "@/lib/content";
import { getPublishedArticles, toArticlePreview } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const dbArticles = await getPublishedArticles(50);
  const dbPreviews = dbArticles.map(toArticlePreview);
  const articles = [
    ...featuredArticles,
    ...dbPreviews.filter(
      (article) =>
        !featuredArticles.some(
          (featured) =>
            featured.slug === article.slug || featured.title === article.title,
        ),
    ),
  ];

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />
      <section className="bg-[#7427b3] px-6 py-20 text-center text-white md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
          Articles
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Explore structured content for holistic development.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/85">
          Published articles are loaded from the Prisma database and can be
          managed through the editorial dashboard.
        </p>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-10 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="overflow-hidden rounded-[22px] border border-[#e1e1e1] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-[#222]"
            >
              <div
                className="h-[320px] bg-cover bg-center"
                style={{ backgroundImage: `url(${article.image})` }}
              />
              <div className="p-8">
                <div className="flex flex-wrap items-center gap-4 text-lg">
                  <span className="font-semibold text-[#7427b3]">{article.category}</span>
                  <span className="text-[#707070]">•</span>
                  <span className="inline-flex items-center gap-2 text-[#707070] dark:text-white/60">
                    <Clock size={20} />
                    {article.readTime}
                  </span>
                </div>
                <h2 className="mt-6 text-3xl font-bold leading-tight">
                  {article.title}
                </h2>
                <p className="mt-5 text-xl leading-8 text-[#707070] dark:text-white/65">
                  {article.excerpt}
                </p>
                <div className="mt-8 flex justify-between gap-4 text-lg">
                  <span className="font-bold">{article.author}</span>
                  <span className="text-[#707070] dark:text-white/60">{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
