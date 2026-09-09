"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Status =
  | { state: "polling" }
  | { state: "paid"; listingId: string; listingName: string; rank: number }
  | { state: "timeout" };

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15; // ~30s — long enough for a normal webhook delivery

export function SuccessStatus({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<Status>({ state: "polling" });
  const attempts = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      attempts.current += 1;
      try {
        const res = await fetch(`/api/bids/${sessionId}/status`);
        const data = await res.json();
        if (cancelled) return;

        if (data.status === "paid") {
          setStatus({
            state: "paid",
            listingId: data.listingId,
            listingName: data.listingName,
            rank: data.rank,
          });
          return;
        }
      } catch {
        // Transient fetch failure — just let the retry loop below handle it.
      }

      if (attempts.current >= MAX_ATTEMPTS) {
        if (!cancelled) setStatus({ state: "timeout" });
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  if (status.state === "paid") {
    return (
      <div className="text-center">
        <p className="font-display text-5xl">🎉</p>
        <h1 className="font-display mt-3 text-4xl font-black leading-[0.95] sm:text-5xl">
          <span className="gradient-text">Payment confirmed</span>
        </h1>
        <p className="mt-3 text-muted">
          <span className="font-semibold text-ink">{status.listingName}</span>{" "}
          is now{" "}
          <span className="tnum money-text font-display font-bold">
            #{status.rank}
          </span>{" "}
          on the board.
        </p>
        <Link
          href={`/#${status.listingId}`}
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-gain to-accent-2 px-6 py-3 font-display text-lg font-bold text-white shadow-[0_8px_28px_var(--glow-money)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          See it on the board
        </Link>
      </div>
    );
  }

  if (status.state === "timeout") {
    return (
      <div className="text-center">
        <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
          Still confirming
        </h1>
        <p className="mt-3 text-muted">
          Your payment went through, but we haven't finished updating the
          board yet. Refresh this page in a moment — if it still hasn't
          shown up after a few minutes,{" "}
          <Link href="/contact" className="text-gain underline underline-offset-2 hover:text-ink">
            contact us
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        Confirming payment
      </h1>
      <p className="mt-3 text-muted">
        Hang on while we hear back from Stripe — this usually takes a few
        seconds.
      </p>
    </div>
  );
}
