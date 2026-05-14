import Link from "next/link";
import { notFound } from "next/navigation";

import { developmentAreas, featuredArticles } from "@/lib/content";

export default async function DevelopmentAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = developmentAreas.find((item) => item.slug === slug);

  if (!area) {
    notFound();
  }

  const Icon = area.icon;

  return (
    <main className="min-h-screen bg-white text-[#191919]">
      <nav className="mx-auto flex h-24 max-w-[1408px] items-center justify-between px-6 md:px-9 lg:px-12">
        <Link href="/" className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-[14px] bg-[#7427b3] text-xl font-bold text-white">
            JMO
          </span>
          <span className="text-2xl font-semibold tracking-tight md:text-3xl">
            JMO Media
          </span>
        </Link>
        <Link href="/development-areas" className="font-semibold text-[#7427b3]">
          All Areas
        </Link>
      </nav>

      <section className="bg-[#7427b3] px-6 py-20 text-white md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <span className="grid size-20 place-items-center rounded-2xl bg-white/15">
            <Icon size={38} />
          </span>
          <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            {area.title}
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-white/85">
            {area.description}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7427b3]">
                Featured posts
              </p>
              <h2 className="mt-4 text-4xl font-bold">Start with these reads</h2>
            </div>
            <Link href="/articles" className="font-semibold text-[#7427b3]">
              Browse all articles
            </Link>
          </div>

          <div className="mt-10 grid gap-7 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="rounded-2xl border border-[#e4e4e4] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="rounded-full bg-[#f1e8f8] px-4 py-2 text-sm font-semibold text-[#7427b3]">
                  {article.category}
                </span>
                <h3 className="mt-8 text-2xl font-bold leading-tight">
                  {article.title}
                </h3>
                <p className="mt-5 text-lg leading-8 text-[#707070]">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
