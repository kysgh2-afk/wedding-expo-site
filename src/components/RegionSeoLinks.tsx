import Link from "next/link";
import {
  LOCAL_SEO,
  METROPOLITAN_SEO,
  SEO_GYEONGGI,
  SEO_LOCAL_INDEX,
  SEO_METROPOLITAN_INDEX,
  SEO_SEOUL,
} from "@/lib/regions";

export function RegionSeoLinks() {
  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">
      <h2 className="text-2xl font-bold text-slate-900">지역별 웨딩박람회 일정</h2>
      <p className="mt-2 text-sm text-slate-500">
        서울, 경기, 광역시, 지방 권역별 최신 웨딩박람회·웨딩페어 일정 페이지입니다.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-semibold text-rose-800">수도권</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href={SEO_SEOUL.path} className="text-slate-600 hover:text-rose-600">
                서울 웨딩박람회
              </Link>
            </li>
            <li>
              <Link href={SEO_GYEONGGI.path} className="text-slate-600 hover:text-rose-600">
                경기 웨딩박람회
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-rose-800">
            <Link href={SEO_METROPOLITAN_INDEX.path}>광역시</Link>
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.values(METROPOLITAN_SEO).map((page) => (
              <li key={page.path}>
                <Link href={page.path} className="text-slate-600 hover:text-rose-600">
                  {page.label} 웨딩박람회
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-rose-800">
            <Link href={SEO_LOCAL_INDEX.path}>지방</Link>
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.values(LOCAL_SEO).map((page) => (
              <li key={page.path}>
                <Link href={page.path} className="text-slate-600 hover:text-rose-600">
                  {page.label} 웨딩박람회
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
