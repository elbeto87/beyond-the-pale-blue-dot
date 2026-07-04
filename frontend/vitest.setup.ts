// Runs before every test file.
// Adds custom matchers like `toBeInTheDocument()` and cleans up the DOM
// after each test so components don't leak between tests.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

