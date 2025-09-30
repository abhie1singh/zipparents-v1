import { test, expect } from '@playwright/test';
import { login, logout, TEST_USERS, waitForToast, expectValidationError, expectToBeLoggedIn, expectToBeLoggedOut } from '../../helpers/auth-test-helpers';

test.describe('Login Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveTitle(/Log In/);
    await expect(page.locator('h2:has-text("Welcome back")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login');

    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Email is required');
    await expectValidationError(page, 'Password is required');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await login(page, 'nonexistent@test.com', 'WrongPassword123!');

    await waitForToast(page, 'Invalid email or password');
  });

  test('should successfully login with verified user', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Should show success message
    await waitForToast(page, 'Welcome back');

    // Should redirect to feed
    await expect(page).toHaveURL(/feed/);
    await expectToBeLoggedIn(page);
  });

  test('should login and show verification banner for unverified user', async ({ page }) => {
    await login(page, TEST_USERS.unverified.email, TEST_USERS.unverified.password);

    // Should show info message
    await waitForToast(page, 'Please verify your email');

    // Should redirect to verify-email page
    await expect(page).toHaveURL(/verify-email/);
  });

  test('should have link to signup page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('a[href="/signup"]')).toBeVisible();
  });

  test('should have link to password reset', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('a[href="/reset-password"]')).toBeVisible();
  });

  test('should successfully logout', async ({ page }) => {
    // Login first
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await expect(page).toHaveURL(/feed/);

    // Logout
    await logout(page);

    // Should show success message
    await waitForToast(page, 'Logged out successfully');

    // Should redirect to home
    await expect(page).toHaveURL('/');
    await expectToBeLoggedOut(page);
  });
});
