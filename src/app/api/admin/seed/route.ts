import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUrl } from "@/lib/url";

/**
 * One-off, temporary route to seed the board with the operator's own sites
 * so it isn't empty at launch — bypasses the normal pay-to-list flow, which
 * is otherwise the only way a Listing row gets created. Protected by a
 * random secret that only exists in Vercel's env vars; delete this whole
 * route once it's been used.
 */
const SEED_LISTINGS: {
  name: string;
  url: string;
  tagline: string;
  imageUrl: string;
  category: string;
  amountCents: number;
}[] = [
  { name: "Angadi Bazar", url: "angadibazar.shop", tagline: "Local marketplace for everyday essentials.", imageUrl: "/brand/angadibazar.svg", category: "ecommerce", amountCents: 800_00 },
  { name: "Rich Quid", url: "richquid.co.uk", tagline: "Money tools that actually make sense.", imageUrl: "/brand/richquid.svg", category: "business", amountCents: 650_00 },
  { name: "GCSE Maths AI", url: "gcsemathsai.co.uk", tagline: "AI-powered GCSE maths revision and practice.", imageUrl: "/brand/gcsemathsai.svg", category: "education", amountCents: 500_00 },
  { name: "SAT ACT Math AI", url: "satactmathai.com", tagline: "AI tutor for SAT and ACT math prep.", imageUrl: "/brand/satactmathai.svg", category: "education", amountCents: 400_00 },
  { name: "IngredScan", url: "ingredscan.com", tagline: "Scan any label, know what's really in it.", imageUrl: "/brand/ingredscan.svg", category: "health", amountCents: 300_00 },
  { name: "Sizzle.io", url: "sizzleio.com", tagline: "Turn raw footage into sizzle reels, fast.", imageUrl: "/brand/sizzleio.svg", category: "marketing", amountCents: 200_00 },
  { name: "Free Websites", url: "freewebsites.website", tagline: "Spin up a website in minutes, free.", imageUrl: "/brand/freewebsites.svg", category: "dev-tools", amountCents: 100_00 },
];

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SEED_SECRET;
  if (!secret || request.headers.get("x-admin-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const row of SEED_LISTINGS) {
    const normalized = normalizeUrl(row.url);
    if (!normalized) {
      results.push({ url: row.url, error: "failed to normalize" });
      continue;
    }

    const now = new Date();
    const listing = await prisma.listing.upsert({
      where: { url: normalized },
      update: {
        totalBidCents: row.amountCents,
        lastBidAt: now,
      },
      create: {
        name: row.name,
        url: normalized,
        tagline: row.tagline,
        imageUrl: row.imageUrl,
        category: row.category,
        totalBidCents: row.amountCents,
        createdAt: now,
        lastBidAt: now,
      },
    });

    await prisma.bid.create({
      data: {
        listingId: listing.id,
        amountCents: row.amountCents,
        status: "paid",
        paidAt: now,
      },
    });

    results.push({ url: normalized, listingId: listing.id });
  }

  return NextResponse.json({ ok: true, results });
}
