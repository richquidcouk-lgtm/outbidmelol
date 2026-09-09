import { CATEGORIES, QUICK_CATEGORY_SLUGS, getCategory, shortLabel } from "@/lib/categories";
import { buildBoardHref, type BoardQuery } from "@/lib/board-query";
import { MoreCategoriesMenu } from "./MoreCategoriesMenu";
import { PillLink } from "./PillLink";

export function CategoryPills({
  query,
  counts,
  total,
}: {
  query: BoardQuery;
  counts: Partial<Record<string, number>>;
  total: number;
}) {
  const quick = QUICK_CATEGORY_SLUGS.map(getCategory);
  const activeIsQuick = query.category === null || QUICK_CATEGORY_SLUGS.includes(query.category);
  const activeOutsideQuick = !activeIsQuick ? getCategory(query.category!) : null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 text-sm">
      <PillLink
        href={buildBoardHref("/", query, { category: null })}
        active={query.category === null}
        label="All"
        count={total}
      />
      {quick.map((cat) => (
        <PillLink
          key={cat.slug}
          href={buildBoardHref("/", query, { category: cat.slug })}
          active={query.category === cat.slug}
          label={`${cat.icon} ${shortLabel(cat)}`}
          count={counts[cat.slug] ?? 0}
        />
      ))}
      {activeOutsideQuick ? (
        <PillLink
          href={buildBoardHref("/", query, { category: activeOutsideQuick.slug })}
          active
          label={`${activeOutsideQuick.icon} ${activeOutsideQuick.label}`}
          count={counts[activeOutsideQuick.slug] ?? 0}
        />
      ) : null}
      <MoreCategoriesMenu
        categories={CATEGORIES}
        query={query}
        counts={counts}
      />
    </div>
  );
}
