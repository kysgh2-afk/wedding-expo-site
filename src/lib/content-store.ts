import { get, list, put } from "@vercel/blob";
import sanitizeHtml from "sanitize-html";

const CONTENT_PREFIX = "data/content-admin/";

export type ContentRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string | null;
  category: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentWriteInput = Omit<ContentRecord, "id" | "createdAt" | "updatedAt">;

type PersistedContent = Omit<ContentRecord, "publishedAt" | "createdAt" | "updatedAt"> & {
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

type ContentSnapshot = {
  version: 1;
  updatedAt: string;
  items: Record<string, PersistedContent>;
};

function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.BLOB_STORE_ID?.trim() && process.env.VERCEL_OIDC_TOKEN?.trim()),
  );
}

function emptySnapshot(): ContentSnapshot {
  return { version: 1, updatedAt: new Date(0).toISOString(), items: {} };
}

export function sanitizeContentHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "blockquote", "a", "figure", "figcaption", "img",
      "hr", "div", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title"],
      div: ["style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    allowedSchemes: ["http", "https"],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
      }),
    },
  });
}

export function slugifyContent(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function fromPersisted(item: PersistedContent): ContentRecord {
  return {
    ...item,
    publishedAt: new Date(item.publishedAt),
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  };
}

function toPersisted(item: ContentRecord): PersistedContent {
  return {
    ...item,
    publishedAt: item.publishedAt.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

async function readSnapshot() {
  if (!hasBlobCredentials()) return emptySnapshot();

  let cursor: string | undefined;
  let latest: { url: string; uploadedAt: Date } | undefined;

  do {
    const page = await list({ prefix: CONTENT_PREFIX, limit: 1000, cursor });
    for (const blob of page.blobs) {
      if (!latest || blob.uploadedAt > latest.uploadedAt) {
        latest = { url: blob.url, uploadedAt: blob.uploadedAt };
      }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  if (!latest) return emptySnapshot();
  const result = await get(latest.url, { access: "public" });
  if (!result || result.statusCode === 304 || !result.stream) return emptySnapshot();

  const payload = (await new Response(result.stream).json()) as ContentSnapshot;
  if (payload.version !== 1 || !payload.items) {
    throw new Error("Invalid content data in Blob storage");
  }
  return payload;
}

async function writeSnapshot(snapshot: ContentSnapshot) {
  if (!hasBlobCredentials()) throw new Error("Vercel Blob storage is not configured");
  const updatedAt = new Date().toISOString();
  await put(
    `${CONTENT_PREFIX}${Date.now()}-${crypto.randomUUID()}.json`,
    JSON.stringify({ ...snapshot, updatedAt }),
    {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60,
    },
  );
}

export async function getAllContent() {
  const snapshot = await readSnapshot();
  return Object.values(snapshot.items)
    .map(fromPersisted)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getPublishedContent() {
  return (await getAllContent()).filter((item) => item.isPublished);
}

export async function getContentById(id: string) {
  return (await getAllContent()).find((item) => item.id === id) ?? null;
}

export async function getContentBySlug(slug: string) {
  return (await getPublishedContent()).find((item) => item.slug === slug) ?? null;
}

export async function createContent(input: ContentWriteInput) {
  const snapshot = await readSnapshot();
  const slug = slugifyContent(input.slug || input.title);
  if (!slug) throw new Error("주소용 이름을 입력해 주세요.");
  if (Object.values(snapshot.items).some((item) => item.slug === slug)) {
    throw new Error("이미 사용 중인 주소입니다.");
  }

  const now = new Date();
  const item: ContentRecord = {
    ...input,
    slug,
    contentHtml: sanitizeContentHtml(input.contentHtml),
    id: `content-${crypto.randomUUID()}`,
    createdAt: now,
    updatedAt: now,
  };
  snapshot.items[item.id] = toPersisted(item);
  await writeSnapshot(snapshot);
  return item;
}

export async function updateContent(id: string, input: ContentWriteInput) {
  const snapshot = await readSnapshot();
  const existing = snapshot.items[id];
  if (!existing) return null;

  const slug = slugifyContent(input.slug || input.title);
  if (!slug) throw new Error("주소용 이름을 입력해 주세요.");
  if (Object.values(snapshot.items).some((item) => item.id !== id && item.slug === slug)) {
    throw new Error("이미 사용 중인 주소입니다.");
  }

  const item: ContentRecord = {
    ...fromPersisted(existing),
    ...input,
    id,
    slug,
    contentHtml: sanitizeContentHtml(input.contentHtml),
    updatedAt: new Date(),
  };
  snapshot.items[id] = toPersisted(item);
  await writeSnapshot(snapshot);
  return item;
}

export async function deleteContent(id: string) {
  const snapshot = await readSnapshot();
  if (!snapshot.items[id]) return false;
  delete snapshot.items[id];
  await writeSnapshot(snapshot);
  return true;
}
