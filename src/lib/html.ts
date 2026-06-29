import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "img",
  "hr",
  "span",
  "mark",
];

const ALLOWED_ATTR = ["href", "src", "alt", "target", "rel", "style", "class"];

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function plainTextToHtml(text: string) {
  if (!text.trim()) return "";
  if (text.includes("<")) return text;

  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function sanitizeArticleHtml(html: string) {
  const normalized = html.includes("<") ? html : plainTextToHtml(html);

  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function articleExcerpt(body: string, excerpt?: string) {
  if (excerpt?.trim()) return excerpt.trim();
  return stripHtml(body).slice(0, 150);
}
