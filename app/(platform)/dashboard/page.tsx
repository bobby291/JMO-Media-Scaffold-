import PlatformPage from "@/components/PlatformPage";

export default function DashboardPage() {
  return (
    <PlatformPage
      eyebrow="Editorial dashboard"
      title="Create, review, and publish content with clear role rules."
      description="The dashboard route gives frontend developers a destination for contributor, editor, and admin workflows while the backend enforces access control."
      apiLabel="POST /api/articles"
      highlights={[
        "Contributors can create drafts and review submissions.",
        "Editors and admins can publish stories.",
        "Owners, editors, and admins can update or delete article records.",
      ]}
    />
  );
}
