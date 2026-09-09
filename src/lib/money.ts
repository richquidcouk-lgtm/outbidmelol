export const MIN_BID_CENTS = 500;

/**
 * Board display: "$1,240" when the amount is whole dollars, "$1,240.50" when not.
 * Keeps the leaderboard column narrow enough to survive 375px.
 */
export function formatMoney(cents: number): string {
  const showCents = cents % 100 !== 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(cents / 100);
}

export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}
