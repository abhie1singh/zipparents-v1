import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Admin Access Control', () => {
  test('should block non-admin user from accessing admin panel', async ({ page }) => {
    // Login as regular user
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Try to access admin panel
    await page.goto('/admin');

    // Should redirect to feed
    await expect(page).toHaveURL(/feed/);
  });

  test('should allow admin user to access admin panel', async ({ page }) => {
    // Login as admin
    await login(page, ADMIN_USER.email, ADMIN_USER.password);

    // Navigate to admin panel
    await page.goto('/admin');

    // Should stay on admin page
    await expect(page).toHaveURL(/\/admin/);

    // Should show admin header
    await expect(page.locator('h1:has-text("ZipParents Admin")')).toBeVisible();

    // Should show admin badge
    await expect(page.locator('.bg-primary-600:has-text("ADMIN")')).toBeVisible();
  });

  test('should redirect unauthenticated user trying to access admin panel', async ({ page }) => {
    // Try to access admin panel without login
    await page.goto('/admin');

    // Should redirect to feed (which will redirect to login)
    await expect(page).toHaveURL(/feed|login/);
  });

  test('should show admin navigation links', async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin');

    // Check for navigation links
    await expect(page.locator('a:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('a:has-text("Users")')).toBeVisible();
    await expect(page.locator('a:has-text("Reports")')).toBeVisible();
    await expect(page.locator('a:has-text("Events")')).toBeVisible();
    await expect(page.locator('a:has-text("Moderation Logs")')).toBeVisible();
    await expect(page.locator('a:has-text("Back to App")')).toBeVisible();
  });
});
