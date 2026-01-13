import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import {
  searchArticles,
  fetchArticles,
  createArticle,
} from '@backend/services/articleService';
import { Article, ValidationError } from '@backend/types/article';

// Only run integration tests when INTEGRATION_TEST env is set
const runIntegration = process.env.INTEGRATION_TEST === 'true';

describe.skipIf(!runIntegration)('ArticleService Integration Tests', () => {
  let supabase: SupabaseClient;
  // Use proper UUIDs for company_id and user_id (DB columns are UUID type)
  const testCompanyId = randomUUID();
  const testUserId = randomUUID();
  const createdArticleIds: string[] = [];

  beforeAll(async () => {
    // Create a direct Supabase client for test setup/cleanup
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Insert test data
    const testArticles = [
      {
        company_id: testCompanyId,
        title: 'Salary is great here',
        content: 'The benefits package is amazing.',
        user_id: testUserId,
        tag: 'workplace_review',
      },
      {
        company_id: testCompanyId,
        title: 'Nice office environment',
        content: 'Good salary and flexible hours.',
        user_id: testUserId,
        tag: 'service_review',
      },
      {
        company_id: testCompanyId,
        title: 'Clean workspace',
        content: 'Very modern and comfortable.',
        user_id: testUserId,
        tag: 'workplace_review',
      },
    ];

    const { data, error } = await supabase
      .from('articles')
      .insert(testArticles)
      .select();

    if (error) {
      console.error('Failed to setup test data:', error);
      throw error;
    }

    if (data) {
      createdArticleIds.push(...data.map((a: Article) => a.id));
    }
  });

  afterAll(async () => {
    // Cleanup: Delete test articles
    if (createdArticleIds.length > 0) {
      await supabase.from('articles').delete().in('id', createdArticleIds);
    }
  });

  describe('searchArticles', () => {
    it('should return 2 articles when searching "Salary" (matches title and content)', async () => {
      // Act
      const result = await searchArticles('Salary');

      // Assert: "Salary" appears in article 1 title and article 2 content
      const testResults = result.filter((a) => a.company_id === testCompanyId);
      expect(testResults.length).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when searching for non-existent keyword', async () => {
      // Act
      const result = await searchArticles('xyz-nonexistent-keyword-' + Date.now());

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('fetchArticles', () => {
    it('should fetch all articles for the test company', async () => {
      // Act
      const result = await fetchArticles({ companyId: testCompanyId });

      // Assert
      expect(result.data.length).toBe(3);
      expect(result.total).toBe(3);
    });

    it('should filter by tag=service_review and return NO workplace_review items', async () => {
      // Act
      const result = await fetchArticles({
        companyId: testCompanyId,
        tag: 'service_review',
      });

      // Assert: Only 1 service_review exists
      expect(result.data.length).toBe(1);
      expect(result.data.every((a) => a.tag === 'service_review')).toBe(true);
      // CRITICAL: Ensure NO workplace_review items
      expect(result.data.some((a) => a.tag === 'workplace_review')).toBe(false);
    });

    it('should paginate correctly with page=1', async () => {
      // Act
      const result = await fetchArticles({ companyId: testCompanyId, page: 1 });

      // Assert
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.hasMore).toBe(false); // Only 3 articles
    });
  });

  describe('createArticle', () => {
    it('should create a new article and return it with id', async () => {
      // Arrange
      const newArticle = {
        company_id: testCompanyId,
        title: 'Integration Test Article',
        content: 'This article was created in integration test.',
        user_id: testUserId,
        tag: 'workplace_review' as const,
      };

      // Act
      const result = await createArticle(newArticle);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.title).toBe(newArticle.title);
      expect(result.tag).toBe('workplace_review');

      // Track for cleanup
      createdArticleIds.push(result.id);
    });

    it('should throw ValidationError for empty title', async () => {
      // Arrange
      const invalidArticle = {
        company_id: testCompanyId,
        title: '',
        content: 'Some content',
        user_id: testUserId,
        tag: 'workplace_review' as const,
      };

      // Act & Assert
      await expect(createArticle(invalidArticle)).rejects.toThrow(ValidationError);
      await expect(createArticle(invalidArticle)).rejects.toThrow(
        'Title cannot be empty'
      );
    });

    it('should throw ValidationError for invalid tag', async () => {
      // Arrange
      const invalidArticle = {
        company_id: testCompanyId,
        title: 'Valid Title',
        content: 'Valid content',
        user_id: testUserId,
        tag: 'invalid_tag' as 'workplace_review',
      };

      // Act & Assert
      await expect(createArticle(invalidArticle)).rejects.toThrow(ValidationError);
      await expect(createArticle(invalidArticle)).rejects.toThrow('Invalid tag');
    });
  });
});
