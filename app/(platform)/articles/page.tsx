import PlatformPage from "@/components/PlatformPage";

export default function ArticlesPage() {
  return (
    <PlatformPage
      eyebrow="Articles"
      title="Browse published stories from the JMO Media platform."
      description="The article index is ready for frontend integration with the published-content API and can be filtered by status, author, or content type."
      apiLabel="GET /api/articles"
      highlights={[
        "Returns published content by default.",
        "Supports query filters for status, type, and author.",
        "Includes author, category, media, and comment count data.",
      ]}
    />
  );
}
