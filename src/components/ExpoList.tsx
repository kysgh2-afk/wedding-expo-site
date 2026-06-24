import { ExpoCard, type ExpoCardData } from "@/components/ExpoCard";

export function ExpoList({ expos }: { expos: ExpoCardData[] }) {
  if (expos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white px-6 py-16 text-center text-slate-500">
        등록된 박람회가 없습니다.
      </div>
    );
  }

  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {expos.map((expo) => (
        <ExpoCard key={expo.id} expo={expo} />
      ))}
    </section>
  );
}
