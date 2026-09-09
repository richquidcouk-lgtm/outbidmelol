/**
 * Trader identification + contact details, referenced from /contact,
 * /terms, and /privacy. number/address are still placeholders — replace
 * before this goes live publicly (Stripe requires accurate trader ID to
 * process payments).
 */
export const COMPANY = {
  legalName: "TechNera Ltd",
  number: "[COMPANY NUMBER]",
  address: "London, UK",
  email: "official@techneraltd.com",
};

export const POLICY_LAST_UPDATED = "September 2026";

/** True while a field still holds its unfilled "[...]" placeholder text. */
export function isPlaceholder(value: string): boolean {
  return /^\[.*\]$/.test(value);
}
