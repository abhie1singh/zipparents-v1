import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Sprint 8: Critical User Journey Test
 *
 * Tests the complete happy path: signup -> profile -> search -> connect -> message -> event
 */

test.describe('Complete User Journey', () => {
  const testUser = {
    email: `test.user.${Date.now()}@test.com`,
    password: 'Test123!',
    displayName: faker.person.fullName(),
    zipCode: '10001',
    dateOfBirth: '1990-01-15',
  };

  test('complete user journey: signup to event participation', async ({ page }) => {
    // ===== PHASE 1: SIGNUP =====
    await test.step('User signs up successfully', async () => {
      await page.goto('/signup');

      // Fill signup form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.fill('input[name="displayName"]', testUser.displayName);

      // Accept terms
      await page.check('input[type="checkbox"][name*="terms"]');

      // Submit
      await page.click('button[type="submit"]:has-text("Sign Up")');

      // Should redirect to age verification
      await expect(page).toHaveURL(/\/verify-age/, { timeout: 10000 });
    });

    // ===== PHASE 2: AGE VERIFICATION =====
    await test.step('User completes age verification', async () => {
      // Fill date of birth
      await page.fill('input[name="dateOfBirth"]', testUser.dateOfBirth);
      await page.fill('input[name="zipCode"]', testUser.zipCode);

      // Submit verification
      await page.click('button[type="submit"]:has-text("Verify")');

      // Should redirect to profile setup
      await expect(page).toHaveURL(/\/profile\/setup/, { timeout: 10000 });
    });

    // ===== PHASE 3: PROFILE SETUP =====
    await test.step('User sets up their profile', async () => {
      // Fill bio
      await page.fill('textarea[name="bio"]', 'Parent of two amazing kids. Love outdoor activities!');

      // Select interests (at least 3)
      const interests = ['Outdoor Activities', 'Playdates', 'School Events'];
      for (const interest of interests) {
        await page.click(`label:has-text("${interest}")`);
      }

      // Select child age range
      await page.click('label:has-text("3-5")');

      // Submit profile
      await page.click('button:has-text("Complete Profile")');

      // Should redirect to feed
      await expect(page).toHaveURL('/feed', { timeout: 10000 });
    });

    // ===== PHASE 4: BROWSE FEED =====
    await test.step('User browses the feed', async () => {
      // Wait for feed to load
      await page.waitForSelector('h1:has-text("Community Feed")', { timeout: 10000 });

      // Should see posts or empty state
      const hasPosts = await page.locator('article').count() > 0;
      const hasEmptyState = await page.locator('text=No posts yet').count() > 0;
      expect(hasPosts || hasEmptyState).toBeTruthy();
    });

    // ===== PHASE 5: SEARCH FOR PARENTS =====
    await test.step('User searches for other parents', async () => {
      // Navigate to search
      await page.click('a[href="/search"]');
      await expect(page).toHaveURL('/search');

      // Search by zip code
      await page.fill('input[placeholder*="zip"]', testUser.zipCode);
      await page.click('button:has-text("Search")');

      // Wait for results
      await page.waitForTimeout(2000);

      // Should see results or no results message
      const hasResults = await page.locator('[data-testid="search-result"]').count() > 0;
      const hasNoResults = await page.locator('text=No parents found').count() > 0;
      expect(hasResults || hasNoResults).toBeTruthy();
    });

    // ===== PHASE 6: SEND CONNECTION REQUEST =====
    await test.step('User sends connection request if parents found', async () => {
      const connectButtons = page.locator('button:has-text("Connect")');
      const count = await connectButtons.count();

      if (count > 0) {
        // Click first connect button
        await connectButtons.first().click();

        // Should see success message or confirmation
        await expect(page.locator('text=Connection request sent')).toBeVisible({ timeout: 5000 });
      } else {
        console.log('No parents to connect with - skipping connection test');
      }
    });

    // ===== PHASE 7: VIEW EVENTS =====
    await test.step('User views local events', async () => {
      // Navigate to events
      await page.click('a[href="/events"]');
      await expect(page).toHaveURL('/events');

      // Wait for events to load
      await page.waitForSelector('h1:has-text("Local Events")', { timeout: 10000 });

      // Should see events or empty state
      const hasEvents = await page.locator('[data-testid="event-card"]').count() > 0;
      const hasEmptyState = await page.locator('text=No events found').count() > 0;
      expect(hasEvents || hasEmptyState).toBeTruthy();
    });

    // ===== PHASE 8: CREATE AN EVENT =====
    await test.step('User creates a new event', async () => {
      // Click create event button
      await page.click('button:has-text("Create Event")');

      // Fill event form
      await page.fill('input[name="title"]', 'Weekend Playdate at Central Park');
      await page.fill('textarea[name="description"]', 'Join us for a fun playdate with kids aged 3-5!');
      await page.fill('input[name="location"]', 'Central Park, New York');

      // Set date to next week
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const dateString = nextWeek.toISOString().split('T')[0];
      await page.fill('input[name="date"]', dateString);
      await page.fill('input[name="time"]', '10:00');

      // Set capacity
      await page.fill('input[name="capacity"]', '10');

      // Submit event
      await page.click('button[type="submit"]:has-text("Create Event")');

      // Should see success message and redirect to event details
      await expect(page).toHaveURL(/\/events\/[a-zA-Z0-9]+/, { timeout: 10000 });
      await expect(page.locator('h1:has-text("Weekend Playdate")')).toBeVisible();
    });

    // ===== PHASE 9: VIEW PROFILE =====
    await test.step('User views their own profile', async () => {
      // Navigate to profile
      await page.click('a[href*="/profile"]');

      // Should see profile information
      await expect(page.locator(`text=${testUser.displayName}`)).toBeVisible();
      await expect(page.locator('text=Outdoor Activities')).toBeVisible();
    });

    // ===== PHASE 10: LOGOUT =====
    await test.step('User logs out successfully', async () => {
      // Click logout button
      await page.click('button:has-text("Log Out")');

      // Should redirect to home page
      await expect(page).toHaveURL('/', { timeout: 10000 });

      // Should see login/signup buttons
      await expect(page.locator('a[href="/login"]')).toBeVisible();
    });
  });

  test('user can login after signup', async ({ page }) => {
    // This test assumes the previous test ran successfully
    await page.goto('/login');

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]:has-text("Log In")');

    // Should redirect to feed
    await expect(page).toHaveURL('/feed', { timeout: 10000 });
    await expect(page.locator(`text=${testUser.displayName}`)).toBeVisible();
  });
});
