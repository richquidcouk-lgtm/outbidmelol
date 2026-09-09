import { NextResponse } from "next/server";
import { getSeedListings } from "@/lib/seed-data";
import { toHref } from "@/lib/url";

/**
 * Every outbound listing link routes through here so clicks can be counted.
 * Phase 1 fixture data is regenerated per request, so counts don't persist
 * yet — this just proves the redirect works. Phase 2 swaps the lookup for a
 * Prisma read and increments Listing.clickCount before redirecting.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const listing = getSeedListings().find((l) => l.id === id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.redirect(toHref(listing.url), { status: 302 });
}
