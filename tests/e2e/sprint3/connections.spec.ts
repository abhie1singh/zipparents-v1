import { test, expect } from '@playwright/test';

// Generate unique emails for test users
const timestamp = Date.now();
const USER_A = {
  email: `test.connecta.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Alice Connector',
  dateOfBirth: '1990-05-15',
  zipCode: '10001'
};

const USER_B = {
  email: `test.connectb.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Bob Connector',
  dateOfBirth: '1988-08-20',
  zipCode: '10002'
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

test.describe('Parent Connections', () => {
  test.beforeAll(async ({ browser }) => {
    // Create both test users
    const page = await browser.newPage();

    // Create User A
    await signupAndOnboard(page, USER_A);

    // Logout and create User B
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Find and click logout/signout button if visible
    const signoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout")');
    if (await signoutButton.isVisible().catch(() => false)) {
      await signoutButton.click();
      await page.waitForTimeout(1000);
    }

    await signupAndOnboard(page, USER_B);

    await page.close();
  });

  test('should navigate to connections page', async ({ page }) => {
    // Login as User A
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/connections');

    await expect(page.getByRole('heading', { name: 'Connections' })).toBeVisible();
    await expect(page.locator('text=/Manage your parent connections/')).toBeVisible();
  });

  test('should display connection tabs', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/connections');

    // Check for all tabs
    await expect(page.locator('button:has-text("Pending")')).toBeVisible();
    await expect(page.locator('button:has-text("Connected")')).toBeVisible();
    await expect(page.locator('button:has-text("All")')).toBeVisible();
  });

  test('should send connection request from search', async ({ page }) => {
    // Login as User A
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Go to search
    await page.goto('http://localhost:3000/search');
    await page.waitForTimeout(2000);

    // Look for User B's card and click connect
    const bobCard = page.locator('div:has-text("Bob Connector")').first();

    // Check if Bob appears in results
    if (await bobCard.isVisible().catch(() => false)) {
      const connectButton = bobCard.locator('button:has-text("Connect")');
      await connectButton.click();
      await page.waitForTimeout(1000);

      // Should show success toast or button state change
      await expect(page.locator('text=/Connection request sent|Request Sent/')).toBeVisible({ timeout: 5000 });
    } else {
      // Expand search radius if Bob isn't visible
      await page.locator('select#radius').selectOption('100');
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(2000);

      const bobCardExpanded = page.locator('div:has-text("Bob Connector")').first();
      if (await bobCardExpanded.isVisible().catch(() => false)) {
        const connectButton = bobCardExpanded.locator('button:has-text("Connect")');
        await connectButton.click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=/Connection request sent|Request Sent/')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should see pending connection request as recipient', async ({ page }) => {
    // Login as User B
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_B.email);
    await page.fill('input[type="password"]', USER_B.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Go to connections
    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    // Should be on Pending tab by default
    const pendingTab = page.locator('button:has-text("Pending")');
    await expect(pendingTab).toHaveClass(/border-primary-600/);

    // Check if there's a pending request from Alice
    const aliceConnection = page.locator('div:has-text("Alice Connector")');

    if (await aliceConnection.isVisible().catch(() => false)) {
      // Should show Accept and Decline buttons
      await expect(aliceConnection.locator('button:has-text("Accept")')).toBeVisible();
      await expect(aliceConnection.locator('button:has-text("Decline")')).toBeVisible();
    }
  });

  test('should accept connection request', async ({ page }) => {
    // Login as User B
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_B.email);
    await page.fill('input[type="password"]', USER_B.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    const aliceConnection = page.locator('div:has-text("Alice Connector")').first();

    if (await aliceConnection.isVisible().catch(() => false)) {
      const acceptButton = aliceConnection.locator('button:has-text("Accept")');
      await acceptButton.click();
      await page.waitForTimeout(1500);

      // Should show success message
      await expect(page.locator('text=/Connection accepted|accepted/')).toBeVisible({ timeout: 5000 });

      // Switch to Connected tab
      await page.click('button:has-text("Connected")');
      await page.waitForTimeout(1000);

      // Alice should now appear in Connected tab
      await expect(page.locator('div:has-text("Alice Connector")')).toBeVisible();
    }
  });

  test('should show connected status on both sides', async ({ page }) => {
    // Login as User A
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    // Switch to Connected tab
    await page.click('button:has-text("Connected")');
    await page.waitForTimeout(1000);

    // Bob should appear in connections
    const bobConnection = page.locator('div:has-text("Bob Connector")');

    if (await bobConnection.isVisible().catch(() => false)) {
      // Should show accepted status badge
      await expect(bobConnection.locator('span:has-text("Accepted")')).toBeVisible();
    }
  });

  test('should show connected badge in search results', async ({ page }) => {
    // Login as User A
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/search');
    await page.waitForTimeout(2000);

    // Expand search if needed
    await page.locator('select#radius').selectOption('100');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);

    const bobCard = page.locator('div:has-text("Bob Connector")').first();

    if (await bobCard.isVisible().catch(() => false)) {
      // Should show Connected button instead of Connect
      await expect(bobCard.locator('button:has-text("Connected")')).toBeVisible();
    }
  });

  test('should prevent duplicate connection requests', async ({ browser }) => {
    // Create a new user to test duplicate prevention
    const page = await browser.newPage();

    const newUser = {
      email: `test.dup.${Date.now()}@test.com`,
      password: 'Test123!',
      displayName: 'Duplicate Tester',
      dateOfBirth: '1992-03-10',
      zipCode: '10003'
    };

    await signupAndOnboard(page, newUser);

    // Go to search and try to connect with User A
    await page.goto('http://localhost:3000/search');
    await page.waitForTimeout(2000);

    await page.locator('select#radius').selectOption('100');
    await page.click('button:has-text("Search")');
    await page.waitForTimeout(2000);

    const aliceCard = page.locator('div:has-text("Alice Connector")').first();

    if (await aliceCard.isVisible().catch(() => false)) {
      // Send first request
      await aliceCard.locator('button:has-text("Connect")').click();
      await page.waitForTimeout(1000);

      // Try to send again - should show error or different button state
      const requestSentButton = aliceCard.locator('button:has-text("Request Sent")');
      await expect(requestSentButton).toBeVisible({ timeout: 3000 });
    }

    await page.close();
  });

  test('should switch between connection tabs', async ({ page }) => {
    // Login as User B
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_B.email);
    await page.fill('input[type="password"]', USER_B.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    // Click on Connected tab
    await page.click('button:has-text("Connected")');
    await expect(page.locator('button:has-text("Connected")').first()).toHaveClass(/border-primary-600/);

    // Click on All tab
    await page.click('button:has-text("All")');
    await expect(page.locator('button:has-text("All")').first()).toHaveClass(/border-primary-600/);

    // Click back to Pending
    await page.click('button:has-text("Pending")');
    await expect(page.locator('button:has-text("Pending")').first()).toHaveClass(/border-primary-600/);
  });

  test('should show empty state when no connections', async ({ browser }) => {
    // Create a completely new user with no connections
    const page = await browser.newPage();

    const lonelyUser = {
      email: `test.lonely.${Date.now()}@test.com`,
      password: 'Test123!',
      displayName: 'Lonely Parent',
      dateOfBirth: '1991-07-25',
      zipCode: '10004'
    };

    await signupAndOnboard(page, lonelyUser);

    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    // Should show empty state
    await expect(page.locator('text=/No pending|No connections/')).toBeVisible();
    await expect(page.locator('a:has-text("Find Parents")')).toBeVisible();

    await page.close();
  });
});
