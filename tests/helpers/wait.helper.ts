/**
 * Wait Test Helper
 *
 * Provides reusable wait functions for tests
 */

import { Page, Locator } from '@playwright/test';

/**
 * Wait for element to be visible
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<Locator> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  return element;
}

/**
 * Wait for element to be hidden
 */
export async function waitForElementToHide(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<void> {
  await page.locator(selector).waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for text to appear
 */
export async function waitForText(
  page: Page,
  text: string,
  timeout: number = 5000
): Promise<Locator> {
  const element = page.locator(`text=${text}`);
  await element.waitFor({ state: 'visible', timeout });
  return element;
}

/**
 * Wait for loading spinner to disappear
 */
export async function waitForLoadingToFinish(page: Page, timeout: number = 10000): Promise<void> {
  try {
    // Wait for loading spinner to appear (optional)
    await page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'visible',
      timeout: 1000,
    }).catch(() => {});

    // Wait for loading spinner to disappear
    await page.waitForSelector('[data-testid="loading-spinner"]', {
      state: 'hidden',
      timeout,
    }).catch(() => {});
  } catch {
    // If no loading spinner, wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout });
  }
}

/**
 * Wait for toast/notification to appear
 */
export async function waitForToast(
  page: Page,
  message?: string,
  timeout: number = 5000
): Promise<Locator> {
  const selector = message
    ? `[data-testid="toast"]:has-text("${message}")`
    : '[data-testid="toast"]';

  const toast = page.locator(selector);
  await toast.waitFor({ state: 'visible', timeout });
  return toast;
}

/**
 * Wait for toast to disappear
 */
export async function waitForToastToHide(page: Page, timeout: number = 5000): Promise<void> {
  await page.locator('[data-testid="toast"]').waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for modal to appear
 */
export async function waitForModal(page: Page, timeout: number = 5000): Promise<Locator> {
  const modal = page.locator('[role="dialog"], [data-testid="modal"]');
  await modal.waitFor({ state: 'visible', timeout });
  return modal;
}

/**
 * Wait for modal to close
 */
export async function waitForModalToClose(page: Page, timeout: number = 5000): Promise<void> {
  await page.locator('[role="dialog"], [data-testid="modal"]').waitFor({
    state: 'hidden',
    timeout,
  });
}

/**
 * Wait for API response
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      return typeof urlPattern === 'string'
        ? url.includes(urlPattern)
        : urlPattern.test(url);
    },
    { timeout }
  );

  return await response.json();
}

/**
 * Wait for successful API response
 */
export async function waitForSuccessfulApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 10000
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      const matchesUrl = typeof urlPattern === 'string'
        ? url.includes(urlPattern)
        : urlPattern.test(url);
      return matchesUrl && response.ok();
    },
    { timeout }
  );

  return await response.json();
}

/**
 * Wait for element count
 */
export async function waitForElementCount(
  page: Page,
  selector: string,
  count: number,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ selector, count }) => {
      return document.querySelectorAll(selector).length === count;
    },
    { selector, count },
    { timeout }
  );
}

/**
 * Wait for element count to be at least
 */
export async function waitForMinElementCount(
  page: Page,
  selector: string,
  minCount: number,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ selector, minCount }) => {
      return document.querySelectorAll(selector).length >= minCount;
    },
    { selector, minCount },
    { timeout }
  );
}

/**
 * Wait for condition
 */
export async function waitForCondition(
  page: Page,
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(condition, { timeout });
}

/**
 * Wait for URL to match
 */
export async function waitForUrl(
  page: Page,
  url: string | RegExp,
  timeout: number = 5000
): Promise<void> {
  await page.waitForURL(url, { timeout });
}

/**
 * Wait for navigation to complete
 */
export async function waitForNavigation(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for element to be enabled
 */
export async function waitForElementToBeEnabled(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector) as HTMLButtonElement | HTMLInputElement;
      return element && !element.disabled;
    },
    selector,
    { timeout }
  );
}

/**
 * Wait for element to be disabled
 */
export async function waitForElementToBeDisabled(
  page: Page,
  selector: string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector) as HTMLButtonElement | HTMLInputElement;
      return element && element.disabled;
    },
    selector,
    { timeout }
  );
}

/**
 * Wait for element to have text
 */
export async function waitForElementText(
  page: Page,
  selector: string,
  text: string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ selector, text }) => {
      const element = document.querySelector(selector);
      return element && element.textContent?.includes(text);
    },
    { selector, text },
    { timeout }
  );
}

/**
 * Wait for element to have attribute
 */
export async function waitForAttribute(
  page: Page,
  selector: string,
  attribute: string,
  value: string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ selector, attribute, value }) => {
      const element = document.querySelector(selector);
      return element && element.getAttribute(attribute) === value;
    },
    { selector, attribute, value },
    { timeout }
  );
}

/**
 * Wait for element to have class
 */
export async function waitForClass(
  page: Page,
  selector: string,
  className: string,
  timeout: number = 5000
): Promise<void> {
  await page.waitForFunction(
    ({ selector, className }) => {
      const element = document.querySelector(selector);
      return element && element.classList.contains(className);
    },
    { selector, className },
    { timeout }
  );
}

/**
 * Wait with custom timeout
 */
export async function wait(milliseconds: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Wait for animation to complete
 */
export async function waitForAnimation(page: Page, selector: string, timeout: number = 1000): Promise<void> {
  await page.waitForFunction(
    (selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;

      const animations = element.getAnimations();
      return animations.length === 0 || animations.every(anim => anim.playState === 'finished');
    },
    selector,
    { timeout }
  );
}

/**
 * Wait for document to be ready
 */
export async function waitForDocumentReady(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForFunction(
    () => document.readyState === 'complete',
    { timeout }
  );
}

/**
 * Retry function until it succeeds or timeout
 */
export async function retryUntilSuccess<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await wait(delayMs);
      }
    }
  }

  throw lastError || new Error('Retry failed');
}
