/**
 * Dev Environment Test Configuration
 *
 * Configuration for running tests against development Firebase project
 */

import { PlaywrightTestConfig } from '@playwright/test';

export const devConfig: Partial<PlaywrightTestConfig> = {
  // Use dev environment URL
  use: {
    baseURL: process.env.DEV_BASE_URL || 'https://zipparents-dev.vercel.app',

    // Capture more artifacts in dev for debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Standard timeouts
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Can run tests in parallel in dev
  workers: 2,

  // Retry failed tests once
  retries: 1,

  // Standard timeout
  timeout: 60 * 1000,

  // No web server needed (testing deployed app)
  webServer: undefined,

  // No global setup (dev environment has persistent data)
  globalSetup: undefined,

  // Dev test output
  outputDir: 'test-results/dev',
};
