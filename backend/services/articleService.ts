import { supabase } from '@backend/lib/supabase';
import {
  Article,
  CreateArticlePayload,
  FetchArticlesOptions,
  PaginatedResult,
  ArticleTag,
  ValidationError,
} from '@backend/types/article';

const VALID_TAGS: ArticleTag[] = ['workplace_review', 'service_review'];
const DEFAULT_PAGE_SIZE = 10;

/**
 * Search articles by keyword using ilike on title and content
 * @param keyword - The search keyword (case-insensitive)
 * @returns Array of matching articles
 */
export async function searchArticles(keyword: string): Promise<Article[]> {
  let query = supabase.from('articles').select('*');

  // Only add filter if keyword is not empty
  if (keyword.trim()) {
    query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as Article[];
}

/**
 * Fetch articles with filtering by company, tag, and pagination
 * @param options - Fetch options including companyId, tag, page, pageSize
 * @returns Paginated result with articles and metadata
 */
export async function fetchArticles(
  options: FetchArticlesOptions
): Promise<PaginatedResult<Article>> {
  const {
    companyId,
    tag,
    keyword,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = options;

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  // Add tag filter if provided
  if (tag) {
    query = query.eq('tag', tag);
  }

  // Add keyword filter if provided
  if (keyword && keyword.trim()) {
    const trimmed = keyword.trim();
    query = query.or(`title.ilike.%${trimmed}%,content.ilike.%${trimmed}%`);
  }

  // Calculate pagination range (0-indexed)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const hasMore = page * pageSize < total;

  return {
    data: data as Article[],
    page,
    pageSize,
    total,
    hasMore,
  };
}

/**
 * Create a new article with validation
 * @param payload - Article data to create
 * @returns The created article
 * @throws ValidationError if payload is invalid
 */
export async function createArticle(
  payload: CreateArticlePayload
): Promise<Article> {
  // Validate title
  if (!payload.title || !payload.title.trim()) {
    throw new ValidationError('Title cannot be empty');
  }

  // Validate content
  if (!payload.content || !payload.content.trim()) {
    throw new ValidationError('Content cannot be empty');
  }

  // Validate tag
  if (!VALID_TAGS.includes(payload.tag)) {
    throw new ValidationError(
      `Invalid tag. Must be one of: ${VALID_TAGS.join(', ')}`
    );
  }

  const { data, error } = await supabase
    .from('articles')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Article;
}
