import { readFile } from 'node:fs/promises';
const data = JSON.parse(await readFile(new URL('../src/data/expos.generated.json', import.meta.url), 'utf8'));
const hook = process.env.VERCEL_DEPLOY_HOOK?.trim();
if (!hook) throw new Error('Missing VERCEL_DEPLOY_HOOK secret');
// Never log the secret URL, including in network error messages.
try {
  const res = await fetch(hook, {method:'POST', signal:AbortSignal.timeout(30000)});
  if (!res.ok) throw new Error();
} catch { throw new Error('Deployment trigger failed'); }
for (let attempt = 0; attempt < 60; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 15000));
  try {
    const r = await fetch('https://weddinglast.com/api/schedule-status', {cache:'no-store', signal:AbortSignal.timeout(15000)});
    const status = await r.json();
    if (r.ok && status.ok && Date.parse(status.generatedAt) >= Date.parse(data.generatedAt)) {
      const home = await (await fetch('https://weddinglast.com/', {signal:AbortSignal.timeout(15000)})).text();
      const displayed = Number(home.match(/전체 일정\s*(\d+)개/)?.[1]);
      if (displayed !== status.visibleCount) continue;
      console.log(`Verified ${displayed} live schedules; updated ${status.generatedAt}`);
      process.exit(0);
    }
  } catch { /* Retry transient deployment and network errors. */ }
}
throw new Error('Live site did not receive healthy current schedules within 15 minutes');
