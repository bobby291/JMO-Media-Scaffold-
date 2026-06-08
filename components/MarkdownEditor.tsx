"use client";

import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import React from "react";

type MarkdownEditorProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  rows?: number;
};

type EditorAction = {
  label: string;
  title: string;
  icon: React.ReactNode;
  apply: (selected: string) => { text: string; startOffset?: number; endOffset?: number };
};

const actions: EditorAction[] = [
  {
    label: "Bold",
    title: "Bold",
    icon: <Bold size={16} />,
    apply: (selected) => ({ text: `**${selected || "Bold text"}**`, startOffset: 2, endOffset: selected ? 2 : -2 }),
  },
  {
    label: "Italic",
    title: "Italic",
    icon: <Italic size={16} />,
    apply: (selected) => ({ text: `*${selected || "Italic text"}*`, startOffset: 1, endOffset: selected ? 1 : -1 }),
  },
  {
    label: "Heading 1",
    title: "Heading 1",
    icon: <Heading1 size={16} />,
    apply: (selected) => ({ text: `# ${selected || "Heading"}` }),
  },
  {
    label: "Heading 2",
    title: "Heading 2",
    icon: <Heading2 size={16} />,
    apply: (selected) => ({ text: `## ${selected || "Subheading"}` }),
  },
  {
    label: "Bulleted list",
    title: "Bulleted list",
    icon: <List size={16} />,
    apply: (selected) => {
      const text = selected
        ? selected
            .split("\n")
            .filter(Boolean)
            .map((line) => `- ${line.replace(/^[-*]\s+/, "")}`)
            .join("\n")
        : "- List item";
      return { text };
    },
  },
  {
    label: "Numbered list",
    title: "Numbered list",
    icon: <ListOrdered size={16} />,
    apply: (selected) => {
      const text = selected
        ? selected
            .split("\n")
            .filter(Boolean)
            .map((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s+/, "")}`)
            .join("\n")
        : "1. First item\n2. Second item";
      return { text };
    },
  },
  {
    label: "Quote",
    title: "Quote",
    icon: <Quote size={16} />,
    apply: (selected) => ({
      text: selected
        ? selected
            .split("\n")
            .filter(Boolean)
            .map((line) => `> ${line.replace(/^>\s+/, "")}`)
            .join("\n")
        : "> Quote",
    }),
  },
  {
    label: "Link",
    title: "Link",
    icon: <Link2 size={16} />,
    apply: (selected) => ({
      text: `[${selected || "Link text"}](https://example.com)`,
      startOffset: 1,
      endOffset: selected ? 21 : -21,
    }),
  },
];

export default function MarkdownEditor({
  label,
  name,
  value,
  onChange,
  required,
  minLength,
  placeholder,
  rows = 12,
}: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  function applyAction(action: EditorAction) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const { text, startOffset = text.length, endOffset = text.length } = action.apply(selectedText);
    const nextValue = `${before}${text}${after}`;

    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const nextStart = selectionStart + startOffset;
      const nextEnd =
        endOffset >= 0 ? selectionStart + text.length - endOffset : selectionStart + text.length + endOffset;
      textarea.setSelectionRange(nextStart, Math.max(nextStart, nextEnd));
    });
  }

  return (
    <label className="block font-semibold">
      {label}
      <div className="mt-2 rounded-2xl border border-[#d7d7d7] bg-white dark:border-white/10 dark:bg-[#111]">
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ebe7f2] px-3 py-3 dark:border-white/10">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              title={action.title}
              aria-label={action.label}
              onClick={() => applyAction(action)}
              className="grid size-10 place-items-center rounded-xl border border-[#ece6f7] text-[#7427b3] transition hover:bg-[#f3ecfa] dark:border-white/10 dark:hover:bg-white/10"
            >
              {action.icon}
            </button>
          ))}
          <span className="ml-auto text-xs font-medium uppercase tracking-[0.16em] text-[#8c78a7]">
            Markdown enabled
          </span>
        </div>

        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={minLength}
          rows={rows}
          placeholder={placeholder}
          className="min-h-56 w-full resize-y rounded-b-2xl bg-transparent px-4 py-4 outline-none focus:border-[#7427b3] dark:text-white"
        />
      </div>
      <p className="mt-2 text-sm font-medium text-[#707070] dark:text-white/55">
        Use the toolbar for headings, bold, italics, lists, quotes, and links.
      </p>
    </label>
  );
}
