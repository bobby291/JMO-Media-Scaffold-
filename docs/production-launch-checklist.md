# JMO Media Production Launch Checklist

## Vercel Project

1. Import the GitHub repository into Vercel.
2. Confirm the project root is the repository root.
3. Confirm the build command is:

```bash
npm run vercel-build
```

4. Confirm the production domain is known before setting `NEXTAUTH_URL`.

## Required Environment Variables

Set these in Vercel Production:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token
RESEND_API_KEY=re_...
EMAIL_FROM=JMO Media <no-reply@yourdomain.com>
```

## Neon

1. Confirm the Neon database is reachable from Vercel.
2. Confirm `DIRECT_URL` uses the direct connection string Prisma migrations expect.
3. Confirm Prisma migrations are applied during build with `npm run vercel-build`.

## Resend

1. Verify the sending domain in Resend.
2. Set `EMAIL_FROM` to a sender on that verified domain.
3. Test:
   - signup verification mail
   - resend verification mail
   - password reset mail

## Vercel Blob

1. Create a Blob store in Vercel.
2. Set `BLOB_READ_WRITE_TOKEN`.
3. Test:
   - upload image from device in `/dashboard`
   - upload document/video from device
   - delete media asset and confirm the asset is removed

## Auth and Roles

1. Create the initial real admin account.
2. Verify admin can:
   - manage users
   - change roles
   - delete users
   - moderate comments
   - manage categories
   - upload media
3. Verify editor can:
   - create content
   - publish content
   - use media library
4. Verify contributor can:
   - sign in
   - view profile
   - comment/share only

## Frontend Regression Pass

Check:

1. `/`
2. `/articles`
3. `/development-areas`
4. `/about`
5. `/join`
6. `/signup`
7. `/login`
8. `/verify-email`
9. `/forgot-password`
10. `/dashboard`

## Final Release Gate

Do not call the deployment production-ready until:

1. verification email delivery works from the live domain
2. password reset works from the live domain
3. Blob uploads persist across reloads and redeploys
4. admin role management works against the production database
5. one full article publishing flow succeeds end to end
