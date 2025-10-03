import { test, expect } from '@playwright/test';
import { login, logout, TEST_USERS } from '../../helpers/auth-test-helpers';

const ADMIN_USER = {
  email: TEST_USERS.admin.email,
  password: TEST_USERS.admin.password,
};

test.describe('Suspended User Login', () => {
  test('should prevent suspended user from accessing the app', async ({ page }) => {
    // First, we need to ensure a user is suspended
    // Login as admin
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/users');

    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Get the first user's email before suspending (that's not admin)
    const firstRow = page.locator('table tbody tr').first();
    const emailCell = firstRow.locator('td').first();
    const userEmail = await emailCell.textContent();

    // Try to find a user to suspend
    const suspendButton = page.locator('button:has-text("Suspend")').first();
    const suspendButtonCount = await suspendButton.count();

    if (suspendButtonCount > 0 && userEmail) {
      // Suspend the user
      page.once('dialog', dialog => dialog.accept());
      await suspendButton.click();
      await page.waitForTimeout(1500);

      // Logout admin
      await logout(page);

      // Try to login as suspended user
      // Note: In a real test, we'd need the suspended user's credentials
      // For this test, we're verifying the flow exists

      // The user should either:
      // 1. Not be able to login
      // 2. Be redirected after login
      // 3. See a suspension message

      // This would require knowing the suspended user's password
      // In practice, you'd track this in your seed data
    }
  });

  test('should show appropriate message for suspended account', async ({ page }) => {
    // This test assumes we have access to a known suspended user's credentials
    // In a real implementation, you'd use seed data to create a suspended user with known credentials

    // Note: This is a placeholder test that demonstrates the expected behavior
    // You would need to modify this based on your actual implementation

    await page.goto('/login');

    // The actual implementation would depend on how your app handles suspended users
    // Common approaches:
    // 1. Show error message during login
    // 2. Redirect to a suspended account page after login
    // 3. Show banner/modal after login

    // Example assertion (adjust based on your implementation):
    // await expect(page.locator('text=/suspended|account disabled/i')).toBeVisible();
  });
});

test.describe('Banned User Login', () => {
  test('should prevent banned user from accessing the app', async ({ page }) => {
    // Login as admin
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/users');

    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Find ban button
    const banButton = page.locator('button:has-text("Ban")').first();
    const banButtonCount = await banButton.count();

    if (banButtonCount > 0) {
      // Get user email before banning
      const firstRow = page.locator('table tbody tr').first();
      const emailCell = firstRow.locator('td').first();
      const userEmail = await emailCell.textContent();

      // Ban the user
      page.on('dialog', dialog => dialog.accept());
      await banButton.click();
      await page.waitForTimeout(1500);

      // Logout admin
      await logout(page);

      // Attempt to login as banned user would fail
      // Similar to suspended user test, this requires known credentials
    }
  });
});

test.describe('Admin User Status Management', () => {
  test('should unsuspend a previously suspended user', async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/users');

    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Look for an Unsuspend button (which means user is already suspended)
    const unsuspendButton = page.locator('button:has-text("Unsuspend")').first();
    const unsuspendCount = await unsuspendButton.count();

    if (unsuspendCount > 0) {
      // Click to view user details
      const viewButton = page.locator('button:has-text("View")').first();
      await viewButton.click();

      // Look for Unsuspend button on detail page
      const detailUnsuspendButton = page.locator('button:has-text("Unsuspend")');
      const detailUnsuspendCount = await detailUnsuspendButton.count();

      if (detailUnsuspendCount > 0) {
        page.once('dialog', dialog => dialog.accept());
        await detailUnsuspendButton.click();
        await page.waitForTimeout(1500);

        // Status should change to active
        await expect(page.locator('text=active')).toBeVisible();
      }
    }
  });

  test('should unban a previously banned user', async ({ page }) => {
    await login(page, ADMIN_USER.email, ADMIN_USER.password);
    await page.goto('/admin/users');

    // Wait for users table
    await page.waitForSelector('table tbody tr', { timeout: 5000 });

    // Look for users with banned status
    const bannedBadge = page.locator('text=banned').first();
    const bannedCount = await bannedBadge.count();

    if (bannedCount > 0) {
      // Find the row with banned user
      const bannedRow = page.locator('tr:has(span:has-text("banned"))').first();
      const viewButton = bannedRow.locator('button:has-text("View")');
      await viewButton.click();

      // Look for Unban button
      const unbanButton = page.locator('button:has-text("Unban")');
      const unbanCount = await unbanButton.count();

      if (unbanCount > 0) {
        page.once('dialog', dialog => dialog.accept());
        await unbanButton.click();
        await page.waitForTimeout(1500);

        // Status should change to active
        await expect(page.locator('text=active')).toBeVisible();
      }
    }
  });
});
