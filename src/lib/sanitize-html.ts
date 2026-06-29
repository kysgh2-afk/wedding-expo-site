import "server-only";
import DOMPurify from "isomorphic-dompurify";
import { plainTextToHtml } from "@/lib/html";

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

export function sanitizeArticleHtml(html: string) {
  const normalized = html.includes("<") ? html : plainTextToHtml(html);

  return DOMPurify.sanitize(normalized, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}
