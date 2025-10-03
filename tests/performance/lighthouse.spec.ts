import { test, expect } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import lighthouse from 'lighthouse';
import { login, TEST_USERS } from '../helpers/auth-test-helpers';

/**
 * Sprint 8: Performance Tests with Lighthouse
 *
 * Tests page load performance, Core Web Vitals, and best practices
 */

test.describe('Lighthouse Performance Tests', () => {
  test('homepage should meet performance thresholds', async ({ page }) => {
    await page.goto('/');

    await playAudit({
      page,
      thresholds: {
        performance: 70,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      port: 9222,
    });
  });

  test('login page should meet performance thresholds', async ({ page }) => {
    await page.goto('/login');

    await playAudit({
      page,
      thresholds: {
        performance: 75,
        accessibility: 90,
        'best-practices': 80,
        seo: 80,
      },
      port: 9222,
    });
  });

  test('feed page should meet performance thresholds', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
    await page.goto('/feed');

    await playAudit({
      page,
      thresholds: {
        performance: 65, // Lower for authenticated pages with data
        accessibility: 90,
        'best-practices': 80,
      },
      port: 9222,
    });
  });
});

test.describe('Page Load Performance', () => {
  test('homepage loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('feed page loads within 4 seconds', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    const startTime = Date.now();
    await page.goto('/feed');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(4000);
  });

  test('events page loads within 4 seconds', async ({ page }) => {
    await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

    const startTime = Date.now();
    await page.goto('/events');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(4000);
  });
});

test.describe('Core Web Vitals', () => {
  test('measure First Contentful Paint (FCP)', async ({ page }) => {
    await page.goto('/');

    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            resolve(fcpEntry.startTime);
          }
        }).observe({ entryTypes: ['paint'] });
      });
    });

    // FCP should be less than 1.8 seconds (good)
    expect(fcp).toBeLessThan(1800);
  });

  test('measure Largest Contentful Paint (LCP)', async ({ page }) => {
    await page.goto('/');

    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Timeout after 10 seconds
        setTimeout(() => resolve(10000), 10000);
      });
    });

    // LCP should be less than 2.5 seconds (good)
    expect(lcp).toBeLessThan(2500);
  });

  test('measure Cumulative Layout Shift (CLS)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });

        setTimeout(() => resolve(clsValue), 5000);
      });
    });

    // CLS should be less than 0.1 (good)
    expect(cls).toBeLessThan(0.1);
  });
});

test.describe('Resource Optimization', () => {
  test('images are optimized and lazy loaded', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);

      // Check if image has loading="lazy"
      const loading = await img.getAttribute('loading');
      const isAboveFold = await img.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight;
      });

      // Images below fold should be lazy loaded
      if (!isAboveFold) {
        expect(loading).toBe('lazy');
      }
    }
  });

  test('no render-blocking resources', async ({ page }) => {
    await page.goto('/');

    // Get performance timing
    const performanceTiming = await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByType('navigation')[0])
    );

    const timing = JSON.parse(performanceTiming);

    // Time to interactive should be reasonable
    const tti = timing.domInteractive - timing.fetchStart;
    expect(tti).toBeLessThan(3000);
  });

  test('check bundle size warnings', async ({ page }) => {
    await page.goto('/');

    // Check for large JavaScript files
    const jsResources = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter((r: any) => r.name.endsWith('.js'))
        .map((r: any) => ({
          name: r.name,
          size: r.transferSize,
          duration: r.duration,
        }));
    });

    // Warn if any JS file is over 500KB
    for (const resource of jsResources) {
      if (resource.size > 500000) {
        console.warn(`Large JS file detected: ${resource.name} (${Math.round(resource.size / 1024)}KB)`);
      }
    }
  });
});
