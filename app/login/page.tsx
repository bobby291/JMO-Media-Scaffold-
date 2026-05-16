"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    window.location.href = result?.url ?? "/dashboard";
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-[#fbf9ff] text-[#080b19] dark:bg-[#0d0d12] dark:text-white lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative hidden overflow-hidden px-12 py-12 lg:block">
        <div className="absolute inset-0 bg-[#7427b3]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_28%,rgba(223,187,53,0.34),transparent_28%),radial-gradient(circle_at_66%_58%,rgba(255,255,255,0.30),transparent_34%)] animate-jmo-soft-pulse" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full border border-white/20" />
        <div className="absolute right-16 top-24 size-24 rounded-[28px] border border-white/20 bg-white/10 backdrop-blur animate-jmo-float" />

        <Link href="/" className="relative z-10 flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-[16px] bg-white text-xl font-black text-[#7427b3] shadow-lg">
            JMO
          </span>
          <span className="text-2xl font-bold text-white">JMO Media</span>
        </Link>

        <div className="relative z-10 mt-32 max-w-2xl animate-jmo-fade-up">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#dfbb35]">
            Welcome back
          </p>
          <h1 className="mt-7 text-6xl font-black leading-[1.05] text-white xl:text-7xl">
            Continue shaping the newsroom.
          </h1>
          <p className="mt-8 max-w-xl text-2xl leading-10 text-white/90">
            Sign in to access your role-based workspace, publish stories if you
            are an editor, or manage the platform if you are an admin.
          </p>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_16%,rgba(116,39,179,0.16),transparent_34%),radial-gradient(circle_at_82%_86%,rgba(223,187,53,0.18),transparent_30%)]" />
        <div className="relative w-full max-w-[560px] animate-jmo-fade-up rounded-[28px] border border-[#ded7ea] bg-white p-8 shadow-[0_24px_80px_rgba(63,31,96,0.14)] dark:border-white/10 dark:bg-[#191919] md:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-bold text-[#4f5d75] transition hover:text-[#7427b3] dark:text-white/70"
          >
            <ArrowLeft size={19} />
            Back to home
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
              <ShieldCheck size={29} />
            </span>
            <div>
              <h2 className="text-5xl font-black tracking-tight">Sign in</h2>
              <p className="mt-2 text-lg text-[#4f5d75] dark:text-white/65">
                Access your JMO Media workspace.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <label className="block text-base font-bold text-[#111827] dark:text-white">
              Email
              <span className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-[#cfd7e6] bg-white px-4 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                <Mail size={22} className="text-[#7427b3]" />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="editor@jmomedia.com"
                  className="w-full bg-transparent py-4 text-lg text-[#080b19] outline-none placeholder:text-[#68758a] dark:text-white"
                />
              </span>
            </label>

            <label className="block text-base font-bold text-[#111827] dark:text-white">
              Password
              <span className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-[#cfd7e6] bg-white px-4 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                <Lock size={22} className="text-[#7427b3]" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  className="w-full bg-transparent py-4 text-lg text-[#080b19] outline-none placeholder:text-[#68758a] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="grid size-10 place-items-center rounded-xl text-[#4f5d75] transition hover:bg-[#f1e8f8] hover:text-[#7427b3] dark:text-white/70"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
                </button>
              </span>
            </label>

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-base font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="min-h-16 w-full rounded-2xl bg-[#7427b3] px-5 text-xl font-black text-white shadow-[0_16px_34px_rgba(116,39,179,0.32)] transition hover:-translate-y-0.5 hover:bg-[#5d1f92] disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-lg text-[#4f5d75] dark:text-white/65">
            Need platform access?{" "}
            <Link href="/signup" className="font-black text-[#080b19] hover:text-[#7427b3] dark:text-white">
              Create staff account
            </Link>
          </p>
          <p className="mt-3 text-base text-[#68758a] dark:text-white/55">
            Looking for community membership?{" "}
            <Link href="/join" className="font-bold text-[#7427b3]">
              Join the community
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
