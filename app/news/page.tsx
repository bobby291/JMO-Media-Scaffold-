import PlatformPage from "@/components/PlatformPage";

export default function NewsPage() {
  return (
    <PlatformPage
      eyebrow="News"
      title="Fast updates for current stories and newsroom coverage."
      description="The news section is wired to published article records with type filtering, author data, categories, media assets, and comment counts."
      apiLabel="GET /api/articles?type=NEWS"
      highlights={[
        "Published news is filtered through the article API.",
        "Drafts remain hidden unless the user owns or manages the article.",
        "Each story supports cover media, category metadata, and comments.",
      ]}
    />
  );
}
