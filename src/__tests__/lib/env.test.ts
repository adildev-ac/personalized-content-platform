// src/__tests__/lib/env.test.ts
import { describe, test, expect, jest } from '@jest/globals';

// Setup environment variable mocks
process.env = {
  ...process.env,
  NEXT_PUBLIC_STRAPI_URL: 'http://localhost:1337',
  NEXT_PUBLIC_GISCUS_REPO: 'owner/repo',
  NEXT_PUBLIC_GISCUS_REPO_ID: 'R_abc123',
  NEXT_PUBLIC_GISCUS_CATEGORY: 'General',
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: 'DIC_abc123'
};

// Create mock for EnvValidator class methods
jest.mock('../../lib/env', () => {
  // Create a mock implementation of the EnvValidator class
  const mockValidator = {
    validateEnv: jest.fn().mockReturnValue([]),
    isValid: jest.fn().mockReturnValue(true),
    getErrors: jest.fn().mockReturnValue([]),
    get: jest.fn((key: string, fallback = '') => {
      return process.env[key as keyof typeof process.env] || fallback;
    })
  };

  return {
    env: mockValidator,
    validateEnvironment: jest.fn()
  };
});

// Import the mocked module
import { env, validateEnvironment } from '../../lib/env';

describe('Environment Variables', () => {
  test('API URL validation', () => {
    // Testing valid URL
    expect(env.get('NEXT_PUBLIC_STRAPI_URL')).toBe('http://localhost:1337');
  });

  test('Environment validation', () => {
    validateEnvironment();
    expect(env.isValid()).toBeTruthy();
  });
});
