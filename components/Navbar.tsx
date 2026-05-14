"use client";

import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/development-areas", label: "Development Areas" },
  { href: "/about", label: "About" },
];

export default function Navbar({ showHero = true }: { showHero?: boolean }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 bg-white text-[#191919] shadow-[0_1px_10px_rgba(0,0,0,0.08)] dark:bg-[#191919] dark:text-white">
      <nav className="mx-auto flex h-24 max-w-[1408px] items-center justify-between px-6 md:px-9 lg:px-12">
        <Link href="/" className="flex items-center gap-4" aria-label="JMO Media home">
          <span className="grid size-14 place-items-center rounded-[14px] bg-[#7427b3] text-xl font-bold text-white shadow-sm">
            JMO
          </span>
          <span className="text-2xl font-semibold tracking-tight md:text-3xl">
            JMO Media
          </span>
        </Link>

        <div className="hidden items-center gap-10 text-lg font-medium lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-2 py-1 transition hover:text-[#7427b3] dark:hover:text-white ${
                isActive(link.href)
                  ? "font-bold text-[#7427b3]"
                  : "text-[#222] dark:text-white/75"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/join"
          className="hidden rounded-[14px] bg-[#7427b3] px-8 py-4 text-lg font-medium text-white shadow-sm transition hover:bg-[#5d1f92] lg:inline-flex"
        >
          Join Community
        </Link>

        <button
          className="grid size-11 place-items-center rounded-lg border border-slate-200 lg:hidden dark:border-white/15"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white text-xl font-medium dark:bg-[#191919] lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={isActive(link.href) ? "font-bold text-[#7427b3]" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setMenuOpen(false)}
            className="rounded-xl bg-[#7427b3] px-6 py-3 text-white"
          >
            Join Community
          </Link>
          <button
            className="mt-4 grid size-11 place-items-center rounded-lg bg-slate-100"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
      )}

      {showHero ? (
      <section className="relative overflow-hidden bg-[#7427b3] px-6 py-24 text-center text-white md:px-10 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(223,187,53,0.28),transparent_30%),radial-gradient(circle_at_72%_60%,rgba(255,255,255,0.22),transparent_36%)] animate-jmo-soft-pulse" />
        <div className="relative mx-auto max-w-[1180px] animate-jmo-fade-up">
          <Link
            href="/development-areas"
            className="mx-auto inline-flex items-center gap-3 rounded-full bg-white/15 px-6 py-3 text-base font-medium text-white"
          >
            <Sparkles size={22} />
            Empowering Your Journey
          </Link>

          <h1 className="mx-auto mt-12 max-w-5xl text-5xl font-bold leading-[1.08] tracking-normal md:text-7xl lg:text-8xl">
            Grow, Learn, and Build Your Future
          </h1>

          <p className="mx-auto mt-9 max-w-4xl text-xl leading-9 text-white/90 md:text-2xl">
            Content designed to develop your career, mindset, skills, and impact
          </p>

          <div className="mt-14 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/articles"
              className="inline-flex items-center justify-center gap-4 rounded-[14px] bg-white px-9 py-5 text-lg font-semibold text-[#7427b3] transition hover:bg-white/90"
            >
              Explore Articles
              <ArrowRight size={24} />
            </Link>
            <Link
              href="/join"
              className="inline-flex items-center justify-center rounded-[14px] bg-[#dfbb35] px-9 py-5 text-lg font-semibold text-[#161616] transition hover:bg-[#cfa820]"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
      ) : null}
    </header>
  );
}
