import { formatMoney } from "@/lib/money";
import { relativeTime } from "@/lib/time";
import type { ActivityEvent } from "@/lib/types";

export function ActivityTicker({
  events,
  now,
}: {
  events: ActivityEvent[];
  now: Date;
}) {
  if (events.length === 0) return null;

  const items = (key: string) => (
    <ul className="flex w-max shrink-0 gap-6 pr-6">
      {events.map((e, i) => (
        <li
          key={`${key}-${e.listingId}-${i}`}
          className="flex shrink-0 items-center gap-1.5 text-xs"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-gain shadow-[0_0_8px_var(--glow-money)]"
            aria-hidden
          />
          <span className="tnum money-text font-semibold">
            {formatMoney(e.amountCents)}
          </span>
          <span className="text-muted opacity-80">on</span>
          <span className="font-medium">{e.listingName}</span>
          <span className="tnum text-muted opacity-60">
            {relativeTime(e.at, now)}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="glass overflow-hidden rounded-full px-4 py-2.5">
      <div className="marquee-track flex w-max">
        {items("a")}
        {items("b")}
      </div>
    </div>
  );
}
