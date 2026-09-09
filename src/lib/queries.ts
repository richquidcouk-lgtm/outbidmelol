import { isCategorySlug } from "./categories";
import { prisma } from "./prisma";
import type { ActivityEvent, BoardListing, BoardStats, RangeFilter } from "./types";

function startOfUtcDay(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Full board, all-time order — the canonical ranking every page derives from. */
export async function getBoardListings(now: Date = new Date()): Promise<BoardListing[]> {
  const dayStart = startOfUtcDay(now);

  const [listings, todayBids] = await Promise.all([
    prisma.listing.findMany({
      orderBy: [{ totalBidCents: "desc" }, { lastBidAt: "asc" }],
      include: {
        bids: {
          where: { status: "paid" },
          orderBy: { paidAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.bid.groupBy({
      by: ["listingId"],
      where: { status: "paid", paidAt: { gte: dayStart }, listingId: { not: null } },
      _sum: { amountCents: true },
    }),
  ]);

  const todayByListing = new Map(
    todayBids.map((b) => [b.listingId as string, b._sum.amountCents ?? 0]),
  );

  return listings.map((l) => ({
    id: l.id,
    name: l.name,
    url: l.url,
    tagline: l.tagline,
    imageUrl: l.imageUrl,
    category: isCategorySlug(l.category) ? l.category : "other",
    totalBidCents: l.totalBidCents,
    todayBidCents: todayByListing.get(l.id) ?? 0,
    lastBidAmountCents: l.bids[0]?.amountCents ?? l.totalBidCents,
    clickCount: l.clickCount,
    createdAt: l.createdAt,
    lastBidAt: l.lastBidAt,
  }));
}

/** Independent of the full list — the header pill only needs these three numbers. */
export async function getBoardStats(now: Date = new Date()): Promise<BoardStats> {
  const dayStart = startOfUtcDay(now);

  const [totals, bidsToday] = await Promise.all([
    prisma.listing.aggregate({
      _sum: { totalBidCents: true },
      _count: true,
    }),
    prisma.listing.count({ where: { lastBidAt: { gte: dayStart } } }),
  ]);

  return {
    totalRaisedCents: totals._sum.totalBidCents ?? 0,
    listingCount: totals._count,
    bidsToday,
  };
}

export async function getRecentActivity(limit = 6): Promise<ActivityEvent[]> {
  const bids = await prisma.bid.findMany({
    where: { status: "paid" },
    orderBy: { paidAt: "desc" },
    take: limit,
    include: { listing: { select: { name: true } } },
  });

  return bids
    .filter((b) => b.listing && b.paidAt)
    .map((b) => ({
      listingId: b.listingId as string,
      listingName: b.listing!.name,
      amountCents: b.amountCents,
      at: b.paidAt as Date,
    }));
}

/** Pure re-ranking of an already-fetched board — presentation logic, not a query. */
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

export async function getMostRecentBidAt(): Promise<Date | null> {
  const mostRecent = await prisma.listing.findFirst({
    orderBy: { lastBidAt: "desc" },
    select: { lastBidAt: true },
  });
  return mostRecent?.lastBidAt ?? null;
}

export async function getLeaderTotalCents(): Promise<number | null> {
  const leader = await prisma.listing.findFirst({
    orderBy: [{ totalBidCents: "desc" }, { lastBidAt: "asc" }],
    select: { totalBidCents: true },
  });
  return leader?.totalBidCents ?? null;
}

/** Just the fields the OG image needs — not the full board shape. */
export function getLeaderListing() {
  return prisma.listing.findFirst({
    orderBy: [{ totalBidCents: "desc" }, { lastBidAt: "asc" }],
    select: { name: true, imageUrl: true },
  });
}

export function getListingByUrl(normalizedUrl: string) {
  return prisma.listing.findUnique({ where: { url: normalizedUrl } });
}

export function getListingById(id: string) {
  return prisma.listing.findUnique({ where: { id } });
}
