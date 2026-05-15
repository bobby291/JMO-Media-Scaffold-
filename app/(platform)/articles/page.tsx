import ArticlesContentBrowser from "@/components/ArticlesContentBrowser";
import Footer from "@/components/Footer";
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
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          All Articles
        </h1>
        <p className="mx-auto mt-6 max-w-5xl text-xl leading-9 text-white/85 md:text-2xl">
          Explore our comprehensive library of articles across all development areas
        </p>
      </section>

      <section className="px-6 py-20 md:px-10">
        <ArticlesContentBrowser articles={articles} />
      </section>

      <Footer />
    </main>
  );
}
