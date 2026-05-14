import CardGrid from "@/components/CardGrid";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublishedArticles, toArticlePreview } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getPublishedArticles(6);
  const previews = articles.map(toArticlePreview);

  return (
    <main>
      <Navbar />
      <CardGrid featured={previews.slice(0, 2)} trending={previews.slice(2, 4)} />
      <Footer />
    </main>
  );
}
