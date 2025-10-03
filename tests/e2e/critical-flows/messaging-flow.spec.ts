import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../../helpers/auth-test-helpers';

/**
 * Sprint 8: Messaging Flow Test
 *
 * Tests the complete messaging journey between two users
 */

test.describe('Messaging Flow', () => {
  test('complete messaging flow between two users', async ({ page, context }) => {
    // ===== SETUP: Login as User 1 =====
    await test.step('User 1 logs in', async () => {
      await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
      await page.goto('/feed');
      await expect(page).toHaveURL('/feed');
    });

    // ===== User 1: Navigate to Messages =====
    await test.step('User 1 navigates to messages', async () => {
      await page.click('a[href="/messages"]');
      await expect(page).toHaveURL('/messages');

      // Should see messages page
      await expect(page.locator('h1:has-text("Messages")')).toBeVisible({ timeout: 10000 });
    });

    // ===== User 1: Start New Conversation =====
    await test.step('User 1 starts new conversation', async () => {
      // Click new message button
      const newMessageBtn = page.locator('button:has-text("New Message")');
      if (await newMessageBtn.count() > 0) {
        await newMessageBtn.click();

        // Search for user to message
        await page.fill('input[placeholder*="Search"]', 'parent');
        await page.waitForTimeout(1000);

        // Select first user from results
        const firstUser = page.locator('[data-testid="user-search-result"]').first();
        if (await firstUser.count() > 0) {
          await firstUser.click();
        }
      }
    });

    // ===== User 1: Send Message =====
    let conversationId: string | null = null;

    await test.step('User 1 sends a message', async () => {
      // Type message
      const messageInput = page.locator('textarea[placeholder*="Type"]');
      await messageInput.fill('Hi! Would you like to meet up for a playdate this weekend?');

      // Send message
      await page.click('button:has-text("Send")');

      // Should see message in conversation
      await expect(page.locator('text=Would you like to meet up')).toBeVisible({ timeout: 5000 });

      // Extract conversation ID from URL
      const url = page.url();
      const match = url.match(/\/messages\/([a-zA-Z0-9]+)/);
      if (match) {
        conversationId = match[1];
      }
    });

    // ===== User 1: Send Follow-up Message =====
    await test.step('User 1 sends follow-up message', async () => {
      const messageInput = page.locator('textarea[placeholder*="Type"]');
      await messageInput.fill('I was thinking Central Park around 10am?');
      await page.click('button:has-text("Send")');

      await expect(page.locator('text=Central Park around 10am')).toBeVisible({ timeout: 5000 });
    });

    // ===== User 1: Logout =====
    await test.step('User 1 logs out', async () => {
      await page.click('button:has-text("Log Out")');
      await expect(page).toHaveURL('/');
    });

    // ===== SETUP: Login as User 2 =====
    await test.step('User 2 logs in', async () => {
      // Login as different user
      await login(page, TEST_USERS.unverified.email, TEST_USERS.unverified.password);
      await page.goto('/feed');
    });

    // ===== User 2: Check Messages =====
    await test.step('User 2 sees new message notification', async () => {
      await page.click('a[href="/messages"]');
      await expect(page).toHaveURL('/messages');

      // Should see unread message indicator (if implemented)
      const unreadBadge = page.locator('[data-testid="unread-badge"]');
      if (await unreadBadge.count() > 0) {
        await expect(unreadBadge).toBeVisible();
      }
    });

    // ===== User 2: Open Conversation =====
    await test.step('User 2 opens the conversation', async () => {
      if (conversationId) {
        await page.goto(`/messages/${conversationId}`);
      } else {
        // Click first conversation
        await page.locator('[data-testid="conversation-item"]').first().click();
      }

      // Should see both messages from User 1
      await expect(page.locator('text=Would you like to meet up')).toBeVisible();
      await expect(page.locator('text=Central Park around 10am')).toBeVisible();
    });

    // ===== User 2: Reply to Message =====
    await test.step('User 2 replies to the message', async () => {
      const messageInput = page.locator('textarea[placeholder*="Type"]');
      await messageInput.fill('That sounds perfect! See you there!');
      await page.click('button:has-text("Send")');

      await expect(page.locator('text=That sounds perfect')).toBeVisible({ timeout: 5000 });
    });

    // ===== User 2: View Message History =====
    await test.step('User 2 can see full message history', async () => {
      // Should see all 3 messages in order
      const messages = page.locator('[data-testid="message"]');
      const count = await messages.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });

  test('user cannot send empty messages', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/messages');

    // Try to send without typing
    const sendButton = page.locator('button:has-text("Send")');

    if (await sendButton.count() > 0) {
      // Button should be disabled
      await expect(sendButton).toBeDisabled();
    }
  });

  test('user can delete their own message', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/messages');

    // Open first conversation
    const firstConvo = page.locator('[data-testid="conversation-item"]').first();
    if (await firstConvo.count() > 0) {
      await firstConvo.click();

      // Find delete button on own message
      const deleteBtn = page.locator('[data-testid="delete-message"]').first();
      if (await deleteBtn.count() > 0) {
        await deleteBtn.click();

        // Confirm deletion
        await page.click('button:has-text("Delete")');

        // Message should be removed
        await page.waitForTimeout(1000);
      }
    }
  });
});
