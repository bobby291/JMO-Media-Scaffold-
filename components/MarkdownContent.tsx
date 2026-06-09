import Link from "next/link";
import React from "react";

type Segment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; label: string; url: string };

function parseInline(text: string): Segment[] {
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/g;
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const full = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    if (match[2]) {
      segments.push({ type: "bold", value: match[2] });
    } else if (match[3]) {
      segments.push({ type: "italic", value: match[3] });
    } else if (match[4]) {
      segments.push({ type: "code", value: match[4] });
    } else if (match[5] && match[6]) {
      segments.push({ type: "link", label: match[5], url: match[6] });
    } else {
      segments.push({ type: "text", value: full });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

function renderInline(text: string) {
  return parseInline(text).map((segment, index) => {
    if (segment.type === "bold") {
      return <strong key={index} className="font-bold text-[#191919] dark:text-white">{segment.value}</strong>;
    }

    if (segment.type === "italic") {
      return <em key={index} className="italic">{segment.value}</em>;
    }

    if (segment.type === "code") {
      return (
        <code
          key={index}
          className="rounded bg-[#f3ecfa] px-2 py-1 font-mono text-[0.92em] text-[#7427b3] dark:bg-white/10 dark:text-white"
        >
          {segment.value}
        </code>
      );
    }

    if (segment.type === "link") {
      return (
        <Link
          key={index}
          href={segment.url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#7427b3] underline underline-offset-4"
        >
          {segment.label}
        </Link>
      );
    }

    return <React.Fragment key={index}>{segment.value}</React.Fragment>;
  });
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "alignment"; align: "left" | "center" | "right"; content: string }
  | { type: "paragraph"; text: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    const alignment = trimmed.match(/^:::\s+align-(left|center|right)$/);
    if (alignment) {
      index += 1;
      const contentLines: string[] = [];
      while (index < lines.length && lines[index].trim() !== ":::") {
        contentLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length && lines[index].trim() === ":::") {
        index += 1;
      }
      blocks.push({
        type: "alignment",
        align: alignment[1] as "left" | "center" | "right",
        content: contentLines.join("\n").trim(),
      });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("> ")) {
        quoteLines.push(lines[index].trim().slice(2));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3})\s+/.test(lines[index].trim()) &&
      !lines[index].trim().startsWith("> ") &&
      !/^[-*]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function renderBlock(block: Block, index: number): React.ReactNode {
  if (block.type === "heading") {
    const headingClass =
      block.level === 1
        ? "text-4xl font-black leading-tight text-[#191919] dark:text-white"
        : block.level === 2
          ? "text-3xl font-bold text-[#191919] dark:text-white"
          : "text-2xl font-bold text-[#191919] dark:text-white";

    if (block.level === 1) {
      return <h1 key={index} className={headingClass}>{renderInline(block.text)}</h1>;
    }
    if (block.level === 2) {
      return <h2 key={index} className={headingClass}>{renderInline(block.text)}</h2>;
    }
    return <h3 key={index} className={headingClass}>{renderInline(block.text)}</h3>;
  }

  if (block.type === "blockquote") {
    return (
      <blockquote
        key={index}
        className="border-l-4 border-[#7427b3] py-2 pl-8 text-2xl italic leading-10 text-[#707070] dark:text-white/65"
      >
        {renderInline(block.text)}
      </blockquote>
    );
  }

  if (block.type === "ul") {
    return (
      <ul key={index} className="space-y-3 pl-0">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-4 size-2 rounded-full bg-[#7427b3]" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={index} className="space-y-3 pl-0">
        {block.items.map((item, itemIndex) => (
          <li key={`${itemIndex}-${item}`} className="flex gap-4">
            <span className="mt-1 inline-flex min-w-8 justify-center rounded-full bg-[#f1e8f8] px-2 py-1 text-base font-bold text-[#7427b3]">
              {itemIndex + 1}
            </span>
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "alignment") {
    const alignClass =
      block.align === "center"
        ? "text-center"
        : block.align === "right"
          ? "text-right"
          : "text-left";

    return (
      <div key={index} className={alignClass}>
        <div className="space-y-6">
          {parseBlocks(block.content).map((nestedBlock, nestedIndex) =>
            renderBlock(nestedBlock, nestedIndex),
          )}
        </div>
      </div>
    );
  }

  return <p key={index}>{renderInline(block.text)}</p>;
}

export default function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const blocks = parseBlocks(content);

  return (
    <div className={`space-y-6 text-xl leading-9 text-[#4f4f4f] dark:text-white/75 ${className}`}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
