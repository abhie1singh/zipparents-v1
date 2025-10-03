import { Page, expect } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  zipCode: string;
}

export const TEST_USERS = {
  verified: {
    email: 'verified.parent@test.com',
    password: 'Test123!',
    displayName: 'Sarah Johnson',
    dateOfBirth: '1990-05-15',
    zipCode: '10001',
  },
  unverified: {
    email: 'unverified.parent@test.com',
    password: 'Test123!',
    displayName: 'Mike Chen',
    dateOfBirth: '1988-03-22',
    zipCode: '10001',
  },
  admin: {
    email: 'admin.test@test.com',
    password: 'Test123!',
    displayName: 'Admin User',
    dateOfBirth: '1985-01-01',
    zipCode: '10001',
  },
  new: {
    email: `test-${Date.now()}@test.com`,
    password: 'Test123!',
    displayName: 'Test User',
    dateOfBirth: '1990-01-01',
    zipCode: '10001',
  },
};

export async function signUp(page: Page, user: TestUser) {
  await page.goto('/signup');

  // Fill in signup form
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="displayName"]', user.displayName);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  await page.fill('input[type="date"]', user.dateOfBirth);
  await page.fill('input[name="zipCode"]', user.zipCode);

  // Accept terms
  await page.check('input[name="acceptedTerms"]');
  await page.check('input[name="acceptedPrivacy"]');

  // Submit form
  await page.click('button[type="submit"]');
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await page.click('button[type="submit"]');
}

export async function logout(page: Page) {
  await page.click('button:has-text("Log Out")');
}

export async function expectToBeLoggedIn(page: Page) {
  // Should see logout button
  await expect(page.locator('button:has-text("Log Out")')).toBeVisible();
}

export async function expectToBeLoggedOut(page: Page) {
  // Should see login/signup buttons
  await expect(page.locator('text=Log In')).toBeVisible();
  await expect(page.locator('text=Sign Up')).toBeVisible();
}

export async function expectEmailVerificationBanner(page: Page) {
  await expect(page.locator('text=Email verification required')).toBeVisible();
}

export async function waitForToast(page: Page, message: string) {
  await expect(page.locator(`text=${message}`)).toBeVisible();
}

export async function expectValidationError(page: Page, error: string) {
  await expect(page.locator(`text=${error}`)).toBeVisible();
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function getDateYearsAgo(years: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}
