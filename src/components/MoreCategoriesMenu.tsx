"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { buildBoardHref, type BoardQuery } from "@/lib/board-query";
import type { Category } from "@/lib/categories";

export function MoreCategoriesMenu({
  categories,
  query,
  counts,
}: {
  categories: Category[];
  query: BoardQuery;
  counts: Partial<Record<string, number>>;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
          open
            ? "bg-gradient-to-r from-accent to-gain text-white shadow-[0_2px_14px_var(--glow-accent)]"
            : "glass text-muted hover:text-ink"
        }`}
      >
        All categories {open ? "▴" : "▾"}
      </button>

      {open ? (
        <div className="glass rise-in absolute right-0 top-[calc(100%+8px)] z-20 max-h-80 w-72 overflow-y-auto rounded-2xl p-1.5 shadow-[0_16px_40px_var(--shadow-color-lg)]">
          {categories.map((cat) => {
            const active = query.category === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={buildBoardHref("/", query, { category: cat.slug })}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors ${
                  active ? "bg-surface-2 font-semibold" : "hover:bg-surface-2"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{cat.icon}</span>
                  {cat.label}
                </span>
                <span className="tnum text-xs text-muted">
                  {counts[cat.slug] ?? 0}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
