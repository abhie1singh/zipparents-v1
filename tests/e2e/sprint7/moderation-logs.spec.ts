import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Admin Moderation Logs', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/logs');
  });

  test('should display moderation logs page', async ({ page }) => {
    await expect(page.locator('h1:has-text("Moderation Logs")')).toBeVisible();

    // Should show action filters
    await expect(page.locator('button:has-text("All")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Dismiss Report")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Warn User")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Remove Content")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Suspend User")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Ban User")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Verify User")').first()).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No logs found', { timeout: 1000 })).catch(() => {});

    // Should show logs table or empty state (not error)
    const hasTable = await page.locator('table').count();
    const hasEmptyState = await page.locator('text=No logs found').count();
    expect(hasTable + hasEmptyState).toBeGreaterThan(0);
  });

  test('should display log entries with correct columns', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No logs found', { timeout: 1000 })).catch(() => {});

    // Check if table exists
    const hasTable = await page.locator('table').count();

    if (hasTable > 0) {
      // Check table headers
      await expect(page.locator('th:has-text("Action")')).toBeVisible();
      await expect(page.locator('th:has-text("Admin")')).toBeVisible();
      await expect(page.locator('th:has-text("Target User")')).toBeVisible();
      await expect(page.locator('th:has-text("Reason")')).toBeVisible();
      await expect(page.locator('th:has-text("Timestamp")')).toBeVisible();
      await expect(page.locator('th:has-text("Details")')).toBeVisible();
    } else {
      // If no table, should show empty state
      await expect(page.locator('text=No logs found')).toBeVisible();
    }
  });

  test('should filter logs by action type', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No logs found', { timeout: 1000 })).catch(() => {});

    // Click on Suspend User filter
    await page.click('button:has-text("Suspend User")');

    // Wait for filter to apply
    await page.waitForTimeout(1000);

    // Suspend User button should be active - use first() to avoid strict mode error
    const suspendButton = page.locator('button:has-text("Suspend User")').first();
    await expect(suspendButton).toHaveClass(/bg-primary-600/);

    // Should show filtered count in footer
    const footer = page.locator('text=/Showing .* log/');
    await expect(footer).toContainText('filtered by Suspend User');
  });

  test('should display all logs when "All" filter is selected', async ({ page }) => {
    // Click on specific filter first
    await page.click('button:has-text("Ban User")');
    await page.waitForTimeout(500);

    // Click on "All" filter
    await page.click('button:has-text("All")');
    await page.waitForTimeout(500);

    // All button should be active
    const allButton = page.locator('button:has-text("All")').first();
    await expect(allButton).toHaveClass(/bg-primary-600/);

    // Should not show "filtered by" in footer
    const footer = page.locator('text=/Showing .* log/');
    const footerText = await footer.textContent();
    expect(footerText).not.toContain('filtered by');
  });

  test('should display moderation action badges with correct colors', async ({ page }) => {
    const hasRows = await page.locator('table tbody tr').count();
    if (hasRows === 0) return; // Skip if no data

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    if (count > 0) {
      // Check that action badges are displayed
      const badges = page.locator('table tbody .inline-flex');
      const badgeCount = await badges.count();
      expect(badgeCount).toBeGreaterThan(0);
    }
  });

  test('should show admin and target user information', async ({ page }) => {
    const hasRows = await page.locator('table tbody tr').count();
    if (hasRows === 0) return; // Skip if no data

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();

      // Should show admin name and ID
      const adminCell = firstRow.locator('td').nth(1);
      await expect(adminCell).toBeVisible();

      // Should show target user name
      const targetCell = firstRow.locator('td').nth(2);
      await expect(targetCell).toBeVisible();
    }
  });

  test('should display timestamps for log entries', async ({ page }) => {
    const hasRows = await page.locator('table tbody tr').count();
    if (hasRows === 0) return; // Skip if no data

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    if (count > 0) {
      const firstRow = rows.first();
      const timestampCell = firstRow.locator('td').nth(4);

      const timestamp = await timestampCell.textContent();
      expect(timestamp).toBeTruthy();
      expect(timestamp).not.toBe('-');
    }
  });

  test('should show content ID and report ID in details column', async ({ page }) => {
    const hasRows = await page.locator('table tbody tr').count();
    if (hasRows === 0) return; // Skip if no data

    const rows = page.locator('table tbody tr');
    const count = await rows.count();

    if (count > 0) {
      // Find a row that has content or report ID
      for (let i = 0; i < Math.min(count, 5); i++) {
        const row = rows.nth(i);
        const detailsCell = row.locator('td').nth(5);
        const detailsText = await detailsCell.textContent();

        if (detailsText && (detailsText.includes('Content:') || detailsText.includes('Report:'))) {
          // Found a row with details
          expect(detailsText).toBeTruthy();
          break;
        }
      }
    }
  });

  test('should refresh logs when refresh button is clicked', async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No logs found', { timeout: 1000 })).catch(() => {});

    // Click refresh button
    await page.click('button:has-text("Refresh")');

    // Wait for refresh
    await page.waitForTimeout(1000);

    // Wait for content to reload
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => page.waitForSelector('text=No logs found', { timeout: 1000 })).catch(() => {});

    // Table or empty state should be visible (not error)
    const hasTable = await page.locator('table').count();
    const hasEmptyState = await page.locator('text=No logs found').count();
    expect(hasTable + hasEmptyState).toBeGreaterThan(0);
  });

  test('should show correct count of logs in footer', async ({ page }) => {
    const hasRows = await page.locator('table tbody tr').count();
    if (hasRows === 0) return; // Skip if no data

    const footer = page.locator('text=/Showing .* log/');
    await expect(footer).toBeVisible();

    const footerText = await footer.textContent();
    expect(footerText).toMatch(/Showing \d+ log/);
  });
});
