import { ArrowRight } from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { developmentAreas, featuredArticles } from "@/lib/content";

const toneClasses = {
  purple: "bg-[#f1e8f8] text-[#7427b3]",
  gold: "bg-[#fbf6e7] text-[#caa225]",
  green: "bg-emerald-50 text-emerald-700",
  rose: "bg-rose-50 text-rose-600",
};

export default function DevelopmentAreasPage() {
  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />

      <section className="relative overflow-hidden bg-[#7427b3] px-6 py-24 text-center text-white md:px-10 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(223,187,53,0.28),transparent_30%),radial-gradient(circle_at_72%_58%,rgba(255,255,255,0.22),transparent_36%)] animate-jmo-soft-pulse" />
        <div className="relative mx-auto max-w-5xl animate-jmo-fade-up">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#dfbb35]">
            Development Areas
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight md:text-7xl">
            Explore structured paths for holistic growth.
          </h1>
          <p className="mx-auto mt-7 max-w-4xl text-2xl font-medium leading-10 text-white/90">
            Choose from seven development categories designed to strengthen your
            career, mindset, skills, relationships, and impact.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-8 md:grid-cols-2 xl:grid-cols-3">
          {developmentAreas.map((area) => {
            const Icon = area.icon;
            const count = featuredArticles.filter(
              (article) => article.area === area.title,
            ).length;

            return (
              <Link
                key={area.slug}
                href={`/development-areas/${area.slug}`}
                className="group rounded-[22px] border border-[#e4e4e4] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:border-[#7427b3]/35 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#222]"
              >
                <span
                  className={`grid size-20 place-items-center rounded-2xl ${
                    toneClasses[area.tone as keyof typeof toneClasses]
                  }`}
                >
                  <Icon size={36} />
                </span>
                <h2 className="mt-8 text-3xl font-black leading-tight">{area.title}</h2>
                <p className="mt-5 text-xl leading-8 text-[#707070] dark:text-white/65">
                  {area.description}
                </p>
                <div className="mt-9 flex items-center justify-between border-t border-[#ececec] pt-6 dark:border-white/10">
                  <span className="text-base font-bold text-[#707070] dark:text-white/55">
                    {count || 1}+ resources
                  </span>
                  <span className="inline-flex items-center gap-2 text-base font-black text-[#7427b3]">
                    Explore
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f7f7f7] px-6 py-24 text-center dark:bg-[#222] md:px-10">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-5xl font-black">Ready to Start Your Journey?</h2>
          <p className="mt-7 text-2xl leading-9 text-[#707070] dark:text-white/65">
            Join our community and get access to exclusive content, resources,
            and support across every development area.
          </p>
          <Link
            href="/join"
            className="mt-10 inline-flex rounded-2xl bg-[#7427b3] px-12 py-5 text-xl font-black text-white transition hover:-translate-y-0.5 hover:bg-[#5d1f92]"
          >
            Join Community
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
