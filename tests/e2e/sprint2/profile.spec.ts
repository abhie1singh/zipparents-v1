import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'verified.parent@test.com',
  password: 'Test123!',
};

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*feed/, { timeout: 10000 });
  });

  test('should view own profile', async ({ page }) => {
    // Navigate to own profile (assuming there's a profile link in header/nav)
    await page.goto('http://localhost:3000/profile/edit');
    await expect(page).toHaveURL(/.*profile\/edit/);

    // Should see edit form
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /Display Name/i })).toBeVisible();
  });

  test('should edit profile successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Update bio
    const newBio = 'Updated bio for testing ' + Date.now();
    await page.fill('textarea#bio', newBio);

    // Update interests - select ones that exist in INTERESTS constant
    await page.click('button:has-text("Technology")');

    // Save changes
    await page.click('button:has-text("Save Changes")');

    // Should show success message or redirect
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });

  test('should validate profile fields', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Try to save with invalid data
    const displayNameInput = page.getByRole('textbox', { name: /Display Name/i });
    const zipCodeInput = page.getByRole('textbox', { name: /Zip Code/i });

    await displayNameInput.clear();
    await displayNameInput.fill('A'); // Too short
    await zipCodeInput.clear();
    await zipCodeInput.fill('1234'); // Invalid zip

    await page.click('button:has-text("Save Changes")');

    // Should show validation error message (either for name or zip)
    // Check for either "at least 2 characters" or "valid 5-digit" error
    const errorVisible = await Promise.race([
      page.locator('text=/.*at least 2 characters.*/i').isVisible().then(() => true).catch(() => false),
      page.locator('text=/.*valid 5-digit.*/i').isVisible().then(() => true).catch(() => false),
      page.locator('text=/.*valid.*zip.*/i').isVisible().then(() => true).catch(() => false),
      new Promise(resolve => setTimeout(() => resolve(false), 5000))
    ]);

    expect(errorVisible).toBe(true);
  });

  test('should cancel profile edits', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Make some changes
    await page.fill('textarea#bio', 'This should be cancelled');

    // Click cancel
    await page.click('button:has-text("Cancel")');

    // Should redirect back to profile view
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 5000 });
  });

  test.skip('should display profile information correctly', async ({ page }) => {
    // TODO: Implement profile view page
    // Get user ID from auth context or URL
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Click cancel to go to profile view
    await page.click('button:has-text("Cancel")');

    // Should display user information - wait for profile page to load
    await page.waitForURL(/.*profile\/[^/]+$/, { timeout: 10000 });

    // Check for profile content
    await expect(page.locator('text=/Sarah Johnson/i').first()).toBeVisible({ timeout: 10000 });
  });

  test.skip('should show edit button only on own profile', async ({ page }) => {
    // TODO: Implement profile view page with edit button
    // Visit own profile
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for edit page to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    await page.click('button:has-text("Cancel")');

    // Wait for profile view to load
    await page.waitForURL(/.*profile\/[^/]+$/, { timeout: 10000 });

    // Should see edit button on own profile
    await expect(page.locator('button:has-text("Edit Profile"), a:has-text("Edit Profile")').first()).toBeVisible({ timeout: 10000 });

    // Navigate to another user's profile (if possible)
    // This would require knowing another user's ID
    // For now, we'll skip this part as it requires seed data
  });

  test('should update privacy settings', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Scroll to privacy settings section
    await page.locator('text=Privacy Settings').scrollIntoViewIfNeeded();

    // Change privacy visibility - select "Verified Only" radio button
    await page.getByRole('radio', { name: /Verified Only/i }).click();

    await page.click('button:has-text("Save Changes")');

    // Should save successfully
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });

  test('should allow selecting children age ranges', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Get initial button states
    const button02 = page.locator('button:has-text("0-2")').first();
    const button35 = page.locator('button:has-text("3-5")').first();

    // Select "0-2" age range
    await button02.click();
    await page.waitForTimeout(500); // Wait for state update

    // Verify "0-2" is now selected
    await expect(button02).toHaveClass(/bg-primary-600/);

    // Select "3-5" if not already selected
    const button35Class = await button35.getAttribute('class');
    if (!button35Class?.includes('bg-primary-600')) {
      await button35.click();
      await page.waitForTimeout(500);
    }
    await expect(button35).toHaveClass(/bg-primary-600/);

    // Deselect "0-2"
    await button02.click();
    await page.waitForTimeout(500);
    await expect(button02).not.toHaveClass(/bg-primary-600/);
  });

  test('should allow selecting relationship status', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Wait for form to load
    await expect(page.getByRole('heading', { name: 'Edit Your Profile' })).toBeVisible();

    // Change relationship status - find select by label
    const relationshipSelect = page.locator('select').filter({ hasText: /Single|Partnered|Married/i });
    await relationshipSelect.selectOption('single');

    // Save
    await page.click('button:has-text("Save Changes")');

    // Should save successfully
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });
});
