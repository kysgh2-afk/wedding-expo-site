import { get, list, put } from "@vercel/blob";
import generatedExpoData from "@/data/expos.generated.json";

const ADMIN_EXPO_PREFIX = "data/expos-admin/";

export type ExpoRecord = {
  id: string;
  title: string;
  location: string;
  regionGroup: string;
  regionSub: string;
  regionLabel: string;
  startDate: Date;
  endDate: Date;
  status: string;
  imageUrl: string | null;
  linkUrl: string | null;
  sortOrder: number;
  clickCount: number;
  tags: string[];
  isWeeklyWeekend: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpoWriteInput = Omit<
  ExpoRecord,
  "id" | "clickCount" | "createdAt" | "updatedAt"
>;

type PersistedExpo = Omit<
  ExpoRecord,
  "startDate" | "endDate" | "createdAt" | "updatedAt"
> & {
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

type ExpoOverlay = {
  version: 1;
  updatedAt: string;
  upserts: Record<string, PersistedExpo>;
  deletedIds: string[];
};

function hasBlobCredentials() {
  const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const hasOidcStore = Boolean(
    process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL_OIDC_TOKEN?.trim(),
  );

  return hasToken || hasOidcStore;
}

function emptyOverlay(): ExpoOverlay {
  return {
    version: 1,
    updatedAt: generatedExpoData.generatedAt,
    upserts: {},
    deletedIds: [],
  };
}

function toPersisted(expo: ExpoRecord): PersistedExpo {
  return {
    ...expo,
    startDate: expo.startDate.toISOString(),
    endDate: expo.endDate.toISOString(),
    createdAt: expo.createdAt.toISOString(),
    updatedAt: expo.updatedAt.toISOString(),
  };
}

function fromPersisted(expo: PersistedExpo): ExpoRecord {
  return {
    ...expo,
    startDate: new Date(expo.startDate),
    endDate: new Date(expo.endDate),
    createdAt: new Date(expo.createdAt),
    updatedAt: new Date(expo.updatedAt),
  };
}

function generatedExpos(): ExpoRecord[] {
  const generatedAt = new Date(generatedExpoData.generatedAt);

  return generatedExpoData.expos.map((expo) => ({
    ...expo,
    startDate: new Date(expo.startDate),
    endDate: new Date(expo.endDate),
    createdAt: generatedAt,
    updatedAt: generatedAt,
  }));
}

async function readOverlay() {
  if (!hasBlobCredentials()) return emptyOverlay();

  let cursor: string | undefined;
  let latest:
    | {
        url: string;
        uploadedAt: Date;
      }
    | undefined;

  do {
    const page = await list({
      prefix: ADMIN_EXPO_PREFIX,
      limit: 1000,
      cursor,
    });

    for (const blob of page.blobs) {
      if (!latest || blob.uploadedAt > latest.uploadedAt) {
        latest = { url: blob.url, uploadedAt: blob.uploadedAt };
      }
    }

    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  if (!latest) return emptyOverlay();

  const result = await get(latest.url, { access: "public" });
  if (!result || result.statusCode === 304 || !result.stream) return emptyOverlay();

  const payload = (await new Response(result.stream).json()) as ExpoOverlay;
  if (payload.version !== 1 || !payload.upserts || !Array.isArray(payload.deletedIds)) {
    throw new Error("Invalid admin expo data in Blob storage");
  }

  return payload;
}

async function writeOverlay(overlay: ExpoOverlay) {
  if (!hasBlobCredentials()) {
    throw new Error("Vercel Blob storage is not configured");
  }

  const updatedAt = new Date().toISOString();
  const pathname = `${ADMIN_EXPO_PREFIX}${Date.now()}-${crypto.randomUUID()}.json`;
  const nextOverlay = { ...overlay, updatedAt };

  await put(pathname, JSON.stringify(nextOverlay), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60,
  });

  return nextOverlay;
}

function mergeExpos(overlay: ExpoOverlay) {
  const deleted = new Set(overlay.deletedIds);
  const expos = new Map(
    generatedExpos()
      .filter((expo) => !deleted.has(expo.id))
      .map((expo) => [expo.id, expo]),
  );

  for (const persisted of Object.values(overlay.upserts)) {
    if (!deleted.has(persisted.id)) {
      expos.set(persisted.id, fromPersisted(persisted));
    }
  }

  return [...expos.values()];
}

export async function getAllExpos() {
  return mergeExpos(await readOverlay());
}

export async function getExpoById(id: string) {
  return (await getAllExpos()).find((expo) => expo.id === id) ?? null;
}

export async function getExpoStoreUpdatedAt() {
  return new Date((await readOverlay()).updatedAt);
}

export async function createExpo(input: ExpoWriteInput) {
  const overlay = await readOverlay();
  const now = new Date();
  const expo: ExpoRecord = {
    ...input,
    id: `admin-${crypto.randomUUID()}`,
    clickCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  overlay.upserts[expo.id] = toPersisted(expo);
  overlay.deletedIds = overlay.deletedIds.filter((id) => id !== expo.id);
  await writeOverlay(overlay);

  return expo;
}

export async function updateExpo(id: string, input: ExpoWriteInput) {
  const overlay = await readOverlay();
  const existing = mergeExpos(overlay).find((expo) => expo.id === id);
  if (!existing) return null;

  const expo: ExpoRecord = {
    ...existing,
    ...input,
    id,
    updatedAt: new Date(),
  };

  overlay.upserts[id] = toPersisted(expo);
  overlay.deletedIds = overlay.deletedIds.filter((deletedId) => deletedId !== id);
  await writeOverlay(overlay);

  return expo;
}

export async function deleteExpo(id: string) {
  const overlay = await readOverlay();
  const exists = mergeExpos(overlay).some((expo) => expo.id === id);
  if (!exists) return false;

  delete overlay.upserts[id];
  if (!overlay.deletedIds.includes(id)) overlay.deletedIds.push(id);
  await writeOverlay(overlay);

  return true;
}
