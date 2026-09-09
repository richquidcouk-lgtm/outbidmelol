import type { MetadataRoute } from "next";
import { getSeedListings } from "@/lib/seed-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Phase 1 fixture — swapped for a Prisma query (MAX(lastBidAt)) in Phase 2.
  const listings = getSeedListings();
  const mostRecentBid = listings.reduce(
    (latest, l) => (l.lastBidAt > latest ? l.lastBidAt : latest),
    listings[0]?.lastBidAt ?? new Date(),
  );

  return [
    {
      url: SITE_URL,
      lastModified: mostRecentBid,
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/claim`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/refunds`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
