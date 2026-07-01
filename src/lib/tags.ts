const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 20;

export function parseTagsFromInput(input: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of input.split(/[\s,#]+/)) {
    const tag = part.trim().slice(0, MAX_TAG_LENGTH);
    if (!tag) continue;

    const key = tag.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(tag);
    if (result.length >= MAX_TAGS) break;
  }

  return result;
}

export function normalizeTagsInput(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => parseTagsFromInput(String(item)))
      .filter((tag, index, tags) => tags.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) === index)
      .slice(0, MAX_TAGS);
  }

  if (typeof value === "string") {
    return parseTagsFromInput(value);
  }

  return [];
}

export function formatTagsForInput(tags: string[]): string {
  if (tags.length === 0) return "";
  return tags.map((tag) => `#${tag}`).join(" ");
}
