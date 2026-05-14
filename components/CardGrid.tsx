import Link from "next/link";

const features = [
  {
    href: "/news",
    eyebrow: "Newsroom",
    title: "Publish fast, structured news updates",
    copy: "Create timely stories with categories, cover media, publishing status, and author attribution ready for the backend API.",
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    href: "/editorials",
    eyebrow: "Editorial",
    title: "Move drafts through review and publish",
    copy: "Contributors can draft, while editors and admins control publishing for stronger content governance.",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop",
  },
  {
    href: "/media",
    eyebrow: "Media library",
    title: "Attach image, video, audio, and embeds",
    copy: "Media posts can carry rich assets and captions so frontend teams can build immersive story pages.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop",
  },
];

const stats = [
  { label: "Roles", value: "4" },
  { label: "Content types", value: "4" },
  { label: "API routes", value: "9+" },
];

const CardGrid = () => {
  return (
    <section className="bg-white px-5 py-20 text-slate-950 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
              Built for the MVP
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              A frontend ready to talk to the backend.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            The static demo links are now real platform routes. Frontend pages
            can consume articles, categories, comments, roles, and authenticated
            user state from the new APIs.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="h-56 bg-cover bg-center"
                style={{ backgroundImage: `url(${feature.image})` }}
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                  {feature.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-snug">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.copy}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-slate-950 group-hover:text-indigo-600">
                  Open section
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid gap-4 rounded-lg bg-slate-950 p-6 text-white md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="border-white/10 py-4 md:border-r md:last:border-r-0">
              <p className="text-4xl font-semibold">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardGrid;
