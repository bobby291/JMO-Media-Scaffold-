import PlatformPage from "@/components/PlatformPage";

export default function EditorialsPage() {
  return (
    <PlatformPage
      eyebrow="Editorials"
      title="Opinion, analysis, and reviewed publishing in one workflow."
      description="Editorial content uses the same publishing engine as articles while preserving its own content type for frontend filtering and presentation."
      apiLabel="GET /api/articles?type=EDITORIAL"
      highlights={[
        "Editors and admins create and manage editorial pieces.",
        "Editors and admins can publish approved stories.",
        "The frontend renders editorials from the shared article model with type-specific filtering.",
      ]}
    />
  );
}
