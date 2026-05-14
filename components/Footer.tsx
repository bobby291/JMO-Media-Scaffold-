import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/development-areas", label: "Development Areas" },
  { href: "/about", label: "About" },
  { href: "/signup", label: "Join Community" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 px-5 py-10 text-white md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-white text-sm font-bold text-slate-950">
              J
            </span>
            <span className="font-semibold">JMO Media</span>
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/60">
            Content designed to develop your career, mindset, skills, and impact.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
