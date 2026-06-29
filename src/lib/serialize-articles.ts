export type SerializedArticle = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

type ArticleRecord = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeArticles(articles: ArticleRecord[]): SerializedArticle[] {
  return articles.map((article) => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));
}
