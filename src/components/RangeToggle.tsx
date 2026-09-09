import Link from "next/link";
import { buildBoardHref, type BoardQuery } from "@/lib/board-query";

export function RangeToggle({ query }: { query: BoardQuery }) {
  const tabs: { range: "all" | "today"; label: string }[] = [
    { range: "all", label: "All-time" },
    { range: "today", label: "Today" },
  ];

  return (
    <div className="inline-flex rounded-full bg-surface-2 p-1 text-sm">
      {tabs.map((tab) => {
        const active = query.range === tab.range;
        return (
          <Link
            key={tab.range}
            href={buildBoardHref("/", query, { range: tab.range })}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition-all ${
              active
                ? "bg-gradient-to-r from-gain to-accent-2 text-white shadow-[0_2px_10px_var(--glow-money)]"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
