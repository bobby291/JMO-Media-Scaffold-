import Link from "next/link";

import BrandLogo from "@/components/BrandLogo";

type PlatformPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  apiLabel: string;
  apiHref?: string;
  highlights: string[];
};

export default function PlatformPage({
  eyebrow,
  title,
  description,
  apiLabel,
  apiHref = "/articles",
  highlights,
}: PlatformPageProps) {
  return (
    <main className="min-h-screen bg-[#fbf9ff] text-slate-950">
      <section className="relative isolate overflow-hidden px-5 py-10 md:px-12 lg:px-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(99,75,255,0.28),rgba(219,126,214,0.18)_28%,rgba(255,255,255,0)_58%)]" />
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <BrandLogo size={40} textClassName="font-semibold" className="flex items-center gap-3" />
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-slate-600 hover:text-slate-950">
              Sign in
            </Link>
            <Link href="/join" className="rounded-md bg-indigo-600 px-4 py-2 text-white">
              Join
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-10 pb-20 pt-20 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
              {eyebrow}
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-tight md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={apiHref}
                className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Browse articles
              </Link>
              <Link
                href="/dashboard"
                className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold"
              >
                Open dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/70 bg-white/50 p-6 shadow-xl shadow-indigo-900/5 backdrop-blur">
            <p className="text-sm font-semibold text-indigo-600">Backend source</p>
            <code className="mt-3 block rounded-md bg-slate-950 px-4 py-3 text-sm text-white">
              {apiLabel}
            </code>
            <div className="mt-6 space-y-3">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex gap-3 text-sm text-slate-700">
                  <span className="mt-1 size-2 rounded-full bg-rose-500" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
