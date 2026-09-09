# Outbid Me

A public leaderboard where rank is decided purely by cumulative money paid — pay more than
the listing above you and you move past it. Every listing carries a brand image, not just text.

## Status

The board, filters, and claim form still run against fixture data in `src/lib/seed-data.ts` —
none of the app's own pages read from the database yet. What exists so far toward real payments:

- **`prisma/schema.prisma` + an offline-generated migration** (`prisma/migrations/`) — `Listing`
  and `Bid` models, matching the shapes `seed-data.ts` already produces. Not yet applied to a
  real database (no `DATABASE_URL` set up yet) and no application code queries it yet.
- **Payment model: a single Stripe Payment Link with a customer-chosen amount**, not a
  dynamically-created Checkout Session. That means: (a) the $5 floor must be configured on the
  Payment Link itself in the Stripe dashboard — our own client-side validation can't enforce it
  on Stripe's hosted page — and (b) our UI can only *suggest* an amount, never guarantee what the
  buyer actually pays, since that's typed in on Stripe's page. A pending `Bid` row is created
  first so the Payment Link's `client_reference_id` param has something to point back to; the
  webhook fills in the real `amount_total` once payment confirms.
- **Not yet built**: the `/api/checkout` redirect route, the webhook that confirms a paid bid,
  `/success`, and Vercel Blob image upload. `/claim` validates input client-side but its submit
  handler still stops short of checkout.
- `/api/go/[id]` redirects to the listing's URL (proves the click-through mechanism) but does
  not yet persist a click count — there's no live database to persist it into.

Once those land, the env vars below become required for local development and for the Vercel
deployment.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables (not yet consumed by the app)

```
DATABASE_URL=
STRIPE_PAYMENT_LINK_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=https://www.outbid-me.lol
```

`DATABASE_URL`: create one from the Vercel project's **Storage** tab → **Create Database** →
**Postgres** — it's added to Vercel's env vars automatically. `STRIPE_PAYMENT_LINK_URL` is the
"customer chooses price" Payment Link buyers get redirected to. `STRIPE_SECRET_KEY` is only
needed if the app calls the Stripe API directly (it currently doesn't — checkout is a redirect to
a pre-made link, not an API call); `STRIPE_WEBHOOK_SECRET` is required to verify
`checkout.session.completed` events. There's no `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — that's for
Stripe.js/Elements, which this flow doesn't use since checkout happens entirely on Stripe's own
hosted page.

`NEXT_PUBLIC_SITE_URL` is already read (for canonical URLs, OG/Twitter metadata, and the
sitemap/robots.txt — see `src/lib/site.ts`) and defaults to the `www` host the site is actually
deployed at if unset. **Set it explicitly in the Vercel project's env vars** so it matches
whichever of `outbid-me.lol` / `www.outbid-me.lol` is configured as the primary domain — a
mismatch there would make canonical tags point at a host that 301s away from itself. The rest are
placeholders for the Prisma/Stripe/Blob phases.

## SEO

Per-route metadata (title/description/canonical), Open Graph + Twitter Card images
(`app/opengraph-image.tsx` is dynamic — live stats + current #1 — on the same 15s revalidate
window as the board; `/about` and `/claim` get simple static ones), `robots.ts`/`sitemap.ts`,
JSON-LD (`WebSite` + `ItemList` on `/`), and real favicon/app icons are all in place. Filtered
board views (`?category=`, `?range=`) and `/claim`'s prefill params (`?url=`, `?amount=`) all
canonicalize back to their bare route rather than getting indexed as separate pages. `/success`
isn't built yet (Stripe phase), so it has no page-level `noindex` yet, but `/success` is already
disallowed in `robots.ts` ahead of that.

## How ranking works

- A listing's position is its cumulative amount paid, highest first — no votes, no algorithm.
- Bidding on a URL that's already listed adds to that listing's running total instead of
  creating a duplicate.
- Anyone can bid on any listing, not just its creator — but only the original creator's name,
  tagline, and image stand; later bids only move money.
- Listings are keyed by a normalized URL (protocol, `www.`, trailing slash, query, and hash
  stripped), so `example.com/a` and `example.com/b` are distinct listings.
- The "Today" view ranks by money paid since UTC midnight instead of the all-time total.

## Known gaps

- **No content moderation.** Anyone can submit any image/name/tagline once claim is wired to
  checkout. Decide before opening real payments whether that needs manual review or an
  automated check.
- **Abandoned checkouts** will leave `pending` bids behind once Stripe is wired up; the plan is
  to simply exclude non-`paid` bids from every query rather than clean them up.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL (planned) · Stripe
Checkout (planned) · Vercel Blob (planned) · deploy target: Vercel.
