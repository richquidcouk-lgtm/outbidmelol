import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/url";

/** One-off, temporary route for manual board adjustments. Delete after use. */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SEED_SECRET;
  if (!secret || request.headers.get("x-admin-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, totalBidCents } = (await request.json()) as {
    url: string;
    totalBidCents: number;
  };
  const normalized = normalizeUrl(url);
  if (!normalized) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  const listing = await prisma.listing.update({
    where: { url: normalized },
    data: { totalBidCents, lastBidAt: new Date() },
  });

  return NextResponse.json({ ok: true, listing });
}
