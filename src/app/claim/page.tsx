import { ClaimForm } from "@/components/ClaimForm";
import { getSeedListings } from "@/lib/seed-data";
import { normalizeUrl } from "@/lib/url";

export const metadata = {
  title: "Claim a spot — Outbid Me",
  description: "Pay to put your listing on the board. $5 minimum.",
};

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;
  const lockedUrl = url ? (normalizeUrl(url) ?? undefined) : undefined;

  // Phase 1 fixture — swapped for a Prisma query in Phase 2.
  const listings = getSeedListings();
  const leaderTotalCents = listings[0]?.totalBidCents ?? null;

  return (
    <section className="border-b border-rule bg-plate px-4 py-8">
      <h1 className="font-display text-4xl font-black leading-[0.95]">
        {lockedUrl ? "Bump a listing" : "Claim a spot"}
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted">
        {lockedUrl
          ? "Money you add goes onto this listing's running total and moves it up the board."
          : "Your position is whatever you have paid, compared to everyone else. Nothing else."}
      </p>

      <ClaimForm lockedUrl={lockedUrl} leaderTotalCents={leaderTotalCents} />
    </section>
  );
}
