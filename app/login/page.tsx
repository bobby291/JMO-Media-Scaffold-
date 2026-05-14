"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="grid min-h-screen bg-[#fbf9ff] text-slate-950 lg:grid-cols-[1fr_0.85fr]">
      <section className="relative hidden overflow-hidden px-12 py-10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_34%,rgba(99,75,255,0.52),rgba(219,126,214,0.28)_30%,rgba(255,255,255,0)_62%)]" />
        <Link href="/" className="relative z-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-slate-950 text-sm font-bold text-white">
            J
          </span>
          <span className="font-semibold">JMO Media</span>
        </Link>
        <div className="relative z-10 mt-28 max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
            Welcome back
          </p>
          <h1 className="mt-5 text-6xl font-semibold leading-tight text-white">
            Continue shaping the newsroom.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/90">
            Sign in to manage drafts, publish stories, and join the media
            conversation.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white/80 p-8 shadow-xl shadow-indigo-900/5 backdrop-blur">
          <Link href="/" className="mb-8 inline-flex text-sm font-semibold text-slate-600">
            Back to home
          </Link>
          <h2 className="text-3xl font-semibold">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">
            Access your JMO Media workspace.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-slate-950">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
