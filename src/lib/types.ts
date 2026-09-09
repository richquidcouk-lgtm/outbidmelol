import type { CategorySlug } from "./categories";

export type BoardListing = {
  id: string;
  name: string;
  /** Normalized key, e.g. "hyperloopcoffee.com" — render via toHref(). */
  url: string;
  tagline: string;
  imageUrl: string;
  category: CategorySlug;
  totalBidCents: number;
  /** Sum of paid bids since the start of the current UTC day. */
  todayBidCents: number;
  /** Size of the most recent paid bid, for the activity ticker. */
  lastBidAmountCents: number;
  clickCount: number;
  createdAt: Date;
  lastBidAt: Date;
};

export type BoardStats = {
  totalRaisedCents: number;
  listingCount: number;
  bidsToday: number;
};

export type RangeFilter = "all" | "today";

export type ActivityEvent = {
  listingId: string;
  listingName: string;
  amountCents: number;
  at: Date;
};
