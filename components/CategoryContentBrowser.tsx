"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import React from "react";

import type { StaticArticle } from "@/lib/content";

const filters = ["All", "Beginner", "Advanced", "Tools", "Trends"];

function matchesFilter(article: StaticArticle, filter: string) {
  if (filter === "All") {
    return true;
  }

  if (filter === "Beginner") {
    return article.level === "Foundational" || article.level === "Intermediate";
  }

  if (filter === "Advanced") {
    return article.level === "Advanced";
  }

  if (filter === "Tools") {
    return /tools|framework|system|practice|habits|applications/i.test(
      `${article.title} ${article.excerpt} ${article.sections.map((section) => section.body).join(" ")}`,
    );
  }

  return /future|technology|market|signals|trend|ai|blockchain/i.test(
    `${article.title} ${article.excerpt}`,
  );
}

export default function CategoryContentBrowser({
  articles,
}: {
  articles: StaticArticle[];
}) {
  const [query, setQuery] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState("All");

  const visibleArticles = articles.filter((article) => {
    const searchable = `${article.title} ${article.excerpt} ${article.author} ${article.category}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && matchesFilter(article, activeFilter);
  });

  return (
    <div>
      <div className="grid gap-4 rounded-[22px] border border-[#e4e4e4] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#222] lg:grid-cols-[1fr_auto] lg:items-center">
        <label className="flex min-h-16 items-center gap-3 rounded-2xl border border-[#d7dce8] px-5 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15">
          <Search size={24} className="text-[#7427b3]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, tools, trends..."
            className="w-full bg-transparent text-lg outline-none placeholder:text-[#777] dark:text-white"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-base font-black transition ${
                activeFilter === filter
                  ? "bg-[#7427b3] text-white"
                  : "bg-[#f1e8f8] text-[#7427b3] hover:bg-[#e6d6f2]"
              }`}
            >
              {filter === activeFilter ? <SlidersHorizontal size={16} /> : null}
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {visibleArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="group overflow-hidden rounded-[22px] border border-[#e4e4e4] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.09)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.13)] dark:border-white/10 dark:bg-[#222]"
          >
            <div
              className="h-56 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${article.image})` }}
            />
            <div className="p-7">
              <div className="flex flex-wrap items-center gap-3 text-base">
                <span className="rounded-full bg-[#f1e8f8] px-4 py-2 font-black text-[#7427b3]">
                  {article.level}
                </span>
                <span className="font-semibold text-[#707070] dark:text-white/55">
                  {article.readTime}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-black leading-tight">
                {article.title}
              </h3>
              <p className="mt-4 text-lg leading-8 text-[#707070] dark:text-white/65">
                {article.excerpt}
              </p>
              <div className="mt-7 flex items-center justify-between gap-4 text-base">
                <span className="font-black">{article.author}</span>
                <span className="text-[#707070] dark:text-white/55">{article.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleArticles.length === 0 ? (
        <div className="mt-10 rounded-[22px] border border-dashed border-[#cfd7e6] p-10 text-center text-xl text-[#707070] dark:border-white/15 dark:text-white/65">
          No content matched your search. Try a different keyword or filter.
        </div>
      ) : null}
    </div>
  );
}
