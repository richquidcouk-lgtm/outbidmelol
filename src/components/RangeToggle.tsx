import Link from "next/link";
import { buildBoardHref, type BoardQuery } from "@/lib/board-query";

export function RangeToggle({ query }: { query: BoardQuery }) {
  const tabs: { range: "all" | "today"; label: string }[] = [
    { range: "all", label: "All-time" },
    { range: "today", label: "Today" },
  ];

  return (
    <div className="inline-flex rounded-full border border-rule bg-plate p-0.5 text-sm">
      {tabs.map((tab) => {
        const active = query.range === tab.range;
        return (
          <Link
            key={tab.range}
            href={buildBoardHref("/", query, { range: tab.range })}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              active ? "bg-gain text-white" : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
