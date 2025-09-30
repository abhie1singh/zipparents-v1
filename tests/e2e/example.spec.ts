import { test, expect } from '@playwright/test';

/**
 * Example E2E test
 * This demonstrates the basic test structure
 */

test.describe('Home Page', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Welcome to ZipParents');
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ZipParents/);
  });
});

// To run these tests:
// Local: npm run test:e2e:local
// Dev: npm run test:e2e:dev
// Prod: npm run test:e2e:prod
