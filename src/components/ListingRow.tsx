"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getCategory, shortLabel } from "@/lib/categories";
import { formatMoney } from "@/lib/money";
import { relativeTime } from "@/lib/time";
import type { BoardListing, RangeFilter } from "@/lib/types";

const NEW_WINDOW_MS = 24 * 60 * 60 * 1000;

export function ListingRow({
  listing,
  rank,
  now,
  range,
}: {
  listing: BoardListing;
  rank: number;
  now: Date;
  range: RangeFilter;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isTop = rank <= 3 && range === "all";
  const size = isTop ? 64 : 48;
  const category = getCategory(listing.category);
  const isNew = now.getTime() - listing.createdAt.getTime() < NEW_WINDOW_MS;
  const isTrendingToday = range === "all" && listing.todayBidCents > 0;

  const primaryCents =
    range === "today" ? listing.todayBidCents : listing.totalBidCents;

  async function onShare() {
    const shareUrl = `${window.location.origin}/?category=${listing.category}#${listing.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can fail silently (permissions, insecure context) —
      // nothing to recover into, so just skip the "copied" confirmation.
    }
  }

  return (
    <li
      id={listing.id}
      className={`border-b border-rule bg-plate ${
        isTop ? "border-l-2 border-l-gold" : ""
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span
          className={`font-display tnum shrink-0 text-right font-black leading-none ${
            isTop ? "w-10 text-4xl sm:text-5xl" : "w-10 text-2xl text-muted"
          }`}
        >
          {rank}
        </span>

        <div
          className="relative shrink-0 overflow-hidden rounded-md border border-rule"
          style={{ width: size, height: size }}
        >
          <Image
            src={listing.imageUrl}
            alt={`${listing.name} logo`}
            fill
            sizes="64px"
            className="object-cover"
            unoptimized={listing.imageUrl.endsWith(".svg")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <a
              href={`/api/go/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`truncate font-semibold hover:underline ${
                isTop ? "text-lg" : ""
              }`}
            >
              {listing.name}
            </a>
            <span className="shrink-0 rounded-full bg-board px-1.5 py-0.5 text-[11px] font-medium text-muted ring-1 ring-inset ring-rule">
              {category.icon} {shortLabel(category)}
            </span>
            {isNew ? (
              <span className="shrink-0 rounded-full bg-gold/20 px-1.5 py-0.5 text-[11px] font-medium text-gold ring-1 ring-inset ring-gold/40">
                NEW
              </span>
            ) : isTrendingToday ? (
              <span className="shrink-0 rounded-full bg-gain/12 px-1.5 py-0.5 text-[11px] font-medium text-gain ring-1 ring-inset ring-gain/30">
                Active today
              </span>
            ) : null}
          </div>

          <p
            className={`mt-0.5 text-sm text-muted ${
              expanded ? "" : "line-clamp-1"
            }`}
          >
            {listing.tagline}
          </p>

          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span className="truncate">{listing.url}</span>
            <span>bumped {relativeTime(listing.lastBidAt, now)}</span>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="font-medium hover:text-ink hover:underline"
            >
              {expanded ? "hide details" : "see details"}
            </button>
          </p>

          {expanded ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-rule pt-2 text-xs text-muted">
              <span>
                {category.icon} {category.label}
              </span>
              <span className="tnum">
                {listing.clickCount.toLocaleString()} clicks
              </span>
              <span>
                listed {relativeTime(listing.createdAt, now)}
              </span>
              <span className="tnum">
                last bid {formatMoney(listing.lastBidAmountCents)}
              </span>
              <Link
                href={`/claim?url=${encodeURIComponent(listing.url)}`}
                className="font-medium text-gain hover:underline"
              >
                Bump this listing
              </Link>
              <button
                type="button"
                onClick={onShare}
                className="font-medium hover:text-ink hover:underline"
              >
                {copied ? "Link copied" : "Share"}
              </button>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <div
            className={`font-display tnum font-black leading-none text-gain ${
              isTop ? "text-2xl sm:text-3xl" : "text-xl"
            }`}
          >
            {formatMoney(primaryCents)}
          </div>
          {range === "today" ? (
            <div className="tnum mt-0.5 text-xs text-muted">
              {formatMoney(listing.totalBidCents)} total
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
