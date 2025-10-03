/**
 * Signup Page Object Model
 *
 * Encapsulates signup page elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly zipCodeInput: Locator;
  readonly termsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;
  readonly googleSignupButton: Locator;
  readonly showPasswordButton: Locator;
  readonly ageVerificationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.dateOfBirthInput = page.locator('input[name="dateOfBirth"]');
    this.zipCodeInput = page.locator('input[name="zipCode"]');
    this.termsCheckbox = page.locator('input[name="acceptTerms"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.loginLink = page.locator('a[href="/login"]');
    this.googleSignupButton = page.locator('button:has-text("Continue with Google")');
    this.showPasswordButton = page.locator('button[aria-label="Show password"]');
    this.ageVerificationMessage = page.locator('[data-testid="age-verification-message"]');
  }

  /**
   * Navigate to signup page
   */
  async goto(): Promise<void> {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill signup form
   */
  async fillSignupForm(data: {
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    zipCode: string;
  }): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword);
    await this.dateOfBirthInput.fill(data.dateOfBirth);
    await this.zipCodeInput.fill(data.zipCode);
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms(): Promise<void> {
    await this.termsCheckbox.check();
  }

  /**
   * Submit signup form
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Complete signup flow
   */
  async signup(data: {
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    zipCode: string;
  }): Promise<void> {
    await this.fillSignupForm(data);
    await this.acceptTerms();
    await this.submit();
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.showPasswordButton.click();
  }

  /**
   * Click login link
   */
  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  /**
   * Click Google signup button
   */
  async clickGoogleSignup(): Promise<void> {
    await this.googleSignupButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Get field-specific error
   */
  async getFieldError(fieldName: string): Promise<string | null> {
    const errorLocator = this.page.locator(`[data-testid="${fieldName}-error"]`);
    try {
      await errorLocator.waitFor({ state: 'visible', timeout: 2000 });
      return await errorLocator.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  /**
   * Check if age verification message is shown
   */
  async hasAgeVerificationMessage(): Promise<boolean> {
    try {
      await this.ageVerificationMessage.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get age verification message text
   */
  async getAgeVerificationMessage(): Promise<string | null> {
    try {
      return await this.ageVerificationMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if passwords match
   */
  async doPasswordsMatch(): Promise<boolean> {
    const password = await this.passwordInput.inputValue();
    const confirmPassword = await this.confirmPasswordInput.inputValue();
    return password === confirmPassword && password.length > 0;
  }

  /**
   * Check if form is valid
   */
  async isFormValid(): Promise<boolean> {
    const email = await this.emailInput.inputValue();
    const password = await this.passwordInput.inputValue();
    const confirmPassword = await this.confirmPasswordInput.inputValue();
    const dob = await this.dateOfBirthInput.inputValue();
    const zipCode = await this.zipCodeInput.inputValue();
    const termsAccepted = await this.termsCheckbox.isChecked();
    const isDisabled = await this.isSubmitDisabled();

    return (
      email.length > 0 &&
      password.length > 0 &&
      confirmPassword === password &&
      dob.length > 0 &&
      zipCode.length > 0 &&
      termsAccepted &&
      !isDisabled
    );
  }

  /**
   * Clear signup form
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
    await this.dateOfBirthInput.clear();
    await this.zipCodeInput.clear();
    if (await this.termsCheckbox.isChecked()) {
      await this.termsCheckbox.uncheck();
    }
  }

  /**
   * Get all form values
   */
  async getFormValues(): Promise<{
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    zipCode: string;
    termsAccepted: boolean;
  }> {
    return {
      email: await this.emailInput.inputValue(),
      password: await this.passwordInput.inputValue(),
      confirmPassword: await this.confirmPasswordInput.inputValue(),
      dateOfBirth: await this.dateOfBirthInput.inputValue(),
      zipCode: await this.zipCodeInput.inputValue(),
      termsAccepted: await this.termsCheckbox.isChecked(),
    };
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.submitButton.waitFor({ state: 'visible' });
  }

  /**
   * Check if on signup page
   */
  async isOnSignupPage(): Promise<boolean> {
    return this.page.url().includes('/signup');
  }
}
