import { test, expect } from '@playwright/test';

test.describe('Sprint 6: SEO & Public Pages', () => {
  test('homepage has proper meta tags', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Check title
    await expect(page).toHaveTitle(/ZipParents/);

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');

    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();

    // Check Twitter Card tags
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    const twitterTitle = await page.locator('meta[name="twitter:title"]').getAttribute('content');

    expect(twitterCard).toBeTruthy();
    expect(twitterTitle).toBeTruthy();
  });

  test('sitemap.xml is accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/sitemap.xml');
    expect(response?.status()).toBe(200);

    const bodyText = await response!.text();
    expect(bodyText).toContain('<?xml');
    expect(bodyText).toContain('urlset');
    expect(bodyText).toContain('<loc>');
  });

  test('robots.txt is accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/robots.txt');
    expect(response?.status()).toBe(200);

    const bodyText = await page.evaluate(() => document.body.textContent);
    expect(bodyText).toContain('User-Agent');
    expect(bodyText).toContain('Sitemap');
  });

  test('all public pages are accessible', async ({ page }) => {
    const pages = [
      '/how-it-works',
      '/safety-trust',
      '/for-parents',
      '/faq',
      '/blog',
    ];

    for (const url of pages) {
      const response = await page.goto(`http://localhost:3000${url}`);
      expect(response?.status()).toBe(200);

      // Verify page has a title (from root layout or page-specific)
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('FAQ page loads with questions', async ({ page }) => {
    await page.goto('http://localhost:3000/faq');

    // Verify FAQ heading (use more specific selector to avoid header h1)
    await expect(page.locator('main h1, h1').filter({ hasText: 'Frequently Asked Questions' })).toBeVisible();

    // Verify FAQ questions are present
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('structured data exists on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Check for JSON-LD structured data
    const scripts = await page.locator('script[type="application/ld+json"]').count();
    expect(scripts).toBeGreaterThan(0);

    // Validate JSON-LD content
    const scriptContent = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(scriptContent).toBeTruthy();

    const jsonData = JSON.parse(scriptContent!);
    expect(jsonData['@context']).toBe('https://schema.org');
    expect(jsonData['@type']).toBeTruthy();
  });

  test('canonical URLs are set correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('http');
  });
});
