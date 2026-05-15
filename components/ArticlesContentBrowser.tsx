"use client";

import { ChevronDown, Clock, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

type BrowserArticle = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  level?: string;
};

export default function ArticlesContentBrowser({
  articles,
}: {
  articles: BrowserArticle[];
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All Categories");
  const [level, setLevel] = React.useState("All Levels");

  const categories = React.useMemo(
    () => ["All Categories", ...Array.from(new Set(articles.map((article) => article.category)))],
    [articles],
  );

  const levels = React.useMemo(
    () => [
      "All Levels",
      ...Array.from(
        new Set(articles.map((article) => article.level).filter(Boolean) as string[]),
      ),
    ],
    [articles],
  );

  const visibleArticles = articles.filter((article) => {
    const searchable =
      `${article.title} ${article.excerpt} ${article.author} ${article.category}`.toLowerCase();
    const matchesQuery = searchable.includes(query.toLowerCase());
    const matchesCategory =
      category === "All Categories" || article.category === category;
    const matchesLevel =
      level === "All Levels" || (article.level ?? "") === level;

    return matchesQuery && matchesCategory && matchesLevel;
  });

  return (
    <div className="mx-auto max-w-[1408px]">
      <div className="rounded-[28px] border border-[#e7e7e7] bg-white p-8 shadow-[0_2px_18px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#222]">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_auto_0.8fr_0.5fr] xl:items-center">
          <label className="flex min-h-20 items-center gap-4 rounded-[20px] border border-[#d9d9d9] px-6 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15">
            <Search size={32} className="text-[#7b7b7b]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-[1.15rem] outline-none placeholder:text-[#8a8a8a] dark:text-white"
            />
          </label>

          <div className="hidden xl:flex xl:justify-center">
            <SlidersHorizontal size={36} className="text-[#7b7b7b]" />
          </div>

          <label className="relative flex min-h-20 items-center rounded-[20px] border border-[#d9d9d9] px-6 dark:border-white/15">
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-full w-full appearance-none bg-transparent pr-10 text-[1.15rem] outline-none dark:text-white"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={24} className="pointer-events-none absolute right-6 text-[#3a3a3a] dark:text-white/70" />
          </label>

          <label className="relative flex min-h-20 items-center rounded-[20px] border border-[#d9d9d9] px-6 dark:border-white/15">
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-full w-full appearance-none bg-transparent pr-10 text-[1.15rem] outline-none dark:text-white"
            >
              {levels.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown size={24} className="pointer-events-none absolute right-6 text-[#3a3a3a] dark:text-white/70" />
          </label>
        </div>

        <p className="mt-7 text-xl text-[#707070] dark:text-white/65">
          Showing {visibleArticles.length} of {articles.length} articles
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="overflow-hidden rounded-[22px] border border-[#e1e1e1] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.14)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-[#222]"
          >
            <div
              className="h-[270px] bg-cover bg-center"
              style={{ backgroundImage: `url(${article.image})` }}
            />
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 text-lg">
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

      {visibleArticles.length === 0 ? (
        <div className="mt-10 rounded-[22px] border border-dashed border-[#cfd7e6] p-10 text-center text-xl text-[#707070] dark:border-white/15 dark:text-white/65">
          No articles matched your search or filters.
        </div>
      ) : null}
    </div>
  );
}
