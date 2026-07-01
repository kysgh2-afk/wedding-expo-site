import Link from "next/link";
import { SEO_COST_INDEX } from "@/lib/wedding-cost";

const NAV_ITEMS = [
  { path: "/cost/regional", label: "지역별" },
  { path: "/cost/season", label: "시기별" },
  { path: "/cost/venue", label: "예식장" },
  { path: "/cost/sdme", label: "스드메" },
] as const;

type CostNavProps = {
  activePath: string;
};

function navClass(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-rose-600 text-white shadow"
      : "bg-white text-slate-600 ring-1 ring-rose-100 hover:bg-rose-50"
  }`;
}

export function CostNav({ activePath }: CostNavProps) {
  return (
    <nav aria-label="결혼비용 카테고리" className="flex flex-wrap gap-2">
      <Link href={SEO_COST_INDEX.path} className={navClass(activePath === SEO_COST_INDEX.path)}>
        전체
      </Link>
      {NAV_ITEMS.map((item) => (
        <Link key={item.path} href={item.path} className={navClass(activePath === item.path)}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
