import { formatMoney } from "@/lib/money";
import { getBoardStats } from "@/lib/queries";

/**
 * Its own async component behind a Suspense boundary (see layout.tsx) so a
 * DB fetch for this one pill doesn't force every route — including static
 * pages like /terms and Next's own /_not-found — to require live database
 * connectivity just to prerender.
 */
export async function HeaderStatsPill() {
  const stats = await getBoardStats();

  return (
    <span className="hidden items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted md:flex">
      <span
        className="h-1.5 w-1.5 rounded-full bg-gain shadow-[0_0_6px_var(--glow-money)]"
        aria-hidden
      />
      <span className="tnum font-semibold text-ink">
        {formatMoney(stats.totalRaisedCents)}
      </span>
      raised · {stats.listingCount} listings
    </span>
  );
}
