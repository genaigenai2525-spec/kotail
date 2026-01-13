import { beforeEach, vi } from 'vitest';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
