import PlatformPage from "@/components/PlatformPage";

export default function AboutPage() {
  return (
    <PlatformPage
      eyebrow="About the platform"
      title="A focused media system for contributors, editors, and readers."
      description="JMO Media is shaped around a practical publishing workflow: users choose roles, contributors create content, editors publish, and readers engage through comments."
      apiLabel="GET /api/me"
      highlights={[
        "Role-aware accounts for readers, contributors, editors, and admins.",
        "Structured content models for articles, news, editorials, and media.",
        "Frontend routes are ready for the Figma visual layer and backend APIs.",
      ]}
    />
  );
}
