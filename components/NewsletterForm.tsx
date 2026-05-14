"use client";

import React from "react";

export default function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to subscribe");
      return;
    }

    setEmail("");
    setMessage("You are subscribed.");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-6 sm:flex-row"
    >
      <div className="w-full flex-1">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
          className="min-h-20 w-full rounded-[18px] bg-white px-8 text-2xl text-[#191919] outline-none placeholder:text-[#5b2d71]"
        />
        {message ? <p className="mt-3 text-left text-sm text-white">{message}</p> : null}
        {error ? <p className="mt-3 text-left text-sm text-[#ffdfdf]">{error}</p> : null}
      </div>
      <button
        disabled={loading}
        className="min-h-20 rounded-[18px] bg-[#dfbb35] px-14 text-2xl font-bold text-[#191919] disabled:opacity-70"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
