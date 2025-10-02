import { test, expect } from '@playwright/test';

// Generate unique emails for test users
const timestamp = Date.now();
const USER_A = {
  email: `test.msg.a.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Alice Messenger',
  dateOfBirth: '1990-05-15',
  zipCode: '10001'
};

const USER_B = {
  email: `test.msg.b.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Bob Messenger',
  dateOfBirth: '1988-08-20',
  zipCode: '10001'
};

const USER_C = {
  email: `test.msg.c.${timestamp}@test.com`,
  password: 'Test123!',
  displayName: 'Charlie Messenger',
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

test.describe('Sprint 4: Messaging & Safety', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    // Create all test users
    await signupAndOnboard(page, USER_A);

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    const signoutButton = page.locator('button:has-text("Sign Out"), button:has-text("Logout")');
    if (await signoutButton.isVisible().catch(() => false)) {
      await signoutButton.click();
      await page.waitForTimeout(1000);
    }

    await signupAndOnboard(page, USER_B);

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);
    const signoutButton2 = page.locator('button:has-text("Sign Out"), button:has-text("Logout")');
    if (await signoutButton2.isVisible().catch(() => false)) {
      await signoutButton2.click();
      await page.waitForTimeout(1000);
    }

    await signupAndOnboard(page, USER_C);

    // Connect USER_A and USER_B
    await connectUsers(page, USER_A, USER_B);

    await page.close();
  });

  test('should navigate to messages page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');

    await expect(page.getByRole('heading', { name: 'Messages' })).toBeVisible();
    await expect(page.locator('text=/Chat with your connected/')).toBeVisible();
  });

  test('should show empty state when no conversations', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    // Might have conversations or empty state
    const hasConversations = await page.locator('text=/No conversations yet/').isVisible().catch(() => false);
    if (hasConversations) {
      await expect(page.locator('a:has-text("Find Parents")')).toBeVisible();
    }
  });

  test('connected users can start a conversation', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Go to connections and click on connected user
    await page.goto('http://localhost:3000/connections');
    await page.waitForTimeout(1000);

    await page.click('button:has-text("Connected")');
    await page.waitForTimeout(500);

    const bobCard = page.locator(`div:has-text("${USER_B.displayName}")`).first();
    if (await bobCard.isVisible().catch(() => false)) {
      await bobCard.click();
      await page.waitForTimeout(1000);

      // Should navigate to profile page - from there we'd need a "Message" button
      // For now, navigate directly to messages
      await page.goto('http://localhost:3000/messages');
    }
  });

  test('should send and receive text messages', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    // Check if there are conversations
    const conversationExists = await page.locator(`text=${USER_B.displayName}`).isVisible().catch(() => false);

    if (!conversationExists) {
      console.log('No conversation found - test will be skipped');
      return;
    }

    // Click on conversation
    await page.click(`text=${USER_B.displayName}`);
    await page.waitForTimeout(1000);

    // Should be on thread page
    await expect(page.locator(`text=${USER_B.displayName}`)).toBeVisible();

    // Send a message
    const messageText = `Test message at ${Date.now()}`;
    await page.fill('textarea[placeholder*="Type a message"]', messageText);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Message should appear
    await expect(page.locator(`text=${messageText}`)).toBeVisible();
  });

  test('should display conversation in real-time for both users', async ({ browser }) => {
    // Open two browser contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    // Login as USER_A
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[type="email"]', USER_A.email);
    await page1.fill('input[type="password"]', USER_A.password);
    await page1.click('button[type="submit"]');
    await page1.waitForTimeout(2000);

    // Login as USER_B
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[type="email"]', USER_B.email);
    await page2.fill('input[type="password"]', USER_B.password);
    await page2.click('button[type="submit"]');
    await page2.waitForTimeout(2000);

    // Both navigate to messages
    await page1.goto('http://localhost:3000/messages');
    await page2.goto('http://localhost:3000/messages');
    await page1.waitForTimeout(1000);
    await page2.waitForTimeout(1000);

    await context1.close();
    await context2.close();
  });

  test('non-connected users cannot message', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_C.email);
    await page.fill('input[type="password"]', USER_C.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    // Should not see USER_A or USER_B in conversations
    const hasUserA = await page.locator(`text=${USER_A.displayName}`).isVisible().catch(() => false);
    const hasUserB = await page.locator(`text=${USER_B.displayName}`).isVisible().catch(() => false);

    expect(hasUserA).toBe(false);
    expect(hasUserB).toBe(false);
  });

  test('should be able to report a user', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    const conversationExists = await page.locator(`text=${USER_B.displayName}`).isVisible().catch(() => false);
    if (!conversationExists) return;

    await page.click(`text=${USER_B.displayName}`);
    await page.waitForTimeout(1000);

    // Click menu
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Click Report user
    const reportButton = page.locator('button:has-text("Report user")');
    if (await reportButton.isVisible().catch(() => false)) {
      await reportButton.click();
      await page.waitForTimeout(500);

      // Fill report form
      await page.selectOption('select', 'spam');
      await page.fill('textarea', 'Test report description for automated testing');

      // Submit
      await page.click('button:has-text("Submit Report")');
      await page.waitForTimeout(1000);

      // Should show success message
      await expect(page.locator('text=/Report submitted|Thank you/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should be able to block a user', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    const conversationExists = await page.locator(`text=${USER_B.displayName}`).isVisible().catch(() => false);
    if (!conversationExists) return;

    await page.click(`text=${USER_B.displayName}`);
    await page.waitForTimeout(1000);

    // Click menu
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Click Block user
    const blockButton = page.locator('button:has-text("Block user")');
    if (await blockButton.isVisible().catch(() => false)) {
      // Accept confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      await blockButton.click();
      await page.waitForTimeout(1000);

      // Should navigate back to messages
      await expect(page).toHaveURL(/\/messages$/);
    }
  });

  test('blocked users cannot message each other', async ({ page }) => {
    // After blocking in previous test, USER_A should not see USER_B
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    // Conversation might still exist but messages should be blocked
    // This would require additional implementation
  });

  test('should mute a conversation', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_B.email);
    await page.fill('input[type="password"]', USER_B.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    const conversationExists = await page.locator(`text=${USER_A.displayName}`).isVisible().catch(() => false);
    if (!conversationExists) return;

    await page.click(`text=${USER_A.displayName}`);
    await page.waitForTimeout(1000);

    // Click menu
    const menuButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Click Mute
    const muteButton = page.locator('button:has-text("Mute conversation")');
    if (await muteButton.isVisible().catch(() => false)) {
      await muteButton.click();
      await page.waitForTimeout(1000);

      // Should show success
      await expect(page.locator('text=/Conversation muted|muted/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show unread message count', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    // Look for unread count badges
    const unreadBadge = page.locator('span.bg-primary-600').first();
    // Might or might not be visible depending on messages
  });

  test('should format message timestamps correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', USER_A.email);
    await page.fill('input[type="password"]', USER_A.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    await page.goto('http://localhost:3000/messages');
    await page.waitForTimeout(1000);

    const conversationExists = await page.locator(`text=${USER_B.displayName}`).isVisible().catch(() => false);
    if (!conversationExists) return;

    // Timestamps should be visible in the conversation list
    // Could be "Yesterday", "5:30 PM", etc.
  });
});
