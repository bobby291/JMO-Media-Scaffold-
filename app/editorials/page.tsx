export default function EditorialsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Editorials</h1>
      <p className="mt-4 text-neutral-600">
        Placeholder route. Fetch published editorials from
        <code className="mx-1 rounded bg-neutral-100 px-1">
          /api/articles?type=EDITORIAL
        </code>
        .
      </p>
    </main>
  );
}
