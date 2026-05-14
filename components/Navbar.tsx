"use client";

import Link from "next/link";
import React from "react";

const navLinks = [
  { href: "/news", label: "News" },
  { href: "/editorials", label: "Editorials" },
  { href: "/media", label: "Media" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
];

const quickActions = [
  "Breaking news",
  "Editorial review",
  "Photo essay",
  "Community story",
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [pitch, setPitch] = React.useState("");

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = pitch.trim()
      ? `?pitch=${encodeURIComponent(pitch.trim())}`
      : "";

    window.location.href = `/signup${query}`;
  };

  return (
    <section className="relative isolate min-h-[820px] overflow-hidden bg-[#fbf9ff] text-slate-950">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_42%,rgba(99,75,255,0.54),rgba(219,126,214,0.30)_28%,rgba(255,255,255,0)_58%),linear-gradient(115deg,#fff_0%,#f4fbf7_24%,#f9eef6_51%,#eef7ff_76%,#fff_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-64 bg-white/50 blur-3xl" />

      <nav className="relative z-50 flex w-full items-center justify-between border-b border-slate-900/15 px-5 py-5 text-slate-900 backdrop-blur md:px-12 lg:px-24">
        <Link href="/" className="flex items-center gap-3" aria-label="JMO Media home">
          <span className="grid size-10 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-lg shadow-slate-900/20">
            J
          </span>
          <span className="text-lg font-semibold tracking-tight">JMO Media</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-md border border-indigo-500 px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Get started
          </Link>
        </div>

        <button
          className="grid size-11 place-items-center rounded-md border border-slate-200 bg-white text-slate-950 shadow-sm md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-slate-950/90 text-lg font-medium text-white backdrop-blur md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)}>
            Sign in
          </Link>
          <Link href="/signup" onClick={() => setMenuOpen(false)}>
            Get started
          </Link>
          <button
            className="mt-4 grid size-11 place-items-center rounded-md bg-white text-slate-950"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-24 pt-24 text-center md:pt-28">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full border border-slate-950/45 bg-white/20 p-1 pr-4 text-sm font-medium text-white shadow-sm backdrop-blur"
        >
          <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            New
          </span>
          Editorial workspace is live
          <span aria-hidden="true">›</span>
        </Link>

        <h1 className="mt-10 max-w-5xl text-5xl font-semibold leading-[1.08] tracking-normal text-white drop-shadow-sm md:text-7xl">
          Publish media stories that move culture forward.
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-white/90">
          JMO Media brings news, editorials, rich media, comments, and role-based
          publishing into one focused newsroom platform.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="mt-12 w-full max-w-3xl rounded-xl border-4 border-indigo-500/80 bg-white/20 p-4 text-left shadow-2xl shadow-indigo-700/10 backdrop-blur-md"
        >
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            className="min-h-32 w-full resize-none bg-transparent p-3 text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Pitch a story, editorial, media post, or newsroom idea..."
            aria-label="Story pitch"
          />
          <div className="flex flex-col gap-4 border-t border-white/30 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <span
                  key={action}
                  className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {action}
                </span>
              ))}
            </div>
            <button className="rounded-md bg-gradient-to-r from-rose-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-700/20">
              Start publishing
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Navbar;
