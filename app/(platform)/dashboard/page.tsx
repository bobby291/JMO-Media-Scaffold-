import Link from "next/link";

import { auth } from "@/auth";
import CreateArticleForm from "@/components/CreateArticleForm";
import { getPublishedArticles } from "@/lib/articles";
import { canWrite } from "@/lib/auth/roles";

export default async function DashboardPage() {
  const session = await auth();
  const recentArticles = await getPublishedArticles(8);

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <section className="bg-[#7427b3] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/75">
            Editorial dashboard
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-tight md:text-7xl">
            Connect frontend actions to backend publishing.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-white/85">
            Sign in with a contributor, editor, or admin role to create content
            through the Prisma-backed API.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1408px] gap-8 px-6 py-16 lg:grid-cols-[1fr_0.85fr] md:px-10">
        <div>
          {!session?.user ? (
            <div className="rounded-2xl border border-[#e4e4e4] bg-white p-8 dark:border-white/10 dark:bg-[#222]">
              <h2 className="text-2xl font-bold">Authentication required</h2>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Login or create an account to publish articles, media, news, and
                editorials.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/login" className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white">
                  Login
                </Link>
                <Link href="/signup" className="rounded-xl border border-[#7427b3] px-5 py-3 font-semibold text-[#7427b3]">
                  Sign up
                </Link>
              </div>
            </div>
          ) : canWrite(session.user.role) ? (
            <CreateArticleForm />
          ) : (
            <div className="rounded-2xl border border-[#e4e4e4] bg-white p-8 dark:border-white/10 dark:bg-[#222]">
              <h2 className="text-2xl font-bold">Reader access</h2>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Your current role is <strong>{session.user.role}</strong>. Choose
                contributor, editor, or admin during signup to create content.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-[#e4e4e4] bg-white p-6 dark:border-white/10 dark:bg-[#222]">
          <h2 className="text-2xl font-bold">Published articles</h2>
          <div className="mt-5 space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="block rounded-xl border border-[#e4e4e4] p-4 transition hover:border-[#7427b3] dark:border-white/10"
                >
                  <p className="font-bold">{article.title}</p>
                  <p className="mt-1 text-sm text-[#707070] dark:text-white/60">
                    {article.type} • {article.status}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-[#707070] dark:text-white/65">
                No published database articles yet.
              </p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
