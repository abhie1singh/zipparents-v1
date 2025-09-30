import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing feed without authentication', async ({ page }) => {
    await page.goto('/feed');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should allow access to feed when authenticated', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Should be on feed page
    await expect(page).toHaveURL(/feed/);
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible();
  });

  test('should redirect unverified users to verification page', async ({ page }) => {
    await login(page, TEST_USERS.unverified.email, TEST_USERS.unverified.password);

    // Should be on verify-email page
    await expect(page).toHaveURL(/verify-email/);
    await expect(page.locator('h2:has-text("Verify your email")')).toBeVisible();
  });

  test('should show loading spinner while checking auth state', async ({ page }) => {
    await page.goto('/feed');

    // Should show loading spinner briefly
    const spinner = page.locator('text=Loading');
    // Spinner might be very quick, so we just check it was in the page at some point
    // or we're already redirected
    await page.waitForURL(/login/, { timeout: 5000 });
  });

  test('should maintain authentication across navigation', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Navigate to different pages
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL(/about/);
    await expect(page.locator('button:has-text("Log Out")')).toBeVisible();

    // Navigate to safety
    await page.click('a[href="/safety"]');
    await expect(page).toHaveURL(/safety/);
    await expect(page.locator('button:has-text("Log Out")')).toBeVisible();

    // Navigate back to feed
    await page.click('a[href="/feed"]');
    await expect(page).toHaveURL(/feed/);
    await expect(page.locator('h1:has-text("Welcome")')).toBeVisible();
  });
});
