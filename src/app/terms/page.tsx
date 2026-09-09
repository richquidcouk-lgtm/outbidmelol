import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY, POLICY_LAST_UPDATED, isPlaceholder } from "@/lib/company";

const TITLE = "Terms — Outbid Me";
const DESCRIPTION =
  "The terms that govern using Outbid Me: what the service is, what's not allowed, payments, and governing law.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/terms" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function TermsPage() {
  return (
    <article className="glass rise-in rounded-2xl px-5 py-8 sm:px-8">
      <h1 className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
        <span className="gradient-text">Terms</span>
      </h1>
      <p className="mt-2 text-xs text-muted">
        Last updated {POLICY_LAST_UPDATED}.
      </p>

      <div className="mt-6 max-w-prose space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-black">What this is</h2>
          <p className="mt-2">
            Outbid Me is a public leaderboard. Rank is decided purely by
            cumulative money paid — highest total, highest position. We don't
            guarantee traffic, clicks, conversions, or any other result from
            being listed. You're paying for a position on a page, not an
            outcome.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Who this is for
          </h2>
          <p className="mt-2">
            Outbid Me is a business-to-business advertising service. Listings
            are businesses, products, and links paying to be ranked — not
            consumers buying something for personal use. If you submit a
            listing or place a bid, you're doing so on behalf of a business or
            in a commercial capacity, not as a private individual.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            You must be 18 or older
          </h2>
          <p className="mt-2">
            By submitting a listing or placing a bid, you confirm you're at
            least 18 years old.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Payments are final
          </h2>
          <p className="mt-2">
            A bid becomes final the moment your Stripe Checkout session
            completes and your listing goes live on the board. There are no
            refunds for change of mind, dissatisfaction with results, or
            being outbid and dropping in rank. See our{" "}
            <Link
              href="/refunds"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              Refund Policy
            </Link>{" "}
            for the full policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            What you can't list
          </h2>
          <p className="mt-2">You can't submit a listing that:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>is illegal, or links to illegal content</li>
            <li>is a scam, phishing attempt, or otherwise deceptive</li>
            <li>contains adult content</li>
            <li>
              infringes someone else's trademark, copyright, or other IP
            </li>
            <li>
              impersonates a business or person you're not authorised to
              represent
            </li>
          </ul>
          <p className="mt-2">
            We can remove a listing that breaks these rules at any time,
            without refunding any bid tied to it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            The board might not always be here
          </h2>
          <p className="mt-2">
            We aim to keep Outbid Me running, but we don't guarantee uptime or
            that the service continues indefinitely. It's provided "as is,"
            without warranties beyond what UK law requires us to give.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Liability</h2>
          <p className="mt-2">
            We're not responsible for what happens after someone clicks
            through to a listed link — that site is run by whoever listed it,
            not us. Our liability for anything else is limited to the amount
            you've paid us in the 12 months before the claim arose.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Governing law
          </h2>
          <p className="mt-2">
            These terms are governed by the law of England and Wales. Any
            dispute is subject to the exclusive jurisdiction of the courts of
            England and Wales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Company details
          </h2>
          <p className="mt-2">
            Outbid Me is operated by {COMPANY.legalName}
            {!isPlaceholder(COMPANY.number)
              ? `, company number ${COMPANY.number}`
              : ""}
            . Full contact and registration details:{" "}
            <Link
              href="/contact"
              className="text-gain underline underline-offset-2 hover:text-ink"
            >
              /contact
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
