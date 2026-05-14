import Link from "next/link";
import { notFound } from "next/navigation";

import CategoryContentBrowser from "@/components/CategoryContentBrowser";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
  const areaArticles = featuredArticles.filter((article) => article.area === area.title);
  const articles = areaArticles.length ? areaArticles : featuredArticles.slice(0, 3);
  const featuredPost = articles[0];

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />

      <section className="relative overflow-hidden bg-[#7427b3] px-6 py-20 text-white md:px-10 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(223,187,53,0.26),transparent_30%),radial-gradient(circle_at_78%_58%,rgba(255,255,255,0.20),transparent_36%)] animate-jmo-soft-pulse" />
        <div className="relative mx-auto max-w-[1408px] animate-jmo-fade-up">
          <Link href="/development-areas" className="text-base font-bold text-white/75 hover:text-white">
            Development Areas
          </Link>
          <span className="mt-8 grid size-20 place-items-center rounded-2xl bg-white/15">
            <Icon size={40} />
          </span>
          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            {area.title}
          </h1>
          <p className="mt-6 max-w-3xl text-2xl leading-10 text-white/90">
            {area.description}
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
            <div className="rounded-[22px] bg-[#f7f7f7] p-8 dark:bg-[#222]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7427b3]">
                Category Focus
              </p>
              <h2 className="mt-5 text-4xl font-black">Search, filter, and start with practical content.</h2>
              <p className="mt-5 text-xl leading-9 text-[#707070] dark:text-white/65">
                Use the filters for beginner-friendly resources, advanced thinking,
                practical tools, and trend-focused analysis.
              </p>
              <Link
                href="/join"
                className="mt-8 inline-flex rounded-2xl bg-[#7427b3] px-8 py-4 text-lg font-black text-white"
              >
                Join Community
              </Link>
            </div>

            {featuredPost ? (
              <Link
                href={`/articles/${featuredPost.slug}`}
                className="group overflow-hidden rounded-[22px] border border-[#e4e4e4] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)] dark:border-white/10 dark:bg-[#222]"
              >
                <div
                  className="h-72 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${featuredPost.image})` }}
                />
                <div className="p-8">
                  <span className="rounded-full bg-[#f1e8f8] px-4 py-2 text-base font-black text-[#7427b3]">
                    Featured post
                  </span>
                  <h2 className="mt-6 text-4xl font-black leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-5 text-xl leading-9 text-[#707070] dark:text-white/65">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            ) : null}
          </div>

          <div className="mt-16">
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7427b3]">
                Content Grid
              </p>
              <h2 className="mt-4 text-5xl font-black">Explore {area.title}</h2>
            </div>
            <CategoryContentBrowser articles={articles} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
