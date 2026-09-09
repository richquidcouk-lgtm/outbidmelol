import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toHref } from "@/lib/url";

/** Every outbound listing link routes through here so clicks get counted. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Increment-and-return in one round trip; a 404 on a bad id is rare enough
  // not to be worth a separate existence check first.
  const listing = await prisma.listing
    .update({
      where: { id },
      data: { clickCount: { increment: 1 } },
      select: { url: true },
    })
    .catch(() => null);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  return NextResponse.redirect(toHref(listing.url), { status: 302 });
}
