"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12.24 10.285v3.821h5.445c-.24 1.284-.96 2.373-2.045 3.1l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.48 0-.72-.065-1.415-.185-2.1H12.24Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.745 0 5.05-.905 6.735-2.445l-3.3-2.56c-.915.615-2.085.985-3.435.985-2.645 0-4.885-1.785-5.685-4.185l-3.41 2.63C4.575 19.74 8.01 22 12 22Z"
      />
      <path
        fill="#4A90E2"
        d="M6.315 13.795A5.997 5.997 0 0 1 6 12c0-.625.11-1.23.315-1.795l-3.41-2.63A9.995 9.995 0 0 0 2 12c0 1.615.385 3.14 1.065 4.425l3.25-2.52Z"
      />
      <path
        fill="#FBBC05"
        d="M12 6.02c1.495 0 2.84.515 3.9 1.525l2.925-2.925C17.045 2.96 14.74 2 12 2 8.01 2 4.575 4.26 3.065 7.575l3.41 2.63C7.115 7.805 9.355 6.02 12 6.02Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.1h2.7l.4-3.1h-3.1V7.9c0-.9.2-1.5 1.5-1.5H17V3.6c-.4-.1-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.1H7.8v3.1h2.7V21h3Z" />
    </svg>
  );
}

const providerMeta = {
  google: {
    label: "Continue with Google",
    icon: <GoogleIcon />,
  },
  facebook: {
    label: "Continue with Facebook",
    icon: <FacebookIcon />,
  },
} as const;

export default function SocialAuthButtons() {
  const [providers, setProviders] = useState<ProviderMap>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getProviders().then((result) => {
      if (mounted) {
        setProviders(result);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const availableProviders = Object.entries(providers ?? {}).filter(
    ([id, provider]) => provider.type === "oauth" && (id === "google" || id === "facebook"),
  );

  if (availableProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {availableProviders.map(([id]) => {
        const meta = providerMeta[id as keyof typeof providerMeta];

        return (
          <button
            key={id}
            type="button"
            onClick={async () => {
              setActiveProvider(id);
              await signIn(id, {
                callbackUrl: `${window.location.origin}/dashboard`,
              });
            }}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl border border-[#cfd7e6] bg-white px-5 text-lg font-bold text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-[#7427b3]/30 hover:bg-[#faf7ff] dark:border-white/15 dark:bg-[#111] dark:text-white dark:hover:bg-white/5"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#1877F2]">
              {meta.icon}
            </span>
            <span>{activeProvider === id ? "Redirecting..." : meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
