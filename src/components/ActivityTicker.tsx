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

  return (
    <div className="overflow-x-auto border-b border-rule bg-ink">
      <ul className="flex w-max gap-6 px-4 py-2 text-xs text-white/90">
        {events.map((e, i) => (
          <li key={`${e.listingId}-${i}`} className="flex shrink-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gain" aria-hidden />
            <span className="tnum font-semibold">{formatMoney(e.amountCents)}</span>
            <span className="opacity-70">on</span>
            <span className="font-medium">{e.listingName}</span>
            <span className="tnum opacity-50">{relativeTime(e.at, now)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
