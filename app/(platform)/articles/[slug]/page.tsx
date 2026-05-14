import { Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import CommentForm from "@/components/CommentForm";
import { featuredArticles } from "@/lib/content";
import {
  estimateReadTime,
  formatArticleDate,
  getArticleBySlug,
} from "@/lib/articles";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const fallback = featuredArticles.find((item) => item.slug === slug);

  if (!article && !fallback) {
    notFound();
  }

  const title = article?.title ?? fallback?.title ?? "";
  const excerpt = article?.excerpt ?? fallback?.excerpt ?? "";
  const content =
    article?.content ??
    "This article preview is available from the design content. Once matching content is published in the database, this page renders the full article body, comments, author details, and media assets from Prisma.";
  const image = article?.coverImage ?? article?.media[0]?.url ?? fallback?.image;
  const author = article?.author.name ?? fallback?.author ?? "JMO Media";
  const date = article
    ? formatArticleDate(article.publishedAt ?? article.createdAt)
    : fallback?.date;
  const readTime = article ? estimateReadTime(article.content) : fallback?.readTime;
  const category = article?.category?.name ?? fallback?.category ?? "Article";

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <article>
        <section className="bg-[#7427b3] px-6 py-16 text-white md:px-10">
          <div className="mx-auto max-w-5xl">
            <Link href="/articles" className="text-sm font-semibold text-white/75">
              Back to articles
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-lg text-white/80">
              <span>{category}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-2">
                <Clock size={20} />
                {readTime}
              </span>
            </div>
            <h1 className="mt-7 text-5xl font-bold leading-tight md:text-7xl">
              {title}
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-white/85">
              {excerpt}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-lg text-white/80">
              <span>{author}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
        </section>

        {image ? (
          <div
            className="mx-auto mt-12 h-[420px] max-w-5xl rounded-2xl bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : null}

        <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
          <div className="space-y-6 text-xl leading-9 text-[#4f4f4f] dark:text-white/75">
            {content.split("\n").filter(Boolean).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>

      <section className="mx-auto max-w-5xl px-6 pb-20 md:px-10">
        <h2 className="text-3xl font-bold">Comments</h2>
        <div className="mt-6 space-y-4">
          {article?.comments.length ? (
            article.comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-2xl border border-[#e4e4e4] bg-white p-5 dark:border-white/10 dark:bg-[#222]"
              >
                <p className="font-bold">{comment.author.name ?? "Reader"}</p>
                <p className="mt-2 text-[#707070] dark:text-white/65">{comment.body}</p>
              </div>
            ))
          ) : (
            <p className="text-[#707070] dark:text-white/65">
              No comments yet. Be the first to join the conversation.
            </p>
          )}
        </div>
        <div className="mt-8">
          <CommentForm slug={slug} />
        </div>
      </section>
    </main>
  );
}
