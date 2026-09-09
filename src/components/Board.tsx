import { ListingRow } from "./ListingRow";
import type { BoardListing, RangeFilter } from "@/lib/types";

export function Board({
  listings,
  now,
  range,
}: {
  listings: BoardListing[];
  now: Date;
  range: RangeFilter;
}) {
  if (listings.length === 0) {
    return (
      <div className="border-b border-rule bg-plate px-4 py-16 text-center">
        <p className="font-display text-3xl font-black">
          {range === "today" ? "No bids yet today" : "The board is empty"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {range === "today"
            ? "Nobody has paid today. Be the first and take the top spot."
            : "Nobody has paid for a spot yet. The first $5 takes #1."}
        </p>
      </div>
    );
  }

  return (
    <ol className="border-t border-rule">
      {listings.map((listing, i) => (
        <ListingRow
          key={listing.id}
          listing={listing}
          rank={i + 1}
          now={now}
          range={range}
        />
      ))}
    </ol>
  );
}
