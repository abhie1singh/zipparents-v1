import { test, expect } from '@playwright/test';

/**
 * Comprehensive browser console check
 */

test('comprehensive console error check', async ({ page }) => {
  const consoleMessages: Array<{type: string, text: string}> = [];
  const pageErrors: string[] = [];

  // Capture ALL console messages
  page.on('console', (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });

  // Capture page errors
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  // Navigate to home page
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Wait a bit for any lazy-loaded scripts
  await page.waitForTimeout(3000);

  // Filter out non-error messages
  const errors = consoleMessages.filter(msg => msg.type === 'error');
  const warnings = consoleMessages.filter(msg => msg.type === 'warning');

  // Log all console output
  console.log('\n📊 Console Output Summary:');
  console.log(`Total messages: ${consoleMessages.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`Page Errors: ${pageErrors.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Console Errors:');
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err.text}`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Console Warnings:');
    warnings.forEach((warn, i) => {
      console.log(`${i + 1}. ${warn.text}`);
    });
  }

  if (pageErrors.length > 0) {
    console.log('\n❌ Page Errors:');
    pageErrors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`);
    });
  }

  // Check page loaded correctly
  await expect(page.locator('h1')).toContainText('Welcome to ZipParents');

  // Fail if there are any errors
  expect(errors.length + pageErrors.length,
    `Found ${errors.length + pageErrors.length} errors`).toBe(0);

  console.log('\n✅ No console errors detected!');
});
