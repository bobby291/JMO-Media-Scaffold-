export default function NewsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">News</h1>
      <p className="mt-4 text-neutral-600">
        Placeholder route. Fetch published news from
        <code className="mx-1 rounded bg-neutral-100 px-1">/api/articles?type=NEWS</code>.
      </p>
    </main>
  );
}
