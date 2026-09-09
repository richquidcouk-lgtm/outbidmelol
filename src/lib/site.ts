/**
 * Single source of truth for the canonical origin. Falls back to the www
 * host the site is actually deployed at; set NEXT_PUBLIC_SITE_URL in Vercel
 * to override without a code change.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.outbid-me.lol";
