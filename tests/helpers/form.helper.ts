/**
 * Form Test Helper
 *
 * Provides reusable form interaction functions for tests
 */

import { Page, Locator } from '@playwright/test';

/**
 * Fill text input
 */
export async function fillInput(page: Page, name: string, value: string): Promise<void> {
  await page.fill(`input[name="${name}"]`, value);
}

/**
 * Fill textarea
 */
export async function fillTextarea(page: Page, name: string, value: string): Promise<void> {
  await page.fill(`textarea[name="${name}"]`, value);
}

/**
 * Select option from dropdown
 */
export async function selectOption(page: Page, name: string, value: string): Promise<void> {
  await page.selectOption(`select[name="${name}"]`, value);
}

/**
 * Check checkbox
 */
export async function checkCheckbox(page: Page, name: string): Promise<void> {
  await page.check(`input[name="${name}"][type="checkbox"]`);
}

/**
 * Uncheck checkbox
 */
export async function uncheckCheckbox(page: Page, name: string): Promise<void> {
  await page.uncheck(`input[name="${name}"][type="checkbox"]`);
}

/**
 * Select radio button
 */
export async function selectRadio(page: Page, name: string, value: string): Promise<void> {
  await page.check(`input[name="${name}"][value="${value}"]`);
}

/**
 * Click submit button
 */
export async function submitForm(page: Page, formSelector?: string): Promise<void> {
  const selector = formSelector
    ? `${formSelector} button[type="submit"]`
    : 'button[type="submit"]';

  await page.click(selector);
}

/**
 * Fill entire form from object
 */
export async function fillForm(
  page: Page,
  formData: Record<string, string | boolean | string[]>
): Promise<void> {
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'boolean') {
      if (value) {
        await checkCheckbox(page, key);
      } else {
        await uncheckCheckbox(page, key);
      }
    } else if (Array.isArray(value)) {
      // Handle multi-select or checkbox groups
      for (const item of value) {
        await page.check(`input[name="${key}"][value="${item}"]`);
      }
    } else {
      // Check if it's a textarea
      const isTextarea = await page.locator(`textarea[name="${key}"]`).count() > 0;
      if (isTextarea) {
        await fillTextarea(page, key, value);
      } else {
        await fillInput(page, key, value);
      }
    }
  }
}

/**
 * Clear form field
 */
export async function clearField(page: Page, name: string): Promise<void> {
  await page.fill(`input[name="${name}"], textarea[name="${name}"]`, '');
}

/**
 * Get form field value
 */
export async function getFieldValue(page: Page, name: string): Promise<string> {
  const value = await page.inputValue(`input[name="${name}"], textarea[name="${name}"]`);
  return value;
}

/**
 * Check if field has error
 */
export async function hasFieldError(page: Page, name: string): Promise<boolean> {
  try {
    await page.waitForSelector(
      `input[name="${name}"][aria-invalid="true"], textarea[name="${name}"][aria-invalid="true"]`,
      { timeout: 1000 }
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get field error message
 */
export async function getFieldError(page: Page, name: string): Promise<string | null> {
  try {
    const errorId = await page.getAttribute(`input[name="${name}"], textarea[name="${name}"]`, 'aria-describedby');
    if (errorId) {
      return await page.textContent(`#${errorId}`);
    }

    // Fallback: look for error message near the field
    const errorLocator = page.locator(`[data-testid="${name}-error"]`);
    if (await errorLocator.count() > 0) {
      return await errorLocator.textContent();
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Wait for form submission
 */
export async function waitForFormSubmission(page: Page, timeout: number = 5000): Promise<void> {
  await page.waitForResponse(
    response => response.request().method() === 'POST',
    { timeout }
  ).catch(() => {
    // Fallback: wait for URL change or loading state
    return page.waitForLoadState('networkidle', { timeout });
  });
}

/**
 * Upload file
 */
export async function uploadFile(page: Page, inputName: string, filePath: string): Promise<void> {
  await page.setInputFiles(`input[name="${inputName}"][type="file"]`, filePath);
}

/**
 * Upload multiple files
 */
export async function uploadFiles(page: Page, inputName: string, filePaths: string[]): Promise<void> {
  await page.setInputFiles(`input[name="${inputName}"][type="file"]`, filePaths);
}

/**
 * Clear file upload
 */
export async function clearFileUpload(page: Page, inputName: string): Promise<void> {
  await page.setInputFiles(`input[name="${inputName}"][type="file"]`, []);
}

/**
 * Fill date input
 */
export async function fillDate(page: Page, name: string, date: string): Promise<void> {
  await page.fill(`input[name="${name}"][type="date"]`, date);
}

/**
 * Fill time input
 */
export async function fillTime(page: Page, name: string, time: string): Promise<void> {
  await page.fill(`input[name="${name}"][type="time"]`, time);
}

/**
 * Select multiple options
 */
export async function selectMultipleOptions(page: Page, name: string, values: string[]): Promise<void> {
  for (const value of values) {
    await page.check(`input[name="${name}"][value="${value}"]`);
  }
}

/**
 * Check if form is valid
 */
export async function isFormValid(page: Page, formSelector?: string): Promise<boolean> {
  const selector = formSelector || 'form';

  try {
    const hasInvalidFields = await page.locator(`${selector} [aria-invalid="true"]`).count();
    const submitButton = page.locator(`${selector} button[type="submit"]`);
    const isDisabled = await submitButton.isDisabled();

    return hasInvalidFields === 0 && !isDisabled;
  } catch {
    return false;
  }
}

/**
 * Get all form data as object
 */
export async function getFormData(page: Page, formSelector: string = 'form'): Promise<Record<string, any>> {
  return await page.evaluate((selector) => {
    const form = document.querySelector(selector) as HTMLFormElement;
    if (!form) return {};

    const formData = new FormData(form);
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  }, formSelector);
}

/**
 * Reset form
 */
export async function resetForm(page: Page, formSelector: string = 'form'): Promise<void> {
  await page.evaluate((selector) => {
    const form = document.querySelector(selector) as HTMLFormElement;
    if (form) {
      form.reset();
    }
  }, formSelector);
}

/**
 * Check if submit button is disabled
 */
export async function isSubmitDisabled(page: Page, formSelector?: string): Promise<boolean> {
  const selector = formSelector
    ? `${formSelector} button[type="submit"]`
    : 'button[type="submit"]';

  return await page.locator(selector).isDisabled();
}

/**
 * Wait for field validation
 */
export async function waitForFieldValidation(page: Page, name: string, timeout: number = 3000): Promise<void> {
  await page.waitForFunction(
    (fieldName) => {
      const field = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
      return field?.hasAttribute('aria-invalid');
    },
    name,
    { timeout }
  );
}
