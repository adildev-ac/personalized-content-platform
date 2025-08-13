// Basic security test for GiscusComments component
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GiscusComments from '../../components/GiscusComments';

// Mock environment variables
const mockEnv = {
  NEXT_PUBLIC_GISCUS_REPO: undefined,
  NEXT_PUBLIC_GISCUS_REPO_ID: undefined,
  NEXT_PUBLIC_GISCUS_CATEGORY: undefined,
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: undefined,
};

// Save original process.env
const originalEnv = process.env;

describe('GiscusComments Security', () => {
  beforeEach(() => {
    // Setup test environment
    process.env = { ...originalEnv, ...mockEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('handles missing environment variables safely', () => {
    render(<GiscusComments />);
    expect(screen.getByText(/Loading comments/i)).toBeInTheDocument();
  });
});
