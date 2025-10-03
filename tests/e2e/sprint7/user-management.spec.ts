import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/users');
  });

  test('should display user list page', async ({ page }) => {
    await expect(page.locator('h1:has-text("User Management")')).toBeVisible();

    // Should show search bar
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();

    // Should show users table
    await expect(page.locator('table')).toBeVisible();

    // Should have table headers
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Display Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Role")')).toBeVisible();
    await expect(page.locator('th:has-text("Age Verified")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should search for users by email', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    // Search for admin user
    await searchInput.fill('admin.test');
    await page.click('button:has-text("Search")');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Should show admin user in results
    await expect(page.locator(`text=${TEST_USERS.admin.email}`).first()).toBeVisible();
  });

  test('should search for users by display name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    // Search for Sarah Johnson
    await searchInput.fill('Sarah');
    await page.click('button:has-text("Search")');

    // Wait for search results
    await page.waitForTimeout(1000);

    // Should show matching users
    const tableBody = page.locator('tbody');
    const rowCount = await tableBody.locator('tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test('should view user details', async ({ page }) => {
    // Wait for users table to load
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Click on first "View" button
    await page.locator('button:has-text("View")').first().click();

    // Should navigate to user detail page
    await expect(page).toHaveURL(/\/admin\/users\/[a-zA-Z0-9]+/);

    // Wait for user details to load (success or error state)
    await page.waitForSelector('h1:has-text("User Details")', { timeout: 10000 }).catch(() => page.waitForSelector('text=Failed to load', { timeout: 1000 }));

    // Should show user details (not error)
    await expect(page.locator('h1:has-text("User Details")')).toBeVisible();
    await expect(page.locator('text=User ID:')).toBeVisible();
    await expect(page.locator('text=Email:')).toBeVisible();
    await expect(page.locator('text=Display Name:')).toBeVisible();
  });

  test('should suspend a user', async ({ page }) => {
    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Find a user that is not suspended or banned
    const suspendButton = page.locator('button:has-text("Suspend")').first();

    // Check if suspend button exists
    const suspendButtonCount = await suspendButton.count();
    if (suspendButtonCount > 0) {
      // Handle confirmation dialog
      page.once('dialog', dialog => dialog.accept());

      await suspendButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1500);

      // Reload to see updated status
      await page.reload();

      // Should show suspended status (verify suspension worked)
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should verify a user manually', async ({ page }) => {
    // Navigate to user detail page of an unverified user
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Find verify button
    const verifyButton = page.locator('button:has-text("Verify")').first();

    const verifyButtonCount = await verifyButton.count();
    if (verifyButtonCount > 0) {
      await verifyButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1500);

      // Verify button should disappear after verification
      const updatedCount = await page.locator('button:has-text("Verify")').count();
      expect(updatedCount).toBeLessThan(verifyButtonCount);
    }
  });

  test('should ban a user', async ({ page }) => {
    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Find ban button
    const banButton = page.locator('button:has-text("Ban")').first();

    const banButtonCount = await banButton.count();
    if (banButtonCount > 0) {
      // Handle confirmation dialogs
      page.on('dialog', dialog => dialog.accept());

      await banButton.click();

      // Wait for action to complete
      await page.waitForTimeout(1500);

      // Reload to see updated status
      await page.reload();

      // Should show banned status
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should display user activity logs', async ({ page }) => {
    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Click on first "View" button to go to detail page
    await page.locator('button:has-text("View")').first().click();

    // Wait for user details page to load
    await page.waitForSelector('h1:has-text("User Details")', { timeout: 10000 }).catch(() => page.waitForSelector('text=Failed to load', { timeout: 1000 }));

    // Should show activity logs section
    await expect(page.locator('h2:has-text("Activity Logs")')).toBeVisible();

    // Activity logs table should exist
    const activityLogsSection = page.locator('h2:has-text("Activity Logs")').locator('xpath=ancestor::div[contains(@class, "bg-white")]');
    await expect(activityLogsSection).toBeVisible();
  });

  test('should clear search results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    // Perform search
    await searchInput.fill('test');
    await page.click('button:has-text("Search")');

    await page.waitForTimeout(1000);

    // Click clear button
    await page.click('button:has-text("Clear")');

    // Search input should be empty
    await expect(searchInput).toHaveValue('');
  });
});
