import { test, expect } from '@playwright/test';

/**
 * Verification test to ensure home page loads without errors
 */

test.describe('Home Page Verification', () => {
  let consoleErrors: string[] = [];
  let consoleWarnings: string[] = [];

  test.beforeEach(({ page }) => {
    // Capture console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });

    // Capture page errors
    page.on('pageerror', (error) => {
      consoleErrors.push(error.message);
    });
  });

  test('should load home page without console errors', async ({ page }) => {
    consoleErrors = [];
    consoleWarnings = [];

    // Navigate to home page
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Wait for page to be fully loaded
    await page.waitForSelector('h1:has-text("Welcome to ZipParents")', {
      timeout: 10000,
    });

    // Check that the page title is correct
    await expect(page).toHaveTitle(/ZipParents/);

    // Check that main content is visible
    await expect(page.locator('h1')).toContainText('Welcome to ZipParents');
    await expect(page.locator('p')).toContainText('Connect, Share, Support');

    // Report any console errors
    if (consoleErrors.length > 0) {
      console.log('❌ Console Errors:', consoleErrors);
    }

    if (consoleWarnings.length > 0) {
      console.log('⚠️  Console Warnings:', consoleWarnings);
    }

    // Fail test if there are console errors
    expect(consoleErrors.length, `Found ${consoleErrors.length} console errors: ${consoleErrors.join(', ')}`).toBe(0);

    console.log('✅ Home page loaded successfully with no console errors!');
  });

  test('should have correct styling applied', async ({ page }) => {
    await page.goto('http://localhost:3000');

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Check that Tailwind classes are applied
    const h1Class = await h1.getAttribute('class');
    expect(h1Class).toContain('text-4xl');
    expect(h1Class).toContain('font-bold');
    expect(h1Class).toContain('text-primary-600');
  });
});
