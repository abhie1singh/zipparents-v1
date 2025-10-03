/**
 * Local Environment Test Configuration
 *
 * Configuration for running tests against local Firebase emulators
 */

import { PlaywrightTestConfig } from '@playwright/test';

export const localConfig: Partial<PlaywrightTestConfig> = {
  // Use local emulators
  use: {
    baseURL: 'http://localhost:3000',

    // Local environment doesn't need screenshots/videos on every failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Faster timeouts for local development
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  // Run tests serially to avoid race conditions with emulator data
  workers: 1,

  // No retries in local development
  retries: 0,

  // Longer timeout for local debugging
  timeout: 30 * 1000,

  // Use local dev server
  webServer: {
    command: 'NEXT_PUBLIC_FIREBASE_ENV=local npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },

  // Global setup to seed test data
  globalSetup: './tests/global-setup.ts',

  // Local test output
  outputDir: 'test-results/local',
};
