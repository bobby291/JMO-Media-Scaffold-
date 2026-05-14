import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import CommentForm from "@/components/CommentForm";
import Navbar from "@/components/Navbar";
import { featuredArticles, type StaticArticle } from "@/lib/content";
import {
  estimateReadTime,
  formatArticleDate,
  getArticleBySlug,
} from "@/lib/articles";

function RelatedArticleCard({ article }: { article: StaticArticle }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="overflow-hidden rounded-[22px] border border-[#e1e1e1] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.16)] dark:border-white/10 dark:bg-[#222]"
    >
      <div
        className="h-[260px] bg-cover bg-center"
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
        <h3 className="mt-5 text-2xl font-bold leading-tight">{article.title}</h3>
        <p className="mt-4 text-lg leading-8 text-[#707070] dark:text-white/65">
          {article.excerpt}
        </p>
        <div className="mt-7 flex items-center justify-between gap-4 text-lg">
          <span className="font-bold">{article.author}</span>
          <span className="text-[#707070] dark:text-white/60">{article.date}</span>
        </div>
      </div>
    </Link>
  );
}

function ShareLinks({ title, slug }: { title: string; slug: string }) {
  const shareUrl = `/articles/${slug}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-8">
      <span className="text-lg font-bold text-[#191919] dark:text-white">Share:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Facebook"
        className="text-3xl font-bold text-[#191919] transition hover:text-[#7427b3] dark:text-white"
      >
        f
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
        className="text-2xl font-bold text-[#191919] transition hover:text-[#7427b3] dark:text-white"
      >
        X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
        className="text-2xl font-bold text-[#191919] transition hover:text-[#7427b3] dark:text-white"
      >
        in
      </a>
    </div>
  );
}

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
  const content = article?.content ?? "";
  const image = article?.coverImage ?? article?.media[0]?.url ?? fallback?.image;
  const author = article?.author.name ?? fallback?.author ?? "JMO Media";
  const date = article
    ? formatArticleDate(article.publishedAt ?? article.createdAt)
    : fallback?.date;
  const readTime = article ? estimateReadTime(article.content) : fallback?.readTime;
  const category = article?.category?.name ?? fallback?.area ?? "Article";
  const level = fallback?.level ?? "Published";
  const bodyParagraphs = content.split("\n").filter(Boolean);
  const relatedArticles = fallback?.relatedSlugs.length
    ? fallback.relatedSlugs
        .map((relatedSlug) =>
          featuredArticles.find((item) => item.slug === relatedSlug),
        )
        .filter(Boolean)
    : featuredArticles
        .filter((item) => item.slug !== slug && item.category === fallback?.category)
        .slice(0, 2);

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />
      <article>
        <section className="px-6 pb-12 pt-14 md:px-10">
          <div className="mx-auto max-w-[1260px]">
            <Link
              href="/articles"
              className="inline-flex items-center gap-3 text-xl font-medium text-[#707070] transition hover:text-[#7427b3] dark:text-white/65"
            >
              <ArrowLeft size={26} />
              Back to {category}
            </Link>

            <div className="mt-14 flex flex-wrap gap-4">
              <span className="rounded-full bg-[#f1e8f8] px-6 py-3 text-lg font-bold text-[#7427b3]">
                {category}
              </span>
              <span className="rounded-full bg-[#fbf6e7] px-6 py-3 text-lg font-bold text-[#191919]">
                {level}
              </span>
            </div>

            <h1 className="mt-8 max-w-[1120px] text-5xl font-bold leading-tight md:text-7xl">
              {title}
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-8 text-xl text-[#707070] dark:text-white/65">
              <span className="inline-flex items-center gap-3">
                <User size={24} />
                {author}
              </span>
              <span className="inline-flex items-center gap-3">
                <Calendar size={24} />
                {date}
              </span>
              <span className="inline-flex items-center gap-3">
                <Clock size={24} />
                {readTime}
              </span>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-8 border-b border-[#dedede] pb-12 dark:border-white/10">
              <ShareLinks title={title} slug={slug} />
              <button
                type="button"
                aria-label="Save article"
                className="rounded-full p-3 text-[#191919] transition hover:bg-[#f1e8f8] hover:text-[#7427b3] dark:text-white"
              >
                <Bookmark size={30} />
              </button>
            </div>
          </div>
        </section>

        {image ? (
          <div className="mx-auto max-w-[1260px] px-6 md:px-10">
            <div
              className="h-[360px] rounded-[22px] bg-cover bg-center shadow-sm md:h-[620px]"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ) : null}

        <section className="mx-auto max-w-[900px] px-6 py-16 md:px-10">
          {fallback ? (
            <div className="space-y-10 text-xl leading-9 text-[#191919] dark:text-white/80">
              <p className="text-2xl leading-10 text-[#707070] dark:text-white/65">
                {fallback.excerpt}
              </p>
              <p>{fallback.intro}</p>

              {fallback.sections.map((section, index) => (
                <div key={section.heading} className="space-y-5">
                  <h2 className="text-3xl font-bold text-[#191919] dark:text-white">
                    {section.heading}
                  </h2>
                  <p>{section.body}</p>
                  {index === 0 && fallback.quote ? (
                    <blockquote className="border-l-4 border-[#7427b3] py-2 pl-8 text-2xl italic leading-10 text-[#707070] dark:text-white/65">
                      {`"${fallback.quote}"`}
                    </blockquote>
                  ) : null}
                  {section.bullets ? (
                    <ul className="space-y-3 pl-0">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-4 size-2 rounded-full bg-[#7427b3]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 text-xl leading-9 text-[#4f4f4f] dark:text-white/75">
              {bodyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          )}
        </section>
      </article>

      <section className="mx-auto max-w-[1260px] px-6 pb-20 md:px-10">
        <div className="rounded-[22px] bg-[#f3f3f3] p-8 dark:bg-[#222] md:p-12">
          <div className="grid gap-8 md:grid-cols-[96px_1fr] md:items-center">
            <div className="grid size-24 place-items-center rounded-full bg-[#f1e8f8] text-[#7427b3]">
              <User size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">About {author}</h2>
              <p className="mt-4 text-xl leading-9 text-[#707070] dark:text-white/65">
                {fallback?.authorBio ??
                  article?.author.bio ??
                  `${author} contributes practical insight for the JMO Media community.`}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[22px] bg-[#7427b3] px-8 py-14 text-center text-white md:px-14">
          <h2 className="text-4xl font-bold">Ready to Take Action?</h2>
          <p className="mx-auto mt-7 max-w-4xl text-2xl leading-10 text-white/90">
            Join our community to access exclusive content, connect with
            like-minded individuals, and accelerate your growth journey.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Link
              href="/join"
              className="rounded-2xl bg-white px-12 py-5 text-xl font-bold text-[#7427b3]"
            >
              Join Community
            </Link>
            <Link
              href="/development-areas"
              className="rounded-2xl border-2 border-white px-12 py-5 text-xl font-bold text-white"
            >
              Explore JMO BIZHUB
            </Link>
          </div>
        </div>
      </section>

      {relatedArticles.length ? (
        <section className="bg-[#f7f7f7] px-6 py-20 dark:bg-[#222] md:px-10">
          <div className="mx-auto max-w-[1260px]">
            <h2 className="text-center text-5xl font-bold">Related Articles</h2>
            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {relatedArticles.map((related) => (
                <RelatedArticleCard key={related!.slug} article={related!} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-[900px] px-6 py-20 md:px-10">
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
