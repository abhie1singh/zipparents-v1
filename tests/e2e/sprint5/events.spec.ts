import { test, expect } from '@playwright/test';

// Generate unique emails for test users
const timestamp = Date.now();
const USER_A = {
  email: `test.event.a.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Alice Events',
  dateOfBirth: '1990-05-15',
  zipCode: '10001'
};

const USER_B = {
  email: `test.event.b.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Bob Events',
  dateOfBirth: '1988-08-20',
  zipCode: '10001'
};

const USER_C = {
  email: `test.event.c.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Charlie Events',
  dateOfBirth: '1992-03-10',
  zipCode: '10001'
};

async function signupAndOnboard(page: any, user: typeof USER_A) {
  await page.goto('http://localhost:3000/signup');

  await page.fill('input[type="email"]', user.email);
  await page.fill('input[name="displayName"]', user.displayName);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  await page.fill('input[type="date"]', user.dateOfBirth);
  await page.fill('input[name="zipCode"]', user.zipCode);
  await page.check('input[name="acceptedTerms"]');
  await page.check('input[name="acceptedPrivacy"]');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(1000);

  // Complete onboarding
  await page.goto('http://localhost:3000/onboarding');

  // Step 1
  await expect(page.getByRole('heading', { name: 'Basic Information' })).toBeVisible({ timeout: 10000 });
  await page.click('button:has-text("Continue")');

  // Step 2
  await expect(page.getByRole('heading', { name: 'About You' })).toBeVisible();
  await page.fill('textarea#bio', `Test bio for ${user.displayName}`);
  await page.locator('button:has-text("3-5")').first().click();
  await page.click('button:has-text("Continue")');

  // Step 3
  await expect(page.getByRole('heading', { name: 'Your Interests' })).toBeVisible();
  await page.locator('button:has-text("Sports")').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Reading")').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Food & Cooking")').first().click();
  await page.waitForTimeout(300);
  await page.click('button:has-text("Continue")');

  // Step 4
  await expect(page.getByRole('heading', { name: /Privacy.*Photo/i })).toBeVisible();
  await page.waitForTimeout(500);
  const completeButton = page.locator('button:has-text("Complete Profile")');
  await expect(completeButton).toBeEnabled();
  await completeButton.click();
  await page.waitForTimeout(2000);
}

async function connectUsers(page: any, fromUser: typeof USER_A, toUser: typeof USER_B) {
  // Login as fromUser
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', fromUser.email);
  await page.fill('input[type="password"]', fromUser.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Search and connect
  await page.goto('http://localhost:3000/search');
  await page.waitForTimeout(2000);

  await page.locator('select#radius').selectOption('100');
  await page.click('button:has-text("Search")');
  await page.waitForTimeout(2000);

  const userCard = page.locator(`div:has-text("${toUser.displayName}")`).first();
  if (await userCard.isVisible().catch(() => false)) {
    const connectButton = userCard.locator('button:has-text("Connect")');
    await connectButton.click();
    await page.waitForTimeout(1000);
  }

  // Logout and login as toUser to accept
  await page.goto('http://localhost:3000');
  const signoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout")');
  if (await signoutButton.isVisible().catch(() => false)) {
    await signoutButton.click();
    await page.waitForTimeout(1000);
  }

  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', toUser.email);
  await page.fill('input[type="password"]', toUser.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // Accept connection
  await page.goto('http://localhost:3000/connections');
  await page.waitForTimeout(1000);

  const connectionCard = page.locator(`div:has-text("${fromUser.displayName}")`).first();
  if (await connectionCard.isVisible().catch(() => false)) {
    const acceptButton = connectionCard.locator('button:has-text("Accept")');
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click();
      await page.waitForTimeout(1500);
    }
  }
}

async function loginUser(page: any, user: typeof USER_A) {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

async function signoutUser(page: any) {
  await page.goto('http://localhost:3000');
  const signoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout")');
  if (await signoutButton.isVisible().catch(() => false)) {
    await signoutButton.click();
    await page.waitForTimeout(1000);
  }
}

// Helper function to get tomorrow's date in YYYY-MM-DD format
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

// Helper function to get day after tomorrow's date
function getDayAfterTomorrowDate() {
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  return dayAfterTomorrow.toISOString().split('T')[0];
}

test.describe('Sprint 5: Community Calendar & Events', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    // Create all test users
    await signupAndOnboard(page, USER_A);
    await signoutUser(page);

    await signupAndOnboard(page, USER_B);
    await signoutUser(page);

    await signupAndOnboard(page, USER_C);
    await signoutUser(page);

    // Connect USER_A and USER_B
    await connectUsers(page, USER_A, USER_B);

    await page.close();
  });

  test('should navigate to calendar page', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(1000);

    // Verify calendar heading exists
    await expect(page.getByRole('heading', { name: 'Community Calendar' })).toBeVisible();

    // Verify calendar component is visible
    await expect(page.locator('.react-calendar')).toBeVisible();
  });

  test('should navigate to create event page', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    // Verify page heading
    await expect(page.getByRole('heading', { name: 'Create New Event' })).toBeVisible();

    // Verify form fields exist
    await expect(page.locator('input#title')).toBeVisible();
    await expect(page.locator('textarea#description')).toBeVisible();
    await expect(page.locator('input#location')).toBeVisible();
    await expect(page.locator('input#zipCode')).toBeVisible();
    await expect(page.locator('input#startDate')).toBeVisible();
    await expect(page.locator('input#startTime')).toBeVisible();
    await expect(page.locator('input#endDate')).toBeVisible();
    await expect(page.locator('input#endTime')).toBeVisible();
  });

  test('should create event', async ({ page }) => {
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Test Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    // Fill form
    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'This is a test event for automated testing. Join us for fun activities!');
    await page.fill('input#location', 'Central Park Playground');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '10:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '12:00');

    // Select age ranges
    await page.check('input[type="checkbox"]:near(:text("3-5 years"))');
    await page.check('input[type="checkbox"]:near(:text("6-8 years"))');

    // Check public place checkbox
    await page.check('input[name="isPublicPlace"]');

    // Check liability disclaimer
    await page.check('input[name="acceptedLiability"]');

    // Submit form
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Verify redirect to event details
    await expect(page).toHaveURL(/\/events\/[a-zA-Z0-9]+$/);

    // Verify event appears
    await expect(page.getByRole('heading', { name: eventTitle })).toBeVisible();
    await expect(page.locator('text=Central Park Playground')).toBeVisible();
  });

  test('should display event on calendar', async ({ page }) => {
    await loginUser(page, USER_A);

    // Create event for tomorrow
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Calendar Test Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'This event should appear on the calendar.');
    await page.fill('input#location', 'Test Location');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '14:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '16:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Navigate to calendar
    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(1500);

    // Verify event marker on calendar (blue dot on date)
    const eventMarker = page.locator('.react-calendar .bg-primary-500');
    await expect(eventMarker).toBeVisible({ timeout: 5000 });
  });

  test('should RSVP to event', async ({ page }) => {
    // Create event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `RSVP Test Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Event for RSVP testing');
    await page.fill('input#location', 'Test Park');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '15:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '17:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Get event ID from URL
    const eventUrl = page.url();
    const eventId = eventUrl.split('/').pop();

    // Logout and login as USER_B
    await signoutUser(page);
    await loginUser(page, USER_B);

    // View event details
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);

    // Get initial attendee count
    const initialAttendeeText = await page.locator('text=/\\d+ attendee/').textContent();
    const initialCount = parseInt(initialAttendeeText?.match(/\d+/)?.[0] || '0');

    // Click RSVP button
    const rsvpButton = page.locator('button:has-text("RSVP to Event")');
    await expect(rsvpButton).toBeVisible();
    await rsvpButton.click();
    await page.waitForTimeout(1500);

    // Verify "Cancel RSVP" button appears
    await expect(page.locator('button:has-text("Cancel RSVP")')).toBeVisible();

    // Verify attendee count increases
    const updatedAttendeeText = await page.locator('text=/\\d+ attendee/').textContent();
    const updatedCount = parseInt(updatedAttendeeText?.match(/\d+/)?.[0] || '0');
    expect(updatedCount).toBe(initialCount + 1);
  });

  test('should cancel RSVP', async ({ page }) => {
    // Create event and RSVP first
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Cancel RSVP Test ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Event for cancel RSVP testing');
    await page.fill('input#location', 'Test Location');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '11:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '13:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    const eventUrl = page.url();
    const eventId = eventUrl.split('/').pop();

    // Login as USER_B and RSVP
    await signoutUser(page);
    await loginUser(page, USER_B);
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);

    await page.click('button:has-text("RSVP to Event")');
    await page.waitForTimeout(1500);

    // Get attendee count after RSVP
    const rsvpedAttendeeText = await page.locator('text=/\\d+ attendee/').textContent();
    const rsvpedCount = parseInt(rsvpedAttendeeText?.match(/\d+/)?.[0] || '0');

    // Accept confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Click "Cancel RSVP"
    await page.click('button:has-text("Cancel RSVP")');
    await page.waitForTimeout(1500);

    // Verify "RSVP" button appears again
    await expect(page.locator('button:has-text("RSVP to Event")')).toBeVisible();

    // Verify attendee count decreases
    const cancelledAttendeeText = await page.locator('text=/\\d+ attendee/').textContent();
    const cancelledCount = parseInt(cancelledAttendeeText?.match(/\d+/)?.[0] || '0');
    expect(cancelledCount).toBe(rsvpedCount - 1);
  });

  test('should show attendee count correctly', async ({ page }) => {
    // Create event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Multi RSVP Test ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Event for multiple RSVP testing');
    await page.fill('input#location', 'Community Center');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '09:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '11:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    const eventUrl = page.url();
    const eventId = eventUrl.split('/').pop();

    // Have USER_B RSVP
    await signoutUser(page);
    await loginUser(page, USER_B);
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);
    await page.click('button:has-text("RSVP to Event")');
    await page.waitForTimeout(1500);

    // Have USER_C RSVP
    await signoutUser(page);
    await loginUser(page, USER_C);
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);
    await page.click('button:has-text("RSVP to Event")');
    await page.waitForTimeout(1500);

    // Verify count shows 2
    const attendeeText = await page.locator('text=/\\d+ attendee/').textContent();
    const count = parseInt(attendeeText?.match(/\d+/)?.[0] || '0');
    expect(count).toBe(2);
  });

  test('should allow event creator to edit event', async ({ page }) => {
    // Create event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Edit Test Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Original description');
    await page.fill('input#location', 'Original Location');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '10:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '12:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Click edit button
    const editButton = page.locator('a:has-text("Edit Event")');
    await expect(editButton).toBeVisible();
    await editButton.click();
    await page.waitForTimeout(1000);

    // Change title
    const updatedTitle = `Updated ${eventTitle}`;
    await page.fill('input#title', '');
    await page.fill('input#title', updatedTitle);

    // Submit
    await page.click('button:has-text("Update Event")');
    await page.waitForTimeout(2000);

    // Verify updated title
    await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  });

  test('should allow event creator to cancel event', async ({ page }) => {
    // Create event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Cancel Event Test ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Event to be cancelled');
    await page.fill('input#location', 'Test Park');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '14:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '16:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Handle prompt dialog for cancellation reason
    page.on('dialog', async dialog => {
      await dialog.accept('Weather conditions');
    });

    // Click cancel event
    await page.click('button:has-text("Cancel Event")');
    await page.waitForTimeout(2000);

    // Verify status shows "Cancelled"
    await expect(page.locator('text=Cancelled')).toBeVisible();
    await expect(page.locator('text=Weather conditions')).toBeVisible();
  });

  test('should prevent RSVP to cancelled event', async ({ page }) => {
    // Create and cancel event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Cancelled Event Test ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'This event will be cancelled');
    await page.fill('input#location', 'Test Location');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '10:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '12:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    const eventUrl = page.url();
    const eventId = eventUrl.split('/').pop();

    // Cancel event
    page.on('dialog', async dialog => {
      await dialog.accept('Cancelling for test');
    });
    await page.click('button:has-text("Cancel Event")');
    await page.waitForTimeout(2000);

    // Login as USER_B
    await signoutUser(page);
    await loginUser(page, USER_B);

    // View event
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);

    // Verify RSVP button is not visible (event is cancelled)
    const rsvpButton = page.locator('button:has-text("RSVP to Event")');
    await expect(rsvpButton).not.toBeVisible();
  });

  test('should filter events by age range', async ({ page }) => {
    // Create events with different age ranges
    await loginUser(page, USER_A);

    // Create event for age 3-5
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const event1Title = `Age 3-5 Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', event1Title);
    await page.fill('textarea#description', 'Event for preschool age');
    await page.fill('input#location', 'Playground A');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '10:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '11:00');
    await page.check('input[type="checkbox"]:near(:text("3-5 years"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Create event for age 9-12
    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const event2Title = `Age 9-12 Event ${Date.now()}`;

    await page.fill('input#title', event2Title);
    await page.fill('textarea#description', 'Event for tweens');
    await page.fill('input#location', 'Community Center');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '14:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '15:00');
    await page.check('input[type="checkbox"]:near(:text("9-12 years"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    // Navigate to calendar
    await page.goto('http://localhost:3000/calendar');
    await page.waitForTimeout(1500);

    // Open filters
    await page.click('button:has-text("Filters")');
    await page.waitForTimeout(500);

    // Select age range filter for 3-5
    await page.click('button:has-text("Preschool (3-5)")');
    await page.waitForTimeout(1000);

    // Switch to list view for easier verification
    await page.locator('button').filter({ has: page.locator('svg').first() }).last().click();
    await page.waitForTimeout(500);

    // Verify only age 3-5 event is shown
    await expect(page.locator(`text=${event1Title}`)).toBeVisible();
    await expect(page.locator(`text=${event2Title}`)).not.toBeVisible();
  });

  test('should add comment to event', async ({ page }) => {
    // Create event as USER_A
    await loginUser(page, USER_A);

    await page.goto('http://localhost:3000/events/create');
    await page.waitForTimeout(1000);

    const eventTitle = `Comment Test Event ${Date.now()}`;
    const tomorrowDate = getTomorrowDate();

    await page.fill('input#title', eventTitle);
    await page.fill('textarea#description', 'Event for comment testing');
    await page.fill('input#location', 'Test Park');
    await page.fill('input#zipCode', '10001');
    await page.fill('input#startDate', tomorrowDate);
    await page.fill('input#startTime', '10:00');
    await page.fill('input#endDate', tomorrowDate);
    await page.fill('input#endTime', '12:00');
    await page.check('input[type="checkbox"]:near(:text("All Ages"))');
    await page.check('input[name="isPublicPlace"]');
    await page.check('input[name="acceptedLiability"]');
    await page.click('button:has-text("Create Event")');
    await page.waitForTimeout(2000);

    const eventUrl = page.url();
    const eventId = eventUrl.split('/').pop();

    // Login as USER_B
    await signoutUser(page);
    await loginUser(page, USER_B);

    // View event details
    await page.goto(`http://localhost:3000/events/${eventId}`);
    await page.waitForTimeout(1000);

    // Add comment
    const commentText = `Test comment at ${Date.now()}`;
    const commentTextarea = page.locator('textarea[placeholder*="Add a comment"]');
    await expect(commentTextarea).toBeVisible();
    await commentTextarea.fill(commentText);

    await page.click('button:has-text("Post Comment")');
    await page.waitForTimeout(1500);

    // Verify comment appears
    await expect(page.locator(`text=${commentText}`)).toBeVisible();
    await expect(page.locator(`text=${USER_B.displayName}`)).toBeVisible();
  });
});
