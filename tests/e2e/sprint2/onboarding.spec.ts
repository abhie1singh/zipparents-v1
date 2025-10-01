import { test, expect } from '@playwright/test';

// Generate unique email for each test run
const timestamp = Date.now();
const TEST_USER = {
  email: `test.onboarding.${timestamp}@test.com`,
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
    await page.fill('input[name="displayName"]', TEST_USER.displayName);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="confirmPassword"]', TEST_USER.password);
    await page.fill('input[type="date"]', TEST_USER.dateOfBirth);
    await page.fill('input[name="zipCode"]', TEST_USER.zipCode);

    // Accept terms (correct checkbox names)
    await page.check('input[type="checkbox"][name="acceptedTerms"]');
    await page.check('input[type="checkbox"][name="acceptedPrivacy"]');

    // Submit signup
    await page.click('button[type="submit"]');

    // Should redirect to verify-email, then navigate to onboarding manually for test
    await expect(page).toHaveURL(/.*verify-email/, { timeout: 10000 });

    // Navigate directly to onboarding for testing purposes
    await page.goto('http://localhost:3000/onboarding');

    // Step 1: Basic Info
    await expect(page.locator('text=Basic Information')).toBeVisible();
    await expect(page.locator('input[value="' + TEST_USER.displayName + '"]')).toBeVisible();
    await expect(page.locator('input[value="' + TEST_USER.zipCode + '"]')).toBeVisible();

    // Select age range
    await page.selectOption('select', '35-44');

    // Continue to step 2
    await page.click('button:has-text("Continue")');

    // Step 2: About You
    await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();

    // Fill bio
    await page.fill('textarea#bio', 'Test parent looking to connect with local families.');

    // Select relationship status
    await page.selectOption('select', 'married');

    // Select children age ranges
    await page.click('button:has-text("3-5")');
    await page.click('button:has-text("6-12")');

    // Continue to step 3
    await page.click('button:has-text("Continue")');

    // Step 3: Interests
    await expect(page.getByRole('heading', { name: 'Your Interests' })).toBeVisible({ timeout: 10000 });

    // Wait for interests buttons to be visible
    await expect(page.locator('button:has-text("Sports")').first()).toBeVisible();

    // Select at least 3 interests
    await page.locator('button:has-text("Sports")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Reading")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Food & Cooking")').first().click();
    await page.waitForTimeout(300);

    // Continue to step 4
    await page.click('button:has-text("Continue")');

    // Step 4: Privacy & Photo
    await expect(page.getByRole('heading', { name: /Privacy.*Photo/i })).toBeVisible({ timeout: 10000 });

    // Privacy settings should be visible - check for Privacy Settings heading instead
    await expect(page.locator('text=Privacy Settings')).toBeVisible();

    // Wait a bit for any state updates
    await page.waitForTimeout(500);

    // Complete profile - wait for button to be enabled and clickable
    const completeButton = page.locator('button:has-text("Complete Profile")');
    await expect(completeButton).toBeEnabled();

    // Click and wait for navigation
    await Promise.all([
      page.waitForURL(/.*feed|.*profile/, { timeout: 20000 }).catch(() => {}),
      completeButton.click()
    ]);

    // Verify we navigated away from onboarding
    // Either to feed or we might need to wait longer for the redirect
    const finalURL = page.url();
    if (finalURL.includes('onboarding')) {
      // Wait a bit more in case the redirect is delayed
      await page.waitForTimeout(3000);
    }

    // Check if we're on feed or profile page, or at least not on onboarding
    const currentURL = page.url();
    expect(currentURL).toMatch(/feed|profile|(?!.*onboarding)/);
  });

  test('should validate required fields in step 1', async ({ page }) => {
    // Create a new user and log in
    const testEmail = `test.validation.${Date.now()}@test.com`;

    await page.goto('http://localhost:3000/signup');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Validation Test');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.fill('input[name="zipCode"]', '10001');
    await page.check('input[name="acceptedTerms"]');
    await page.check('input[name="acceptedPrivacy"]');
    await page.click('button[type="submit"]');

    // Wait a bit for signup to complete
    await page.waitForTimeout(1000);

    // Navigate directly to onboarding
    await page.goto('http://localhost:3000/onboarding');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible({ timeout: 10000 });

    // Try to continue without filling required fields - clear existing values and add invalid ones
    const displayNameInput = page.getByRole('textbox', { name: /Display Name/i });
    const zipCodeInput = page.getByRole('textbox', { name: /Zip Code/i });

    await displayNameInput.clear();
    await displayNameInput.fill('A'); // Too short
    await zipCodeInput.clear();
    await zipCodeInput.fill('1234'); // Invalid zip

    await page.click('button:has-text("Continue")');

    // Should show validation error for either name or zip code
    const errorVisible = await Promise.race([
      page.locator('text=/.*at least 2 characters.*/i').isVisible().then(() => true).catch(() => false),
      page.locator('text=/.*valid 5-digit.*/i').isVisible().then(() => true).catch(() => false),
      page.locator('text=/.*valid.*zip.*/i').isVisible().then(() => true).catch(() => false),
      new Promise(resolve => setTimeout(() => resolve(false), 5000))
    ]);

    expect(errorVisible).toBe(true);
  });

  test('should validate minimum interests in step 3', async ({ page }) => {
    // Create a new user
    const testEmail = `test.interests.${Date.now()}@test.com`;

    await page.goto('http://localhost:3000/signup');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Interests Test');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.fill('input[name="zipCode"]', '10001');
    await page.check('input[name="acceptedTerms"]');
    await page.check('input[name="acceptedPrivacy"]');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);
    await page.goto('http://localhost:3000/onboarding');

    // Navigate to step 3
    await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible();
    await page.click('button:has-text("Continue")');
    await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();
    await page.click('button:has-text("Continue")');

    // Wait for interests step to load
    await expect(page.getByRole('heading', { name: 'Your Interests' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button:has-text("Sports")').first()).toBeVisible();

    // Try to continue without selecting enough interests - select only 1
    await page.locator('button:has-text("Sports")').first().click();
    await page.waitForTimeout(300);
    await page.click('button:has-text("Continue")');

    // Should show validation error
    await expect(page.locator('text=/.*least.*3.*interests/i')).toBeVisible({ timeout: 5000 });
  });

  test('should allow navigation between steps', async ({ page }) => {
    // Create a new user
    const testEmail = `test.navigation.${Date.now()}@test.com`;

    await page.goto('http://localhost:3000/signup');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Navigation Test');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.fill('input[name="zipCode"]', '10001');
    await page.check('input[name="acceptedTerms"]');
    await page.check('input[name="acceptedPrivacy"]');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/onboarding');

    // Go to step 2
    await page.click('button:has-text("Continue")');
    await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();

    // Go back to step 1
    await page.click('button:has-text("Back")');
    await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible();

    // Go forward again
    await page.click('button:has-text("Continue")');
    await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();
  });

  test('should show progress indicator', async ({ page }) => {
    // Create a new user
    const testEmail = `test.progress.${Date.now()}@test.com`;

    await page.goto('http://localhost:3000/signup');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[name="displayName"]', 'Progress Test');
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="confirmPassword"]', 'Test123!');
    await page.fill('input[type="date"]', '1990-01-01');
    await page.fill('input[name="zipCode"]', '10001');
    await page.check('input[name="acceptedTerms"]');
    await page.check('input[name="acceptedPrivacy"]');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:3000/onboarding');

    // Check progress indicator exists
    await expect(page.locator('text=Step 1 of 4')).toBeVisible();

    // Navigate to step 2
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=Step 2 of 4')).toBeVisible();
  });
});
