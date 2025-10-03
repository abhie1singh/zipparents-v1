/**
 * Production Environment Test Configuration
 *
 * Configuration for running READ-ONLY smoke tests against production
 */

import { PlaywrightTestConfig } from '@playwright/test';

export const prodConfig: Partial<PlaywrightTestConfig> = {
  // Use production URL
  use: {
    baseURL: process.env.PROD_BASE_URL || 'https://zipparents.com',

    // Capture everything for production failures
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',

    // Longer timeouts for production (network latency)
    actionTimeout: 20 * 1000,
    navigationTimeout: 45 * 1000,
  },

  // Run tests serially in production to minimize impact
  workers: 1,

  // Retry failed tests twice (network issues)
  retries: 2,

  // Longer timeout for production
  timeout: 90 * 1000,

  // No web server needed (testing deployed app)
  webServer: undefined,

  // No global setup (production environment - read-only tests)
  globalSetup: undefined,

  // Only run smoke tests in production
  testMatch: '**/*.smoke.spec.ts',

  // Production test output
  outputDir: 'test-results/prod',

  // Grep pattern to only run tests tagged with @smoke
  grep: /@smoke/,
};

/**
 * IMPORTANT: Production Tests Guidelines
 *
 * 1. Only run READ-ONLY tests (no writes, no deletes)
 * 2. Use existing test accounts (never create new accounts)
 * 3. Never modify production data
 * 4. Focus on critical user journeys (smoke tests)
 * 5. Run during low-traffic periods
 * 6. Monitor for any side effects
 *
 * Example smoke tests:
 * - Can access homepage
 * - Can view login page
 * - Can view signup page (don't submit)
 * - Can view public events
 * - Can access legal pages (terms, privacy)
 * - Can access help/FAQ
 */
