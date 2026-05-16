"use client";

import { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        token,
        password,
      }),
    });

    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setError(payload?.error ?? "Unable to reset password");
      return;
    }

    setMessage(payload?.message ?? "Password updated successfully.");
    setPassword("");
  }

  const missingToken = !email || !token;

  return (
    <main className="grid min-h-screen place-items-center bg-[#fbf9ff] px-6 py-12 text-[#080b19] dark:bg-[#0d0d12] dark:text-white md:px-10">
      <div className="w-full max-w-[620px] rounded-[28px] border border-[#ded7ea] bg-white p-8 shadow-[0_24px_80px_rgba(63,31,96,0.14)] dark:border-white/10 dark:bg-[#191919] md:p-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-base font-bold text-[#4f5d75] transition hover:text-[#7427b3] dark:text-white/70"
        >
          <ArrowLeft size={19} />
          Back to sign in
        </Link>

        <div className="mt-10 flex items-start gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
            <ShieldCheck size={29} />
          </span>
          <div>
            <h1 className="text-5xl font-black tracking-tight">Reset password</h1>
            <p className="mt-3 text-lg leading-8 text-[#4f5d75] dark:text-white/65">
              Choose a new password for {email || "your account"}.
            </p>
          </div>
        </div>

        {missingToken ? (
          <div className="mt-10 rounded-2xl bg-red-50 px-4 py-3 text-base font-semibold text-red-700">
            This reset link is incomplete. Request a new password reset link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <label className="block text-base font-bold text-[#111827] dark:text-white">
              New password
              <span className="mt-3 flex min-h-16 items-center gap-3 rounded-2xl border border-[#cfd7e6] bg-white px-4 transition focus-within:border-[#7427b3] focus-within:ring-4 focus-within:ring-[#7427b3]/10 dark:border-white/15 dark:bg-[#111]">
                <Lock size={22} className="text-[#7427b3]" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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

            {error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-base font-semibold text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-base text-emerald-800">
                <p className="font-semibold">{message}</p>
                <p className="mt-2 text-sm">
                  You can now{" "}
                  <Link href="/login" className="font-bold underline">
                    sign in
                  </Link>{" "}
                  with your new password.
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="min-h-16 w-full rounded-2xl bg-[#7427b3] px-5 text-xl font-black text-white shadow-[0_16px_34px_rgba(116,39,179,0.32)] transition hover:-translate-y-0.5 hover:bg-[#5d1f92] disabled:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Updating password..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
