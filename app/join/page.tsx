"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  Mail,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { developmentAreas } from "@/lib/content";

const benefits = [
  {
    title: "Exclusive Content",
    description: "Access premium articles, guides, and resources not available to the public.",
    icon: BookOpen,
  },
  {
    title: "Community Network",
    description: "Connect with like-minded individuals and build valuable relationships.",
    icon: Users,
  },
  {
    title: "Early Access",
    description: "Be the first to know about new content, courses, and ecosystem updates.",
    icon: Sparkles,
  },
  {
    title: "Growth Tools",
    description: "Access special tools, templates, and frameworks for accelerated development.",
    icon: TrendingUp,
  },
];

export default function JoinPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const interests = form.getAll("interests").map(String);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          interests,
        }),
      });

      const body = await response.json().catch(() => null);
      setLoading(false);

      if (!response.ok) {
        setError(body?.error ?? "Unable to join the community");
        return;
      }

      event.currentTarget.reset();
      setMessage(body?.message ?? "You are in. We saved your community preferences.");
    } catch {
      setLoading(false);
      setError("Unable to join the community right now. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#191919] dark:bg-[#191919] dark:text-white">
      <Navbar showHero={false} />

      <section className="relative isolate overflow-hidden bg-[#7427b3] px-6 py-24 text-center text-white md:px-10 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_28%_22%,rgba(223,187,53,0.34),transparent_28%),radial-gradient(circle_at_74%_58%,rgba(255,255,255,0.24),transparent_34%)] animate-jmo-soft-pulse" />
        <div className="mx-auto max-w-5xl animate-jmo-fade-up">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#dfbb35]">
            JMO Community
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight md:text-7xl">
            Join the JMO Community
          </h1>
          <p className="mx-auto mt-7 max-w-4xl text-2xl font-medium leading-10 text-white/92">
            Get exclusive access to premium content, resources, and a network of
            growth-minded individuals.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1408px] gap-14 lg:grid-cols-[0.92fr_1fr] lg:items-start">
          <div className="animate-jmo-fade-up">
            <h2 className="text-5xl font-black tracking-tight">Member Benefits</h2>
            <div className="mt-12 space-y-10">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div key={benefit.title} className="flex gap-6">
                    <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
                      <Icon size={36} />
                    </span>
                    <div>
                      <h3 className="text-3xl font-black">{benefit.title}</h3>
                      <p className="mt-4 max-w-2xl text-2xl leading-9 text-[#707070] dark:text-white/65">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-14 rounded-2xl border border-[#ead798] bg-[#fffaf0] p-8 text-2xl leading-9 text-[#707070] dark:border-[#dfbb35]/30 dark:bg-[#dfbb35]/10 dark:text-white/70">
              <strong className="text-[#191919] dark:text-white">100% Free</strong> - No
              credit card required. Join thousands of members already
              transforming their lives.
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="animate-jmo-fade-up rounded-[28px] border border-[#dedede] bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#222] md:p-12"
          >
            <h2 className="text-4xl font-black tracking-tight">Create Your Account</h2>

            <div className="mt-10 space-y-7">
              <label className="block text-xl font-black">
                Full Name
                <span className="mt-3 flex min-h-20 items-center gap-4 rounded-2xl border border-[#d8d8d8] bg-white px-6 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                  <User size={25} className="text-[#7427b3]" />
                  <input
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    placeholder="John Doe"
                    className="w-full bg-transparent text-2xl text-[#191919] outline-none placeholder:text-[#777] dark:text-white"
                  />
                </span>
              </label>

              <label className="block text-xl font-black">
                Email Address
                <span className="mt-3 flex min-h-20 items-center gap-4 rounded-2xl border border-[#d8d8d8] bg-white px-6 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                  <Mail size={25} className="text-[#7427b3]" />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="w-full bg-transparent text-2xl text-[#191919] outline-none placeholder:text-[#777] dark:text-white"
                  />
                </span>
              </label>

              <fieldset>
                <legend className="text-xl font-black">
                  Areas of Interest (select all that apply)
                </legend>
                <div className="mt-5 grid gap-4">
                  {developmentAreas.map((area) => (
                    <label
                      key={area.slug}
                      className="group flex cursor-pointer items-center gap-4 text-xl font-bold"
                    >
                      <input
                        type="checkbox"
                        name="interests"
                        value={area.title}
                        className="peer sr-only"
                      />
                      <span className="grid size-9 place-items-center rounded-md border-2 border-[#777] bg-white text-transparent transition peer-checked:border-[#7427b3] peer-checked:bg-[#7427b3] peer-checked:text-white dark:bg-[#111]">
                        <Check size={22} strokeWidth={3} />
                      </span>
                      <span className="transition group-hover:text-[#7427b3]">
                        {area.title}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {message ? (
              <p className="mt-7 rounded-2xl bg-emerald-50 px-5 py-4 text-lg font-bold text-emerald-700">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="mt-7 rounded-2xl bg-red-50 px-5 py-4 text-lg font-bold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-10 inline-flex min-h-20 w-full items-center justify-center gap-3 rounded-2xl bg-[#7427b3] px-8 text-2xl font-black text-white shadow-[0_16px_34px_rgba(116,39,179,0.28)] transition hover:-translate-y-0.5 hover:bg-[#5d1f92] disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Joining..." : "Join the Community"}
              <ArrowRight size={28} />
            </button>

            <p className="mt-8 text-center text-lg leading-8 text-[#707070] dark:text-white/65">
              By joining, you agree to receive emails from JMO Media. You can
              unsubscribe at any time.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
