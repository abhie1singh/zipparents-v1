import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'test.onboarding@test.com',
  password: 'Test123!',
  displayName: 'Test Parent',
  dateOfBirth: '1990-05-15', // 34 years old
  zipCode: '10001'
};

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should complete full onboarding flow', async ({ page }) => {
    // Navigate to signup
    await page.click('text=Sign Up');
    await expect(page).toHaveURL(/.*signup/);

    // Fill signup form
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.fill('input[name="displayName"]', TEST_USER.displayName);
    await page.fill('input[name="zipCode"]', TEST_USER.zipCode);
    await page.fill('input[type="date"]', TEST_USER.dateOfBirth);

    // Accept terms
    await page.check('input[type="checkbox"][name="termsAccepted"]');
    await page.check('input[type="checkbox"][name="ageVerified"]');

    // Submit signup
    await page.click('button[type="submit"]');

    // Should redirect to onboarding
    await expect(page).toHaveURL(/.*onboarding/, { timeout: 10000 });

    // Step 1: Basic Info
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('input[value="' + TEST_USER.displayName + '"]')).toBeVisible();
    await expect(page.locator('input[value="' + TEST_USER.zipCode + '"]')).toBeVisible();

    // Select age range
    await page.selectOption('select', '35-44');

    // Continue to step 2
    await page.click('button:has-text("Continue")');

    // Step 2: About You
    await expect(page.locator('text=About You')).toBeVisible();

    // Fill bio
    await page.fill('textarea#bio', 'Test parent looking to connect with local families.');

    // Select relationship status
    await page.selectOption('select', 'married');

    // Select children age ranges
    await page.click('button:has-text("3-5")');
    await page.click('button:has-text("6-8")');

    // Continue to step 3
    await page.click('button:has-text("Continue")');

    // Step 3: Interests
    await expect(page.locator('text=Your Interests')).toBeVisible();

    // Select at least 3 interests
    await page.click('button:has-text("Sports")');
    await page.click('button:has-text("Reading")');
    await page.click('button:has-text("Cooking")');

    // Continue to step 4
    await page.click('button:has-text("Continue")');

    // Step 4: Privacy & Photo
    await expect(page.locator('text=Privacy & Photo')).toBeVisible();

    // Privacy settings should be visible
    await expect(page.locator('text=Who can see your profile')).toBeVisible();

    // Complete profile
    await page.click('button:has-text("Complete Profile")');

    // Should redirect to feed
    await expect(page).toHaveURL(/.*feed/, { timeout: 10000 });
  });

  test('should validate required fields in step 1', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    // Try to continue without filling required fields
    await page.fill('input[name="displayName"]', ''); // Clear name
    await page.fill('input[name="zipCode"]', '1234'); // Invalid zip

    await page.click('button:has-text("Continue")');

    // Should show validation errors
    await expect(page.locator('text=Invalid name').or(page.locator('text=/.*name.*/i'))).toBeVisible();
    await expect(page.locator('text=/.*zip.*/i')).toBeVisible();
  });

  test('should validate minimum interests in step 3', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    // Navigate to step 3
    await page.click('button:has-text("Continue")');
    await page.click('button:has-text("Continue")');

    // Try to continue without selecting enough interests
    await page.click('button:has-text("Sports")');
    await page.click('button:has-text("Continue")');

    // Should show validation error
    await expect(page.locator('text=/.*least.*3.*interests/i')).toBeVisible();
  });

  test('should allow navigation between steps', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    // Go to step 2
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=About You')).toBeVisible();

    // Go back to step 1
    await page.click('button:has-text("Back")');
    await expect(page.locator('text=Basic Information')).toBeVisible();

    // Go forward again
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=About You')).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    await page.goto('http://localhost:3000/onboarding');

    // Check progress indicator exists
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();

    // Navigate to step 2
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Step 2 of 4')).toBeVisible();
  });
});
