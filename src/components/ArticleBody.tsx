import { sanitizeArticleHtml } from "@/lib/html";

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  const safeHtml = sanitizeArticleHtml(html);

  return (
    <div
      className="article-prose"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
