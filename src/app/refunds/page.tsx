import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Refund Policy — Outbid Me";
const DESCRIPTION =
  "Outbid Me's refund policy: once a payment is made and a listing is live on the board, it's final. No exceptions.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/refunds" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/refunds" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RefundsPage() {
  return (
    <article className="glass rise-in rounded-2xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        <span className="gradient-text">Refunds</span>
      </h1>

      <div className="mt-6 max-w-prose space-y-4 text-sm leading-relaxed">
        <p>
          Once a payment is made and your listing or bid is live on the
          board, it's final. There are no refunds — not for change of mind,
          not for dissatisfaction with the traffic or results your listing
          gets, and not for being outbid and dropping in rank afterward. This
          applies with no exceptions.
        </p>
        <p className="text-xs text-muted">
          Full terms:{" "}
          <Link
            href="/terms"
            className="text-gain underline underline-offset-2 hover:text-ink"
          >
            /terms
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
