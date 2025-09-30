import { test, expect } from '@playwright/test';
import { signUp, TEST_USERS, expectValidationError, getDateYearsAgo } from '../../helpers/auth-test-helpers';

test.describe('Age Verification (18+ Requirement)', () => {
  test('should show age verification field', async ({ page }) => {
    await page.goto('/signup');

    const dobInput = page.locator('input[type="date"]');
    await expect(dobInput).toBeVisible();

    const helperText = page.locator('text=You must be 18 or older');
    await expect(helperText).toBeVisible();
  });

  test('should reject user under 18', async ({ page }) => {
    await page.goto('/signup');

    const under18Date = getDateYearsAgo(17); // 17 years old

    const newUser = {
      ...TEST_USERS.new,
      email: `test-under18-${Date.now()}@test.com`,
      dateOfBirth: under18Date,
    };

    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="displayName"]', newUser.displayName);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="confirmPassword"]', newUser.password);
    await page.fill('input[type="date"]', newUser.dateOfBirth);
    await page.fill('input[name="zipCode"]', newUser.zipCode);

    // Trigger validation by blurring the date field
    await page.locator('input[type="date"]').blur();

    await expectValidationError(page, 'You must be 18 or older to use ZipParents');
  });

  test('should accept user exactly 18 years old', async ({ page }) => {
    await page.goto('/signup');

    const exactly18Date = getDateYearsAgo(18);

    const newUser = {
      ...TEST_USERS.new,
      email: `test-18yo-${Date.now()}@test.com`,
      dateOfBirth: exactly18Date,
    };

    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="displayName"]', newUser.displayName);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="confirmPassword"]', newUser.password);
    await page.fill('input[type="date"]', newUser.dateOfBirth);
    await page.fill('input[name="zipCode"]', newUser.zipCode);

    // Trigger validation
    await page.locator('input[type="date"]').blur();

    // Should show age verified message
    await expect(page.locator('text=Age verified: 18 years old')).toBeVisible();
  });

  test('should accept user over 18', async ({ page }) => {
    await page.goto('/signup');

    const over18Date = getDateYearsAgo(25);

    const newUser = {
      ...TEST_USERS.new,
      email: `test-25yo-${Date.now()}@test.com`,
      dateOfBirth: over18Date,
    };

    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="displayName"]', newUser.displayName);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="confirmPassword"]', newUser.password);
    await page.fill('input[type="date"]', newUser.dateOfBirth);
    await page.fill('input[name="zipCode"]', newUser.zipCode);

    // Trigger validation
    await page.locator('input[type="date"]').blur();

    // Should show age verified message
    await expect(page.locator('text=Age verified: 25 years old')).toBeVisible();
  });

  test('should reject unrealistic age (over 120)', async ({ page }) => {
    await page.goto('/signup');

    const oldDate = getDateYearsAgo(121);

    await page.fill('input[type="date"]', oldDate);
    await page.locator('input[type="date"]').blur();

    await expectValidationError(page, 'Please enter a valid date of birth');
  });

  test('should have max date set to 18 years ago', async ({ page }) => {
    await page.goto('/signup');

    const dobInput = page.locator('input[type="date"]');
    const maxDate = await dobInput.getAttribute('max');

    // Verify max date is approximately 18 years ago
    const maxDateObj = new Date(maxDate!);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

    // Allow 1 day difference for timing
    const diffInDays = Math.abs((maxDateObj.getTime() - eighteenYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffInDays).toBeLessThan(2);
  });
});
