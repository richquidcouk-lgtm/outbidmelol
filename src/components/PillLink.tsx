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
      className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-accent to-gain text-white shadow-[0_2px_14px_var(--glow-accent)]"
          : "glass text-muted hover:text-ink"
      }`}
    >
      {label} <span className="tnum text-xs opacity-70">{count}</span>
    </Link>
  );
}
