/**
 * Navigation Test Helper
 *
 * Provides reusable navigation functions for tests
 */

import { Page } from '@playwright/test';

/**
 * Navigate to home page
 */
export async function goToHome(page: Page): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to feed page
 */
export async function goToFeed(page: Page): Promise<void> {
  await page.goto('/feed');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to profile page
 */
export async function goToProfile(page: Page, userId?: string): Promise<void> {
  const url = userId ? `/profile/${userId}` : '/profile';
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to profile setup
 */
export async function goToProfileSetup(page: Page): Promise<void> {
  await page.goto('/profile/setup');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to messages page
 */
export async function goToMessages(page: Page, conversationId?: string): Promise<void> {
  const url = conversationId ? `/messages/${conversationId}` : '/messages';
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to calendar/events page
 */
export async function goToCalendar(page: Page): Promise<void> {
  await page.goto('/calendar');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to event details page
 */
export async function goToEventDetails(page: Page, eventId: string): Promise<void> {
  await page.goto(`/events/${eventId}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to create event page
 */
export async function goToCreateEvent(page: Page): Promise<void> {
  await page.goto('/calendar/create');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to search page
 */
export async function goToSearch(page: Page): Promise<void> {
  await page.goto('/search');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to admin dashboard
 */
export async function goToAdminDashboard(page: Page): Promise<void> {
  await page.goto('/admin');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to admin users page
 */
export async function goToAdminUsers(page: Page): Promise<void> {
  await page.goto('/admin/users');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to admin reports page
 */
export async function goToAdminReports(page: Page): Promise<void> {
  await page.goto('/admin/reports');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to admin logs page
 */
export async function goToAdminLogs(page: Page): Promise<void> {
  await page.goto('/admin/logs');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate using sidebar/navigation menu
 */
export async function navigateViaMenu(page: Page, menuItem: string): Promise<void> {
  // Click on navigation menu item
  await page.click(`nav >> text="${menuItem}"`, { timeout: 5000 }).catch(async () => {
    // Alternative: try clicking on link with href
    await page.click(`a:has-text("${menuItem}")`);
  });

  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to legal pages
 */
export async function goToTerms(page: Page): Promise<void> {
  await page.goto('/terms');
  await page.waitForLoadState('networkidle');
}

export async function goToPrivacy(page: Page): Promise<void> {
  await page.goto('/privacy');
  await page.waitForLoadState('networkidle');
}

export async function goToCommunityGuidelines(page: Page): Promise<void> {
  await page.goto('/community-guidelines');
  await page.waitForLoadState('networkidle');
}

export async function goToSafetyTips(page: Page): Promise<void> {
  await page.goto('/safety-tips');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to marketing pages
 */
export async function goToHowItWorks(page: Page): Promise<void> {
  await page.goto('/how-it-works');
  await page.waitForLoadState('networkidle');
}

export async function goToSafetyTrust(page: Page): Promise<void> {
  await page.goto('/safety-trust');
  await page.waitForLoadState('networkidle');
}

export async function goToFAQ(page: Page): Promise<void> {
  await page.goto('/faq');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate back
 */
export async function goBack(page: Page): Promise<void> {
  await page.goBack();
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate forward
 */
export async function goForward(page: Page): Promise<void> {
  await page.goForward();
  await page.waitForLoadState('networkidle');
}

/**
 * Reload page
 */
export async function reload(page: Page): Promise<void> {
  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Check current page URL
 */
export async function isOnPage(page: Page, pathname: string): Promise<boolean> {
  const currentUrl = new URL(page.url());
  return currentUrl.pathname === pathname;
}

/**
 * Wait for navigation to specific path
 */
export async function waitForNavigation(page: Page, pathname: string, timeout: number = 10000): Promise<void> {
  await page.waitForURL(url => url.pathname === pathname, { timeout });
}

/**
 * Navigate through breadcrumbs
 */
export async function navigateToBreadcrumb(page: Page, breadcrumbText: string): Promise<void> {
  await page.click(`[data-testid="breadcrumbs"] >> text="${breadcrumbText}"`);
  await page.waitForLoadState('networkidle');
}

/**
 * Open page in new tab
 */
export async function openInNewTab(page: Page, url: string): Promise<Page> {
  const context = page.context();
  const newPage = await context.newPage();
  await newPage.goto(url);
  await newPage.waitForLoadState('networkidle');
  return newPage;
}

/**
 * Check if navigation menu is visible
 */
export async function isNavigationVisible(page: Page): Promise<boolean> {
  try {
    await page.waitForSelector('nav', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Toggle mobile navigation menu
 */
export async function toggleMobileMenu(page: Page): Promise<void> {
  await page.click('[data-testid="mobile-menu-button"]');
  await page.waitForSelector('[data-testid="mobile-menu"]', { state: 'visible' });
}
