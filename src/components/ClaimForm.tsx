"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";
import { MIN_BID_CENTS, formatMoney, parseDollarsToCents } from "@/lib/money";
import { normalizeUrl } from "@/lib/url";

const TAGLINE_MAX = 140;
const IMAGE_MAX_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ClaimForm({
  lockedUrl,
  prefillUrl,
  prefillAmount,
  leaderTotalCents,
}: {
  /** URL already exists on the board — bump mode, url field hidden. */
  lockedUrl?: string;
  /** URL doesn't exist yet — pre-populate the (still editable) url field. */
  prefillUrl?: string;
  prefillAmount?: number;
  leaderTotalCents: number | null;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState(lockedUrl ?? prefillUrl ?? "");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<CategorySlug | "">("");
  const [amount, setAmount] = useState(
    prefillAmount ? String(prefillAmount) : "5",
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [agreedNoRefund, setAgreedNoRefund] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const isBump = Boolean(lockedUrl);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function pickFile(next: File | null) {
    if (!next) {
      setFile(null);
      return;
    }
    if (!IMAGE_TYPES.includes(next.type)) {
      setErrors((e) => ({ ...e, image: "Use a JPG, PNG, or WebP file." }));
      setFile(null);
      return;
    }
    if (next.size > IMAGE_MAX_BYTES) {
      setErrors((e) => ({ ...e, image: "That image is over 3MB." }));
      setFile(null);
      return;
    }
    setErrors((e) => ({ ...e, image: "" }));
    setFile(next);
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!isBump) {
      if (!name.trim()) next.name = "Give the listing a name.";
      if (!tagline.trim()) next.tagline = "One line about it.";
      if (tagline.length > TAGLINE_MAX)
        next.tagline = `Keep it under ${TAGLINE_MAX} characters.`;
      if (!file) next.image = "Pick a brand image.";
      if (!category) next.category = "Choose the closest category.";
    }
    if (!normalizeUrl(url)) next.url = "That does not look like a web address.";
    const cents = parseDollarsToCents(amount);
    if (cents === null) next.amount = "Enter an amount like 25 or 25.50.";
    else if (cents < MIN_BID_CENTS)
      next.amount = `Minimum bid is ${formatMoney(MIN_BID_CENTS)}.`;
    if (!agreedNoRefund)
      next.agreedNoRefund = "You need to accept this before paying.";
    return next;
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    const found = validate();
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;
    setFormError(
      "Checkout is not connected yet — image upload and Stripe land in the next phases.",
    );
  }

  const cents = parseDollarsToCents(amount);
  const beatsLeader =
    leaderTotalCents !== null && cents !== null && cents > leaderTotalCents;

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
      {isBump ? (
        <div className="rounded-xl bg-surface-2 px-3.5 py-3 text-sm">
          <p className="text-muted">Adding money to an existing listing</p>
          <p className="mt-0.5 font-semibold">{lockedUrl}</p>
          <p className="mt-1 text-xs text-muted">
            Its name, tagline, and image belong to whoever listed it first and
            stay as they are.
          </p>
        </div>
      ) : (
        <>
          <Field label="Name" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hyperloop Coffee"
              className={inputClass}
            />
          </Field>

          <Field label="Link" error={errors.url}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="hyperloopcoffee.com"
              inputMode="url"
              className={inputClass}
            />
          </Field>

          <Field
            label="Tagline"
            error={errors.tagline}
            hint={`${tagline.length}/${TAGLINE_MAX}`}
          >
            <input
              value={tagline}
              maxLength={TAGLINE_MAX}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Beans that arrive before you order them."
              className={inputClass}
            />
          </Field>

          <Field label="Brand image" error={errors.image}>
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview of your brand image"
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                ) : null}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="rounded-full bg-surface-2 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-rule"
                >
                  {file ? "Change image" : "Choose image"}
                </button>
                <p className="mt-1 text-xs text-muted">
                  JPG, PNG, or WebP. Up to 3MB. Shown as a square.
                </p>
              </div>
              <input
                ref={fileInput}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </Field>

          <Field label="Category" error={errors.category}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategorySlug)}
              className={inputClass}
            >
              <option value="" disabled>
                Choose the closest fit
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <Field label="Bid amount (USD)" error={errors.amount}>
        <div className="flex items-center rounded-xl bg-surface-2 ring-1 ring-transparent transition-shadow focus-within:ring-accent">
          <span className="pl-3.5 font-display text-lg font-bold text-muted">$</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="tnum font-display w-full bg-transparent py-2.5 pr-3.5 pl-1.5 text-lg font-bold outline-none"
          />
        </div>
        {leaderTotalCents !== null ? (
          <p className="mt-1 text-xs text-muted">
            {beatsLeader
              ? "That takes #1 outright."
              : `Beat ${formatMoney(leaderTotalCents)} to take #1. Minimum is ${formatMoney(MIN_BID_CENTS)}.`}
          </p>
        ) : (
          <p className="mt-1 text-xs text-muted">
            Board is empty — {formatMoney(MIN_BID_CENTS)} takes #1.
          </p>
        )}
      </Field>

      <div>
        <label className="flex items-start gap-2.5 text-xs text-muted">
          <input
            type="checkbox"
            checked={agreedNoRefund}
            onChange={(e) => setAgreedNoRefund(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gain"
          />
          <span>
            I understand{" "}
            {isBump ? "this bid will be added" : "my listing will be displayed"}{" "}
            immediately once payment completes, and that I lose any right to
            cancel or receive a refund from that point.{" "}
            <Link
              href="/refunds"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              Refund policy
            </Link>
            .
          </span>
        </label>
        {errors.agreedNoRefund ? (
          <p className="mt-1 pl-6 text-xs text-cut">
            {errors.agreedNoRefund}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-xl bg-cut/10 px-3.5 py-2.5 text-sm text-cut ring-1 ring-inset ring-cut/25"
        >
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-gain to-accent-2 px-6 py-3.5 font-display text-lg font-bold text-white shadow-[0_8px_28px_var(--glow-money)] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
      >
        {isBump ? "Add to this listing" : "Continue to payment"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl bg-surface-2 px-3.5 py-2.5 outline-none ring-1 ring-transparent transition-shadow focus:ring-accent";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint ? <span className="tnum text-xs text-muted">{hint}</span> : null}
      </span>
      <div className="mt-1">{children}</div>
      {error ? <p className="mt-1 text-xs text-cut">{error}</p> : null}
    </label>
  );
}
