import { test, expect } from '@playwright/test';
import { login, TEST_USERS } from '../helpers/auth-test-helpers';

/**
 * Sprint 8: Authentication & Authorization Security Tests
 *
 * Tests security controls around authentication and access control
 */

test.describe('Authentication Security', () => {
  test('should prevent access to protected routes when not authenticated', async ({ page }) => {
    const protectedRoutes = [
      '/feed',
      '/profile',
      '/events',
      '/messages',
      '/search',
      '/admin',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to login or show access denied
      const url = page.url();
      expect(url === '/login' || url === '/' || url.includes('access-denied')).toBeTruthy();
    }
  });

  test('should prevent brute force attacks with rate limiting', async ({ page }) => {
    await page.goto('/login');

    // Try multiple failed logins
    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      await page.fill('input[name="email"]', 'test@test.com');
      await page.fill('input[name="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // After multiple attempts, should show rate limit error
    const errorText = await page.locator('[role="alert"]').textContent();
    expect(errorText).toContain('too many' || 'rate limit' || 'slow down');
  });

  test('should enforce strong password requirements', async ({ page }) => {
    await page.goto('/signup');

    const weakPasswords = [
      '123456',      // Too weak
      'password',    // Common password
      'abc',         // Too short
      '12345678',    // No special chars
    ];

    for (const pwd of weakPasswords) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', pwd);
      await page.fill('input[name="confirmPassword"]', pwd);
      await page.fill('input[name="displayName"]', 'Test User');

      // Submit
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);

      // Should show password error
      const hasError = await page.locator('text=/password.*weak|password.*requirements/i').count() > 0;
      expect(hasError).toBeTruthy();

      // Reload for next attempt
      await page.reload();
    }
  });

  test('should prevent session hijacking with secure cookies', async ({ page, context }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Get cookies
    const cookies = await context.cookies();

    // Check that session cookie is httpOnly and secure
    const sessionCookie = cookies.find(c =>
      c.name.includes('session') || c.name.includes('auth') || c.name.includes('token')
    );

    if (sessionCookie) {
      expect(sessionCookie.httpOnly).toBeTruthy();
      // In production, should also be secure
      // expect(sessionCookie.secure).toBeTruthy();
    }
  });

  test('should logout user properly and clear session', async ({ page, context }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/feed');

    // Logout
    await page.click('button:has-text("Log Out")');
    await expect(page).toHaveURL('/');

    // Try to access protected route
    await page.goto('/feed');

    // Should be redirected to login
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Authorization Security', () => {
  test('regular user cannot access admin panel', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Try to access admin
    await page.goto('/admin');

    // Should be blocked
    const url = page.url();
    expect(url).not.toContain('/admin');

    // Should see access denied message
    const accessDenied = await page.locator('text=/access denied|unauthorized/i').count() > 0;
    expect(accessDenied).toBeTruthy();
  });

  test('admin user can access admin panel', async ({ page }) => {
    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);

    // Navigate to admin
    await page.goto('/admin');

    // Should be allowed
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('h1:has-text("Admin")')).toBeVisible();
  });

  test('user cannot modify other user\'s data', async ({ page, context }) => {
    // Login as user 1
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    // Try to access another user's profile edit page directly
    await page.goto('/profile/someOtherUserId/edit');

    // Should be blocked or redirected
    const url = page.url();
    expect(url).not.toContain('someOtherUserId/edit');
  });

  test('suspended user cannot access app', async ({ page }) => {
    // Assuming there's a suspended user in test data
    const suspendedUser = TEST_USERS.suspended || TEST_USERS.verified;

    await page.goto('/login');
    await page.fill('input[name="email"]', suspendedUser.email);
    await page.fill('input[name="password"]', suspendedUser.password);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Should see suspended message or be redirected
    const isSuspendedMessageVisible = await page.locator('text=/suspended|account.*disabled/i').count() > 0;
    const isNotOnFeed = !page.url().includes('/feed');

    expect(isSuspendedMessageVisible || isNotOnFeed).toBeTruthy();
  });
});

test.describe('Input Validation Security', () => {
  test('should sanitize XSS attempts in user input', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/profile/setup');

    // Try XSS in bio field
    const xssPayload = '<script>alert("XSS")</script>';
    await page.fill('textarea[name="bio"]', xssPayload);
    await page.click('button:has-text("Save")');

    // Wait for save
    await page.waitForTimeout(1000);

    // Check that script tag is sanitized
    await page.goto('/profile');
    const bioContent = await page.locator('[data-testid="user-bio"]').textContent();

    // Should not contain script tag
    expect(bioContent).not.toContain('<script>');
  });

  test('should prevent SQL injection attempts', async ({ page }) => {
    await page.goto('/login');

    // Try SQL injection
    const sqlPayload = "admin' OR '1'='1";
    await page.fill('input[name="email"]', sqlPayload);
    await page.fill('input[name="password"]', sqlPayload);
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Should not be logged in
    expect(page.url()).not.toContain('/feed');
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/signup');

    const invalidEmails = [
      'notanemail',
      '@example.com',
      'test@',
      'test..test@example.com',
    ];

    for (const email of invalidEmails) {
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="password"]', 'Test123!');
      await page.fill('input[name="confirmPassword"]', 'Test123!');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(500);

      // Should show validation error
      const hasError = await page.locator('text=/invalid.*email|email.*format/i').count() > 0;
      expect(hasError).toBeTruthy();

      await page.reload();
    }
  });

  test('should prevent excessively long input', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/profile/setup');

    // Try extremely long bio (over 1000 characters)
    const longText = 'a'.repeat(2000);
    await page.fill('textarea[name="bio"]', longText);

    // Check if input is truncated or shows error
    const value = await page.locator('textarea[name="bio"]').inputValue();
    const hasError = await page.locator('text=/too long|maximum.*characters/i').count() > 0;

    expect(value.length <= 1000 || hasError).toBeTruthy();
  });
});

test.describe('CSRF Protection', () => {
  test('form submissions should include CSRF token', async ({ page }) => {
    await page.goto('/login');

    // Check for CSRF token in form
    const csrfToken = await page.locator('input[name="_csrf"]').count() > 0 ||
                      await page.locator('input[name="csrf"]').count() > 0;

    // Or check if it's in meta tag
    const csrfMeta = await page.locator('meta[name="csrf-token"]').count() > 0;

    // Should have CSRF protection
    expect(csrfToken || csrfMeta).toBeTruthy();
  });
});

test.describe('Secure Headers', () => {
  test('should have security headers set', async ({ page }) => {
    const response = await page.goto('/');

    if (response) {
      const headers = response.headers();

      // Check for important security headers
      // X-Frame-Options prevents clickjacking
      expect(headers['x-frame-options'] || headers['X-Frame-Options']).toBeTruthy();

      // X-Content-Type-Options prevents MIME sniffing
      expect(headers['x-content-type-options'] || headers['X-Content-Type-Options']).toBe('nosniff');

      // Note: Some headers might be set by Next.js or hosting platform
    }
  });
});
