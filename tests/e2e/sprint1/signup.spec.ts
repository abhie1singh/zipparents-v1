import { test, expect } from '@playwright/test';
import { signUp, TEST_USERS, waitForToast, expectValidationError, expectToBeLoggedIn } from '../../helpers/auth-test-helpers';

test.describe('Sign Up Flow', () => {
  test('should display signup form', async ({ page }) => {
    await page.goto('/signup');

    await expect(page).toHaveTitle(/Sign Up/);
    await expect(page.locator('h2:has-text("Create your account")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('input[name="zipCode"]')).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/signup');

    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Email is required');
    await expectValidationError(page, 'Display name is required');
    await expectValidationError(page, 'Password is required');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Email is invalid');
  });

  test('should validate password length', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', '123');
    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Password must be at least 6 characters');
  });

  test('should validate password match', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Different123!');
    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Passwords do not match');
  });

  test('should validate zip code format', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[name="zipCode"]', '123');
    await page.click('button[type="submit"]');

    await expectValidationError(page, 'Invalid zip code format');
  });

  test('should require terms acceptance', async ({ page }) => {
    await page.goto('/signup');

    const newUser = {
      ...TEST_USERS.new,
      email: `test-${Date.now()}@test.com`,
    };

    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="displayName"]', newUser.displayName);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="confirmPassword"]', newUser.password);
    await page.fill('input[type="date"]', newUser.dateOfBirth);
    await page.fill('input[name="zipCode"]', newUser.zipCode);

    // Don't check terms
    await page.click('button[type="submit"]');

    await expectValidationError(page, 'You must accept the Terms of Service');
  });

  test('should successfully sign up with valid data', async ({ page }) => {
    const newUser = {
      ...TEST_USERS.new,
      email: `test-success-${Date.now()}@test.com`,
    };

    await signUp(page, newUser);

    // Should show success message
    await waitForToast(page, 'Account created');

    // Should redirect to verify-email page
    await expect(page).toHaveURL(/verify-email/);
    await expect(page.locator('h2:has-text("Verify your email")')).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    await signUp(page, TEST_USERS.verified);

    await waitForToast(page, 'This email is already registered');
  });

  test('should have links to login and legal pages', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/terms"]')).toBeVisible();
    await expect(page.locator('a[href="/privacy"]')).toBeVisible();
    await expect(page.locator('a[href="/guidelines"]')).toBeVisible();
  });
});
