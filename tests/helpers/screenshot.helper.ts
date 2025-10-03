/**
 * Screenshot Test Helper
 *
 * Provides screenshot and visual testing utilities
 */

import { Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Take screenshot on test failure
 */
export async function screenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotPath = testInfo.outputPath(`failure-${Date.now()}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
  }
}

/**
 * Take full page screenshot
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  const screenshotPath = testInfo
    ? testInfo.outputPath(`${name}.png`)
    : path.join(process.cwd(), 'test-results', `${name}.png`);

  // Ensure directory exists
  const dir = path.dirname(screenshotPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (testInfo) {
    await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
  }

  return screenshotPath;
}

/**
 * Take element screenshot
 */
export async function takeElementScreenshot(
  page: Page,
  selector: string,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  const screenshotPath = testInfo
    ? testInfo.outputPath(`${name}.png`)
    : path.join(process.cwd(), 'test-results', `${name}.png`);

  const element = page.locator(selector);
  await element.screenshot({ path: screenshotPath });

  if (testInfo) {
    await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
  }

  return screenshotPath;
}

/**
 * Compare screenshot with baseline
 */
export async function compareScreenshot(
  page: Page,
  name: string,
  options?: {
    fullPage?: boolean;
    maxDiffPixels?: number;
    threshold?: number;
  }
): Promise<void> {
  await page.screenshot({
    ...options,
  });
}

/**
 * Take screenshot of specific area
 */
export async function takeAreaScreenshot(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  const screenshotPath = testInfo
    ? testInfo.outputPath(`${name}.png`)
    : path.join(process.cwd(), 'test-results', `${name}.png`);

  await page.screenshot({ path: screenshotPath, clip });

  if (testInfo) {
    await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
  }

  return screenshotPath;
}

/**
 * Take screenshot before and after action
 */
export async function takeBeforeAfterScreenshots(
  page: Page,
  action: () => Promise<void>,
  name: string,
  testInfo?: TestInfo
): Promise<{ before: string; after: string }> {
  const beforePath = await takeFullPageScreenshot(page, `${name}-before`, testInfo);

  await action();

  const afterPath = await takeFullPageScreenshot(page, `${name}-after`, testInfo);

  return { before: beforePath, after: afterPath };
}

/**
 * Take screenshot of mobile viewport
 */
export async function takeMobileScreenshot(
  page: Page,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  const screenshotPath = await takeFullPageScreenshot(page, `${name}-mobile`, testInfo);

  // Reset to default viewport
  await page.setViewportSize({ width: 1280, height: 720 });

  return screenshotPath;
}

/**
 * Take screenshot of desktop viewport
 */
export async function takeDesktopScreenshot(
  page: Page,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });

  const screenshotPath = await takeFullPageScreenshot(page, `${name}-desktop`, testInfo);

  return screenshotPath;
}

/**
 * Take screenshots at multiple breakpoints
 */
export async function takeResponsiveScreenshots(
  page: Page,
  name: string,
  testInfo?: TestInfo
): Promise<Record<string, string>> {
  const breakpoints = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  };

  const screenshots: Record<string, string> = {};

  for (const [breakpoint, size] of Object.entries(breakpoints)) {
    await page.setViewportSize(size);
    screenshots[breakpoint] = await takeFullPageScreenshot(
      page,
      `${name}-${breakpoint}`,
      testInfo
    );
  }

  return screenshots;
}

/**
 * Take screenshot with annotations
 */
export async function takeAnnotatedScreenshot(
  page: Page,
  annotations: Array<{ x: number; y: number; text: string }>,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  // Draw annotations on page
  await page.evaluate((annotations) => {
    annotations.forEach(({ x, y, text }) => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      div.style.background = 'rgba(255, 0, 0, 0.7)';
      div.style.color = 'white';
      div.style.padding = '4px 8px';
      div.style.borderRadius = '4px';
      div.style.fontSize = '12px';
      div.style.zIndex = '10000';
      div.textContent = text;
      document.body.appendChild(div);
    });
  }, annotations);

  const screenshotPath = await takeFullPageScreenshot(page, name, testInfo);

  // Remove annotations
  await page.evaluate(() => {
    document.querySelectorAll('div[style*="position: absolute"][style*="background: rgba(255, 0, 0, 0.7)"]')
      .forEach(el => el.remove());
  });

  return screenshotPath;
}

/**
 * Capture page video (if enabled)
 */
export async function attachVideo(page: Page, testInfo: TestInfo): Promise<void> {
  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    await testInfo.attach('video', { path: videoPath, contentType: 'video/webm' });
  }
}

/**
 * Take screenshot with highlight
 */
export async function takeHighlightedScreenshot(
  page: Page,
  selector: string,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  // Highlight element
  await page.evaluate((selector) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.style.outline = '3px solid red';
      element.style.outlineOffset = '2px';
    }
  }, selector);

  const screenshotPath = await takeFullPageScreenshot(page, name, testInfo);

  // Remove highlight
  await page.evaluate((selector) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }
  }, selector);

  return screenshotPath;
}

/**
 * Screenshot helper for error states
 */
export async function screenshotError(
  page: Page,
  errorMessage: string,
  testInfo: TestInfo
): Promise<void> {
  const screenshotPath = testInfo.outputPath(`error-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(`Error: ${errorMessage}`, {
    path: screenshotPath,
    contentType: 'image/png',
  });
}

/**
 * Save page HTML for debugging
 */
export async function savePageHTML(
  page: Page,
  name: string,
  testInfo?: TestInfo
): Promise<string> {
  const html = await page.content();
  const htmlPath = testInfo
    ? testInfo.outputPath(`${name}.html`)
    : path.join(process.cwd(), 'test-results', `${name}.html`);

  const dir = path.dirname(htmlPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(htmlPath, html);

  if (testInfo) {
    await testInfo.attach(name, { path: htmlPath, contentType: 'text/html' });
  }

  return htmlPath;
}
