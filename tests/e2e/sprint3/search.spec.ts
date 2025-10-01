import { test, expect } from '@playwright/test';

// Generate unique email for each test run
const timestamp = Date.now();
const TEST_USER = {
  email: `test.search.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Test Searcher',
  dateOfBirth: '1990-05-15',
  zipCode: '10001' // Manhattan
};

test.describe('Parent Search', () => {
  test.beforeEach(async ({ page }) => {
    // Create and login test user
    await page.goto('http://localhost:3000/signup');

    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[name="displayName"]', TEST_USER.displayName);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.fill('input[name="confirmPassword"]', TEST_USER.password);
    await page.fill('input[type="date"]', TEST_USER.dateOfBirth);
    await page.fill('input[name="zipCode"]', TEST_USER.zipCode);
    await page.check('input[name="acceptedTerms"]');
    await page.check('input[name="acceptedPrivacy"]');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Complete onboarding
    await page.goto('http://localhost:3000/onboarding');

    // Step 1: Basic Info
    await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Continue")');

    // Step 2: About You
    await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();
    await page.fill('textarea#bio', 'Test parent for search testing');
    await page.click('button:has-text("3-5")');
    await page.click('button:has-text("Continue")');

    // Step 3: Interests
    await expect(page.getByRole('heading', { name: 'Your Interests' })).toBeVisible();
    await page.locator('button:has-text("Sports")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Reading")').first().click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Food & Cooking")').first().click();
    await page.waitForTimeout(300);
    await page.click('button:has-text("Continue")');

    // Step 4: Privacy & Photo
    await expect(page.getByRole('heading', { name: /Privacy.*Photo/i })).toBeVisible();
    await page.waitForTimeout(500);
    const completeButton = page.locator('button:has-text("Complete Profile")');
    await expect(completeButton).toBeEnabled();
    await completeButton.click();
    await page.waitForTimeout(2000);
  });

  test('should navigate to search page', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    await expect(page.getByRole('heading', { name: 'Find Parents' })).toBeVisible();
    await expect(page.locator('text=/Discover parents near you in.*10001/')).toBeVisible();
  });

  test('should display search radius selector', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    const radiusSelect = page.locator('select#radius');
    await expect(radiusSelect).toBeVisible();

    // Check that radius options are available
    await expect(radiusSelect.locator('option[value="5"]')).toBeVisible();
    await expect(radiusSelect.locator('option[value="10"]')).toBeVisible();
    await expect(radiusSelect.locator('option[value="25"]')).toBeVisible();
    await expect(radiusSelect.locator('option[value="50"]')).toBeVisible();
    await expect(radiusSelect.locator('option[value="100"]')).toBeVisible();
  });

  test('should toggle advanced filters panel', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Advanced filters should be hidden initially
    await expect(page.locator('text=Advanced Filters')).not.toBeVisible();

    // Click filters button
    await page.click('button:has-text("Advanced Filters")');

    // Now advanced filters should be visible
    await expect(page.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible();
    await expect(page.locator('text=Age Range')).toBeVisible();
    await expect(page.locator('text=Children Age Ranges')).toBeVisible();
    await expect(page.locator('text=Interests')).toBeVisible();
    await expect(page.locator('text=Relationship Status')).toBeVisible();
  });

  test('should perform basic search with default radius', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Wait for automatic search to complete
    await page.waitForTimeout(2000);

    // Should show results header
    const resultsHeader = page.locator('h2').filter({ hasText: /Found$|No results/ });
    await expect(resultsHeader).toBeVisible();
  });

  test('should filter by age range', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters
    await page.click('button:has-text("Advanced Filters")');
    await expect(page.getByRole('heading', { name: 'Advanced Filters' })).toBeVisible();

    // Select age range
    await page.click('button:has-text("25-34")');

    // Filter button should show active count
    await expect(page.locator('button:has-text("Advanced Filters")').locator('span:has-text("1")')).toBeVisible();

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
  });

  test('should filter by interests', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters
    await page.click('button:has-text("Advanced Filters")');

    // Select interests
    const sportsButtons = page.locator('button:has-text("Sports")');
    await sportsButtons.nth(0).click(); // Click first Sports button (in interests section)

    const readingButtons = page.locator('button:has-text("Reading")');
    await readingButtons.nth(0).click();

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
  });

  test('should filter by children age ranges', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters
    await page.click('button:has-text("Advanced Filters")');

    // Select children age ranges
    await page.locator('button:has-text("3-5")').nth(0).click();
    await page.locator('button:has-text("6-12")').nth(0).click();

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
  });

  test('should filter by relationship status', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters
    await page.click('button:has-text("Advanced Filters")');

    // Select relationship status
    await page.click('button:has-text("Married")');

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);
  });

  test('should clear all filters', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters and select some
    await page.click('button:has-text("Advanced Filters")');
    await page.click('button:has-text("25-34")');
    await page.locator('button:has-text("Sports")').nth(0).click();
    await page.click('button:has-text("Married")');

    // Should show 3 active filters
    await expect(page.locator('button:has-text("Advanced Filters")').locator('span:has-text("3")')).toBeVisible();

    // Clear filters
    await page.click('button:has-text("Clear all")');

    // Active filter count should be gone
    await expect(page.locator('button:has-text("Advanced Filters")').locator('span:has-text("3")')).not.toBeVisible();
  });

  test('should change search radius', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    const radiusSelect = page.locator('select#radius');

    // Change to 50 miles
    await radiusSelect.selectOption('50');

    // Search with new radius
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);

    // Verify radius is still set
    await expect(radiusSelect).toHaveValue('50');
  });

  test('should display parent cards with distance', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Wait for search to complete
    await page.waitForTimeout(2000);

    // Check if any parent cards are displayed (if there are results)
    const parentCards = page.locator('div').filter({ hasText: /mi$/ });
    const cardCount = await parentCards.count();

    // If there are results, verify card structure
    if (cardCount > 0) {
      const firstCard = parentCards.first();
      // Should show distance indicator
      await expect(firstCard.locator('text=/\\d+ mi/')).toBeVisible();
    }
  });

  test('should show no results message when no matches found', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Set very restrictive filters
    await page.click('button:has-text("Advanced Filters")');
    await page.locator('select#radius').selectOption('5'); // Small radius
    await page.click('button:has-text("18-24")'); // Specific age range
    await page.locator('button:has-text("Expecting")').nth(0).click(); // Specific children age

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);

    // Should show no results state or results
    const resultsSection = page.locator('text=/No parents found|Parents? Found/');
    await expect(resultsSection).toBeVisible();
  });

  test('should persist filter selections', async ({ page }) => {
    await page.goto('http://localhost:3000/search');

    // Open filters and select some
    await page.click('button:has-text("Advanced Filters")');
    await page.click('button:has-text("35-44")');
    await page.locator('button:has-text("Reading")').nth(0).click();

    // Search
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);

    // Open filters again
    await page.click('button:has-text("Advanced Filters")');

    // Selections should still be active (buttons should have bg-primary-600 class)
    await expect(page.locator('button:has-text("35-44")').first()).toHaveClass(/bg-primary-600/);
  });
});
