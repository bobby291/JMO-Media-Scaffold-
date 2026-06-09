import CardGrid from "@/components/CardGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getUnifiedPublishedArticlePreviews } from "@/lib/articles";
import { trendingPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const mergedArticles = await getUnifiedPublishedArticlePreviews(12);

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
