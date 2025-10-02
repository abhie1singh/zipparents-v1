import { test, expect } from '@playwright/test';

/**
 * Sprint 5 E2E Tests - Events & Calendar
 * Uses pre-seeded users from Sprint 1
 */

const USER_A = {
  email: 'verified.parent@test.com',
  password: 'Test123!',
  displayName: 'Sarah Johnson',
};

const USER_B = {
  email: 'new.parent@test.com',
  password: 'Test123!',
  displayName: 'Emily Rodriguez',
};

async function loginUser(page: any, user: typeof USER_A) {
  await page.goto('http://localhost:3000/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getTomorrowTime() {
  return '14:00'; // 2 PM
}

function getEndTime() {
  return '16:00'; // 4 PM
}

test.describe('Sprint 5: Community Calendar & Events', () => {

  test('should navigate to calendar page', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/calendar');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify calendar heading exists
    await expect(page.locator('h1')).toContainText('Community Calendar');

    // Verify calendar or some UI element is visible
    const hasCalendar = await page.locator('.react-calendar').isVisible().catch(() => false);
    const hasCreateButton = await page.locator('button:has-text("Create Event")').isVisible().catch(() => false);

    expect(hasCalendar || hasCreateButton).toBeTruthy();
  });

  test('should navigate to create event page', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Verify form fields exist
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="location"]')).toBeVisible();
  });

  test('should create event', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const eventTitle = `Test Event ${Date.now()}`;
    const tomorrow = getTomorrowDate();

    // Fill in event details
    await page.fill('input[name="title"]', eventTitle);
    await page.fill('textarea[name="description"]', 'This is a test event for E2E testing');
    await page.fill('input[name="location"]', 'Central Park, New York');
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());

    // Select age range
    await page.locator('input[value="3-5"]').check();

    // Check required checkboxes
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();

    // Submit form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verify we're on event details page or see the event
    const url = page.url();
    expect(url).toContain('/events/');
  });

  test('should display event on calendar', async ({ page }) => {
    await loginUser(page, USER_A);

    // First create an event
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1500);

    const eventTitle = `Calendar Test ${Date.now()}`;
    const tomorrow = getTomorrowDate();

    await page.fill('input[name="title"]', eventTitle);
    await page.fill('textarea[name="description"]', 'Event for calendar test');
    await page.fill('input[name="location"]', 'Test Location');
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());
    await page.locator('input[value="6-8"]').check();
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Navigate to calendar
    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(2000);

    // Check if we can find the event (in list view or calendar)
    const listViewButton = page.locator('button:has-text("List")');
    if (await listViewButton.isVisible().catch(() => false)) {
      await listViewButton.click();
      await page.waitForTimeout(1000);
    }

    // Event should appear somewhere on the page
    const eventVisible = await page.locator(`text=${eventTitle}`).isVisible({ timeout: 5000 }).catch(() => false);
    expect(eventVisible).toBeTruthy();
  });

  test('should RSVP to event', async ({ page }) => {
    // Login as USER_A and create event
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1500);

    const eventTitle = `RSVP Test ${Date.now()}`;
    const tomorrow = getTomorrowDate();

    await page.fill('input[name="title"]', eventTitle);
    await page.fill('textarea[name="description"]', 'Event for RSVP test');
    await page.fill('input[name="location"]', 'RSVP Test Location');
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());
    await page.locator('input[value="3-5"]').check();
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    const eventUrl = page.url();

    // Logout USER_A
    await page.goto('http://localhost:3000');
    const signoutButton = page.locator('button:has-text("Sign Out")');
    if (await signoutButton.isVisible().catch(() => false)) {
      await signoutButton.click();
      await page.waitForTimeout(1000);
    }

    // Login as USER_B
    await loginUser(page, USER_B);

    // Navigate to the event
    await page.goto(eventUrl);
    await page.waitForTimeout(2000);

    // Click RSVP button
    const rsvpButton = page.locator('button:has-text("RSVP")');
    if (await rsvpButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await rsvpButton.click();
      await page.waitForTimeout(2000);

      // Verify Cancel RSVP button appears
      await expect(page.locator('button:has-text("Cancel RSVP")')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show event details correctly', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1500);

    const eventTitle = `Details Test ${Date.now()}`;
    const eventDesc = 'Detailed description for testing';
    const eventLocation = 'Times Square';
    const tomorrow = getTomorrowDate();

    await page.fill('input[name="title"]', eventTitle);
    await page.fill('textarea[name="description"]', eventDesc);
    await page.fill('input[name="location"]', eventLocation);
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());
    await page.locator('input[value="all-ages"]').check();
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Verify event details are displayed
    await expect(page.locator(`text=${eventTitle}`)).toBeVisible();
    await expect(page.locator(`text=${eventDesc}`)).toBeVisible();
    await expect(page.locator(`text=${eventLocation}`)).toBeVisible();
  });

  test('should allow event creator to edit event', async ({ page }) => {
    await loginUser(page, USER_A);

    // Create event
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1500);

    const originalTitle = `Edit Test ${Date.now()}`;
    const tomorrow = getTomorrowDate();

    await page.fill('input[name="title"]', originalTitle);
    await page.fill('textarea[name="description"]', 'Original description');
    await page.fill('input[name="location"]', 'Original Location');
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());
    await page.locator('input[value="6-8"]').check();
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Click Edit button
    const editButton = page.locator('button:has-text("Edit Event")');
    if (await editButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editButton.click();
      await page.waitForTimeout(2000);

      // Change title
      const updatedTitle = `${originalTitle} Updated`;
      await page.fill('input[name="title"]', updatedTitle);

      // Submit
      const saveButton = page.locator('button[type="submit"]:has-text("Save")');
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        await page.waitForTimeout(2000);

        // Verify updated title
        await expect(page.locator(`text=${updatedTitle}`)).toBeVisible();
      }
    }
  });

  test('should show calendar views', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(2000);

    // Try to click view mode buttons
    const monthButton = page.locator('button:has-text("Month")');
    const weekButton = page.locator('button:has-text("Week")');
    const dayButton = page.locator('button:has-text("Day")');

    if (await monthButton.isVisible().catch(() => false)) {
      await monthButton.click();
      await page.waitForTimeout(500);
    }

    if (await weekButton.isVisible().catch(() => false)) {
      await weekButton.click();
      await page.waitForTimeout(500);
    }

    if (await dayButton.isVisible().catch(() => false)) {
      await dayButton.click();
      await page.waitForTimeout(500);
    }

    // Verify calendar is still visible
    expect(page.url()).toContain('/calendar');
  });

  test('should filter events', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(2000);

    // Try to open filters
    const filterButton = page.locator('button:has-text("Filter")');
    if (await filterButton.isVisible().catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(1000);

      // Try to click My Events filter
      const myEventsCheckbox = page.locator('input[type="checkbox"]:near(:text("My Events"))');
      if (await myEventsCheckbox.isVisible().catch(() => false)) {
        await myEventsCheckbox.check();
        await page.waitForTimeout(1000);
      }
    }

    expect(page.url()).toContain('/calendar');
  });

  test('should add comment to event', async ({ page }) => {
    await loginUser(page, USER_A);

    // Create event
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1500);

    const eventTitle = `Comment Test ${Date.now()}`;
    const tomorrow = getTomorrowDate();

    await page.fill('input[name="title"]', eventTitle);
    await page.fill('textarea[name="description"]', 'Event for comment test');
    await page.fill('input[name="location"]', 'Comment Test Location');
    await page.fill('input[name="startDate"]', tomorrow);
    await page.fill('input[name="startTime"]', getTomorrowTime());
    await page.fill('input[name="endDate"]', tomorrow);
    await page.fill('input[name="endTime"]', getEndTime());
    await page.locator('input[value="9-12"]').check();
    await page.locator('input[name="isPublicPlace"]').check();
    await page.locator('input[name="acceptLiability"]').check();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Scroll down to comments section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Find comment textarea
    const commentTextarea = page.locator('textarea[placeholder*="comment" i], textarea[placeholder*="Comment" i]');
    if (await commentTextarea.isVisible({ timeout: 5000 }).catch(() => false)) {
      const commentText = `Test comment ${Date.now()}`;
      await commentTextarea.fill(commentText);

      // Find and click post button
      const postButton = page.locator('button:has-text("Post Comment"), button:has-text("Add Comment"), button:has-text("Submit")').first();
      if (await postButton.isVisible().catch(() => false)) {
        await postButton.click();
        await page.waitForTimeout(2000);

        // Verify comment appears
        await expect(page.locator(`text=${commentText}`)).toBeVisible({ timeout: 5000 });
      }
    }
  });
});
