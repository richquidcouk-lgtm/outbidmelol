import { NextResponse } from "next/server";
import { isCategorySlug } from "@/lib/categories";
import { MIN_BID_CENTS } from "@/lib/money";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/url";

type CheckoutBody = {
  url?: string;
  amountCents?: number;
  name?: string;
  tagline?: string;
  imageUrl?: string;
  category?: string;
};

/**
 * Creates a `pending` Bid and returns the URL to redirect the browser to.
 *
 * The Payment Link lets the buyer type any amount on Stripe's own page, so
 * amountCents here is only a suggestion — it seeds the Bid row so the
 * webhook has something to update, but the real charged amount comes from
 * Stripe's `amount_total` once payment confirms. The Payment Link's
 * `client_reference_id` param carries this Bid's id through to the webhook.
 */
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const normalized = body.url ? normalizeUrl(body.url) : null;
  if (!normalized) {
    return NextResponse.json({ error: "That does not look like a web address." }, { status: 400 });
  }

  const amountCents = Math.round(body.amountCents ?? 0);
  if (!Number.isFinite(amountCents) || amountCents < MIN_BID_CENTS) {
    return NextResponse.json(
      { error: `Minimum bid is $${(MIN_BID_CENTS / 100).toFixed(2)}.` },
      { status: 400 },
    );
  }

  const existing = await prisma.listing.findUnique({ where: { url: normalized } });

  let bidId: string;
  if (existing) {
    const bid = await prisma.bid.create({
      data: { listingId: existing.id, amountCents, status: "pending" },
      select: { id: true },
    });
    bidId = bid.id;
  } else {
    const name = body.name?.trim();
    const tagline = body.tagline?.trim();
    const imageUrl = body.imageUrl?.trim();
    const category = body.category?.trim();

    if (!name || !tagline || !imageUrl || !category || !isCategorySlug(category)) {
      return NextResponse.json(
        { error: "Name, tagline, image, and category are all required for a new listing." },
        { status: 400 },
      );
    }

    const bid = await prisma.bid.create({
      data: {
        amountCents,
        status: "pending",
        pendingName: name,
        pendingUrl: normalized,
        pendingTagline: tagline,
        pendingImageUrl: imageUrl,
        pendingCategory: category,
      },
      select: { id: true },
    });
    bidId = bid.id;
  }

  const paymentLinkUrl = process.env.STRIPE_PAYMENT_LINK_URL;
  if (!paymentLinkUrl) {
    return NextResponse.json(
      { error: "Payments aren't configured yet — try again shortly." },
      { status: 500 },
    );
  }

  const redirectUrl = new URL(paymentLinkUrl);
  redirectUrl.searchParams.set("client_reference_id", bidId);

  return NextResponse.json({ redirectUrl: redirectUrl.toString() });
}
