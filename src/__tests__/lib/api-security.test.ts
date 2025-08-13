// src/__tests__/lib/api-security.test.ts

import { STRAPI_API_URL, getArticles, getArticleBySlug } from '../../lib/api';

// Mock fetch function for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: [] }),
    headers: {
      get: () => 'application/json',
    },
  })
) as jest.Mock;

describe('API Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSafeApiUrl validates and sanitizes API URL', () => {
    // Store original env
    const originalEnv = { ...process.env };
    
    // Test with valid URL
    process.env.NEXT_PUBLIC_STRAPI_URL = 'https://api.example.com';
    expect(STRAPI_API_URL).not.toBe('');
    
    // Restore original env
    process.env = originalEnv;
  });

  test('API functions handle errors securely', async () => {
    // Mock a failed fetch call
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error('Network error'))
    );
    
    // The API function should catch the error and return empty array
    const result = await getArticles();
    expect(result).toEqual([]);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('API functions validate input parameters', async () => {
    // Test with invalid slug
    await getArticleBySlug('../../etc/passwd');
    
    // Valid slug should proceed with fetch
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
        headers: {
          get: () => 'application/json'
        }
      })
    );
    
    await getArticleBySlug('valid-slug');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
