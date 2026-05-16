"use client";

import type { ArticleStatus, ArticleType, MediaType, UserRole } from "@prisma/client";
import {
  Archive,
  BarChart3,
  CheckCircle2,
  Eye,
  Film,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  MessageSquareMore,
  PencilLine,
  Plus,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import CreateArticleForm from "@/components/CreateArticleForm";

type DashboardCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount?: number;
};

type DashboardUser = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
  bio: string | null;
  emailVerified?: string | null;
  createdAt: string;
  articleCount: number;
  commentCount: number;
};

type ModerationComment = {
  id: string;
  body: string;
  approved: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    role: UserRole;
  };
  article: {
    id: string;
    slug: string;
    title: string;
    status: ArticleStatus;
  };
};

type DashboardAnalytics = {
  totalUsers: number;
  totalCategories: number;
  pendingComments: number;
  publishedArticles: number;
  totalMediaAssets: number;
  articleStats: Array<{
    status: ArticleStatus;
    type: ArticleType;
    count: number;
  }>;
  userRoleStats: Array<{
    role: UserRole;
    count: number;
  }>;
};

type DashboardArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: ArticleStatus;
  type: ArticleType;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  authorId: string;
  categoryId: string | null;
  author: {
    id: string;
    name: string | null;
    role: UserRole;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  commentsCount: number;
};

type EditableArticle = Pick<
  DashboardArticle,
  "slug" | "title" | "excerpt" | "content" | "coverImage" | "type" | "status" | "categoryId"
>;

type DashboardMediaAsset = {
  id: string;
  articleId: string | null;
  type: MediaType;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  caption: string | null;
  altText: string | null;
  createdAt: string;
  updatedAt: string;
  article: {
    id: string;
    slug: string;
    title: string;
    status: ArticleStatus;
  } | null;
  uploadedBy: {
    id: string;
    name: string | null;
    role: UserRole;
  } | null;
};

type EditableMediaAsset = Pick<
  DashboardMediaAsset,
  "id" | "articleId" | "type" | "url" | "thumbnailUrl" | "title" | "caption" | "altText"
>;

type EditableManagedUser = Pick<
  DashboardUser,
  "id" | "name" | "bio" | "image" | "role" | "emailVerified" | "email"
>;

const statusOptions: ArticleStatus[] = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"];
const typeOptions: ArticleType[] = ["ARTICLE", "NEWS", "EDITORIAL", "MEDIA"];
const mediaTypeOptions: MediaType[] = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "EMBED"];
const mediaSourceOptions = ["URL", "UPLOAD", "DRIVE"] as const;

function formatDate(input?: string | null) {
  if (!input) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

function formatDateTime(input: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(input));
}

function isVerified(timestamp?: string | null) {
  return Boolean(timestamp);
}

function statusTone(status: ArticleStatus) {
  if (status === "PUBLISHED") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "REVIEW") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "ARCHIVED") {
    return "bg-slate-100 text-slate-600";
  }

  return "bg-[#f1e8f8] text-[#7427b3]";
}

function roleSummary(role: UserRole) {
  if (role === "ADMIN") {
    return "Full platform management, publishing control, and workflow access.";
  }

  if (role === "EDITOR") {
    return "Create, edit, review, and publish platform content.";
  }

  if (role === "CONTRIBUTOR") {
    return "Read, share, comment, and maintain a contributor profile.";
  }

  return "Read-only access across the platform.";
}

