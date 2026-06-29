import Link from "next/link";

type AdminNavProps = {
  active: "expos" | "articles";
};

function navClass(isActive: boolean) {
  return `rounded-xl px-4 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-rose-600 text-white shadow"
      : "border border-rose-200 text-rose-700 hover:bg-rose-50"
  }`;
}

export function AdminNav({ active }: AdminNavProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="관리자 메뉴">
      <Link href="/admin" className={navClass(active === "expos")}>
        박람회 관리
      </Link>
      <Link href="/admin/articles" className={navClass(active === "articles")}>
        콘텐츠 관리
      </Link>
    </nav>
  );
}
