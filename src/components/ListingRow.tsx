"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getCategory, shortLabel } from "@/lib/categories";
import { formatMoney } from "@/lib/money";
import { relativeTime } from "@/lib/time";
import { toHref } from "@/lib/url";
import type { BoardListing, RangeFilter } from "@/lib/types";

const NEW_WINDOW_MS = 24 * 60 * 60 * 1000;
const RANK_MEDAL: Record<number, string> = { 1: "\u{1F947}", 2: "\u{1F948}", 3: "\u{1F949}" };

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

  const card = (
    <div
      className={`glass rounded-2xl transition-all duration-200 hover:-translate-y-0.5 ${
        isTop
          ? "hover:shadow-[0_16px_36px_var(--shadow-color-lg)]"
          : "hover:shadow-[0_10px_24px_var(--shadow-color)]"
      }`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5 sm:gap-4">
        <span
          className={`font-display tnum shrink-0 text-right font-black leading-none ${
            isTop
              ? "gradient-text w-11 text-4xl sm:text-5xl"
              : "w-8 text-xl text-muted"
          }`}
        >
          {isTop ? RANK_MEDAL[rank] : rank}
        </span>

        <div
          className={`relative shrink-0 overflow-hidden rounded-xl ring-1 ring-rule ${
            isTop ? "shadow-[0_4px_16px_var(--shadow-color)]" : ""
          }`}
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
              title={`Visit ${toHref(listing.url)}`}
              className={`inline-flex items-center gap-1 truncate font-semibold hover:text-gain hover:underline ${
                isTop ? "text-lg" : ""
              }`}
            >
              {listing.name}
              <span aria-hidden className="text-muted">
                ↗
              </span>
            </a>
            <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-muted ring-1 ring-inset ring-rule">
              {category.icon} {shortLabel(category)}
            </span>
            {isNew ? (
              <span className="shrink-0 rounded-full bg-gold/15 px-1.5 py-0.5 text-[11px] font-medium text-gold ring-1 ring-inset ring-gold/40">
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
            <a
              href={`/api/go/${listing.id}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="truncate hover:text-gain hover:underline"
            >
              {listing.url}
            </a>
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
              <span>listed {relativeTime(listing.createdAt, now)}</span>
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
            className={`font-display tnum money-text font-black leading-none ${
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
    </div>
  );

  return (
    <li id={listing.id}>
      {isTop ? <div className="podium-ring">{card}</div> : card}
    </li>
  );
}
