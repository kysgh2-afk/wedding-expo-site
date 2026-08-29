import { list, put } from "@vercel/blob";

const CLICK_PREFIX = "analytics/expo-clicks/";
const EXPO_ID_PATTERN = /^(?:source-[a-f0-9]{20}|admin-[0-9a-f-]{36})$/;

function hasBlobCredentials() {
  const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const hasOidcStore = Boolean(
    process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL_OIDC_TOKEN?.trim(),
  );

  return hasToken || hasOidcStore;
}

export async function recordExpoClick(expoId: string) {
  if (!EXPO_ID_PATTERN.test(expoId)) {
    throw new Error("Invalid source expo id");
  }

  if (!hasBlobCredentials()) {
    throw new Error("Blob click storage is not configured");
  }

  const eventId = `${Date.now()}-${crypto.randomUUID()}`;
  await put(`${CLICK_PREFIX}${expoId}/${eventId}.txt`, "1", {
    access: "public",
    addRandomSuffix: false,
    contentType: "text/plain; charset=utf-8",
  });
}

export async function getExpoClickCounts() {
  const counts = new Map<string, number>();

  if (!hasBlobCredentials()) return counts;

  let cursor: string | undefined;

  do {
    const page = await list({
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
