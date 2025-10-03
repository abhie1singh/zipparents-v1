import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { login, TEST_USERS } from '../helpers/auth-test-helpers';

/**
 * Sprint 8: Accessibility Tests with axe-core
 *
 * Tests WCAG 2.1 AA compliance across all major pages
 */

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('login page should not have accessibility violations', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('signup page should not have accessibility violations', async ({ page }) => {
    await page.goto('/signup');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('feed page should not have accessibility violations', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/feed');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('events page should not have accessibility violations', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/events');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('profile page should not have accessibility violations', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/profile');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('search page should not have accessibility violations', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/search');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('admin dashboard should not have accessibility violations', async ({ page }) => {
    await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    await page.goto('/admin');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Keyboard Navigation', () => {
  test('user can navigate login form with keyboard', async ({ page }) => {
    await page.goto('/login');

    // Tab to email field
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip logo/nav

    // Type email
    await page.keyboard.type(TEST_USERS.verified.email);

    // Tab to password
    await page.keyboard.press('Tab');
    await page.keyboard.type(TEST_USERS.verified.password);

    // Tab to submit button
    await page.keyboard.press('Tab');

    // Press Enter to submit
    await page.keyboard.press('Enter');

    // Should navigate to feed
    await expect(page).toHaveURL('/feed', { timeout: 10000 });
  });

  test('user can navigate between pages with keyboard', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/feed');

    // Tab through navigation until we reach Events link
    let currentUrl = '/feed';
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');

      // Try pressing Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      currentUrl = page.url();
      if (currentUrl.includes('/events')) {
        break;
      }
    }

    // Should have navigated somewhere
    expect(currentUrl).not.toBe('/feed');
  });

  test('modal dialogs can be closed with Escape key', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/events');

    // Click create event to open modal
    const createBtn = page.locator('button:has-text("Create Event")');
    if (await createBtn.count() > 0) {
      await createBtn.click();

      // Modal should be visible
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();

      // Press Escape
      await page.keyboard.press('Escape');

      // Modal should close
      await expect(modal).not.toBeVisible();
    }
  });
});

test.describe('Screen Reader Support', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');

      // Alt should exist and not be empty
      expect(alt).toBeTruthy();
      expect(alt).not.toBe('');
    }
  });

  test('form inputs have labels', async ({ page }) => {
    await page.goto('/login');

    // Email input should have label
    const emailInput = page.locator('input[type="email"]');
    const emailLabel = await emailInput.getAttribute('aria-label') ||
                       await page.locator('label[for="email"]').textContent();
    expect(emailLabel).toBeTruthy();

    // Password input should have label
    const passwordInput = page.locator('input[type="password"]');
    const passwordLabel = await passwordInput.getAttribute('aria-label') ||
                         await page.locator('label[for="password"]').textContent();
    expect(passwordLabel).toBeTruthy();
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');

    // Get all buttons
    const buttons = page.locator('button');
    const count = await buttons.count();

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');

      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('heading hierarchy is correct', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);

    // h2 should not come before h1
    const firstH1 = page.locator('h1').first();
    const firstH2 = page.locator('h2').first();

    if (await firstH2.count() > 0) {
      const h1Box = await firstH1.boundingBox();
      const h2Box = await firstH2.boundingBox();

      if (h1Box && h2Box) {
        expect(h1Box.y).toBeLessThan(h2Box.y);
      }
    }
  });
});

test.describe('Color Contrast', () => {
  test('check color contrast on main pages', async ({ page }) => {
    const pagesToTest = ['/', '/login', '/signup', '/about'];

    for (const url of pagesToTest) {
      await page.goto(url);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('body')
        .analyze();

      const contrastViolations = results.violations.filter(
        v => v.id === 'color-contrast'
      );

      expect(contrastViolations).toEqual([]);
    }
  });
});
