import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Polled by /success. Looks up by Stripe's session id rather than our own
 * Bid id because that's the only identifier the Payment Link's configurable
 * post-payment redirect can carry back (`{CHECKOUT_SESSION_ID}`) — so
 * there's an unavoidable gap between landing on /success and the webhook
 * actually setting stripeSessionId. "not_found" during that gap is expected,
 * not an error; the client just keeps polling.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await params;

  const bid = await prisma.bid.findFirst({
    where: { stripeSessionId: sessionId },
    include: { listing: { select: { id: true, name: true, totalBidCents: true } } },
  });

  if (!bid || bid.status !== "paid" || !bid.listing) {
    return NextResponse.json({ status: "pending" });
  }

  const higherRanked = await prisma.listing.count({
    where: { totalBidCents: { gt: bid.listing.totalBidCents } },
  });

  return NextResponse.json({
    status: "paid",
    listingId: bid.listing.id,
    listingName: bid.listing.name,
    rank: higherRanked + 1,
  });
}
