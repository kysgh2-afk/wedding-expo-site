import data from '@/data/expos.generated.json';
import { getPublishedExpos } from '@/lib/expos';
import { isExpoCurrent } from '@/lib/expo-calendar.mjs';
export const dynamic = 'force-dynamic';
export async function GET() {
  const ageHours = (Date.now() - Date.parse(data.generatedAt)) / 3600000;
  try {
    const visibleCount = (await getPublishedExpos()).length;
    const sourceActiveCount = data.expos.filter(e => e.isPublished && isExpoCurrent(e.endDate)).length;
    const ok = ageHours <= 24 && visibleCount >= 10 && visibleCount >= sourceActiveCount * 0.5;
    return Response.json({ok, generatedAt:data.generatedAt, ageHours, visibleCount, sourceActiveCount}, {status:ok ? 200 : 503, headers:{'Cache-Control':'no-store'}});
  } catch {
    return Response.json({ok:false, generatedAt:data.generatedAt, error:'Schedule read failed'}, {status:503});
  }
}
