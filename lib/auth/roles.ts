import type { Article, UserRole } from "@prisma/client";

const publishingRoles: UserRole[] = ["EDITOR", "ADMIN"];
const writingRoles: UserRole[] = ["CONTRIBUTOR", "EDITOR", "ADMIN"];

export function canWrite(role?: UserRole | null) {
  return Boolean(role && writingRoles.includes(role));
}

export function canPublish(role?: UserRole | null) {
  return Boolean(role && publishingRoles.includes(role));
}

export function canModerate(role?: UserRole | null) {
  return role === "EDITOR" || role === "ADMIN";
}

export function canManageArticle(
  user: { id: string; role: UserRole },
  article: Pick<Article, "authorId">,
) {
  return user.role === "ADMIN" || user.role === "EDITOR" || article.authorId === user.id;
}
