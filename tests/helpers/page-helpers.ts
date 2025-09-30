import { Page, expect } from '@playwright/test';

/**
 * Helper functions for common page interactions
 */

export async function login(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/feed', { timeout: 10000 });
}

export async function logout(page: Page): Promise<void> {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/login', { timeout: 5000 });
}

export async function createPost(
  page: Page,
  content: string,
  groupId?: string
): Promise<void> {
  if (groupId) {
    await page.goto(`/groups/${groupId}`);
  } else {
    await page.goto('/feed');
  }

  await page.fill('[data-testid="post-input"]', content);
  await page.click('[data-testid="submit-post"]');

  // Wait for post to appear
  await expect(page.locator(`text=${content}`).first()).toBeVisible({
    timeout: 5000,
  });
}

export async function joinGroup(page: Page, groupId: string): Promise<void> {
  await page.goto(`/groups/${groupId}`);
  await page.click('[data-testid="join-group-button"]');

  // Wait for success message or button state change
  await expect(page.locator('[data-testid="leave-group-button"]')).toBeVisible({
    timeout: 5000,
  });
}

export async function createEvent(
  page: Page,
  eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
  }
): Promise<void> {
  await page.goto('/events/create');

  await page.fill('[name="title"]', eventData.title);
  await page.fill('[name="description"]', eventData.description);
  await page.fill('[name="date"]', eventData.date);
  await page.fill('[name="location"]', eventData.location);

  await page.click('button[type="submit"]');

  // Wait for redirect to event page
  await page.waitForURL(/\/events\/.*/, { timeout: 10000 });
}

export async function sendMessage(
  page: Page,
  recipientId: string,
  message: string
): Promise<void> {
  await page.goto(`/messages/${recipientId}`);
  await page.fill('[data-testid="message-input"]', message);
  await page.click('[data-testid="send-message"]');

  // Wait for message to appear
  await expect(page.locator(`text=${message}`).last()).toBeVisible({
    timeout: 5000,
  });
}

export async function searchUsers(
  page: Page,
  query: string
): Promise<void> {
  await page.goto('/search');
  await page.fill('[data-testid="search-input"]', query);
  await page.press('[data-testid="search-input"]', 'Enter');

  // Wait for results
  await page.waitForSelector('[data-testid="search-results"]', {
    timeout: 5000,
  });
}

export async function updateProfile(
  page: Page,
  profileData: {
    displayName?: string;
    bio?: string;
    zipCode?: string;
  }
): Promise<void> {
  await page.goto('/profile/edit');

  if (profileData.displayName) {
    await page.fill('[name="displayName"]', profileData.displayName);
  }

  if (profileData.bio) {
    await page.fill('[name="bio"]', profileData.bio);
  }

  if (profileData.zipCode) {
    await page.fill('[name="zipCode"]', profileData.zipCode);
  }

  await page.click('button[type="submit"]');

  // Wait for success message
  await expect(page.locator('text=Profile updated')).toBeVisible({
    timeout: 5000,
  });
}
