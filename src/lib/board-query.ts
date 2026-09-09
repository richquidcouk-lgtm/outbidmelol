import type { CategorySlug } from "./categories";
import { isCategorySlug } from "./categories";
import type { RangeFilter } from "./types";

export type BoardQuery = {
  category: CategorySlug | null;
  range: RangeFilter;
};

export function parseBoardQuery(searchParams: {
  category?: string;
  range?: string;
}): BoardQuery {
  const category =
    searchParams.category && isCategorySlug(searchParams.category)
      ? searchParams.category
      : null;
  const range: RangeFilter = searchParams.range === "today" ? "today" : "all";
  return { category, range };
}

export function buildBoardHref(
  base: string,
  current: BoardQuery,
  overrides: Partial<BoardQuery>,
): string {
  const next = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.range === "today") params.set("range", "today");
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}
