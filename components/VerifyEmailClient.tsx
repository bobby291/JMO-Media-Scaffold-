"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";

type VerifyState = "idle" | "verifying" | "verified" | "error";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>(token ? "verifying" : "idle");
  const [message, setMessage] = useState(
    token
      ? "Verifying your email address."
      : "We prepared an email verification step for your account.",
  );
  const [devLink, setDevLink] = useState(() =>
    typeof window !== "undefined" ? window.sessionStorage.getItem("jmo-email-verify-url") || "" : "",
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      return;
    }

    let cancelled = false;

    async function verify() {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });

      const payload = await response.json().catch(() => null);

      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setState("error");
        setMessage(payload?.error ?? "Unable to verify this email link.");
        return;
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("jmo-email-verify-url");
      }

      setState("verified");
      setMessage("Your email has been verified. You can sign in now.");
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [email, token]);

  async function handleResend() {
    setBusy(true);
    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json().catch(() => null);
    setBusy(false);

    if (!response.ok) {
      setState("error");
      setMessage(payload?.error ?? "Unable to prepare a verification link.");
      return;
    }

    if (payload?.verificationUrl && typeof window !== "undefined") {
      window.sessionStorage.setItem("jmo-email-verify-url", payload.verificationUrl);
      setDevLink(payload.verificationUrl);
    }

    setState("idle");
    setMessage("A fresh verification step has been prepared for your email.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9ff] px-6 py-12 text-[#080b19] dark:bg-[#0d0d12] dark:text-white">
      <div className="w-full max-w-[640px] rounded-[28px] border border-[#ded7ea] bg-white p-8 shadow-[0_24px_80px_rgba(63,31,96,0.14)] dark:border-white/10 dark:bg-[#191919] md:p-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-base font-bold text-[#4f5d75] transition hover:text-[#7427b3] dark:text-white/70"
        >
          <ArrowLeft size={19} />
          Back to sign in
        </Link>

        <div className="mt-10 flex items-start gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#f1e8f8] text-[#7427b3]">
            {state === "verified" ? <CheckCircle2 size={28} /> : <MailCheck size={28} />}
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#7427b3]">
              Email verification
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              {state === "verified" ? "Email confirmed" : "Verify your email"}
            </h1>
            <p className="mt-4 text-lg leading-8 text-[#4f5d75] dark:text-white/65">{message}</p>
            {email ? (
              <p className="mt-3 text-sm font-semibold text-[#7427b3]">{email}</p>
            ) : null}
          </div>
        </div>

        {state === "verifying" ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#f8f4fc] px-5 py-4 text-[#7427b3]">
            <Loader2 className="animate-spin" size={20} />
            Processing verification link...
          </div>
        ) : null}

        {state !== "verified" ? (
          <div className="mt-8 space-y-4">
            {email ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={busy}
                className="min-h-14 w-full rounded-2xl bg-[#7427b3] px-5 text-lg font-black text-white disabled:opacity-60"
              >
                {busy ? "Preparing verification..." : "Resend verification"}
              </button>
            ) : null}

            {devLink ? (
              <a
                href={devLink}
                className="block rounded-2xl border border-[#7427b3] px-5 py-4 text-center text-base font-bold text-[#7427b3]"
              >
                Open development verification link
              </a>
            ) : null}
          </div>
        ) : (
          <Link
            href="/login"
            className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-[#7427b3] px-5 text-lg font-black text-white"
          >
            Continue to sign in
          </Link>
        )}
      </div>
    </main>
  );
}
