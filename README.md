# Whop Partner Directory

A web application where Whop creators can find and hire vetted agencies, service providers, and tech partners.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Frosted UI (Whop design system) + Radix Icons + Tailwind CSS

## Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Environment**

   Copy `.env.local` and set `ANTHROPIC_API_KEY` when you want to use the AI matching bot. The fallback scoring engine works without it.

3. **Run**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The home page redirects to `/partners`.

## Scripts

- `pnpm dev` — start dev server
- `pnpm build` — production build
- `pnpm start` — start production server
- `pnpm lint` — run ESLint

## Project structure

- `src/app` — routes (partners, am, admin, onboarding)
- `src/components` — ui, am, admin components
- `src/data` — mock partners
- `src/lib` — types, constants, matching, utils
- `src/hooks` — use-filters, use-search
