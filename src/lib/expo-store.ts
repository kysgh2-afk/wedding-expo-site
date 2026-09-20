import { get, list, put } from "@vercel/blob";
import generatedExpoData from "@/data/expos.generated.json";

const ADMIN_EXPO_PREFIX = "data/expos-admin/";
const LIVE_EXPO_DATA_URL = process.env.EXPO_LIVE_DATA_URL?.trim();

type GeneratedExpoData = typeof generatedExpoData;

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

function isValidGeneratedData(value: unknown): value is GeneratedExpoData {
  if (!value || typeof value !== "object") return false;
  const data = value as { generatedAt?: unknown; expos?: unknown };
  if (
    typeof data.generatedAt !== "string" ||
    !Number.isFinite(Date.parse(data.generatedAt)) ||
    !Array.isArray(data.expos) ||
    data.expos.length < 10
  ) {
    return false;
  }

  return data.expos.every((expo) => {
    if (!expo || typeof expo !== "object") return false;
    const item = expo as { id?: unknown; title?: unknown; endDate?: unknown };
    return (
      typeof item.id === "string" &&
      typeof item.title === "string" &&
      typeof item.endDate === "string" &&
      Number.isFinite(Date.parse(item.endDate))
    );
  });
}

async function getGeneratedExpoData(): Promise<GeneratedExpoData> {
  if (!LIVE_EXPO_DATA_URL) return generatedExpoData;

  try {
    const liveUrl = new URL(LIVE_EXPO_DATA_URL);
    liveUrl.searchParams.set(
      "weddinglast_refresh",
      String(Math.floor(Date.now() / 300_000)),
    );
    const response = await fetch(liveUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const value: unknown = await response.json();
    if (!isValidGeneratedData(value)) {
      throw new Error("invalid schedule payload");
    }
    return value;
  } catch (error) {
    console.error("[expo-store] Live schedule fetch failed; using bundled data:", error);
    return generatedExpoData;
  }
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

function generatedExpos(data: GeneratedExpoData): ExpoRecord[] {
  const generatedAt = new Date(data.generatedAt);

  return data.expos.map((expo) => ({
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

function mergeExpos(overlay: ExpoOverlay, data: GeneratedExpoData) {
  const deleted = new Set(overlay.deletedIds);
  const expos = new Map(
    generatedExpos(data)
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
  const [data, overlay] = await Promise.all([
    getGeneratedExpoData(),
    readOverlay(),
  ]);
  return mergeExpos(overlay, data);
}

export async function getExpoById(id: string) {
  return (await getAllExpos()).find((expo) => expo.id === id) ?? null;
}

export async function getExpoStoreUpdatedAt() {
  const [data, overlay] = await Promise.all([
    getGeneratedExpoData(),
    readOverlay(),
  ]);
  return new Date(
    Math.max(Date.parse(data.generatedAt), Date.parse(overlay.updatedAt)),
  );
}

export async function getGeneratedExpoUpdatedAt() {
  return new Date((await getGeneratedExpoData()).generatedAt);
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
  const [data, overlay] = await Promise.all([
    getGeneratedExpoData(),
    readOverlay(),
  ]);
  const existing = mergeExpos(overlay, data).find((expo) => expo.id === id);
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
  const [data, overlay] = await Promise.all([
    getGeneratedExpoData(),
    readOverlay(),
  ]);
  const exists = mergeExpos(overlay, data).some((expo) => expo.id === id);
  if (!exists) return false;

  delete overlay.upserts[id];
  if (!overlay.deletedIds.includes(id)) overlay.deletedIds.push(id);
  await writeOverlay(overlay);

  return true;
}
