// jest.setup.js
import '@testing-library/jest-dom';

// Mock the process.env
process.env = Object.assign({}, process.env, {
  NODE_ENV: 'test',
});

// Mock fetch globally
if (typeof global.fetch !== 'function') {
  // @ts-ignore - we're deliberately mocking this for tests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      headers: {
        get: () => 'application/json',
      },
    })
  );
}
