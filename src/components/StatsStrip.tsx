import { formatMoney } from "@/lib/money";
import type { BoardStats } from "@/lib/types";

export function StatsStrip({ stats }: { stats: BoardStats }) {
  const cells = [
    { label: "raised all-time", value: formatMoney(stats.totalRaisedCents) },
    { label: "listings", value: String(stats.listingCount) },
    { label: "bids today", value: String(stats.bidsToday) },
  ];

  return (
    <div className="grid grid-cols-3 border-b border-rule bg-plate md:sticky md:top-0 md:z-10">
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`px-4 py-3 ${i > 0 ? "border-l border-rule" : ""}`}
        >
          <div className="font-display tnum text-2xl font-black leading-none sm:text-3xl">
            {cell.value}
          </div>
          <div className="mt-1 text-xs text-muted">{cell.label}</div>
        </div>
      ))}
    </div>
  );
}
