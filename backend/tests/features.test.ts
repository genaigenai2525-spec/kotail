import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSupabaseMock, SupabaseMock } from './mocks/supabaseMock';
import {
  Article,
  CreateArticlePayload,
  ValidationError,
} from '@backend/types/article';

// Mock the supabase client module
vi.mock('@backend/lib/supabase', () => ({
  supabase: createSupabaseMock(),
}));

// Import service functions (these will use the mocked supabase)
import {
  searchArticles,
  fetchArticles,
  createArticle,
} from '@backend/services/articleService';

describe('ArticleService', () => {
  let supabaseMock: SupabaseMock;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked supabase client
    const { supabase } = await import('@backend/lib/supabase');
    supabaseMock = supabase as unknown as SupabaseMock;
    supabaseMock._reset();
  });

  // ============================================
  // searchArticles Tests
  // ============================================
  describe('searchArticles', () => {
    const sampleArticles: Article[] = [
      {
        id: '1',
        company_id: 'company-1',
        title: 'Salary is great here',
        content: 'The benefits are amazing.',
        user_id: 'user-1',
        tag: 'workplace_review',
        created_at: '2026-01-10T00:00:00Z',
      },
      {
        id: '2',
        company_id: 'company-1',
        title: 'Great workplace',
        content: 'Salary could be better though.',
        user_id: 'user-2',
        tag: 'service_review',
        created_at: '2026-01-09T00:00:00Z',
      },
      {
        id: '3',
        company_id: 'company-1',
        title: 'Nice office',
        content: 'Very clean and modern.',
        user_id: 'user-3',
        tag: 'workplace_review',
        created_at: '2026-01-08T00:00:00Z',
      },
    ];

    it('should return 2 articles when searching "Salary" (matches title and content)', async () => {
      // Arrange: "Salary" appears in article 1 title and article 2 content
      const matchingArticles = sampleArticles.filter(
        (a) =>
          a.title.toLowerCase().includes('salary') ||
          a.content.toLowerCase().includes('salary')
      );
      supabaseMock._setMockResult(matchingArticles);

      // Act
      const result = await searchArticles('Salary');

      // Assert
      expect(supabaseMock.from).toHaveBeenCalledWith('articles');
      expect(supabaseMock.select).toHaveBeenCalled();
      expect(supabaseMock.or).toHaveBeenCalledWith(
        'title.ilike.%Salary%,content.ilike.%Salary%'
      );
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no matches found', async () => {
      // Arrange
      supabaseMock._setMockResult([]);

      // Act
      const result = await searchArticles('nonexistent-keyword-xyz');

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle empty keyword by returning all articles', async () => {
      // Arrange
      supabaseMock._setMockResult(sampleArticles);

      // Act
      const result = await searchArticles('');

      // Assert
      expect(result).toEqual(sampleArticles);
    });

    it('should throw error when Supabase returns an error', async () => {
      // Arrange
      supabaseMock._setMockResult(null, { message: 'Database connection error' });

      // Act & Assert
      await expect(searchArticles('test')).rejects.toThrow(
        'Database connection error'
      );
    });
  });

  // ============================================
  // fetchArticles Tests
  // ============================================
  describe('fetchArticles', () => {
    const mixedArticles: Article[] = [
      {
        id: '1',
        company_id: 'company-1',
        title: 'Workplace Review 1',
        content: 'Content 1',
        user_id: 'user-1',
        tag: 'workplace_review',
        created_at: '2026-01-10T00:00:00Z',
      },
      {
        id: '2',
        company_id: 'company-1',
        title: 'Service Review 1',
        content: 'Content 2',
        user_id: 'user-2',
        tag: 'service_review',
        created_at: '2026-01-09T00:00:00Z',
      },
      {
        id: '3',
        company_id: 'company-1',
        title: 'Workplace Review 2',
        content: 'Content 3',
        user_id: 'user-3',
        tag: 'workplace_review',
        created_at: '2026-01-08T00:00:00Z',
      },
    ];

    it('should fetch all articles for a company when no tag filter', async () => {
      // Arrange
      supabaseMock._setMockResult(mixedArticles, null, mixedArticles.length);

      // Act
      const result = await fetchArticles({ companyId: 'company-1' });

      // Assert
      expect(supabaseMock.from).toHaveBeenCalledWith('articles');
      expect(supabaseMock.eq).toHaveBeenCalledWith('company_id', 'company-1');
      expect(result.data).toHaveLength(3);
    });

    it('should return only service_review articles when tag=service_review', async () => {
      // Arrange: Filter to only service_review
      const serviceReviews = mixedArticles.filter(
        (a) => a.tag === 'service_review'
      );
      supabaseMock._setMockResult(serviceReviews, null, serviceReviews.length);

      // Act
      const result = await fetchArticles({
        companyId: 'company-1',
        tag: 'service_review',
      });

      // Assert
      expect(supabaseMock.eq).toHaveBeenCalledWith('company_id', 'company-1');
      expect(supabaseMock.eq).toHaveBeenCalledWith('tag', 'service_review');
      expect(result.data).toHaveLength(1);
      // CRITICAL: NO workplace_review items should be returned
      expect(result.data.every((a) => a.tag === 'service_review')).toBe(true);
      expect(result.data.some((a) => a.tag === 'workplace_review')).toBe(false);
    });

    it('should paginate with default page size of 10', async () => {
      // Arrange
      supabaseMock._setMockResult(mixedArticles, null, mixedArticles.length);

      // Act
      const result = await fetchArticles({ companyId: 'company-1', page: 1 });

      // Assert
      expect(supabaseMock.range).toHaveBeenCalledWith(0, 9); // 0-indexed, 10 items
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    it('should calculate correct offset for page 3', async () => {
      // Arrange
      supabaseMock._setMockResult([], null, 0);

      // Act
      const result = await fetchArticles({ companyId: 'company-1', page: 3 });

      // Assert
      expect(supabaseMock.range).toHaveBeenCalledWith(20, 29); // Page 3: offset 20-29
      expect(result.page).toBe(3);
    });

    it('should order results by created_at descending', async () => {
      // Arrange
      supabaseMock._setMockResult(mixedArticles, null, mixedArticles.length);

      // Act
      await fetchArticles({ companyId: 'company-1' });

      // Assert
      expect(supabaseMock.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
    });

    it('should set hasMore=true when more results exist', async () => {
      // Arrange: 15 total results, but only 10 returned on page 1
      supabaseMock._setMockResult(mixedArticles.slice(0, 10), null, 15);

      // Act
      const result = await fetchArticles({ companyId: 'company-1', page: 1 });

      // Assert
      expect(result.hasMore).toBe(true);
    });

    it('should set hasMore=false when on last page', async () => {
      // Arrange: 3 total results, all returned
      supabaseMock._setMockResult(mixedArticles, null, 3);

      // Act
      const result = await fetchArticles({ companyId: 'company-1', page: 1 });

      // Assert
      expect(result.hasMore).toBe(false);
    });
  });

  // ============================================
  // createArticle Tests
  // ============================================
  describe('createArticle', () => {
    const validPayload: CreateArticlePayload = {
      company_id: 'company-1',
      title: 'Great Company Review',
      content:
        'This is a detailed review about the company workplace environment.',
      user_id: 'user-1',
      tag: 'workplace_review',
    };

    const mockCreatedArticle: Article = {
      ...validPayload,
      id: 'new-article-id-123',
      created_at: '2026-01-10T00:00:00Z',
    };

    it('should create article with valid payload', async () => {
      // Arrange
      supabaseMock._setMockResult(mockCreatedArticle);

      // Act
      const result = await createArticle(validPayload);

      // Assert
      expect(supabaseMock.from).toHaveBeenCalledWith('articles');
      expect(supabaseMock.insert).toHaveBeenCalledWith(validPayload);
      expect(result.id).toBe('new-article-id-123');
    });

    it('should throw ValidationError when title is empty string', async () => {
      // Arrange
      const invalidPayload = { ...validPayload, title: '' };

      // Act & Assert
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        ValidationError
      );
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        'Title cannot be empty'
      );
    });

    it('should throw ValidationError when title is only whitespace', async () => {
      // Arrange
      const invalidPayload = { ...validPayload, title: '   ' };

      // Act & Assert
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when content is empty string', async () => {
      // Arrange
      const invalidPayload = { ...validPayload, content: '' };

      // Act & Assert
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        ValidationError
      );
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        'Content cannot be empty'
      );
    });

    it('should throw ValidationError when content is only whitespace', async () => {
      // Arrange
      const invalidPayload = { ...validPayload, content: '   ' };

      // Act & Assert
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw ValidationError when tag is invalid', async () => {
      // Arrange
      const invalidPayload = {
        ...validPayload,
        tag: 'invalid_tag' as CreateArticlePayload['tag'],
      };

      // Act & Assert
      await expect(createArticle(invalidPayload)).rejects.toThrow(
        ValidationError
      );
      await expect(createArticle(invalidPayload)).rejects.toThrow('Invalid tag');
    });

    it('should accept workplace_review as valid tag', async () => {
      // Arrange
      supabaseMock._setMockResult(mockCreatedArticle);
      const payload = { ...validPayload, tag: 'workplace_review' as const };

      // Act
      const result = await createArticle(payload);

      // Assert
      expect(result.tag).toBe('workplace_review');
    });

    it('should accept service_review as valid tag', async () => {
      // Arrange
      const articleWithServiceTag = {
        ...mockCreatedArticle,
        tag: 'service_review' as const,
      };
      supabaseMock._setMockResult(articleWithServiceTag);
      const payload = { ...validPayload, tag: 'service_review' as const };

      // Act
      const result = await createArticle(payload);

      // Assert
      expect(result.tag).toBe('service_review');
    });

    it('should throw error when Supabase insert fails', async () => {
      // Arrange
      supabaseMock._setMockResult(null, { message: 'Insert failed: duplicate key' });

      // Act & Assert
      await expect(createArticle(validPayload)).rejects.toThrow(
        'Insert failed: duplicate key'
      );
    });
  });
});
