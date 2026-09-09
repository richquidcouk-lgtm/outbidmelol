import type { CategorySlug } from "./categories";
import type { ActivityEvent, BoardListing, BoardStats, RangeFilter } from "./types";

// Temporary Phase 1 fixture. Replaced by Prisma queries in Phase 2.
const HOUR = 3_600_000;

type SeedRow = {
  name: string;
  url: string;
  tagline: string;
  slug: string;
  category: CategorySlug;
  totalBidCents: number;
  lastBidAmountCents: number;
  clickCount: number;
  /** Hours since the most recent bid landed. */
  lastBidHoursAgo: number;
  /** Hours since the listing was first created (>= lastBidHoursAgo). */
  createdHoursAgo: number;
};

const rows: SeedRow[] = [
  { name: "Hyperloop Coffee", url: "hyperloopcoffee.com", tagline: "Beans that arrive before you order them.", slug: "hyperloop-coffee", category: "food", totalBidCents: 412_00, lastBidAmountCents: 412_00, clickCount: 1387, lastBidHoursAgo: 0.2, createdHoursAgo: 0.2 },
  { name: "Voidmail", url: "voidmail.io", tagline: "An inbox that deletes itself every Sunday.", slug: "voidmail", category: "dev-tools", totalBidCents: 388_50, lastBidAmountCents: 60_00, clickCount: 1204, lastBidHoursAgo: 1.4, createdHoursAgo: 55 * 24 },
  { name: "Scrapheap", url: "scrapheap.parts", tagline: "Marketplace for parts nobody makes anymore.", slug: "scrapheap", category: "ecommerce", totalBidCents: 305_00, lastBidAmountCents: 25_00, clickCount: 966, lastBidHoursAgo: 3, createdHoursAgo: 48 * 24 },
  { name: "Dutch Bulb Co.", url: "dutchbulb.co", tagline: "Tulips, shipped dormant, bloom on your schedule.", slug: "dutchbulb", category: "ecommerce", totalBidCents: 190_00, lastBidAmountCents: 15_00, clickCount: 741, lastBidHoursAgo: 6, createdHoursAgo: 30 * 24 },
  { name: "Nine Lives", url: "ninelives.pet", tagline: "Insurance for cats who climb things.", slug: "nine-lives", category: "business", totalBidCents: 155_00, lastBidAmountCents: 20_00, clickCount: 583, lastBidHoursAgo: 11, createdHoursAgo: 22 * 24 },
  { name: "Tinbox", url: "tinbox.audio", tagline: "Field recorders built like lunchboxes.", slug: "tinbox", category: "hardware", totalBidCents: 120_00, lastBidAmountCents: 10_00, clickCount: 512, lastBidHoursAgo: 20, createdHoursAgo: 18 * 24 },
  { name: "Ferment", url: "ferment.kitchen", tagline: "Sourdough starters with lineage papers.", slug: "ferment", category: "food", totalBidCents: 88_00, lastBidAmountCents: 8_00, clickCount: 398, lastBidHoursAgo: 27, createdHoursAgo: 14 * 24 },
  { name: "Orbit Labs", url: "orbitlabs.dev", tagline: "Satellite telemetry as a boring REST API.", slug: "orbit-labs", category: "dev-tools", totalBidCents: 64_00, lastBidAmountCents: 12_00, clickCount: 301, lastBidHoursAgo: 40, createdHoursAgo: 10 * 24 },
  { name: "Saltmarsh", url: "saltmarsh.farm", tagline: "Seaweed fertiliser from the Norfolk coast.", slug: "saltmarsh", category: "ecommerce", totalBidCents: 41_00, lastBidAmountCents: 6_00, clickCount: 219, lastBidHoursAgo: 52, createdHoursAgo: 9 * 24 },
  { name: "Pigeonpost", url: "pigeonpost.mail", tagline: "Letters delivered slowly, deliberately.", slug: "pigeonpost", category: "agencies", totalBidCents: 27_50, lastBidAmountCents: 5_00, clickCount: 164, lastBidHoursAgo: 76, createdHoursAgo: 7 * 24 },
  { name: "Last Call", url: "lastcall.bar", tagline: "Finds the one place still open near you.", slug: "lastcall", category: "travel", totalBidCents: 12_00, lastBidAmountCents: 5_00, clickCount: 97, lastBidHoursAgo: 96, createdHoursAgo: 5 * 24 },
  { name: "Mossware", url: "mossware.sh", tagline: "Terminal tools that grow on you.", slug: "mossware", category: "dev-tools", totalBidCents: 5_00, lastBidAmountCents: 5_00, clickCount: 31, lastBidHoursAgo: 140, createdHoursAgo: 6 * 24 },
];

export function getSeedListings(now: Date = new Date()): BoardListing[] {
  const startOfUtcDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  return rows
    .map((r, i): BoardListing => {
      const lastBidAt = new Date(now.getTime() - r.lastBidHoursAgo * HOUR);
      const createdAt = new Date(now.getTime() - r.createdHoursAgo * HOUR);
      const bidLandedToday = lastBidAt.getTime() >= startOfUtcDay;
      return {
        id: `seed-${i + 1}`,
        name: r.name,
        url: r.url,
        tagline: r.tagline,
        imageUrl: `/seed/${r.slug}.svg`,
        category: r.category,
        totalBidCents: r.totalBidCents,
        todayBidCents: bidLandedToday ? r.lastBidAmountCents : 0,
        lastBidAmountCents: r.lastBidAmountCents,
        clickCount: r.clickCount,
        createdAt,
        lastBidAt,
      };
    })
    .sort(
      (a, b) =>
        b.totalBidCents - a.totalBidCents ||
        a.lastBidAt.getTime() - b.lastBidAt.getTime(),
    );
}

export function rankListings(
  listings: BoardListing[],
  range: RangeFilter,
): BoardListing[] {
  if (range === "all") return listings;
  return listings
    .filter((l) => l.todayBidCents > 0)
    .slice()
    .sort(
      (a, b) =>
        b.todayBidCents - a.todayBidCents ||
        a.lastBidAt.getTime() - b.lastBidAt.getTime(),
    );
}

export function getSeedStats(
  listings: BoardListing[],
  now: Date = new Date(),
): BoardStats {
  const startOfUtcDay = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return {
    totalRaisedCents: listings.reduce((sum, l) => sum + l.totalBidCents, 0),
    listingCount: listings.length,
    bidsToday: listings.filter((l) => l.lastBidAt.getTime() >= startOfUtcDay)
      .length,
  };
}

export function getSeedActivity(
  listings: BoardListing[],
  limit = 6,
): ActivityEvent[] {
  return listings
    .slice()
    .sort((a, b) => b.lastBidAt.getTime() - a.lastBidAt.getTime())
    .slice(0, limit)
    .map((l) => ({
      listingId: l.id,
      listingName: l.name,
      amountCents: l.lastBidAmountCents,
      at: l.lastBidAt,
    }));
}
