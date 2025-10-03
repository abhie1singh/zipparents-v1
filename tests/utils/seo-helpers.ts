import { Page } from '@playwright/test';

export async function validateMetaTags(page: Page) {
  const title = await page.title();
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');

  return {
    hasTitle: !!title && title.length > 0,
    hasDescription: !!description && description.length > 50,
    hasOgTitle: !!ogTitle,
    hasOgDescription: !!ogDescription,
    title,
    description,
  };
}

export async function validateStructuredData(page: Page) {
  const scripts = await page.locator('script[type="application/ld+json"]').all();
  const schemas = [];

  for (const script of scripts) {
    const content = await script.textContent();
    if (content) {
      try {
        const data = JSON.parse(content);
        schemas.push(data);
      } catch (e) {
        // Invalid JSON
      }
    }
  }

  return {
    count: schemas.length,
    schemas,
    isValid: schemas.every(s => s['@context'] && s['@type']),
  };
}

export async function checkPerformance(page: Page) {
  const metrics = await page.evaluate(() => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return {
      loadTime: perfData.loadEventEnd - perfData.fetchStart,
      domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
      firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    };
  });

  return metrics;
}
