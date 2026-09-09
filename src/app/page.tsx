import { ActivityTicker } from "@/components/ActivityTicker";
import { Board } from "@/components/Board";
import { CategoryPills } from "@/components/CategoryPills";
import { QuickClaimForm } from "@/components/QuickClaimForm";
import { RangeToggle } from "@/components/RangeToggle";
import { StatsStrip } from "@/components/StatsStrip";
import { parseBoardQuery } from "@/lib/board-query";
import { MIN_BID_CENTS, formatMoney } from "@/lib/money";
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
  const suggestedCents = leader ? leader.totalBidCents + 500 : MIN_BID_CENTS;

  const rangeListings = rankListings(allListings, query.range);
  const counts: Partial<Record<string, number>> = {};
  for (const l of rangeListings) counts[l.category] = (counts[l.category] ?? 0) + 1;

  const visibleListings = query.category
    ? rangeListings.filter((l) => l.category === query.category)
    : rangeListings;

  return (
    <div className="space-y-4">
      <ActivityTicker events={activity} now={now} />

      <CategoryPills
        query={query}
        counts={counts}
        total={rangeListings.length}
      />

      <div className="flex flex-col items-center gap-1.5">
        <RangeToggle query={query} />
        <span className="text-xs text-muted">
          {query.range === "today"
            ? "Ranked by money paid today"
            : "Ranked by total money paid, ever"}
        </span>
      </div>

      <section className="glass rise-in overflow-hidden rounded-2xl px-5 py-8 text-center sm:px-8 sm:py-10">
        <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
          {leader ? (
            <>
              Claim <span className="gradient-text">#1</span> for{" "}
              <span className="money-text">{formatMoney(suggestedCents)}</span>
            </>
          ) : (
            <span className="gradient-text">Claim #1 for $5</span>
          )}
        </h1>
        <p className="mx-auto mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
          Rank is bought, not earned — the highest cumulative bid wins the top
          spot. Pay more than the listing above you and you move past it.
          Anyone can pay to move anyone up.
        </p>

        <div className="mx-auto max-w-2xl text-left">
          <QuickClaimForm suggestedCents={suggestedCents} />
        </div>
      </section>

      <StatsStrip stats={stats} />

      <Board listings={visibleListings} now={now} range={query.range} />
    </div>
  );
}
