export function validateExpoData(data, { now = Date.now(), previous } = {}) {
  const age = now - Date.parse(data.generatedAt);
  if (!Number.isFinite(age) || age > 72 * 60 * 60 * 1000 || age < -3600000) {
    throw new Error('Schedule data is stale or has an invalid timestamp. Run expos:update and publish the refreshed data first.');
  }
  if (!Array.isArray(data.expos) || data.expos.length < 10) throw new Error('Too few schedule records; refusing deployment.');
  const ids = new Set();
  for (const expo of data.expos) {
    if (!expo.id || ids.has(expo.id) || !expo.title || !expo.linkUrl || !Number.isFinite(Date.parse(expo.endDate))) {
      throw new Error('Invalid or duplicate schedule record.');
    }
    ids.add(expo.id);
  }
  const active = data.expos.filter(expo => expo.isPublished && Date.parse(expo.endDate) >= now).length;
  if (active < 10) throw new Error(`Only ${active} active schedules; refusing to replace the working site.`);
  if (previous?.expos?.length && data.expos.length < previous.expos.length * 0.5) {
    throw new Error('Schedule count dropped by over 50%; manual review required.');
  }
  return { total: data.expos.length, active };
}
