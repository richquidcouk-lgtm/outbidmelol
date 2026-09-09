import type { Metadata } from "next";
import { ClaimForm } from "@/components/ClaimForm";
import { getLeaderTotalCents, getListingByUrl } from "@/lib/queries";
import { normalizeUrl } from "@/lib/url";

const TITLE = "Claim a spot on Outbid Me — pay to rank #1";
const DESCRIPTION =
  "Submit your link and a bid to take a spot on Outbid Me's leaderboard. $5 minimum — pay more than the listing above you to move past it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // ?url=/?amount= only pre-fill the form (see ClaimPage below) — they don't
  // change the page's content in any way worth indexing separately, so every
  // variant canonicalizes to the bare form.
  alternates: { canonical: "/claim" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/claim" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string; amount?: string }>;
}) {
  const { url, amount } = await searchParams;
  const normalized = url ? normalizeUrl(url) : null;

  const [leaderTotalCents, existing] = await Promise.all([
    getLeaderTotalCents(),
    normalized ? getListingByUrl(normalized) : Promise.resolve(null),
  ]);

  // An existing URL bumps that listing (name/tagline/image locked to the
  // original creator); a new URL just pre-fills the field so it stays
  // editable — same URL param, two different meanings.
  const lockedUrl = existing?.url;
  const prefillUrl = normalized && !existing ? normalized : undefined;
  const prefillAmount = amount ? Number(amount) : undefined;

  return (
    <section className="glass rise-in rounded-2xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        <span className="gradient-text">
          {lockedUrl ? "Bump a listing" : "Claim a spot"}
        </span>
      </h1>
      <p className="mt-2 max-w-prose text-sm text-muted">
        {lockedUrl
          ? "Money you add goes onto this listing's running total and moves it up the board."
          : "Your position is whatever you have paid, compared to everyone else. Nothing else."}
      </p>

      <ClaimForm
        lockedUrl={lockedUrl}
        prefillUrl={prefillUrl}
        prefillAmount={
          prefillAmount && Number.isFinite(prefillAmount)
            ? prefillAmount
            : undefined
        }
        leaderTotalCents={leaderTotalCents}
      />
    </section>
  );
}
