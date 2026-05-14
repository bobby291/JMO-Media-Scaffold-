import { ArrowRight, Clock, Mail } from "lucide-react";
import Link from "next/link";

import NewsletterForm from "@/components/NewsletterForm";
import {
  developmentAreas,
  ecosystemLinks,
  featuredArticles,
  trendingPosts,
} from "@/lib/content";
import type { ArticlePreview } from "@/lib/articles";

const toneClasses = {
  purple: "bg-[#f1e8f8] text-[#7427b3]",
  gold: "bg-[#fbf6e7] text-[#caa225]",
  green: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-600",
};

function ArticleCard({ article }: { article: ArticlePreview }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="overflow-hidden rounded-[22px] border border-[#e1e1e1] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-[#222]"
    >
      <div
        className="h-[370px] bg-cover bg-center"
        style={{ backgroundImage: `url(${article.image})` }}
      />
      <div className="p-10">
        <div className="flex flex-wrap items-center gap-4 text-xl">
          <span className="font-semibold text-[#7427b3]">{article.category}</span>
          <span className="text-[#707070]">•</span>
          <span className="inline-flex items-center gap-2 text-[#707070] dark:text-white/60">
            <Clock size={22} />
            {article.readTime}
          </span>
        </div>
        <h3 className="mt-7 text-3xl font-bold leading-tight text-[#191919] dark:text-white">
          {article.title}
        </h3>
        <p className="mt-6 text-2xl leading-9 text-[#707070] dark:text-white/65">
          {article.excerpt}
        </p>
        <div className="mt-9 flex items-center justify-between gap-4 text-xl">
          <span className="font-bold text-[#191919] dark:text-white">{article.author}</span>
          <span className="text-[#707070] dark:text-white/60">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

function ArticleSection({
  title,
  subtitle,
  articles,
  className = "bg-[#f7f7f7] dark:bg-[#222]",
}: {
  title: string;
  subtitle: string;
  articles: ArticlePreview[];
  className?: string;
}) {
  return (
    <section className={`${className} px-6 py-24 md:px-10`}>
      <div className="mx-auto max-w-[1408px]">
        <div className="text-center">
          <h2 className="text-5xl font-bold leading-tight text-[#191919] dark:text-white md:text-6xl">
            {title}
          </h2>
          <p className="mx-auto mt-7 max-w-4xl text-3xl leading-snug text-[#707070] dark:text-white/65">
            {subtitle}
          </p>
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard key={`${title}-${article.slug}`} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function CardGrid({
  featured = featuredArticles,
  trending = trendingPosts,
}: {
  featured?: ArticlePreview[];
  trending?: ArticlePreview[];
}) {
  const featuredItems = featured.length > 0 ? featured : featuredArticles;
  const trendingItems = trending.length > 0 ? trending : trendingPosts;

  return (
    <>
      <section className="bg-white px-6 py-24 text-[#191919] dark:bg-[#191919] dark:text-white md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="text-center">
            <h2 className="text-5xl font-bold md:text-6xl">Development Areas</h2>
            <p className="mx-auto mt-7 max-w-4xl text-3xl leading-snug text-[#707070] dark:text-white/65">
              Choose your path to growth and explore content tailored to your
              development goals
            </p>
          </div>

          <div className="mt-20 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {developmentAreas.map((area) => {
              const Icon = area.icon;

              return (
                <Link
                  key={area.slug}
                  href={`/development-areas/${area.slug}`}
                  className="group rounded-2xl border border-[#e4e4e4] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#7427b3]/30 hover:shadow-xl dark:border-white/10 dark:bg-[#222]"
                >
                  <span
                    className={`grid size-20 place-items-center rounded-2xl ${
                      toneClasses[area.tone as keyof typeof toneClasses]
                    }`}
                  >
                    <Icon size={34} />
                  </span>
                  <h3 className="mt-8 text-2xl font-bold leading-tight">{area.title}</h3>
                  <p className="mt-5 text-lg leading-8 text-[#707070] dark:text-white/65">
                    {area.description}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 text-base font-semibold text-[#7427b3] opacity-0 transition group-hover:opacity-100">
                    Explore area
                    <ArrowRight size={18} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ArticleSection
        title="Featured Content"
        subtitle="Handpicked articles to accelerate your growth"
        articles={featuredItems.slice(0, 2)}
      />

      <ArticleSection
        title="Trending Now"
        subtitle="Most popular content from our community"
        articles={trendingItems.slice(0, 2)}
        className="bg-white dark:bg-[#191919]"
      />

      <section className="bg-[#7427b3] px-6 py-28 text-center text-white md:px-10">
        <div className="mx-auto max-w-5xl">
          <Mail className="mx-auto" size={72} strokeWidth={2.4} />
          <h2 className="mt-12 text-5xl font-bold md:text-6xl">Stay Informed</h2>
          <p className="mt-8 text-3xl leading-snug text-white/95">
            Get the latest articles and insights delivered directly to your inbox
          </p>
          <NewsletterForm />
        </div>
      </section>

      <section className="bg-[#f7f7f7] px-6 py-24 dark:bg-[#222] md:px-10">
        <div className="mx-auto max-w-[1408px] rounded-3xl bg-[#191919] p-10 text-white md:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#dfbb35]">
                JMO Ecosystem
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
                Continue growing through JMO BIZHUB and JMO Academy.
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {ecosystemLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-2xl bg-white/8 p-6">
                    <Icon className="text-[#dfbb35]" size={32} />
                    <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-base leading-7 text-white/70">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
