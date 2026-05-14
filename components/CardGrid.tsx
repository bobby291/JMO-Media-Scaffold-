import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import {
  developmentAreas,
  ecosystemLinks,
  featuredArticles,
  trendingPosts,
} from "@/lib/content";

const toneClasses = {
  purple: "bg-[#f1e8f8] text-[#7427b3]",
  gold: "bg-[#fbf6e7] text-[#caa225]",
  green: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-600",
};

export default function CardGrid() {
  return (
    <>
      <section className="bg-white px-6 py-24 text-[#191919] md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="text-center">
            <h2 className="text-4xl font-bold md:text-5xl">Development Areas</h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#707070]">
              Choose your path to growth and explore content tailored to your
              development goals
            </p>
          </div>

          <div className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {developmentAreas.map((area) => {
              const Icon = area.icon;

              return (
                <Link
                  key={area.slug}
                  href={`/development-areas/${area.slug}`}
                  className="group rounded-2xl border border-[#e4e4e4] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#7427b3]/30 hover:shadow-xl"
                >
                  <span
                    className={`grid size-20 place-items-center rounded-2xl ${
                      toneClasses[area.tone as keyof typeof toneClasses]
                    }`}
                  >
                    <Icon size={34} />
                  </span>
                  <h3 className="mt-8 text-2xl font-bold leading-tight">{area.title}</h3>
                  <p className="mt-5 text-lg leading-8 text-[#707070]">
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

      <section className="bg-[#f7f7f7] px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7427b3]">
                Featured Content
              </p>
              <h2 className="mt-4 text-4xl font-bold md:text-5xl">
                Top articles for your next step
              </h2>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-lg font-semibold text-[#7427b3]"
            >
              View all articles
              <ArrowRight size={22} />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                href={`/articles/${article.slug}`}
                key={article.slug}
                className="rounded-2xl border border-[#e4e4e4] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#f1e8f8] px-4 py-2 text-sm font-semibold text-[#7427b3]">
                    {article.category}
                  </span>
                  <span className="text-sm text-[#707070]">{article.readTime}</span>
                </div>
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

      <section className="bg-white px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl bg-[#7427b3] p-10 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              Trending Posts
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Popular content readers are exploring now.
            </h2>
            <div className="mt-8 space-y-4">
              {trendingPosts.map((post, index) => (
                <Link
                  key={post}
                  href="/articles"
                  className="flex items-center gap-4 rounded-xl bg-white/10 p-4 transition hover:bg-white/15"
                >
                  <span className="text-xl font-bold text-[#dfbb35]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg">{post}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e4e4e4] p-10">
            <div className="grid size-16 place-items-center rounded-2xl bg-[#fbf6e7] text-[#caa225]">
              <Mail size={30} />
            </div>
            <h2 className="mt-8 text-4xl font-bold leading-tight">
              Get weekly development insights.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#707070]">
              Subscribe for thoughtful articles across leadership, business,
              technology, finance, education, sustainability, and relationships.
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-14 flex-1 rounded-xl border border-[#d7d7d7] px-5 outline-none focus:border-[#7427b3]"
              />
              <button className="rounded-xl bg-[#dfbb35] px-7 py-4 font-semibold text-[#161616]">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] px-6 py-24 md:px-10">
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
