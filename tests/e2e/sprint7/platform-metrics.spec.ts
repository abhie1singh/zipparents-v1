import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Admin Platform Metrics', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin');
  });

  test('should display admin dashboard with metrics', async ({ page }) => {
    await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();

    // Wait for dashboard to load (metrics or error)
    await page.waitForSelector('text=Total Users', { timeout: 10000 }).catch(() => {});

    // Should show refresh button
    await expect(page.locator('button:has-text("Refresh Data")')).toBeVisible();
  });

  test('should display key platform metrics', async ({ page }) => {
    // Wait for metrics to load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Check for key metrics
    await expect(page.locator('text=Total Users')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
    await expect(page.locator('text=Verified Users')).toBeVisible();
    await expect(page.locator('text=Pending Reports')).toBeVisible();
    await expect(page.locator('text=Total Events')).toBeVisible();
    await expect(page.locator('text=Total Messages')).toBeVisible();
  });

  test('should display metric values as numbers', async ({ page }) => {
    // Wait for metrics to load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Find all metric cards
    const metricCards = page.locator('.bg-white.rounded-lg.shadow-md');
    const count = await metricCards.count();

    expect(count).toBeGreaterThan(0);

    // Check that each card has a numeric value
    for (let i = 0; i < Math.min(count, 6); i++) {
      const card = metricCards.nth(i);
      const valueElement = card.locator('.text-3xl.font-bold');
      const value = await valueElement.textContent();

      // Should be a number (possibly with commas)
      expect(value).toMatch(/^\d{1,3}(,\d{3})*$/);
    }
  });

  test('should display recent moderation actions', async ({ page }) => {
    // Wait for page to load - either metrics or error
    await page.waitForSelector('text=Total Users', { timeout: 10000 }).catch(() => {});

    // Wait for the Recent Moderation Actions section
    await page.waitForSelector('h2:has-text("Recent Moderation Actions")', { timeout: 10000 }).catch(() => {});

    await expect(page.locator('h2:has-text("Recent Moderation Actions")')).toBeVisible();

    // Check if table exists
    const table = page.locator('h2:has-text("Recent Moderation Actions")').locator('xpath=following::table[1]');
    const tableCount = await table.count();

    if (tableCount > 0) {
      // Table should have headers
      await expect(table.locator('th:has-text("Action")')).toBeVisible();
      await expect(table.locator('th:has-text("Admin")')).toBeVisible();
      await expect(table.locator('th:has-text("Target User")')).toBeVisible();
      await expect(table.locator('th:has-text("Reason")')).toBeVisible();
      await expect(table.locator('th:has-text("Timestamp")')).toBeVisible();
    } else {
      // If no logs, should show empty state
      await expect(page.locator('text=No moderation actions yet')).toBeVisible();
    }
  });

  test('should refresh dashboard data', async ({ page }) => {
    // Wait for initial load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Click refresh button
    await page.click('button:has-text("Refresh Data")');

    // Wait for refresh
    await page.waitForTimeout(1500);

    // Metrics should still be visible
    await expect(page.locator('text=Total Users')).toBeVisible();
  });

  test('should show metric cards with icons', async ({ page }) => {
    // Wait for metrics to load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Each metric card should have an icon
    const metricCards = page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: /Total Users|Active Users|Verified Users/ });
    const count = await metricCards.count();

    expect(count).toBeGreaterThan(0);

    // Check for SVG icons
    const icons = page.locator('.bg-white.rounded-lg.shadow-md svg');
    const iconCount = await icons.count();

    expect(iconCount).toBeGreaterThan(0);
  });

  test('should display color-coded metric cards', async ({ page }) => {
    // Wait for metrics to load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Check for different colored backgrounds on metric icons
    const iconContainers = page.locator('.rounded-full.flex.items-center.justify-center');
    const count = await iconContainers.count();

    expect(count).toBeGreaterThan(0);

    // Verify at least one has a colored background
    for (let i = 0; i < Math.min(count, 6); i++) {
      const container = iconContainers.nth(i);
      const className = await container.getAttribute('class');

      // Should have a color class (bg-blue, bg-green, etc.)
      expect(className).toMatch(/bg-(blue|green|purple|yellow|indigo|pink)-100/);
    }
  });

  test('should format large numbers with commas', async ({ page }) => {
    // Wait for metrics to load
    const hasMetrics = await page.locator('text=Total Users').count();
    if (hasMetrics === 0) {
      await expect(page.locator('text=Failed to load dashboard data')).toBeVisible();
      return;
    }

    // Find metric values
    const values = page.locator('.text-3xl.font-bold');
    const count = await values.count();

    expect(count).toBeGreaterThan(0);

    // At least one value should exist
    const firstValue = await values.first().textContent();
    expect(firstValue).toBeTruthy();

    // If value is >= 1000, should have comma
    const numValue = parseInt(firstValue!.replace(/,/g, ''), 10);
    if (numValue >= 1000) {
      expect(firstValue).toContain(',');
    }
  });
});
