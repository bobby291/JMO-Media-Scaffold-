"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import Link from "next/link";

import SocialAuthButtons from "@/components/SocialAuthButtons";

const roles = [
  {
    value: "CONTRIBUTOR",
    label: "Contributor",
    description: "Read, share, comment, and access a contributor profile inside the platform.",
    publicAccess: true,
  },
  {
    value: "EDITOR",
    label: "Editor",
    description: "Create, edit, post, and publish articles, news, editorials, and media content.",
    publicAccess: false,
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Manage platform operations, users, categories, and editorial activity.",
    publicAccess: false,
  },
];

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CONTRIBUTOR");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email,
        password: form.get("password"),
        role: selectedRole,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setLoading(false);
      setError(body?.error ?? "Unable to create account");
      return;
    }

    setLoading(false);
    const body = await response.json();

    if (body?.verificationUrl && typeof window !== "undefined") {
      window.sessionStorage.setItem("jmo-email-verify-url", body.verificationUrl);
    }

    window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-[#fbf9ff] text-[#080b19] dark:bg-[#0d0d12] dark:text-white lg:grid-cols-[0.98fr_1.02fr]">
      <section className="relative flex items-center justify-center px-6 py-12 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(116,39,179,0.14),transparent_32%),radial-gradient(circle_at_86%_80%,rgba(223,187,53,0.16),transparent_30%)]" />

        <div className="relative w-full max-w-[620px] animate-jmo-fade-up rounded-[28px] border border-[#ded7ea] bg-white p-8 shadow-[0_24px_80px_rgba(63,31,96,0.14)] dark:border-white/10 dark:bg-[#191919] md:p-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-bold text-[#4f5d75] transition hover:text-[#7427b3] dark:text-white/70"
          >
            <ArrowLeft size={19} />
            Back to home
          </Link>

          <div className="mt-10 flex items-start gap-4">
            <span className="grid size-14 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
              <Shield size={29} />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7427b3]">
                Platform access
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-tight">
                Create Platform Access Account
              </h1>
              <p className="mt-3 text-lg leading-8 text-[#4f5d75] dark:text-white/65">
                Public signup creates Contributor access. Editor and Admin roles are issued internally to approved business email accounts.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <SocialAuthButtons />
          </div>

          <div className="my-8 flex items-center gap-4 text-sm font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
            <span className="h-px flex-1 bg-[#d8deea]" />
            <span>Or create with email</span>
            <span className="h-px flex-1 bg-[#d8deea]" />
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <label className="block text-base font-bold text-[#111827] dark:text-white">
              Full name
              <span className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-[#cfd7e6] bg-white px-4 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                <User size={22} className="text-[#7427b3]" />
                <input
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                  placeholder="John Doe"
                  className="w-full bg-transparent py-4 text-lg text-[#080b19] outline-none placeholder:text-[#68758a] dark:text-white"
                />
              </span>
            </label>

            <label className="block text-base font-bold text-[#111827] dark:text-white">
              Email address
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
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
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

            <fieldset>
              <legend className="text-base font-bold text-[#111827] dark:text-white">
                Dashboard role
              </legend>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#68758a] dark:text-white/55">
                Public registration is limited to Contributor. Editorial and Admin access are assigned internally after verification.
              </p>
              <div className="mt-3 grid gap-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`rounded-2xl border p-4 transition ${
                      role.publicAccess ? "cursor-pointer hover:-translate-y-0.5" : "cursor-not-allowed opacity-70"
                    } ${
                      selectedRole === role.value
                        ? "border-[#7427b3] bg-[#f6effb] shadow-[0_10px_24px_rgba(116,39,179,0.12)] dark:bg-[#7427b3]/20"
                        : "border-[#d8deea] bg-white dark:border-white/15 dark:bg-[#111]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={selectedRole === role.value}
                      onChange={() => {
                        if (role.publicAccess) {
                          setSelectedRole(role.value);
                        }
                      }}
                      disabled={!role.publicAccess}
                      className="sr-only"
                    />
                    <span className="flex items-start gap-3">
                      <span className="mt-1 grid size-6 place-items-center rounded-full border-2 border-[#7427b3]">
                        {selectedRole === role.value ? (
                          <span className="size-3 rounded-full bg-[#7427b3]" />
                        ) : null}
                      </span>
                      <span>
                        <span className="flex flex-wrap items-center gap-2 text-lg font-black">
                          <span>{role.label}</span>
                          {!role.publicAccess ? (
                            <span className="rounded-full bg-[#f1e8f8] px-2.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#7427b3]">
                              Internal only
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block text-base leading-7 text-[#4f5d75] dark:text-white/65">
                          {role.description}
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

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
              {loading ? "Creating account..." : "Create dashboard account"}
            </button>
          </form>

          <p className="mt-8 text-lg text-[#4f5d75] dark:text-white/65">
            Already registered?{" "}
            <Link href="/login" className="font-black text-[#080b19] hover:text-[#7427b3] dark:text-white">
              Login
            </Link>
          </p>
          <p className="mt-3 text-base text-[#68758a] dark:text-white/55">
            Google and Facebook access will still create a Contributor account first.
          </p>
        </div>
      </section>

      <section className="relative hidden overflow-hidden px-12 py-12 lg:block">
        <div className="absolute inset-0 bg-[#7427b3]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_28%,rgba(223,187,53,0.32),transparent_30%),radial-gradient(circle_at_68%_62%,rgba(255,255,255,0.28),transparent_36%)] animate-jmo-soft-pulse" />
        <div className="absolute bottom-20 right-16 grid size-24 place-items-center rounded-[28px] border border-white/20 bg-white/10 text-white backdrop-blur animate-jmo-float">
          <BriefcaseBusiness size={42} />
        </div>

        <div className="relative z-10 ml-auto max-w-2xl pt-32 animate-jmo-fade-up">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-[#dfbb35]">
            Admin and editorial workflow
          </p>
          <h2 className="mt-7 text-6xl font-black leading-[1.05] text-white xl:text-7xl">
            Build stories with clear publishing roles.
          </h2>
          <p className="mt-8 text-2xl leading-10 text-white/90">
            Contributors follow, read, and share. Editors create and publish content.
            Admins manage the platform. Community members still join from the public page.
          </p>
        </div>
      </section>
    </main>
  );
}
