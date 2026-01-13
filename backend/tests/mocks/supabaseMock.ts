import { vi } from 'vitest';

export interface MockQueryResult {
  data: unknown;
  error: unknown;
  count?: number;
}

// Create chainable mock builder for Supabase client
export const createSupabaseMock = () => {
  let mockResult: MockQueryResult = { data: null, error: null };

  const chainableMock = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => Promise.resolve(mockResult)),

    // Make the mock thenable (awaitable)
    then: vi.fn().mockImplementation((resolve) => {
      return Promise.resolve(mockResult).then(resolve);
    }),

    // Helper methods for test setup
    _setMockResult: (data: unknown, error: unknown = null, count?: number) => {
      mockResult = { data, error, count };
    },
    _getMockResult: () => mockResult,
    _reset: () => {
      mockResult = { data: null, error: null };
    },
  };

  // Make all chain methods return the chainable object (except helpers)
  const chainMethods = [
    'from',
    'select',
    'insert',
    'update',
    'delete',
    'ilike',
    'or',
    'eq',
    'neq',
    'range',
    'order',
    'limit',
  ];

  chainMethods.forEach((method) => {
    (chainableMock as Record<string, unknown>)[method] = vi
      .fn()
      .mockReturnValue(chainableMock);
  });

  return chainableMock;
};

export type SupabaseMock = ReturnType<typeof createSupabaseMock>;
