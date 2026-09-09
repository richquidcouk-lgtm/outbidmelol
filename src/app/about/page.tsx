import Link from "next/link";

export const metadata = {
  title: "How it works — Outbid Me",
  description:
    "Outbid Me ranks listings purely by cumulative amount paid. No votes, no algorithm, no editorial curation.",
};

export default function AboutPage() {
  return (
    <article className="border-b border-rule bg-plate px-4 py-8">
      <h1 className="font-display text-4xl font-black leading-[0.95]">
        How it works
      </h1>

      <div className="mt-6 max-w-prose space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-2xl font-black">The whole rule</h2>
          <p className="mt-2">
            Listings are sorted by the total amount of money paid toward them,
            highest first. That is the entire ranking system. There are no
            votes, no engagement score, no recency boost, and nobody at Outbid
            Me decides who sits where.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Bids add up</h2>
          <p className="mt-2">
            A bid is not a replacement price, it is a deposit onto a running
            total. Pay $20 today and $30 next week and your listing sits at
            $50. If someone passes you, you can pay the difference and pass
            them back.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Anyone can bid on anything
          </h2>
          <p className="mt-2">
            You do not have to own a listing to pay toward it. If you want to
            push someone else up the board, you can. What you cannot do is
            change a listing you did not create — the name, tagline, and image
            belong to whoever submitted it first. Later bids only move money.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            One listing per link
          </h2>
          <p className="mt-2">
            Listings are keyed by their address, ignoring{" "}
            <code>https://</code>, <code>www.</code>, trailing slashes, and
            anything after a <code>?</code>. Submitting a link that is already
            on the board adds your money to that listing instead of creating a
            duplicate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">
            Only paid bids count
          </h2>
          <p className="mt-2">
            A bid is recorded the moment you start checkout, but it does not
            move you anywhere until the payment actually clears. Abandoned
            checkouts never touch the board.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-black">Money is spent</h2>
          <p className="mt-2">
            Bids are not refundable and they are not an investment. You are
            paying for a position on a public page, for as long as nobody pays
            more than you.
          </p>
        </section>
      </div>

      <p className="mt-8">
        <Link
          href="/claim"
          className="rounded-full bg-gain px-4 py-2 font-medium text-white"
        >
          Claim a spot
        </Link>
      </p>
    </article>
  );
}
