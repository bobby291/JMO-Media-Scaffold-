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
- Zod validation

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to your Neon connection string.
3. Set `NEXTAUTH_SECRET` to a strong random value.
4. Set `NEXTAUTH_URL` to your local or deployed app URL, for example `http://localhost:3000`.
5. Install dependencies:

```bash
npm install
```

6. Generate Prisma Client and apply migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

7. Run the app:

```bash
npm run dev
```

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
- `/join` - Public JMO Community signup with benefits and interest selection.
- `/signup` - Staff/dashboard registration page with contributor, editor, and admin role selection.
- `/dashboard` - Editorial dashboard placeholder.
- `/news`, `/editorials`, `/media` - Content-type entry pages.
- Community and newsletter signup posts to `/api/newsletter` and stores email, name, and selected interests in the database.

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

- `POST /api/auth/register` creates a user with a selected role.
- `POST /api/auth/forgot-password` creates a password reset token and returns a reset URL in development.
- `POST /api/auth/reset-password` resets a password using the verified token flow.
- `GET /api/me` returns the current authenticated user.
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
- `PATCH /api/media/:id` updates media asset metadata and article association.
- `DELETE /api/media/:id` deletes a media asset.
- `GET /api/admin/users` lists users for admin management.
- `PATCH /api/admin/users/:id` reassigns user roles or updates profile fields.
- `GET /api/admin/comments` lists moderation items for admins.
- `PATCH /api/admin/comments/:id` approves or returns a comment to moderation.
- `DELETE /api/admin/comments/:id` deletes a moderated comment.
- `POST /api/newsletter` stores or updates a community/newsletter subscription with optional name and interests.

## Roles

- `READER`: basic reading access.
- `CONTRIBUTOR`: read, share, comment, and maintain a contributor profile.
- `EDITOR`: create, edit, review, and publish content plus manage the media library.
- `ADMIN`: full platform control including user management, comment moderation, categories, analytics, and publishing.

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
- If `DATABASE_URL` is missing, the app now returns explicit configuration messages instead of opaque Prisma `500`s.
- In development, NextAuth falls back to a local secret if `NEXTAUTH_SECRET` is missing, but you should still set a real value in `.env.local`.

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
