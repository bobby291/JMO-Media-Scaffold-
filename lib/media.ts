import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";

import type { MediaType } from "@prisma/client";

import { hasBlobToken } from "@/lib/env";

const DRIVE_FILE_REGEX = /\/d\/([a-zA-Z0-9_-]+)/;
const DRIVE_OPEN_REGEX = /[?&]id=([a-zA-Z0-9_-]+)/;

export function inferMediaTypeFromMime(mimeType: string): MediaType {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (mimeType.startsWith("audio/")) return "AUDIO";
  return "DOCUMENT";
}

export function sanitizeFileName(fileName: string) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${base.replace(/^-+|-+$/g, "").slice(0, 60) || "asset"}${ext.toLowerCase()}`;
}

export async function saveUploadedFile(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const now = new Date();
  const folder = path.join(
    process.cwd(),
    "public",
    "uploads",
    `${now.getUTCFullYear()}`,
    `${String(now.getUTCMonth() + 1).padStart(2, "0")}`,
  );

  await mkdir(folder, { recursive: true });

  const fileName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const filePath = path.join(folder, fileName);
  await writeFile(filePath, bytes);

  const relativeUrl = `/uploads/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${fileName}`;

  return {
    url: relativeUrl,
    fileName: file.name,
    sizeBytes: file.size,
    mimeType: file.type,
  };
}

export async function persistUploadedFile(file: File) {
  if (hasBlobToken()) {
    const uploaded = await put(sanitizeFileName(file.name), file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      url: uploaded.url,
      fileName: file.name,
      sizeBytes: file.size,
      mimeType: file.type,
    };
  }

  return saveUploadedFile(file);
}

export async function deleteLocalMediaFile(url: string) {
  if (!url.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => undefined);
}

export function isBlobUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function deleteStoredMediaFile(url: string) {
  if (isBlobUrl(url) && hasBlobToken()) {
    await del(url).catch(() => undefined);
    return;
  }

  await deleteLocalMediaFile(url);
}

export function normalizeDriveUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("drive.google.com")) {
      return url;
    }

    const pathnameMatch = parsed.pathname.match(DRIVE_FILE_REGEX);
    const queryMatch = parsed.search.match(DRIVE_OPEN_REGEX);
    const fileId = pathnameMatch?.[1] ?? queryMatch?.[1];

    if (!fileId) {
      return url;
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch {
    return url;
  }
}
