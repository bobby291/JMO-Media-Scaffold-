export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Article Detail</h1>
      <p className="mt-4 text-neutral-600">
        Placeholder detail route for <code>{slug}</code>. Use
        <code className="mx-1 rounded bg-neutral-100 px-1">
          GET /api/articles/{slug}
        </code>
        for content and comments.
      </p>
    </main>
  );
}
