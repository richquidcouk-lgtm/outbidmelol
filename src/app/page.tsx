import Link from "next/link";
import { ActivityTicker } from "@/components/ActivityTicker";
import { Board } from "@/components/Board";
import { CategoryPills } from "@/components/CategoryPills";
import { RangeToggle } from "@/components/RangeToggle";
import { StatsStrip } from "@/components/StatsStrip";
import { parseBoardQuery } from "@/lib/board-query";
import { formatMoney } from "@/lib/money";
import {
  getSeedActivity,
  getSeedListings,
  getSeedStats,
  rankListings,
} from "@/lib/seed-data";

export const revalidate = 15;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; range?: string }>;
}) {
  const query = parseBoardQuery(await searchParams);
  const now = new Date();

  // Phase 1 fixture — swapped for a Prisma query in Phase 2.
  const allListings = getSeedListings(now);
  const stats = getSeedStats(allListings, now);
  const activity = getSeedActivity(allListings);
  const leader = allListings[0];

  const rangeListings = rankListings(allListings, query.range);
  const counts: Partial<Record<string, number>> = {};
  for (const l of rangeListings) counts[l.category] = (counts[l.category] ?? 0) + 1;

  const visibleListings = query.category
    ? rangeListings.filter((l) => l.category === query.category)
    : rangeListings;

  return (
    <>
      <ActivityTicker events={activity} now={now} />
      <StatsStrip stats={stats} />

      <section className="border-b border-rule px-4 py-6">
        <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
          Rank is bought,
          <br />
          not earned.
        </h1>
        <p className="mt-3 max-w-prose text-sm text-muted">
          Every position on this board is decided by one number: how much has
          been paid for it. Pay more than the listing above you and you move
          past it. Anyone can pay to move anyone up.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/claim"
            className="rounded-full bg-gain px-4 py-2 font-medium text-white"
          >
            Claim a spot
          </Link>
          {leader ? (
            <span className="text-sm text-muted">
              Beat{" "}
              <span className="tnum font-semibold text-ink">
                {formatMoney(leader.totalBidCents)}
              </span>{" "}
              to take #1
            </span>
          ) : (
            <span className="text-sm text-muted">
              $5 minimum. The board is empty.
            </span>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule bg-plate px-4 py-3">
        <RangeToggle query={query} />
        <span className="text-xs text-muted">
          {query.range === "today"
            ? "Ranked by money paid today"
            : "Ranked by total money paid, ever"}
        </span>
      </div>

      <CategoryPills
        query={query}
        counts={counts}
        total={rangeListings.length}
      />

      <Board listings={visibleListings} now={now} range={query.range} />
    </>
  );
}
