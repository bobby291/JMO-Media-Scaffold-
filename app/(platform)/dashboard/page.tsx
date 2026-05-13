export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Editorial Dashboard</h1>
      <p className="mt-4 text-neutral-600">
        Placeholder dashboard for contributors, editors, and admins. Create
        content with <code className="rounded bg-neutral-100 px-1">POST /api/articles</code>.
      </p>
    </main>
  );
}
