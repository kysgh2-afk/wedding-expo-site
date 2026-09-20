import { getPublishedExpos, getScheduleSourceUpdatedAt } from '@/lib/expos';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const [expos, lastUpdated] = await Promise.all([
      getPublishedExpos(),
      getScheduleSourceUpdatedAt(),
    ]);
    const ageHours = (Date.now() - lastUpdated.getTime()) / 3_600_000;
    const visibleCount = expos.length;
    const ok = ageHours <= 24 && visibleCount >= 10;
    return Response.json(
      { ok, generatedAt: lastUpdated.toISOString(), ageHours, visibleCount },
      { status: ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { ok: false, error: 'Schedule read failed' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
