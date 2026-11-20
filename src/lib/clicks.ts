import { createHash } from "node:crypto";
import { list, put } from "@vercel/blob";

const CLICK_PREFIX = "analytics/expo-clicks/";
const EXPO_ID_PATTERN = /^(?:source-[a-f0-9]{20}|admin-[0-9a-f-]{36})$/;

export function rankExposByClicks<T extends { id: string; clickCount: number; startDate: Date }>(expos: T[], limit: number) {
  return [...expos].filter((expo) => expo.clickCount > 0)
    .sort((a, b) => b.clickCount - a.clickCount ||
      a.startDate.getTime() - b.startDate.getTime() || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function clickStoreOptions() {
  const storeId = process.env.EXPO_CLICKS_STORE_ID?.trim() || process.env.BLOB_STORE_ID?.trim();
  const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  // On Vercel the SDK also reads the rotating OIDC token from request context,
  // not only process.env. Let the SDK resolve it when a store is configured.
  if (!hasToken && !storeId) throw new Error("Click storage is not configured");
  return storeId ? { storeId } : {};
}

export function clickEventPath(expoId: string, visitorId: string, now = new Date()) {
  if (!EXPO_ID_PATTERN.test(expoId) || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
    throw new Error("Invalid click identity");
  }
  const day = new Date(now.getTime() + 9 * 3600000).toISOString().slice(0, 10);
  const digest = createHash("sha256").update(`${expoId}:${visitorId}:${day}`).digest("hex");
  return `${CLICK_PREFIX}${expoId}/daily-${day}-${digest}.txt`;
}

export async function recordExpoClick(expoId: string, visitorId: string) {
  if (!EXPO_ID_PATTERN.test(expoId)) {
    throw new Error("Invalid source expo id");
  }

  const options = clickStoreOptions();
  const pathname = clickEventPath(expoId, visitorId);
  const existing = await list({ ...options, prefix: pathname, limit: 1 });
  if (existing.blobs.some((blob) => blob.pathname === pathname)) return { counted: false };
  try {
    await put(pathname, "1", {
      ...options,
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "text/plain; charset=utf-8",
    });
  } catch (error) {
    // A concurrent request from the same browser may have created the same key.
    if (error instanceof Error && /already exists/i.test(error.message)) return { counted: false };
    throw error;
  }
  return { counted: true };
}

export async function getExpoClickCounts() {
  const counts = new Map<string, number>();

  const options = clickStoreOptions();

  let cursor: string | undefined;

  do {
    const page = await list({
      ...options,
      prefix: CLICK_PREFIX,
      limit: 1000,
      cursor,
    });

    for (const blob of page.blobs) {
      const relativePath = blob.pathname.slice(CLICK_PREFIX.length);
      const expoId = relativePath.split("/", 1)[0];

      if (!EXPO_ID_PATTERN.test(expoId)) continue;
      counts.set(expoId, (counts.get(expoId) ?? 0) + 1);
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return counts;
}
