import { formatMoney } from "@/lib/money";
import type { BoardStats } from "@/lib/types";

export function StatsStrip({ stats }: { stats: BoardStats }) {
  const cells = [
    {
      label: "raised all-time",
      value: formatMoney(stats.totalRaisedCents),
      icon: "\u{1F4B0}",
      glow: true,
    },
    {
      label: "listings",
      value: String(stats.listingCount),
      icon: "\u{1F4CB}",
      glow: false,
    },
    {
      label: "bids today",
      value: String(stats.bidsToday),
      icon: "\u{26A1}",
      glow: false,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="glass rounded-2xl px-3 py-4 text-center sm:px-4 sm:text-left"
        >
          <div className="text-lg sm:hidden">{cell.icon}</div>
          <div
            className={`font-display tnum text-2xl font-black leading-none sm:text-3xl ${
              cell.glow ? "money-text" : ""
            }`}
          >
            <span className="mr-1 hidden sm:inline">{cell.icon}</span>
            {cell.value}
          </div>
          <div className="mt-1.5 text-xs text-muted">{cell.label}</div>
        </div>
      ))}
    </div>
  );
}
