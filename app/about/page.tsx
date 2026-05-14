import {
  Award,
  Heart,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const stats = [
  { value: "500+", label: "Articles Published", tone: "purple" },
  { value: "10K+", label: "Community Members", tone: "gold" },
  { value: "7", label: "Development Areas", tone: "purple" },
  { value: "95%", label: "Satisfaction Rate", tone: "gold" },
];

const values = [
  {
    title: "Purpose-Driven",
    description: "We create content with clear intent to help people achieve meaningful growth and transformation.",
    icon: Target,
  },
  {
    title: "Community-Focused",
    description: "We build a supportive ecosystem where individuals learn, grow, and succeed together.",
    icon: Users,
  },
  {
    title: "Innovation",
    description: "We stay ahead with practical insights, modern tools, and forward-thinking strategies.",
    icon: Lightbulb,
  },
  {
    title: "Excellence",
    description: "We deliver high-quality, actionable content that respects attention and drives real results.",
    icon: TrendingUp,
  },
  {
    title: "Authenticity",
    description: "We value genuine, honest content that speaks clearly and supports intelligent action.",
    icon: Heart,
  },
  {
    title: "Impact",
    description: "We measure success by the positive change we help create in people's lives.",
    icon: Award,
  },
];

const approaches = [
  {
    title: "Leadership Development",
    description: "Build the skills to inspire, guide, and empower others effectively.",
    tone: "purple",
  },
  {
    title: "Professional & Business Development",
    description: "Advance your career and build successful business ventures.",
    tone: "gold",
  },
  {
    title: "Technological Development",
    description: "Stay current with digital innovation, AI, automation, and tech skills.",
    tone: "purple",
  },
  {
    title: "Financial Development",
    description: "Master wealth building, investing, and financial management strategies.",
    tone: "gold",
  },
  {
    title: "Educational Development",
    description: "Enhance learning strategies, knowledge acquisition, and self-directed growth.",
    tone: "purple",
  },
  {
    title: "Environmental Sustainability",
    description: "Learn sustainable practices for a better future and stronger communities.",
    tone: "gold",
  },
  {
    title: "Relationship Development",
    description: "Cultivate meaningful spiritual, social, and personal connections.",
    tone: "purple",
  },
];

function toneClass(tone: string) {
  return tone === "gold"
    ? "border-[#ead798] bg-[#fffaf0]"
    : "border-[#dec6f0] bg-[#f7f0fb]";
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />

      <section className="relative overflow-hidden bg-[#7427b3] px-6 py-24 text-center text-white md:px-10 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(223,187,53,0.28),transparent_30%),radial-gradient(circle_at_74%_58%,rgba(255,255,255,0.22),transparent_36%)] animate-jmo-soft-pulse" />
        <div className="relative mx-auto max-w-5xl animate-jmo-fade-up">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#dfbb35]">
            About JMO Media
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight md:text-7xl">
            Empowering holistic development through structured content.
          </h1>
          <p className="mx-auto mt-7 max-w-4xl text-2xl font-medium leading-10 text-white/90">
            We help people unlock growth across career, mindset, skills,
            relationships, financial literacy, technology, and impact.
          </p>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-14 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7427b3]">
              Our Mission
            </p>
            <h2 className="mt-5 text-5xl font-black">Content that turns development into daily practice.</h2>
            <div className="mt-8 space-y-7 text-2xl leading-10 text-[#707070] dark:text-white/65">
              <p>
                At JMO Media, we believe true success comes from holistic
                development across all areas of life. Our mission is to provide
                knowledge, tools, and community support that help people grow as
                leaders, professionals, and individuals.
              </p>
              <p>
                We curate and create content that addresses the complete
                spectrum of personal and professional development, from
                leadership and business acumen to financial literacy,
                technological skills, sustainability, and meaningful
                relationships.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`rounded-[22px] p-8 text-center ${toneClass(stat.tone)} dark:border-white/10 dark:bg-[#222]`}
              >
                <p className={stat.tone === "gold" ? "text-6xl font-black text-[#191919] dark:text-white" : "text-6xl font-black text-[#7427b3]"}>
                  {stat.value}
                </p>
                <p className="mt-4 text-xl text-[#707070] dark:text-white/65">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] px-6 py-24 dark:bg-[#222] md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="text-center">
            <h2 className="text-5xl font-black">Our Values</h2>
            <p className="mx-auto mt-7 max-w-4xl text-2xl leading-9 text-[#707070] dark:text-white/65">
              The principles that guide every piece of content we create and
              every experience we design.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-[22px] border border-[#e4e4e4] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#191919]"
                >
                  <span className="grid size-20 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
                    <Icon size={36} />
                  </span>
                  <h3 className="mt-8 text-3xl font-black">{value.title}</h3>
                  <p className="mt-5 text-xl leading-8 text-[#707070] dark:text-white/65">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1408px]">
          <div className="text-center">
            <h2 className="text-5xl font-black">Holistic Development Approach</h2>
            <p className="mx-auto mt-7 max-w-4xl text-2xl leading-9 text-[#707070] dark:text-white/65">
              We cover seven key development areas to support a complete growth
              journey.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {approaches.map((area, index) => (
              <Link
                key={area.title}
                href={`/development-areas/${area.title.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-")}`}
                className={`rounded-[22px] border p-9 transition hover:-translate-y-1 hover:shadow-xl ${
                  index === approaches.length - 1 ? "lg:col-span-2" : ""
                } ${toneClass(area.tone)} dark:border-white/10 dark:bg-[#222]`}
              >
                <h3 className="text-3xl font-black">{area.title}</h3>
                <p className="mt-5 text-xl leading-8 text-[#707070] dark:text-white/65">
                  {area.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#7427b3] px-6 py-24 text-center text-white md:px-10">
        <h2 className="text-5xl font-black">Join Our Community</h2>
        <p className="mx-auto mt-7 max-w-4xl text-2xl leading-9 text-white/90">
          Be part of a growing community committed to holistic development and
          meaningful growth.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <Link
            href="/join"
            className="rounded-2xl bg-white px-12 py-5 text-xl font-black text-[#7427b3]"
          >
            Join Community
          </Link>
          <Link
            href="/development-areas"
            className="rounded-2xl border-2 border-white px-12 py-5 text-xl font-black text-white"
          >
            Explore Development Areas
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
