# JMO Media Mini Fullstack

JMO Media is a Next.js mini fullstack media platform for structured articles,
development content, community signups, role-aware publishing, and comments.

The frontend follows the supplied `JMO Media UI_UX Design.make` direction:
purple/black primary branding, gold CTAs, development-area cards, featured
content, trending posts, email signup, ecosystem CTA, footer, and a light/dark
screen toggle.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- Prisma 7
- Neon/Postgres
- NextAuth credentials auth
- Vercel Blob
- Resend
- Zod validation

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to your Neon connection string.
3. Set `NEXTAUTH_SECRET` to a strong random value.
4. Set `NEXTAUTH_URL` to your local or deployed app URL, for example `http://localhost:3000`.
5. For production-grade uploads, set `BLOB_READ_WRITE_TOKEN`.
6. For email delivery, set `RESEND_API_KEY` and `EMAIL_FROM`.
7. Install dependencies:

```bash
npm install
```

8. Generate Prisma Client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

9. Run the app:

```bash
npm run dev
```

## Vercel Production Deploy

Use Vercel with the following environment variables:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
RESEND_API_KEY=re_...
EMAIL_FROM=JMO Media <no-reply@yourdomain.com>
```

Recommended Vercel build command:

```bash
npm run vercel-build
```

The repository also includes [vercel.json](/Users/valerian/Mista-Val/JMO-Media-Scaffold-/vercel.json) with the same build command so the project settings stay explicit in source control.

That script runs:

```bash
prisma generate && prisma migrate deploy && next build
```

Pre-launch checklist:

1. Add all production environment variables in Vercel.
2. Confirm `NEXTAUTH_URL` matches the production domain exactly.
3. Confirm `EMAIL_FROM` uses a verified Resend sender/domain.
4. Confirm `BLOB_READ_WRITE_TOKEN` is present before testing device uploads.
5. Trigger one production signup and verify that the verification email is actually delivered.
6. Test password reset end to end from the live domain.
7. Create one admin account and verify `/dashboard` can upload media, manage users, and publish content.

Detailed release checklist:

- [docs/production-launch-checklist.md](/Users/valerian/Mista-Val/JMO-Media-Scaffold-/docs/production-launch-checklist.md)

## Frontend Routes

- `/` - Homepage with hero, development areas, featured content, trending posts, newsletter signup, ecosystem CTA, and footer.
- `/development-areas` - Grid of all development areas.
- `/development-areas/[slug]` - Development area detail page.
- `/articles` - Article index placeholder wired for API integration.
- `/articles/[slug]` - Article detail placeholder.
- `/about` - Platform overview.
- `/login` - Credentials login page with forgot-password link.
- `/forgot-password` - Password reset request page.
- `/reset-password` - Password reset completion page.
- `/verify-email` - Email verification and resend flow.
- `/join` - Public JMO Community signup that creates Reader access plus community interests.
- `/signup` - Platform access registration page for Contributor onboarding. Editor access is assigned by admins.
- `/dashboard` - Editorial dashboard placeholder.
- `/news`, `/editorials`, `/media` - Content-type entry pages.
- Community signup posts to `/api/community/join`, stores interests, and provisions Reader access.

## Frontend Sections

- Top navigation: Home, Articles, Development Areas, About, Join Community.
- Hero: "Grow, Learn, and Build Your Future".
- Development Areas:
  - Leadership Development
  - Professional & Business Development
  - Technological Development
  - Financial Development
  - Educational Development
  - Environmental Sustainability
  - Relationship Development
- Featured Content.
- Trending Now.
- Stay Informed email signup.
- JMO Ecosystem CTA for JMO BIZHUB and JMO Academy.
- Footer with quick links, ecosystem links, contact details, and social links.
- Global light/dark screen toggle.

## API Surface

- `POST /api/auth/register` creates a user, issues a verification token, and sends a verification email.
- `POST /api/auth/resend-verification` regenerates and resends verification email links.
- `POST /api/auth/verify-email` verifies an email address from the signed token.
- `POST /api/auth/forgot-password` creates a password reset token and sends a reset email.
- `POST /api/auth/reset-password` resets a password using the verified token flow.
- `GET /api/me` returns the current authenticated user.
- `PATCH /api/me` updates the current user profile, image, bio, and password.
- `GET /api/articles` lists published articles by default.
- `POST /api/articles` creates articles, news, editorials, and media posts.
- `GET /api/articles/:slug` returns one public article, or a draft for its owner/editor/admin.
- `PATCH /api/articles/:slug` updates articles with role-aware publishing.
- `DELETE /api/articles/:slug` deletes articles for owners, editors, and admins.
- `GET /api/articles/:slug/comments` lists approved comments.
- `POST /api/articles/:slug/comments` adds authenticated comments.
- `GET /api/categories` lists categories.
- `POST /api/categories` creates categories for admins.
- `GET /api/media` lists shared media library assets for editors/admins.
- `POST /api/media` creates shared media assets for editors/admins.
- `POST /api/media/upload` uploads a device file to Vercel Blob in production, with local fallback in development.
- `PATCH /api/media/:id` updates media asset metadata and article association.
- `DELETE /api/media/:id` deletes a media asset.
- `GET /api/admin/users` lists users for admin management.
- `PATCH /api/admin/users/:id` reassigns user roles or updates profile fields.
- `DELETE /api/admin/users/:id` deletes a user from the platform.
- `GET /api/admin/comments` lists moderation items for admins.
- `PATCH /api/admin/comments/:id` approves or returns a comment to moderation.
- `DELETE /api/admin/comments/:id` deletes a moderated comment.
- `POST /api/community/join` stores or updates community interests and creates Reader access.

## Roles

- `READER`: created from Join Community; can sign in, read, share, and comment on published posts.
- `CONTRIBUTOR`: created from platform signup; can access a contributor profile and approved platform workspace.
- `EDITOR`: assigned by admins; can create, edit, review, publish content, and manage the media library.
- `ADMIN`: full platform control including user management, comment moderation, categories, analytics, publishing, and role reassignment.
- `READER`: created from community join; can sign in, manage a reader profile, and comment on published posts.

## Database

The Prisma schema includes:

- Auth models: `User`, `Account`, `Session`, `VerificationToken`
- Content models: `Article`, `Category`, `MediaAsset`, `Comment`, `NewsletterSubscription`
- Enums: `UserRole`, `ArticleStatus`, `ArticleType`, `MediaType`

Prisma 7 uses `prisma.config.ts` for datasource configuration. The schema is
configured for Postgres/Neon.

## Runtime Requirements

- A working `DATABASE_URL` is required for:
  - signup
  - login
  - forgot password
  - newsletter/community signup
  - dashboard and admin APIs
- `BLOB_READ_WRITE_TOKEN` is required in production for persistent device uploads on Vercel.
- `RESEND_API_KEY` and `EMAIL_FROM` are required in production for verification and reset emails.
- If `DATABASE_URL` is missing, the app now returns explicit configuration messages instead of opaque Prisma `500`s.
- In development, NextAuth falls back to a local secret if `NEXTAUTH_SECRET` is missing, but you should still set a real value in `.env.local`.
- In development, verification and reset APIs still expose direct URLs in the response payload when email delivery is not configured.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Validation

Before handoff, run:

```bash
npm run lint
DATABASE_URL="postgresql://user:password@localhost:5432/jmo_media" npx prisma validate
npm run build
```
