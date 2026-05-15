import CardGrid from "@/components/CardGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublishedArticles, toArticlePreview } from "@/lib/articles";
import { featuredArticles, trendingPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getPublishedArticles(6);
  const dbPreviews = articles.map(toArticlePreview);
  const mergedArticles = [
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
    <main id="top">
      <Navbar />
      <CardGrid
        featured={mergedArticles.slice(0, 3)}
        trending={[...trendingPosts, ...mergedArticles.slice(3)].slice(0, 4)}
      />
      <Footer />
    </main>
  );
}
