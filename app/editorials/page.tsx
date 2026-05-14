import PlatformPage from "@/components/PlatformPage";

export default function EditorialsPage() {
  return (
    <PlatformPage
      eyebrow="Editorials"
      title="Opinion, analysis, and reviewed publishing in one workflow."
      description="Editorial content uses the same publishing engine as articles while preserving its own content type for frontend filtering and presentation."
      apiLabel="GET /api/articles?type=EDITORIAL"
      highlights={[
        "Contributors can submit drafts or review-ready pieces.",
        "Editors and admins can publish approved stories.",
        "The frontend can render editorial pages from the shared article model.",
      ]}
    />
  );
}