export default function DashboardControlPanel({
  user,
  articles,
  categories,
  managedUsers,
  moderationComments,
  analytics,
  mediaAssets,
}: {
  user: DashboardUser;
  articles: DashboardArticle[];
  categories: DashboardCategory[];
  managedUsers: DashboardUser[];
  moderationComments: ModerationComment[];
  analytics: DashboardAnalytics;
  mediaAssets: DashboardMediaAsset[];
}) {
  const router = useRouter();
  const [items, setItems] = React.useState(articles);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | ArticleStatus>("ALL");
  const [typeFilter, setTypeFilter] = React.useState<"ALL" | ArticleType>("ALL");
  const [activeArticle, setActiveArticle] = React.useState<EditableArticle | null>(null);
  const [actionError, setActionError] = React.useState("");
  const [actionNotice, setActionNotice] = React.useState("");
  const [busyKey, setBusyKey] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [categoryDescription, setCategoryDescription] = React.useState("");
  const [categoryState, setCategoryState] = React.useState<{
    error: string;
    success: string;
    loading: boolean;
  }>({
    error: "",
    success: "",
    loading: false,
  });
  const [users, setUsers] = React.useState(managedUsers);
  const [comments, setComments] = React.useState(moderationComments);
  const [media, setMedia] = React.useState(mediaAssets);
  const [userQuery, setUserQuery] = React.useState("");
  const [commentFilter, setCommentFilter] = React.useState<"ALL" | "PENDING" | "APPROVED">(
    "PENDING",
  );
  const [mediaQuery, setMediaQuery] = React.useState("");
  const [mediaTypeFilter, setMediaTypeFilter] = React.useState<"ALL" | MediaType>("ALL");
  const [activeMedia, setActiveMedia] = React.useState<EditableMediaAsset | null>(null);
  const [activeManagedUser, setActiveManagedUser] = React.useState<EditableManagedUser | null>(
    null,
  );
  const [profileForm, setProfileForm] = React.useState({
    name: user.name ?? "",
    bio: user.bio ?? "",
    image: user.image ?? "",
    currentPassword: "",
    newPassword: "",
  });
  const [mediaForm, setMediaForm] = React.useState({
    type: "IMAGE" as MediaType,
    url: "",
    thumbnailUrl: "",
    title: "",
    caption: "",
    altText: "",
    articleId: "",
  });
  const [mediaSource, setMediaSource] = React.useState<(typeof mediaSourceOptions)[number]>("URL");
  const [driveUrl, setDriveUrl] = React.useState("");
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);

  const canEdit = user.role === "EDITOR" || user.role === "ADMIN";
  const isAdmin = user.role === "ADMIN";

  const stats = React.useMemo(
    () => ({
      total: items.length,
      published: items.filter((item) => item.status === "PUBLISHED").length,
      review: items.filter((item) => item.status === "REVIEW").length,
      drafts: items.filter((item) => item.status === "DRAFT").length,
    }),
    [items],
  );

  const visibleArticles = React.useMemo(() => {
    return items.filter((article) => {
      const searchable = `${article.title} ${article.excerpt ?? ""} ${
        article.author.name ?? ""
      } ${article.type} ${article.status}`.toLowerCase();

      const matchesQuery = searchable.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || article.status === statusFilter;
      const matchesType = typeFilter === "ALL" || article.type === typeFilter;

      return matchesQuery && matchesStatus && matchesType;
    });
  }, [items, query, statusFilter, typeFilter]);

  const visibleUsers = React.useMemo(() => {
    return users.filter((managedUser) => {
      const searchable = `${managedUser.name ?? ""} ${managedUser.email} ${managedUser.role}`.toLowerCase();
      return searchable.includes(userQuery.toLowerCase());
    });
  }, [users, userQuery]);

  const visibleComments = React.useMemo(() => {
    return comments.filter((comment) => {
      if (commentFilter === "PENDING") {
        return !comment.approved;
      }

      if (commentFilter === "APPROVED") {
        return comment.approved;
      }

      return true;
    });
  }, [comments, commentFilter]);

  const visibleMedia = React.useMemo(() => {
    return media.filter((asset) => {
      const searchable = `${asset.title ?? ""} ${asset.caption ?? ""} ${asset.type} ${
        asset.article?.title ?? ""
      } ${asset.uploadedBy?.name ?? ""}`.toLowerCase();
      const matchesQuery = searchable.includes(mediaQuery.toLowerCase());
      const matchesType = mediaTypeFilter === "ALL" || asset.type === mediaTypeFilter;
      return matchesQuery && matchesType;
    });
  }, [media, mediaQuery, mediaTypeFilter]);

  async function handleStatusChange(article: DashboardArticle, status: ArticleStatus) {
    setActionError("");
    setActionNotice("");
    setBusyKey(`status:${article.slug}:${status}`);

    const response = await fetch(`/api/articles/${article.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update article status");
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.slug === article.slug
          ? {
              ...item,
              ...payload.article,
              createdAt: payload.article.createdAt,
              updatedAt: payload.article.updatedAt,
              publishedAt: payload.article.publishedAt,
              commentsCount: payload.article._count?.comments ?? item.commentsCount,
            }
          : item,
      ),
    );
    setActionNotice(`Updated "${article.title}" to ${status.toLowerCase()}.`);
  }

  async function handleDelete(article: DashboardArticle) {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`delete:${article.slug}`);

    const response = await fetch(`/api/articles/${article.slug}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to delete article");
      return;
    }

    setItems((current) => current.filter((item) => item.slug !== article.slug));
    setActionNotice(`Deleted "${article.title}".`);
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeArticle) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`edit:${activeArticle.slug}`);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/articles/${activeArticle.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        excerpt: form.get("excerpt") || undefined,
        content: form.get("content"),
        coverImage: form.get("coverImage") || undefined,
        type: form.get("type"),
        status: form.get("status"),
        categoryId: form.get("categoryId") || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update article");
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.slug === activeArticle.slug
          ? {
              ...item,
              ...payload.article,
              createdAt: payload.article.createdAt,
              updatedAt: payload.article.updatedAt,
              publishedAt: payload.article.publishedAt,
              commentsCount: payload.article._count?.comments ?? item.commentsCount,
            }
          : item,
      ),
    );
    setActiveArticle(null);
    setActionNotice(`Saved changes to "${payload.article.title}".`);
    router.refresh();
  }

  async function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCategoryState({ error: "", success: "", loading: true });

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setCategoryState({
        error: payload?.error ?? "Unable to create category",
        success: "",
        loading: false,
      });
      return;
    }

    setCategoryName("");
    setCategoryDescription("");
    setCategoryState({
      error: "",
      success: `Created ${payload.category.name}.`,
      loading: false,
    });
    router.refresh();
  }

  async function handleUserRoleChange(userId: string, role: UserRole) {
    setActionError("");
    setActionNotice("");
    setBusyKey(`user:${userId}:${role}`);

    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update user role");
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === userId
          ? {
              ...item,
              role: payload.user.role,
              bio: payload.user.bio,
              name: payload.user.name,
              image: payload.user.image,
              emailVerified: payload.user.emailVerified,
            }
          : item,
      ),
    );
    setActionNotice(`Updated ${payload.user.email} to ${payload.user.role}.`);
  }

  async function handleCommentApproval(commentId: string, approved: boolean) {
    setActionError("");
    setActionNotice("");
    setBusyKey(`comment:${commentId}:${approved ? "approve" : "unapprove"}`);

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update comment");
      return;
    }

    setComments((current) =>
      current.map((item) =>
        item.id === commentId ? { ...item, approved: payload.comment.approved } : item,
      ),
    );
    setActionNotice(
      approved ? "Comment approved and visible publicly." : "Comment moved back to moderation.",
    );
  }

  async function handleCommentDelete(commentId: string) {
    if (!window.confirm("Delete this comment?")) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`comment-delete:${commentId}`);

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to delete comment");
      return;
    }

    setComments((current) => current.filter((item) => item.id !== commentId));
    setActionNotice("Comment deleted.");
  }

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setActionError("");
    setActionNotice("");
    setBusyKey("profile:update");

    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: profileForm.name,
        bio: profileForm.bio || undefined,
        image: profileForm.image || undefined,
        currentPassword: profileForm.currentPassword || undefined,
        newPassword: profileForm.newPassword || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update your profile");
      return;
    }

    setProfileForm((current) => ({
      ...current,
      name: payload.user.name ?? "",
      bio: payload.user.bio ?? "",
      image: payload.user.image ?? "",
      currentPassword: "",
      newPassword: "",
    }));
    setActionNotice("Your profile settings were updated.");
    router.refresh();
  }

  async function handleCreateMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setActionError("");
    setActionNotice("");
    setBusyKey("media:create");

    const response =
      mediaSource === "UPLOAD"
        ? await (() => {
            const formData = new FormData();
            if (uploadFile) {
              formData.set("file", uploadFile);
            }
            formData.set("type", mediaForm.type);
            formData.set("title", mediaForm.title);
            formData.set("caption", mediaForm.caption);
            formData.set("altText", mediaForm.altText);
            formData.set("thumbnailUrl", mediaForm.thumbnailUrl);
            formData.set("articleId", mediaForm.articleId);

            return fetch("/api/media/upload", {
              method: "POST",
              body: formData,
            });
          })()
        : await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: mediaForm.type,
              url: mediaSource === "DRIVE" ? driveUrl : mediaForm.url,
              thumbnailUrl: mediaForm.thumbnailUrl || undefined,
              title: mediaForm.title || undefined,
              caption: mediaForm.caption || undefined,
              altText: mediaForm.altText || undefined,
              articleId: mediaForm.articleId || undefined,
            }),
          });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to create media asset");
      return;
    }

    setMedia((current) => [
      {
        ...payload.media,
        createdAt: payload.media.createdAt,
        updatedAt: payload.media.updatedAt,
      },
      ...current,
    ]);
    setMediaForm({
      type: "IMAGE",
      url: "",
      thumbnailUrl: "",
      title: "",
      caption: "",
      altText: "",
      articleId: "",
    });
    setDriveUrl("");
    setUploadFile(null);
    setActionNotice("Media asset added to the library.");
    router.refresh();
  }

  async function handleMediaUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeMedia) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`media:edit:${activeMedia.id}`);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/media/${activeMedia.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: form.get("type"),
        url: form.get("url"),
        thumbnailUrl: form.get("thumbnailUrl") || undefined,
        title: form.get("title") || undefined,
        caption: form.get("caption") || undefined,
        altText: form.get("altText") || undefined,
        articleId: form.get("articleId") || undefined,
      }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update media asset");
      return;
    }

    setMedia((current) =>
      current.map((item) => (item.id === activeMedia.id ? payload.media : item)),
    );
    setActiveMedia(null);
    setActionNotice("Media asset updated.");
    router.refresh();
  }

  async function handleMediaDelete(id: string) {
    if (!window.confirm("Delete this media asset?")) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`media:delete:${id}`);

    const response = await fetch(`/api/media/${id}`, {
      method: "DELETE",
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to delete media asset");
      return;
    }

    setMedia((current) => current.filter((item) => item.id !== id));
    setActionNotice("Media asset deleted.");
  }

  async function handleManagedUserUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeManagedUser) {
      return;
    }

    setActionError("");
    setActionNotice("");
    setBusyKey(`user:edit:${activeManagedUser.id}`);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/users/${activeManagedUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        bio: form.get("bio") || undefined,
        image: form.get("image") || undefined,
        role: form.get("role"),
        emailVerified: form.get("emailVerified") === "on",
      }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to update user");
      return;
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === activeManagedUser.id
          ? {
              ...item,
              name: payload.user.name,
              bio: payload.user.bio,
              image: payload.user.image,
              role: payload.user.role,
              emailVerified: payload.user.emailVerified,
            }
          : item,
      ),
    );
    setActiveManagedUser(null);
    setActionNotice(`Updated ${payload.user.email}.`);
    router.refresh();
  }

  async function handleResendVerification(email: string) {
    setActionError("");
    setActionNotice("");
    setBusyKey(`verify:${email}`);

    const response = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const payload = await response.json().catch(() => null);
    setBusyKey("");

    if (!response.ok) {
      setActionError(payload?.error ?? "Unable to prepare verification email");
      return;
    }

    if (payload?.verificationUrl && typeof window !== "undefined") {
      window.sessionStorage.setItem("jmo-email-verify-url", payload.verificationUrl);
    }

    setActionNotice(
      payload?.verificationUrl
        ? `Verification prepared for ${email}. Open the verification screen to continue.`
        : `Verification prepared for ${email}.`,
    );
  }

  return (
    <section className="mx-auto max-w-[1408px] px-6 py-16 md:px-10">
      <div className="grid gap-8 xl:grid-cols-[0.84fr_1.16fr]">
        <div className="space-y-8">
          <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7427b3]">
                  Profile panel
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  {user.name ?? "JMO Media user"}
                </h2>
                <p className="mt-2 text-base text-[#707070] dark:text-white/65">
                  {user.email}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f1e8f8] px-4 py-2 text-sm font-black text-[#7427b3]">
                    {user.role}
                  </span>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      isVerified(user.emailVerified)
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isVerified(user.emailVerified) ? "Email verified" : "Verification pending"}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-6 text-lg leading-8 text-[#525252] dark:text-white/70">
              {user.bio || roleSummary(user.role)}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f8f4fc] p-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7427b3]">
                  Articles
                </p>
                <p className="mt-3 text-3xl font-black">{user.articleCount}</p>
              </div>
              <div className="rounded-2xl bg-[#fbf6e7] p-5">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b98f07]">
                  Comments
                </p>
                <p className="mt-3 text-3xl font-black">{user.commentCount}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#ececec] p-5 dark:border-white/10">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#707070] dark:text-white/55">
                Access summary
              </p>
              <ul className="mt-4 space-y-3 text-base text-[#525252] dark:text-white/70">
                <li className="flex items-center gap-3">
                  <Shield size={18} className="text-[#7427b3]" />
                  {roleSummary(user.role)}
                </li>
                <li className="flex items-center gap-3">
                  <UserRound size={18} className="text-[#7427b3]" />
                  Joined {formatDate(user.createdAt)}
                </li>
              </ul>
            </div>

            <form onSubmit={handleProfileUpdate} className="mt-8 space-y-4 rounded-2xl border border-[#ececec] p-5 dark:border-white/10">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#707070] dark:text-white/55">
                  User settings
                </p>
                <h3 className="mt-2 text-xl font-black">Update your profile</h3>
              </div>

              <label className="block text-sm font-semibold">
                Full name
                <input
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Profile image URL
                <input
                  value={profileForm.image}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, image: event.target.value }))
                  }
                  type="url"
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                />
              </label>

              <label className="block text-sm font-semibold">
                Bio
                <textarea
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, bio: event.target.value }))
                  }
                  className="mt-2 min-h-28 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold">
                  Current password
                  <input
                    value={profileForm.currentPassword}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    type="password"
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>

                <label className="block text-sm font-semibold">
                  New password
                  <input
                    value={profileForm.newPassword}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        newPassword: event.target.value,
                      }))
                    }
                    type="password"
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>
              </div>

              {!isVerified(user.emailVerified) ? (
                <button
                  type="button"
                  onClick={() => handleResendVerification(user.email)}
                  disabled={busyKey === `verify:${user.email}`}
                  className="rounded-xl border border-[#7427b3] px-4 py-3 text-sm font-bold text-[#7427b3] disabled:opacity-60"
                >
                  {busyKey === `verify:${user.email}` ? "Preparing verification..." : "Resend verification"}
                </button>
              ) : null}

              <button
                type="submit"
                disabled={busyKey === "profile:update"}
                className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {busyKey === "profile:update" ? "Saving..." : "Save profile"}
              </button>
            </form>
          </div>

          {canEdit ? <CreateArticleForm categories={categories} /> : null}

          {isAdmin ? (
            <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
              <div className="flex items-center gap-3">
                <LayoutGrid className="text-[#7427b3]" />
                <h2 className="text-2xl font-black">Category manager</h2>
              </div>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Create and maintain article categories for the publishing workflow.
              </p>

              <form onSubmit={handleCreateCategory} className="mt-6 space-y-4">
                <label className="block font-semibold">
                  Category name
                  <input
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    required
                    minLength={2}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>
                <label className="block font-semibold">
                  Description
                  <textarea
                    value={categoryDescription}
                    onChange={(event) => setCategoryDescription(event.target.value)}
                    className="mt-2 min-h-24 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>
                {categoryState.error ? (
                  <p className="text-sm font-semibold text-red-600">{categoryState.error}</p>
                ) : null}
                {categoryState.success ? (
                  <p className="text-sm font-semibold text-emerald-600">{categoryState.success}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={categoryState.loading}
                  className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {categoryState.loading ? "Saving..." : "Create category"}
                </button>
              </form>

              <div className="mt-8 space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-xl border border-[#ececec] px-4 py-3 dark:border-white/10"
                  >
                    <div>
                      <p className="font-bold">{category.name}</p>
                      <p className="text-sm text-[#707070] dark:text-white/55">
                        {category.description || category.slug}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#7427b3]">
                      {category.articleCount ?? 0} articles
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#7427b3]">
                  Publishing controls
                </p>
                <h2 className="mt-3 text-3xl font-black">Article control panel</h2>
              </div>
              <div className="flex gap-3">
                <div className="rounded-2xl bg-[#f8f4fc] px-4 py-3 text-sm font-black text-[#7427b3]">
                  {stats.total} total
                </div>
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700">
                  {stats.published} published
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-700">
                  {stats.review} review
                </div>
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700">
                  {stats.drafts} drafts
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_220px]">
              <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#d7d7d7] px-4 dark:border-white/10">
                <Search size={20} className="text-[#7427b3]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by title, author, type, or status"
                  className="w-full bg-transparent outline-none"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "ALL" | ArticleStatus)}
                className="min-h-14 rounded-2xl border border-[#d7d7d7] px-4 outline-none dark:border-white/10 dark:bg-[#191919]"
              >
                <option value="ALL">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as "ALL" | ArticleType)}
                className="min-h-14 rounded-2xl border border-[#d7d7d7] px-4 outline-none dark:border-white/10 dark:bg-[#191919]"
              >
                <option value="ALL">All types</option>
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {actionError ? (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {actionError}
              </p>
            ) : null}
            {actionNotice ? (
              <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {actionNotice}
              </p>
            ) : null}

            <div className="mt-8 space-y-4">
              {canEdit ? (
                visibleArticles.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-[20px] border border-[#e7e7e7] p-5 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone(article.status)}`}>
                            {article.status}
                          </span>
                          <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-xs font-bold text-[#5a5a5a] dark:bg-white/10 dark:text-white/65">
                            {article.type}
                          </span>
                          <span className="text-sm text-[#707070] dark:text-white/55">
                            {article.author.name ?? "JMO Media"} • {article.commentsCount} comments
                          </span>
                        </div>
                        <h3 className="mt-4 text-2xl font-black">{article.title}</h3>
                        <p className="mt-3 max-w-3xl text-base leading-7 text-[#707070] dark:text-white/65">
                          {article.excerpt || article.content.slice(0, 160)}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#707070] dark:text-white/55">
                          <span>Updated {formatDateTime(article.updatedAt)}</span>
                          <span>{article.category?.name ?? "Uncategorized"}</span>
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d7d7d7] px-3 py-2 text-sm font-semibold dark:border-white/10"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveArticle({
                              slug: article.slug,
                              title: article.title,
                              excerpt: article.excerpt,
                              content: article.content,
                              coverImage: article.coverImage,
                              type: article.type,
                              status: article.status,
                              categoryId: article.categoryId,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d7d7d7] px-3 py-2 text-sm font-semibold dark:border-white/10"
                        >
                          <PencilLine size={16} />
                          Edit
                        </button>
                        {article.status !== "PUBLISHED" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(article, "PUBLISHED")}
                            disabled={busyKey === `status:${article.slug}:PUBLISHED`}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            {busyKey === `status:${article.slug}:PUBLISHED` ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={16} />
                            )}
                            Publish
                          </button>
                        ) : null}
                        {article.status !== "REVIEW" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(article, "REVIEW")}
                            disabled={busyKey === `status:${article.slug}:REVIEW`}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            Review
                          </button>
                        ) : null}
                        {article.status !== "DRAFT" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(article, "DRAFT")}
                            disabled={busyKey === `status:${article.slug}:DRAFT`}
                            className="rounded-xl bg-[#7427b3] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            Draft
                          </button>
                        ) : null}
                        {article.status !== "ARCHIVED" ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(article, "ARCHIVED")}
                            disabled={busyKey === `status:${article.slug}:ARCHIVED`}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#d7d7d7] px-3 py-2 text-sm font-semibold dark:border-white/10 disabled:opacity-60"
                          >
                            <Archive size={16} />
                            Archive
                          </button>
                        ) : null}
                        {(isAdmin || article.authorId === user.id) && (
                          <button
                            type="button"
                            onClick={() => handleDelete(article)}
                            disabled={busyKey === `delete:${article.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
                          >
                            {busyKey === `delete:${article.slug}` ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-[#d7d7d7] p-8 text-center text-[#707070] dark:border-white/10 dark:text-white/55">
                  Your current role can access the platform profile and public content, but article management is reserved for editors and admins.
                </div>
              )}

              {canEdit && visibleArticles.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#d7d7d7] p-8 text-center text-[#707070] dark:border-white/10 dark:text-white/55">
                  No articles matched the current search or filter.
                </div>
              ) : null}
            </div>
          </div>

          {isAdmin ? (
            <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
              <div className="flex items-center gap-3">
                <Users className="text-[#7427b3]" />
                <h2 className="text-2xl font-black">User management</h2>
              </div>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Review platform users and reassign roles without leaving the dashboard.
              </p>

              <label className="mt-6 flex min-h-14 items-center gap-3 rounded-2xl border border-[#d7d7d7] px-4 dark:border-white/10">
                <Search size={20} className="text-[#7427b3]" />
                <input
                  value={userQuery}
                  onChange={(event) => setUserQuery(event.target.value)}
                  placeholder="Search users by name, email, or role"
                  className="w-full bg-transparent outline-none"
                />
              </label>

              <div className="mt-6 space-y-4">
                {visibleUsers.map((managedUser) => (
                  <div
                    key={managedUser.id}
                    className="rounded-[20px] border border-[#e7e7e7] p-5 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xl font-black">
                          {managedUser.name ?? "Unnamed user"}
                        </p>
                        <p className="mt-1 text-sm text-[#707070] dark:text-white/55">
                          {managedUser.email}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#f1e8f8] px-3 py-1 text-xs font-black text-[#7427b3]">
                            {managedUser.role}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              isVerified(managedUser.emailVerified)
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {isVerified(managedUser.emailVerified) ? "Verified" : "Pending verification"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#707070] dark:text-white/55">
                          <span>{managedUser.articleCount} articles</span>
                          <span>{managedUser.commentCount} comments</span>
                          <span>Joined {formatDate(managedUser.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <select
                          value={managedUser.role}
                          onChange={(event) =>
                            handleUserRoleChange(managedUser.id, event.target.value as UserRole)
                          }
                          disabled={busyKey.startsWith(`user:${managedUser.id}:`)}
                          className="min-h-12 rounded-xl border border-[#d7d7d7] px-4 outline-none dark:border-white/10 dark:bg-[#191919]"
                        >
                          <option value="READER">READER</option>
                          <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveManagedUser({
                              id: managedUser.id,
                              email: managedUser.email,
                              name: managedUser.name,
                              bio: managedUser.bio,
                              image: managedUser.image ?? null,
                              role: managedUser.role,
                              emailVerified: managedUser.emailVerified ?? null,
                            })
                          }
                          className="rounded-xl border border-[#d7d7d7] px-4 py-3 text-sm font-semibold dark:border-white/10"
                        >
                          Edit profile
                        </button>
                        {!isVerified(managedUser.emailVerified) ? (
                          <button
                            type="button"
                            onClick={() => handleResendVerification(managedUser.email)}
                            disabled={busyKey === `verify:${managedUser.email}`}
                            className="rounded-xl border border-[#7427b3] px-4 py-3 text-sm font-semibold text-[#7427b3] disabled:opacity-60"
                          >
                            {busyKey === `verify:${managedUser.email}` ? "Preparing..." : "Resend verification"}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}

                {visibleUsers.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#d7d7d7] p-8 text-center text-[#707070] dark:border-white/10 dark:text-white/55">
                    No users matched the current search.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {canEdit ? (
            <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
              <div className="flex items-center gap-3">
                <Film className="text-[#7427b3]" />
                <h2 className="text-2xl font-black">Media asset manager</h2>
              </div>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Manage a shared library of images, videos, audio, documents, and embeds beyond article cover fields.
              </p>

              <form onSubmit={handleCreateMedia} className="mt-6 grid gap-4">
                <div className="flex flex-wrap gap-3">
                  {mediaSourceOptions.map((source) => (
                    <button
                      key={source}
                      type="button"
                      onClick={() => setMediaSource(source)}
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        mediaSource === source
                          ? "bg-[#7427b3] text-white"
                          : "bg-[#f1e8f8] text-[#7427b3]"
                      }`}
                    >
                      {source === "URL"
                        ? "External URL"
                        : source === "UPLOAD"
                          ? "Upload from device"
                          : "Google Drive"}
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block font-semibold">
                    Asset type
                    <select
                      value={mediaForm.type}
                      onChange={(event) =>
                        setMediaForm((current) => ({
                          ...current,
                          type: event.target.value as MediaType,
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    >
                      {mediaTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block font-semibold">
                    Attach to article
                    <select
                      value={mediaForm.articleId}
                      onChange={(event) =>
                        setMediaForm((current) => ({ ...current, articleId: event.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    >
                      <option value="">Library only</option>
                      {items.map((article) => (
                        <option key={article.id} value={article.id}>
                          {article.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {mediaSource === "UPLOAD" ? (
                  <label className="block font-semibold">
                    Upload from local device
                    <input
                      onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                      required
                      type="file"
                      accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt"
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#7427b3] file:px-4 file:py-2 file:font-semibold file:text-white focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    />
                  </label>
                ) : (
                  <label className="block font-semibold">
                    {mediaSource === "DRIVE" ? "Google Drive share URL" : "Media URL"}
                    <input
                      value={mediaSource === "DRIVE" ? driveUrl : mediaForm.url}
                      onChange={(event) =>
                        mediaSource === "DRIVE"
                          ? setDriveUrl(event.target.value)
                          : setMediaForm((current) => ({ ...current, url: event.target.value }))
                      }
                      required
                      type="url"
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    />
                  </label>
                )}

                <label className="block font-semibold">
                  Thumbnail URL
                  <input
                    value={mediaForm.thumbnailUrl}
                    onChange={(event) =>
                      setMediaForm((current) => ({
                        ...current,
                        thumbnailUrl: event.target.value,
                      }))
                    }
                    type="url"
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block font-semibold">
                    Title
                    <input
                      value={mediaForm.title}
                      onChange={(event) =>
                        setMediaForm((current) => ({ ...current, title: event.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    />
                  </label>
                  <label className="block font-semibold">
                    Alt text
                    <input
                      value={mediaForm.altText}
                      onChange={(event) =>
                        setMediaForm((current) => ({ ...current, altText: event.target.value }))
                      }
                      className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                    />
                  </label>
                </div>

                <label className="block font-semibold">
                  Caption
                  <textarea
                    value={mediaForm.caption}
                    onChange={(event) =>
                      setMediaForm((current) => ({ ...current, caption: event.target.value }))
                    }
                    className="mt-2 min-h-20 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#191919]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={busyKey === "media:create"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  <Plus size={18} />
                  {busyKey === "media:create" ? "Saving..." : "Add media asset"}
                </button>
              </form>

              <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_220px]">
                <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#d7d7d7] px-4 dark:border-white/10">
                  <Search size={20} className="text-[#7427b3]" />
                  <input
                    value={mediaQuery}
                    onChange={(event) => setMediaQuery(event.target.value)}
                    placeholder="Search media by title, article, uploader"
                    className="w-full bg-transparent outline-none"
                  />
                </label>
                <select
                  value={mediaTypeFilter}
                  onChange={(event) =>
                    setMediaTypeFilter(event.target.value as "ALL" | MediaType)
                  }
                  className="min-h-14 rounded-2xl border border-[#d7d7d7] px-4 outline-none dark:border-white/10 dark:bg-[#191919]"
                >
                  <option value="ALL">All media types</option>
                  {mediaTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 space-y-4">
                {visibleMedia.map((asset) => (
                  <div
                    key={asset.id}
                    className="rounded-[20px] border border-[#e7e7e7] p-5 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="grid h-20 w-24 place-items-center overflow-hidden rounded-2xl bg-[#f5f5f5] text-[#7427b3] dark:bg-white/5">
                          {asset.type === "IMAGE" && (asset.thumbnailUrl || asset.url) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={asset.thumbnailUrl || asset.url}
                              alt={asset.altText || asset.title || "Media preview"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon size={24} />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-[#f1e8f8] px-3 py-1 text-xs font-black text-[#7427b3]">
                              {asset.type}
                            </span>
                            <span className="text-sm text-[#707070] dark:text-white/55">
                              {asset.uploadedBy?.name ?? "Unknown"} • {formatDateTime(asset.updatedAt)}
                            </span>
                          </div>
                          <p className="mt-3 text-lg font-black">
                            {asset.title || asset.url}
                          </p>
                          <p className="mt-2 text-sm text-[#707070] dark:text-white/55">
                            {asset.article ? `Attached to ${asset.article.title}` : "Library-only asset"}
                          </p>
                          {asset.caption ? (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#707070] dark:text-white/65">
                              {asset.caption}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={asset.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d7d7d7] px-3 py-2 text-sm font-semibold dark:border-white/10"
                        >
                          <Eye size={16} />
                          Open
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMedia({
                              id: asset.id,
                              articleId: asset.articleId,
                              type: asset.type,
                              url: asset.url,
                              thumbnailUrl: asset.thumbnailUrl,
                              title: asset.title,
                              caption: asset.caption,
                              altText: asset.altText,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#d7d7d7] px-3 py-2 text-sm font-semibold dark:border-white/10"
                        >
                          <PencilLine size={16} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMediaDelete(asset.id)}
                          disabled={busyKey === `media:delete:${asset.id}`}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {visibleMedia.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#d7d7d7] p-8 text-center text-[#707070] dark:border-white/10 dark:text-white/55">
                    No media assets matched the current search or filter.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
              <div className="flex items-center gap-3">
                <MessageSquareMore className="text-[#7427b3]" />
                <h2 className="text-2xl font-black">Comment moderation</h2>
              </div>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Approve, hold, or remove comments from the moderation queue.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {(["PENDING", "APPROVED", "ALL"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCommentFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-black ${
                      commentFilter === filter
                        ? "bg-[#7427b3] text-white"
                        : "bg-[#f1e8f8] text-[#7427b3]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {visibleComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-[20px] border border-[#e7e7e7] p-5 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              comment.approved
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {comment.approved ? "APPROVED" : "PENDING"}
                          </span>
                          <span className="text-sm text-[#707070] dark:text-white/55">
                            {comment.author.name ?? "Unknown"} • {comment.author.role}
                          </span>
                        </div>
                        <p className="mt-4 text-lg leading-8 text-[#303030] dark:text-white/75">
                          {comment.body}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#707070] dark:text-white/55">
                          <span>{formatDateTime(comment.createdAt)}</span>
                          <Link
                            href={`/articles/${comment.article.slug}`}
                            className="font-semibold text-[#7427b3]"
                          >
                            {comment.article.title}
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {!comment.approved ? (
                          <button
                            type="button"
                            onClick={() => handleCommentApproval(comment.id, true)}
                            disabled={busyKey === `comment:${comment.id}:approve`}
                            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCommentApproval(comment.id, false)}
                            disabled={busyKey === `comment:${comment.id}:unapprove`}
                            className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                          >
                            Hold
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCommentDelete(comment.id)}
                          disabled={busyKey === `comment-delete:${comment.id}`}
                          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {visibleComments.length === 0 ? (
                  <div className="rounded-[20px] border border-dashed border-[#d7d7d7] p-8 text-center text-[#707070] dark:border-white/10 dark:text-white/55">
                    No comments matched the current moderation filter.
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {isAdmin ? (
            <div className="rounded-[24px] border border-[#e4e4e4] bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#222]">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-[#7427b3]" />
                <h2 className="text-2xl font-black">Analytics and reporting</h2>
              </div>
              <p className="mt-3 text-[#707070] dark:text-white/65">
                Operational totals across users, content workflow, and moderation volume.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-[#f8f4fc] p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#7427b3]">
                    Users
                  </p>
                  <p className="mt-3 text-3xl font-black">{analytics.totalUsers}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Published
                  </p>
                  <p className="mt-3 text-3xl font-black">{analytics.publishedArticles}</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-700">
                    Pending comments
                  </p>
                  <p className="mt-3 text-3xl font-black">{analytics.pendingComments}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700">
                    Media assets
                  </p>
                  <p className="mt-3 text-3xl font-black">{analytics.totalMediaAssets}</p>
                </div>
                <div className="rounded-2xl bg-[#fbf6e7] p-5 md:col-span-2 xl:col-span-1">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b98f07]">
                    Categories
                  </p>
                  <p className="mt-3 text-3xl font-black">{analytics.totalCategories}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#ececec] p-5 dark:border-white/10">
                  <h3 className="text-lg font-black">Users by role</h3>
                  <div className="mt-4 space-y-3">
                    {analytics.userRoleStats.map((item) => (
                      <div key={item.role} className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{item.role}</span>
                        <span className="font-black text-[#7427b3]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#ececec] p-5 dark:border-white/10">
                  <h3 className="text-lg font-black">Content workflow mix</h3>
                  <div className="mt-4 space-y-3">
                    {analytics.articleStats.map((item) => (
                      <div
                        key={`${item.type}-${item.status}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-semibold">
                          {item.type} / {item.status}
                        </span>
                        <span className="font-black text-[#7427b3]">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {activeArticle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:bg-[#191919]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7427b3]">
                  Edit article
                </p>
                <h2 className="mt-2 text-3xl font-black">{activeArticle.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="grid size-11 place-items-center rounded-full border border-[#d7d7d7] dark:border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-8 space-y-5">
              <label className="block font-semibold">
                Title
                <input
                  name="title"
                  required
                  defaultValue={activeArticle.title}
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <label className="block font-semibold">
                Excerpt
                <textarea
                  name="excerpt"
                  defaultValue={activeArticle.excerpt ?? ""}
                  className="mt-2 min-h-24 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <label className="block font-semibold">
                Content
                <textarea
                  name="content"
                  required
                  minLength={20}
                  defaultValue={activeArticle.content}
                  className="mt-2 min-h-56 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block font-semibold">
                  Cover image URL
                  <input
                    name="coverImage"
                    type="url"
                    defaultValue={activeArticle.coverImage ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  />
                </label>

                <label className="block font-semibold">
                  Category
                  <select
                    name="categoryId"
                    defaultValue={activeArticle.categoryId ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
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
                    defaultValue={activeArticle.type}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block font-semibold">
                  Status
                  <select
                    name="status"
                    defaultValue={activeArticle.status}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="rounded-xl border border-[#d7d7d7] px-5 py-3 font-semibold dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyKey === `edit:${activeArticle.slug}`}
                  className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {busyKey === `edit:${activeArticle.slug}` ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {activeMedia ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:bg-[#191919]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7427b3]">
                  Edit media asset
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {activeMedia.title || activeMedia.url}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveMedia(null)}
                className="grid size-11 place-items-center rounded-full border border-[#d7d7d7] dark:border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMediaUpdate} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block font-semibold">
                  Media type
                  <select
                    name="type"
                    defaultValue={activeMedia.type}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  >
                    {mediaTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block font-semibold">
                  Attach to article
                  <select
                    name="articleId"
                    defaultValue={activeMedia.articleId ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  >
                    <option value="">Library only</option>
                    {items.map((article) => (
                      <option key={article.id} value={article.id}>
                        {article.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block font-semibold">
                Media URL
                <input
                  name="url"
                  required
                  type="url"
                  defaultValue={activeMedia.url}
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <label className="block font-semibold">
                Thumbnail URL
                <input
                  name="thumbnailUrl"
                  type="url"
                  defaultValue={activeMedia.thumbnailUrl ?? ""}
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block font-semibold">
                  Title
                  <input
                    name="title"
                    defaultValue={activeMedia.title ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  />
                </label>

                <label className="block font-semibold">
                  Alt text
                  <input
                    name="altText"
                    defaultValue={activeMedia.altText ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  />
                </label>
              </div>

              <label className="block font-semibold">
                Caption
                <textarea
                  name="caption"
                  defaultValue={activeMedia.caption ?? ""}
                  className="mt-2 min-h-20 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="rounded-xl border border-[#d7d7d7] px-5 py-3 font-semibold dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyKey === `media:edit:${activeMedia.id}`}
                  className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {busyKey === `media:edit:${activeMedia.id}` ? "Saving..." : "Save media"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {activeManagedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-[28px] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.25)] dark:bg-[#191919]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7427b3]">
                  Edit user
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  {activeManagedUser.name ?? activeManagedUser.email}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveManagedUser(null)}
                className="grid size-11 place-items-center rounded-full border border-[#d7d7d7] dark:border-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleManagedUserUpdate} className="mt-8 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block font-semibold">
                  Full name
                  <input
                    name="name"
                    required
                    defaultValue={activeManagedUser.name ?? ""}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  />
                </label>

                <label className="block font-semibold">
                  Role
                  <select
                    name="role"
                    defaultValue={activeManagedUser.role}
                    className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                  >
                    <option value="READER">READER</option>
                    <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                    <option value="EDITOR">EDITOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </label>
              </div>

              <label className="block font-semibold">
                Profile image URL
                <input
                  name="image"
                  type="url"
                  defaultValue={activeManagedUser.image ?? ""}
                  className="mt-2 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <label className="block font-semibold">
                Bio
                <textarea
                  name="bio"
                  defaultValue={activeManagedUser.bio ?? ""}
                  className="mt-2 min-h-24 w-full rounded-xl border border-[#d7d7d7] px-4 py-3 outline-none focus:border-[#7427b3] dark:border-white/10 dark:bg-[#111]"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-[#d7d7d7] px-4 py-4 text-sm font-semibold dark:border-white/10">
                <input
                  name="emailVerified"
                  type="checkbox"
                  defaultChecked={isVerified(activeManagedUser.emailVerified)}
                  className="size-4 accent-[#7427b3]"
                />
                Mark email as verified
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveManagedUser(null)}
                  className="rounded-xl border border-[#d7d7d7] px-5 py-3 font-semibold dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busyKey === `user:edit:${activeManagedUser.id}`}
                  className="rounded-xl bg-[#7427b3] px-5 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {busyKey === `user:edit:${activeManagedUser.id}` ? "Saving..." : "Save user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
