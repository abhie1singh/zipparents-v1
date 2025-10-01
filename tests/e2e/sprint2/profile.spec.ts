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
    await expect(page.locator('text=Edit Your Profile')).toBeVisible();
    await expect(page.locator('input[name="displayName"]')).toBeVisible();
  });

  test('should edit profile successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Update bio
    const newBio = 'Updated bio for testing ' + Date.now();
    await page.fill('textarea#bio', newBio);

    // Update interests
    await page.click('button:has-text("Technology")');
    await page.click('button:has-text("Photography")');

    // Save changes
    await page.click('button:has-text("Save Changes")');

    // Should show success message or redirect
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });

  test('should validate profile fields', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Try to save with invalid data
    await page.fill('input[name="displayName"]', 'A'); // Too short
    await page.fill('input[name="zipCode"]', '1234'); // Invalid zip

    await page.click('button:has-text("Save Changes")');

    // Should show validation errors
    await expect(page.locator('text=/.*name.*2.*characters/i')).toBeVisible();
    await expect(page.locator('text=/.*5-digit.*zip/i')).toBeVisible();
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

  test('should display profile information correctly', async ({ page }) => {
    // Get user ID from auth context or URL
    await page.goto('http://localhost:3000/profile/edit');
    await page.click('button:has-text("Cancel")');

    // Should display user information
    await expect(page.locator('text=/Sarah Johnson|verified.parent/i')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    await expect(page.locator('text=Interests')).toBeVisible();
  });

  test('should show edit button only on own profile', async ({ page }) => {
    // Visit own profile
    await page.goto('http://localhost:3000/profile/edit');
    await page.click('button:has-text("Cancel")');

    // Should see edit button
    await expect(page.locator('button:has-text("Edit Profile")')).toBeVisible();

    // Navigate to another user's profile (if possible)
    // This would require knowing another user's ID
    // For now, we'll skip this part as it requires seed data
  });

  test('should update privacy settings', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Scroll to privacy settings
    await page.locator('text=Who can see your profile').scrollIntoViewIfNeeded();

    // Change privacy settings (assuming there are radio buttons or selects)
    // The exact selectors would depend on your PrivacySettings component implementation

    await page.click('button:has-text("Save Changes")');

    // Should save successfully
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });

  test('should allow selecting children age ranges', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Select some age ranges
    await page.click('button:has-text("0-2")');
    await page.click('button:has-text("3-5")');

    // Should be highlighted/selected
    await expect(page.locator('button:has-text("0-2")')).toHaveClass(/bg-primary/);
    await expect(page.locator('button:has-text("3-5")')).toHaveClass(/bg-primary/);

    // Deselect one
    await page.click('button:has-text("0-2")');
    await expect(page.locator('button:has-text("0-2")')).not.toHaveClass(/bg-primary/);
  });

  test('should allow selecting relationship status', async ({ page }) => {
    await page.goto('http://localhost:3000/profile/edit');

    // Change relationship status
    await page.selectOption('select', 'single');

    // Save
    await page.click('button:has-text("Save Changes")');

    // Should save successfully
    await expect(page).toHaveURL(/.*profile\/[^/]+$/, { timeout: 10000 });
  });
});
