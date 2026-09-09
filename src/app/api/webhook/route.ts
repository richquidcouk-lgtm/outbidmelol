import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Confirms a `checkout.session.completed` event and finalizes the matching
 * pending Bid. Idempotent via the `status: "pending"` guard in the update
 * below — a retried webhook delivery finds the bid already `paid` and its
 * updateMany matches zero rows, so nothing gets double-counted.
 */
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set — refusing to process webhook");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_not_configured");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const bidId = session.client_reference_id;
  const amountCents = session.amount_total;

  if (!bidId || amountCents == null) {
    console.error("Webhook missing client_reference_id or amount_total", {
      bidId,
      amountCents,
    });
    return NextResponse.json({ received: true });
  }

  const claimed = await prisma.bid.updateMany({
    where: { id: bidId, status: "pending" },
    data: {
      status: "paid",
      amountCents,
      stripeSessionId: session.id,
      paidAt: new Date(),
    },
  });

  // 0 rows: either a retried delivery for an already-processed bid, or a
  // stale/unknown client_reference_id — either way there's nothing left to do.
  if (claimed.count === 0) {
    return NextResponse.json({ received: true });
  }

  const bid = await prisma.bid.findUniqueOrThrow({ where: { id: bidId } });
  const now = new Date();

  if (bid.listingId) {
    // Bump: add to an existing listing's running total.
    await prisma.listing.update({
      where: { id: bid.listingId },
      data: { totalBidCents: { increment: amountCents }, lastBidAt: now },
    });
  } else {
    // New listing: only materializes once its first bid is actually paid.
    const listing = await prisma.listing.create({
      data: {
        name: bid.pendingName!,
        url: bid.pendingUrl!,
        tagline: bid.pendingTagline!,
        imageUrl: bid.pendingImageUrl!,
        category: bid.pendingCategory!,
        totalBidCents: amountCents,
        lastBidAt: now,
      },
    });
    await prisma.bid.update({
      where: { id: bid.id },
      data: { listingId: listing.id },
    });
  }

  return NextResponse.json({ received: true });
}
