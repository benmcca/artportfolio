This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment variables

Copy `.env.example` to `.env.local` for local development. Add the same four values in Vercel under **Project Settings > Environment Variables** for Production (and Preview if preview deployments should use the app):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_EMAIL=the_email_allowed_to_manage_the_gallery
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Use the Supabase anon key, never the service-role key. `NEXT_PUBLIC_` values are intentionally available to the browser; `ADMIN_EMAIL` and `IMAGEKIT_PRIVATE_KEY` stay server-only.

### Image uploads

Admin image uploads use ImageKit for CDN delivery and automatic format and quality selection:

```bash
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

The ImageKit account's URL endpoint must be `https://ik.imagekit.io/...`; this is the delivery host configured in `next.config.ts`. The private key is only read by the server upload route and is never exposed to the browser.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Push this repository to GitHub, then import it from [Vercel](https://vercel.com/new).
2. Select the Hobby plan and add the environment variables above before the first deployment.
3. Deploy, then copy the production URL from Vercel.

In Supabase, open **Authentication > URL Configuration**:

- Set **Site URL** to the production origin, such as `https://portfolio.example.com` or the Vercel production URL.
- Add `https://your-production-host/auth/callback` to **Redirect URLs**.
- Keep `http://localhost:3000/auth/callback` for local development.
- If using Vercel preview deployments, add the exact preview callback URLs you need. Avoid broad wildcard URLs unless you understand the security tradeoff.

The app builds the sign-in callback from the current request origin, so no URL environment variable is needed. After changing auth settings or environment variables in Vercel, redeploy so the change is active.

### Supabase activity check

Supabase pauses inactive free projects. This repository includes a scheduled GitHub Action at `.github/workflows/keep-supabase-active.yml` that runs every three days and queries the health endpoint, which performs a read against Supabase.

Add a GitHub repository secret named `SITE_URL` containing the production origin, for example `https://portfolio.example.com`. You can also run it manually from the workflow's **Run workflow** button. Scheduled GitHub Actions can be delayed or disabled after long periods without repository activity, so treat this as a convenience rather than a service-level uptime guarantee.

For custom domains, add the domain in Vercel first, then update Supabase's Site URL and Redirect URLs to use that domain.
