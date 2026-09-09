"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MIN_BID_CENTS, formatMoney } from "@/lib/money";

const STEP_CENTS = 500;

export function QuickClaimForm({
  suggestedCents,
}: {
  suggestedCents: number;
}) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [cents, setCents] = useState(suggestedCents);
  const [error, setError] = useState<string | null>(null);

  function step(deltaCents: number) {
    setCents((c) => Math.max(MIN_BID_CENTS, c + deltaCents));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError("Paste a URL to claim first.");
      return;
    }
    setError(null);
    const params = new URLSearchParams({
      url: url.trim(),
      amount: (cents / 100).toString(),
    });
    router.push(`/claim?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass mt-6 flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-2.5">
        <span aria-hidden className="text-muted">
          🌐
        </span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourproduct.com"
          inputMode="url"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-2 px-2 py-1.5 sm:justify-start">
        <button
          type="button"
          onClick={() => step(-STEP_CENTS)}
          aria-label="Decrease amount"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plate text-lg font-bold transition-colors hover:bg-rule"
        >
          −
        </button>
        <span className="tnum money-text font-display min-w-20 text-center text-lg font-bold">
          {formatMoney(cents)}
        </span>
        <button
          type="button"
          onClick={() => step(STEP_CENTS)}
          aria-label="Increase amount"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plate text-lg font-bold transition-colors hover:bg-rule"
        >
          +
        </button>
      </div>

      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gradient-to-r from-gain to-accent-2 px-6 py-3 font-display text-base font-bold text-white shadow-[0_6px_22px_var(--glow-money)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Claim rank
      </button>

      {error ? (
        <p role="alert" className="basis-full text-xs text-cut">
          {error}
        </p>
      ) : null}
    </form>
  );
}
