import Link from "next/link";

export function PillLink({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-medium transition-colors ${
        active
          ? "border-ink bg-ink text-white"
          : "border-rule text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label} <span className="tnum text-xs opacity-70">{count}</span>
    </Link>
  );
}
