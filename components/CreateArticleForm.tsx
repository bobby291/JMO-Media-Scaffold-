"use client";

import React from "react";
import { useRouter } from "next/navigation";

import MarkdownEditor from "@/components/MarkdownEditor";

type CategoryOption = {
  id: string;
  name: string;
};

const articleTypes = [
  { value: "ARTICLE", label: "Article" },
  { value: "NEWS", label: "News" },
  { value: "EDITORIAL", label: "Editorial" },
  { value: "MEDIA", label: "Media" },
];

function getApiErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Unable to create article";
  }

  const error = "error" in payload && typeof payload.error === "string" ? payload.error : "";
  const details =
    "details" in payload && payload.details && typeof payload.details === "object"
      ? payload.details
      : null;
  const fieldErrors =
    details && "fieldErrors" in details && details.fieldErrors && typeof details.fieldErrors === "object"
      ? details.fieldErrors
      : null;

  if (fieldErrors) {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (Array.isArray(messages) && typeof messages[0] === "string") {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        return `${label}: ${messages[0]}`;
      }
    }
  }

  return error || "Unable to create article";
}

export default function CreateArticleForm({
  categories = [],
}: {
  categories?: CategoryOption[];
}) {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        excerpt: form.get("excerpt"),
        content: form.get("content"),
        coverImage: form.get("coverImage") || undefined,
        type: form.get("type"),
        status: form.get("status"),
        categoryId: form.get("categoryId") || undefined,
      }),
    });

    setLoading(false);

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setError(getApiErrorMessage(payload));
      return;
    }

    setSuccess("Article saved successfully.");
    event.currentTarget.reset();
    setContent("");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#e4e4e4] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#222]"
    >
      <h2 className="text-2xl font-bold">Create content</h2>
      <p className="mt-2 text-[#707070] dark:text-white/65">
        This form posts directly to <code>/api/articles</code> and persists the
        record in Neon through Prisma.
      </p>

      <div className="mt-6 grid gap-4">
        <label className="block font-semibold">
          Title
          <input
            name="title"
            required
            minLength={4}
            className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
          />
        </label>

        <label className="block font-semibold">
          Excerpt
          <textarea
            name="excerpt"
            maxLength={500}
            className="mt-2 min-h-24 w-full resize-none rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
          />
          <span className="mt-2 block text-xs font-medium text-[#707070] dark:text-white/55">
            Optional summary, up to 500 characters.
          </span>
        </label>

        <MarkdownEditor
          label="Content"
          name="content"
          value={content}
          onChange={setContent}
          required
          minLength={20}
          placeholder="Write the article body here. Use the toolbar to format headings, lists, quotes, and links."
        />

        <label className="block font-semibold">
          Cover image URL
          <input
            name="coverImage"
            type="url"
            className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-semibold">
            Category
            <select
              name="categoryId"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block font-semibold">
            Type
            <select
              name="type"
              defaultValue="ARTICLE"
              className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
            >
              {articleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-semibold sm:col-start-2">
            Status
            <select
              name="status"
              defaultValue="DRAFT"
              className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
            >
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}

      <button
        disabled={loading}
        className="mt-6 rounded-xl bg-[#7427b3] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save article"}
      </button>
    </form>
  );
}
