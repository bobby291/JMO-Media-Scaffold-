# JMO Media Mini Fullstack

Backend-first MVP for a media platform using Next.js App Router, Prisma, Neon/Postgres, and NextAuth.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Neon connection string.
2. Set `NEXTAUTH_SECRET` to a strong random value. For NextAuth v4,
   `NEXTAUTH_URL` should point at your app URL.
3. Install dependencies with `npm install`.
4. Generate and migrate the database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Run the app:

```bash
npm run dev
```

## API Surface

- `POST /api/auth/register` creates a user with a selected role.
- `GET /api/me` returns the current authenticated user.
- `GET /api/articles` lists published articles by default.
- `POST /api/articles` creates articles, news, editorials, and media posts.
- `GET /api/articles/:slug` returns one public article, or a draft for its owner/editor/admin.
- `PATCH /api/articles/:slug` updates articles with role-aware publishing.
- `DELETE /api/articles/:slug` deletes articles for owners, editors, and admins.
- `GET /api/articles/:slug/comments` lists approved comments.
- `POST /api/articles/:slug/comments` adds authenticated comments.
- `GET /api/categories` lists categories.
- `POST /api/categories` creates categories for editors and admins.

## Roles

- `READER`: can read and comment.
- `CONTRIBUTOR`: can create draft or review posts.
- `EDITOR`: can publish and manage articles/categories.
- `ADMIN`: full editorial control.
