"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function CommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch(`/api/articles/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Unable to add comment");
      return;
    }

    setBody("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#e4e4e4] bg-white p-6 dark:border-white/10 dark:bg-[#222]">
      <label className="block text-lg font-bold">Add a comment</label>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        required
        minLength={2}
        className="mt-4 min-h-32 w-full resize-none rounded-xl border border-[#d7d7d7] p-4 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
        placeholder="Share your thoughts..."
      />
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <button
        disabled={loading}
        className="mt-4 rounded-xl bg-[#7427b3] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
