import PlatformPage from "@/components/PlatformPage";

export default function MediaPage() {
  return (
    <PlatformPage
      eyebrow="Media"
      title="Rich media posts for visual, audio, video, and embedded stories."
      description="Media posts can attach typed assets with captions, alt text, and article relationships so the frontend can build immersive layouts."
      apiLabel="GET /api/articles?type=MEDIA"
      highlights={[
        "Media assets support image, video, audio, document, and embed types.",
        "Captions and alt text are part of the backend model.",
        "Comments and publishing permissions work the same as written articles.",
      ]}
    />
  );
}
