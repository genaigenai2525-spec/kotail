export type ArticleTag = 'workplace_review' | 'service_review';

export interface Article {
  id: string;
  company_id: string;
  title: string;
  content: string;
  user_id: string;
  tag: ArticleTag;
  created_at: string;
}

export interface CreateArticlePayload {
  company_id: string;
  title: string;
  content: string;
  user_id: string;
  tag: ArticleTag;
}

export interface FetchArticlesOptions {
  companyId: string;
  tag?: ArticleTag;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
