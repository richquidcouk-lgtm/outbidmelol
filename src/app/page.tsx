import type { Metadata } from "next";
import { ActivityTicker } from "@/components/ActivityTicker";
import { Board } from "@/components/Board";
import { CategoryPills } from "@/components/CategoryPills";
import { QuickClaimForm } from "@/components/QuickClaimForm";
import { RangeToggle } from "@/components/RangeToggle";
import { StatsStrip } from "@/components/StatsStrip";
import { parseBoardQuery } from "@/lib/board-query";
import { MIN_BID_CENTS, formatMoney } from "@/lib/money";
import {
  getBoardListings,
  getBoardStats,
  getRecentActivity,
  rankListings,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/site";
import { toHref } from "@/lib/url";

// Root layout is force-dynamic (see layout.tsx) — this route inherits that
// and always renders per-request, so there's no separate revalidate here.

const TITLE = "Outbid Me — the board where money is the only ranking";
const DESCRIPTION =
  "A public leaderboard ranked purely by how much has been paid. No votes, no algorithm. Pay more, rank higher.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Category/range are view filters on the same content, not distinct pages —
  // this canonical is static (not read from searchParams) so every
  // ?category=/?range= combination points back at the one indexable URL.
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; range?: string }>;
}) {
  const query = parseBoardQuery(await searchParams);
  const now = new Date();

  const [allListings, stats, activity] = await Promise.all([
    getBoardListings(now),
    getBoardStats(now),
    getRecentActivity(),
  ]);
  const leader = allListings[0];
  const suggestedCents = leader ? leader.totalBidCents + 500 : MIN_BID_CENTS;

  const rangeListings = rankListings(allListings, query.range);
  const counts: Partial<Record<string, number>> = {};
  for (const l of rangeListings) counts[l.category] = (counts[l.category] ?? 0) + 1;

  const visibleListings = query.category
    ? rangeListings.filter((l) => l.category === query.category)
    : rangeListings;

  // Reflects the canonical (unfiltered, all-time) board regardless of which
  // filtered view is currently rendered — the canonical URL always points at
  // this ranking, so the structured data should describe that, not whatever
  // ?category=/?range= slice a crawler happened to request.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Outbid Me",
        url: SITE_URL,
        description: DESCRIPTION,
      },
      {
        "@type": "ItemList",
        name: "Outbid Me leaderboard",
        description: "Listings ranked by cumulative amount paid, highest first.",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: allListings.length,
        itemListElement: allListings.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: l.name,
          url: toHref(l.url),
        })),
      },
    ],
  };

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger -- documented Next.js pattern for JSON-LD; JSON.stringify avoids the HTML-entity escaping a text child would apply
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
