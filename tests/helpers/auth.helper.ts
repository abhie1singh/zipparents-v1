/**
 * Authentication Test Helper
 *
 * Provides reusable authentication functions for tests
 */

import { Page } from '@playwright/test';
import { TEST_USERS } from '../fixtures/users';

/**
 * Login with email and password
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
}

/**
 * Login as verified user
 */
export async function loginAsVerifiedUser(page: Page): Promise<void> {
  await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
}

/**
 * Login as admin
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
}

/**
 * Signup new user
 */
export async function signup(
  page: Page,
  email: string,
  password: string,
  dateOfBirth: string,
  zipCode: string
): Promise<void> {
  await page.goto('/signup');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.check('input[name="acceptTerms"]');
  await page.click('button[type="submit"]');

  // Age verification
  await page.waitForURL(/\/verify-age/, { timeout: 10000 });
  await page.fill('input[name="dateOfBirth"]', dateOfBirth);
  await page.fill('input[name="zipCode"]', zipCode);
  await page.click('button[type="submit"]');
}

/**
 * Logout
 */
export async function logout(page: Page): Promise<void> {
  // Click user menu or logout button
  await page.click('[data-testid="user-menu"]', { timeout: 5000 }).catch(() => {
    // If user menu not found, try direct logout link
  });

  await page.click('text=Logout', { timeout: 5000 }).catch(async () => {
    // Alternative: navigate to logout URL
    await page.goto('/api/auth/logout');
  });

  // Wait for redirect to home or login
  await page.waitForURL(url => url.pathname === '/' || url.pathname === '/login', { timeout: 10000 });
}

/**
 * Check if user is logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Check for user menu or profile link
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Wait for authentication to complete
 */
export async function waitForAuth(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForFunction(
    () => {
      const metaAuth = document.querySelector('meta[name="auth-status"]');
      return metaAuth?.getAttribute('content') === 'authenticated';
    },
    { timeout }
  ).catch(() => {
    // If meta tag doesn't exist, check for user menu
    return page.waitForSelector('[data-testid="user-menu"]', { timeout });
  });
}

/**
 * Clear all auth cookies and session
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Get current user info from page
 */
export async function getCurrentUser(page: Page): Promise<{
  email?: string;
  displayName?: string;
  uid?: string;
} | null> {
  try {
    return await page.evaluate(() => {
      const userDataElement = document.querySelector('[data-user-info]');
      if (userDataElement) {
        const userDataStr = userDataElement.getAttribute('data-user-info');
        return userDataStr ? JSON.parse(userDataStr) : null;
      }
      return null;
    });
  } catch {
    return null;
  }
}

/**
 * Login with multiple users (for conversation tests)
 */
export async function loginMultipleUsers(
  page1: Page,
  page2: Page,
  user1Email: string,
  user1Password: string,
  user2Email: string,
  user2Password: string
): Promise<void> {
  await Promise.all([
    login(page1, user1Email, user1Password),
    login(page2, user2Email, user2Password),
  ]);
}

/**
 * Verify email (simulate)
 */
export async function verifyEmail(page: Page): Promise<void> {
  // This would normally involve clicking email verification link
  // For testing, we might need to directly update the database or mock the verification
  await page.goto('/verify-email');
  await page.click('button:has-text("Resend Verification Email")');
}

/**
 * Reset password
 */
export async function requestPasswordReset(page: Page, email: string): Promise<void> {
  await page.goto('/reset-password');
  await page.fill('input[name="email"]', email);
  await page.click('button[type="submit"]');
}

/**
 * Check if user has specific role
 */
export async function hasRole(page: Page, role: 'admin' | 'moderator' | 'user'): Promise<boolean> {
  try {
    const userInfo = await getCurrentUser(page);
    return userInfo?.['role'] === role;
  } catch {
    return false;
  }
}

/**
 * Wait for email verification status
 */
export async function waitForEmailVerification(page: Page, isVerified: boolean = true): Promise<void> {
  const selector = isVerified
    ? '[data-testid="email-verified-badge"]'
    : '[data-testid="email-unverified-banner"]';

  await page.waitForSelector(selector, { timeout: 5000 });
}
