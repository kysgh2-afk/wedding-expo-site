import Link from "next/link";
import {
  LOCAL_SUBREGIONS,
  METROPOLITAN_CITIES,
} from "@/lib/constants";
import {
  LOCAL_SEO,
  METROPOLITAN_SEO,
  SEO_GYEONGGI,
  SEO_LOCAL_INDEX,
  SEO_METROPOLITAN_INDEX,
  SEO_SEOUL,
} from "@/lib/regions";
import { SEO_COST_INDEX } from "@/lib/wedding-cost";

type RegionNavProps = {
  activePath?: string;
};

function navClass(isActive: boolean) {
  return `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-rose-600 text-white shadow"
      : "bg-white text-slate-600 ring-1 ring-rose-100 hover:bg-rose-50"
  }`;
}

export function RegionNav({ activePath = "/" }: RegionNavProps) {
  return (
    <nav aria-label="사이트 주요 메뉴" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link href="/" className={navClass(activePath === "/")}>
          전체
        </Link>
        <Link href={SEO_SEOUL.path} className={navClass(activePath === SEO_SEOUL.path)}>
          서울
        </Link>
        <Link href={SEO_GYEONGGI.path} className={navClass(activePath === SEO_GYEONGGI.path)}>
          경기
        </Link>
        <Link
          href={SEO_METROPOLITAN_INDEX.path}
          className={navClass(activePath.startsWith("/metropolitan"))}
        >
          광역시
        </Link>
        <Link href={SEO_LOCAL_INDEX.path} className={navClass(activePath.startsWith("/local"))}>
          지방
        </Link>
        <Link
          href={SEO_COST_INDEX.path}
          className={navClass(activePath.startsWith("/cost"))}
        >
          결혼비용
        </Link>
      </div>

      {activePath.startsWith("/metropolitan") ? (
        <div className="flex flex-wrap gap-2 pl-1">
          {METROPOLITAN_CITIES.map((city) => {
            const path = METROPOLITAN_SEO[city.value].path;
            return (
              <Link key={city.value} href={path} className={navClass(activePath === path)}>
                {city.label}
              </Link>
            );
          })}
        </div>
      ) : null}

      {activePath.startsWith("/local") ? (
        <div className="flex flex-wrap gap-2 pl-1">
          {LOCAL_SUBREGIONS.map((area) => {
            const path = LOCAL_SEO[area.value].path;
            return (
              <Link key={area.value} href={path} className={navClass(activePath === path)}>
                {area.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
