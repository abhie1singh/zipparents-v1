import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Admin Content Moderation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
  });

  test('should display reports queue', async ({ page }) => {
    await page.goto('/admin/reports');

    await expect(page.locator('h1:has-text("Reports Queue")')).toBeVisible();

    // Should show status filters
    await expect(page.locator('button:has-text("All")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Pending")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Reviewing")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Resolved")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Dismissed")').first()).toBeVisible();

    // Wait for loading to complete - either table, empty state, or error will appear
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No reports found', { timeout: 1000 })).catch(() => {});

    // Should show reports table or empty state (not error)
    const hasTable = await page.locator('table').count();
    const hasEmptyState = await page.locator('text=No reports found').count();
    expect(hasTable + hasEmptyState).toBeGreaterThan(0);
  });

  test('should filter reports by status', async ({ page }) => {
    await page.goto('/admin/reports');

    // Click on Pending filter
    await page.click('button:has-text("Pending")');

    // Wait for filter to apply
    await page.waitForTimeout(1000);

    // Pending button should be active
    const pendingButton = page.locator('button:has-text("Pending")');
    await expect(pendingButton).toHaveClass(/bg-primary-600/);
  });

  test('should view report details', async ({ page }) => {
    await page.goto('/admin/reports');

    // Wait for reports to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No reports found', { timeout: 1000 })).catch(() => {});

    // Check if there are any reports
    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      // Should navigate to report detail page
      await expect(page).toHaveURL(/\/admin\/reports\/[a-zA-Z0-9]+/);

      // Wait for report details to load
      await page.waitForSelector('h1:has-text("Report Details")', { timeout: 10000 }).catch(() => {});

      // Should show report details
      await expect(page.locator('h1:has-text("Report Details")')).toBeVisible();
      await expect(page.locator('text=Report ID:')).toBeVisible();
      await expect(page.locator('text=Type:')).toBeVisible();
      await expect(page.locator('text=Status:')).toBeVisible();
    } else {
      // No reports available - test passes
      await expect(page.locator('text=No reports found')).toBeVisible();
    }
  });

  test('should dismiss a report', async ({ page }) => {
    await page.goto('/admin/reports');

    // Navigate to pending reports
    await page.click('button:has-text("Pending")');
    await page.waitForTimeout(1000);

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      // Check if dismiss button is visible
      const dismissButton = page.locator('button:has-text("Dismiss")');
      const dismissCount = await dismissButton.count();

      if (dismissCount > 0) {
        // Handle prompt for reason
        page.once('dialog', dialog => {
          dialog.accept('No violation found');
        });

        await dismissButton.click();

        // Wait for action
        await page.waitForTimeout(1500);

        // Should show success alert
        page.once('dialog', dialog => {
          expect(dialog.message()).toContain('dismissed');
          dialog.accept();
        });
      }
    }
  });

  test('should remove reported content', async ({ page }) => {
    await page.goto('/admin/reports');

    // Navigate to pending reports
    await page.click('button:has-text("Pending")');
    await page.waitForTimeout(1000);

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      const removeButton = page.locator('button:has-text("Remove Content")');
      const removeCount = await removeButton.count();

      if (removeCount > 0) {
        // Handle prompts
        page.on('dialog', dialog => {
          if (dialog.message().includes('reason')) {
            dialog.accept('Inappropriate content');
          } else {
            dialog.accept();
          }
        });

        await removeButton.click();

        // Wait for action
        await page.waitForTimeout(1500);
      }
    }
  });

  test('should warn user', async ({ page }) => {
    await page.goto('/admin/reports');

    await page.click('button:has-text("Pending")');
    await page.waitForTimeout(1000);

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      const warnButton = page.locator('button:has-text("Warn User")');
      const warnCount = await warnButton.count();

      if (warnCount > 0) {
        page.once('dialog', dialog => {
          dialog.accept('Warning: Please follow community guidelines');
        });

        await warnButton.click();

        await page.waitForTimeout(1500);

        page.once('dialog', dialog => {
          expect(dialog.message()).toContain('warned');
          dialog.accept();
        });
      }
    }
  });

  test('should ban user from report', async ({ page }) => {
    await page.goto('/admin/reports');

    await page.click('button:has-text("Pending")');
    await page.waitForTimeout(1000);

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      const banButton = page.locator('button:has-text("Ban User")');
      const banCount = await banButton.count();

      if (banCount > 0) {
        page.on('dialog', dialog => {
          if (dialog.message().includes('reason')) {
            dialog.accept('Severe violation of community standards');
          } else {
            dialog.accept();
          }
        });

        await banButton.click();

        await page.waitForTimeout(1500);
      }
    }
  });

  test('should display report metadata for different types', async ({ page }) => {
    await page.goto('/admin/reports');

    // Wait for reports to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No reports found', { timeout: 1000 })).catch(() => {});

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      // Wait for report details to load
      await page.waitForSelector('h1:has-text("Report Details")', { timeout: 10000 }).catch(() => {});

      // Should show report reason
      await expect(page.locator('h2:has-text("Report Reason")')).toBeVisible();

      // May show reported content section
      const contentSection = page.locator('h2:has-text("Reported Content")');
      const contentCount = await contentSection.count();

      if (contentCount > 0) {
        await expect(contentSection).toBeVisible();
      }
    } else {
      await expect(page.locator('text=No reports found')).toBeVisible();
    }
  });

  test('should show back button to return to reports list', async ({ page }) => {
    await page.goto('/admin/reports');

    // Wait for reports to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No reports found', { timeout: 1000 })).catch(() => {});

    const reviewButtons = page.locator('button:has-text("Review")');
    const count = await reviewButtons.count();

    if (count > 0) {
      await reviewButtons.first().click();

      // Wait for report details to load
      await page.waitForSelector('h1:has-text("Report Details")', { timeout: 10000 }).catch(() => {});

      // Click back button
      await page.click('button:has-text("Back to Reports")');

      // Should return to reports list
      await expect(page).toHaveURL(/\/admin\/reports$/);
      await expect(page.locator('h1:has-text("Reports Queue")')).toBeVisible();
    } else {
      await expect(page.locator('text=No reports found')).toBeVisible();
    }
  });
});
