import type { Metadata } from "next";
import Link from "next/link";
import { SuccessStatus } from "@/components/SuccessStatus";

export const metadata: Metadata = {
  title: "Payment confirmation — Outbid Me",
  // Personal, post-payment page — nothing here anyone should land on from
  // search, and robots.ts already disallows it too.
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <section className="glass rounded-2xl px-5 py-8 text-center sm:px-8">
        <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
          Nothing to confirm
        </h1>
        <p className="mt-3 text-muted">
          This page is only useful right after paying.{" "}
          <Link href="/claim" className="text-gain underline underline-offset-2 hover:text-ink">
            Claim a spot
          </Link>{" "}
          to get here properly.
        </p>
      </section>
    );
  }

  return (
    <section className="glass rise-in rounded-2xl px-5 py-10 sm:px-8">
      <SuccessStatus sessionId={sessionId} />
    </section>
  );
}
