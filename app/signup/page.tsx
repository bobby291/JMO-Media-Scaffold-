"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const roles = [
  { value: "READER", label: "Reader" },
  { value: "CONTRIBUTOR", label: "Contributor" },
  { value: "EDITOR", label: "Editor" },
  { value: "ADMIN", label: "Admin" },
];

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email,
        password,
        role: form.get("role"),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setLoading(false);
      setError(body?.error ?? "Unable to create account");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    setLoading(false);
    window.location.href = result?.url ?? "/dashboard";
  }

  return (
    <main className="grid min-h-screen bg-[#fbf9ff] text-slate-950 lg:grid-cols-[0.85fr_1fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white/80 p-8 shadow-xl shadow-indigo-900/5 backdrop-blur">
          <Link href="/" className="mb-8 inline-flex text-sm font-semibold text-slate-600">
            Back to home
          </Link>
          <h1 className="text-3xl font-semibold">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Choose a role and join the publishing workflow.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <label className="block text-sm font-medium">
              Name
              <input
                name="name"
                required
                minLength={2}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
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
                minLength={8}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block text-sm font-medium">
              Role
              <select
                name="role"
                defaultValue="READER"
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-slate-950">
              Login
            </Link>
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden px-12 py-10 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_35%,rgba(99,75,255,0.50),rgba(219,126,214,0.28)_30%,rgba(255,255,255,0)_62%)]" />
        <div className="relative z-10 ml-auto max-w-xl pt-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
            Join JMO Media
          </p>
          <h2 className="mt-5 text-6xl font-semibold leading-tight text-white">
            Build stories with clear publishing roles.
          </h2>
          <p className="mt-6 text-lg leading-8 text-white/90">
            Readers comment, contributors draft, editors publish, and admins
            manage the platform.
          </p>
        </div>
      </section>
    </main>
  );
}
