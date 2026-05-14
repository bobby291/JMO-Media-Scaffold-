import Link from "next/link";

import { developmentAreas } from "@/lib/content";

const toneClasses = {
  purple: "bg-[#f1e8f8] text-[#7427b3]",
  gold: "bg-[#fbf6e7] text-[#caa225]",
  green: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-600",
};

export default function DevelopmentAreasPage() {
  return (
    <main className="min-h-screen bg-white text-[#191919]">
      <nav className="mx-auto flex h-24 max-w-[1408px] items-center justify-between px-6 md:px-9 lg:px-12">
        <Link href="/" className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-[14px] bg-[#7427b3] text-xl font-bold text-white">
            JMO
          </span>
          <span className="text-2xl font-semibold tracking-tight md:text-3xl">
            JMO Media
          </span>
        </Link>
        <Link
          href="/join"
          className="rounded-[14px] bg-[#7427b3] px-6 py-3 font-medium text-white"
        >
          Join Community
        </Link>
      </nav>

      <section className="bg-[#7427b3] px-6 py-20 text-center text-white md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
          Development Areas
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Choose your path to growth.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-white/85">
          Explore holistic content across career, mindset, skills, community,
          sustainability, and personal impact.
        </p>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-7 md:grid-cols-2 xl:grid-cols-3">
          {developmentAreas.map((area) => {
            const Icon = area.icon;

            return (
              <Link
                key={area.slug}
                href={`/development-areas/${area.slug}`}
                className="rounded-2xl border border-[#e4e4e4] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#7427b3]/30 hover:shadow-xl"
              >
                <span
                  className={`grid size-20 place-items-center rounded-2xl ${
                    toneClasses[area.tone as keyof typeof toneClasses]
                  }`}
                >
                  <Icon size={34} />
                </span>
                <h2 className="mt-8 text-2xl font-bold leading-tight">{area.title}</h2>
                <p className="mt-5 text-lg leading-8 text-[#707070]">
                  {area.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
