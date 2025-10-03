/**
 * Email Utility Functions
 *
 * Provides email generation and validation utilities for tests
 */

/**
 * Test email domains
 */
export const TEST_EMAIL_DOMAINS = [
  'test.com',
  'example.com',
  'testmail.com',
  'demo.com',
  'playwright.test',
];

/**
 * Generate unique test email
 */
export function generateTestEmail(prefix: string = 'user', domain: string = 'test.com'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}@${domain}`;
}

/**
 * Generate unique test email with custom format
 */
export function generateUniqueEmail(baseName?: string): string {
  const name = baseName || `testuser`;
  const timestamp = Date.now();
  return `${name}-${timestamp}@test.com`;
}

/**
 * Generate email from name
 */
export function generateEmailFromName(firstName: string, lastName: string, domain: string = 'test.com'): string {
  const first = firstName.toLowerCase().replace(/\s+/g, '');
  const last = lastName.toLowerCase().replace(/\s+/g, '');
  const random = Math.floor(Math.random() * 100);
  return `${first}.${last}${random}@${domain}`;
}

/**
 * Valid email formats for testing
 */
export const VALID_EMAIL_FORMATS = [
  'user@example.com',
  'user.name@example.com',
  'user+tag@example.com',
  'user_name@example.com',
  'user123@example.com',
  'first.last@example.co.uk',
  'user@subdomain.example.com',
];

/**
 * Invalid email formats for negative testing
 */
export const INVALID_EMAIL_FORMATS = [
  '',                          // Empty
  'notanemail',               // No @
  '@example.com',             // No username
  'user@',                    // No domain
  'user @example.com',        // Space in username
  'user@example',             // No TLD
  'user@@example.com',        // Double @
  'user@.com',                // No domain name
  'user@example..com',        // Double dot
  'user name@example.com',    // Space in username
  'user@exam ple.com',        // Space in domain
  '<script>@example.com',     // Injection attempt
  'user@example.com.',        // Trailing dot
  '.user@example.com',        // Leading dot
];

/**
 * Get random valid email
 */
export function getRandomValidEmail(): string {
  const username = `user${Math.floor(Math.random() * 10000)}`;
  const domain = TEST_EMAIL_DOMAINS[Math.floor(Math.random() * TEST_EMAIL_DOMAINS.length)];
  return `${username}@${domain}`;
}

/**
 * Get random invalid email
 */
export function getRandomInvalidEmail(): string {
  return INVALID_EMAIL_FORMATS[Math.floor(Math.random() * INVALID_EMAIL_FORMATS.length)];
}

/**
 * Validate email format (basic)
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email format (strict)
 */
export function isValidEmailStrict(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Extract username from email
 */
export function getEmailUsername(email: string): string {
  return email.split('@')[0];
}

/**
 * Extract domain from email
 */
export function getEmailDomain(email: string): string {
  return email.split('@')[1];
}

/**
 * Generate email with plus addressing (for testing email verification)
 */
export function generatePlusAddressedEmail(baseEmail: string, tag: string): string {
  const [username, domain] = baseEmail.split('@');
  return `${username}+${tag}@${domain}`;
}

/**
 * Generate multiple test emails
 */
export function generateTestEmails(count: number, prefix: string = 'user'): string[] {
  const emails: string[] = [];
  for (let i = 0; i < count; i++) {
    emails.push(generateTestEmail(`${prefix}${i}`));
  }
  return emails;
}

/**
 * Generate email for specific test scenario
 */
export function generateScenarioEmail(scenario: string): string {
  const timestamp = Date.now();
  return `${scenario}-${timestamp}@test.com`;
}

/**
 * Email test data with purposes
 */
export const EMAIL_TEST_DATA = {
  verified: 'verified.user@test.com',
  unverified: 'unverified.user@test.com',
  admin: 'admin.test@test.com',
  suspended: 'suspended.user@test.com',
  banned: 'banned.user@test.com',
  newUser: () => generateTestEmail('newuser'),
  tempUser: () => generateTestEmail('temp'),
};

/**
 * Generate disposable email (for testing email verification flow)
 */
export function generateDisposableEmail(): string {
  const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com'];
  const username = `temp${Date.now()}`;
  const domain = disposableDomains[Math.floor(Math.random() * disposableDomains.length)];
  return `${username}@${domain}`;
}

/**
 * Check if email is from test domain
 */
export function isTestEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  return TEST_EMAIL_DOMAINS.includes(domain);
}

/**
 * Normalize email (lowercase, trim)
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Obfuscate email for display (user***@example.com)
 */
export function obfuscateEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 3) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.substring(0, 3)}***@${domain}`;
}

/**
 * Generate email with specific pattern for testing
 */
export function generatePatternEmail(pattern: 'simple' | 'complex' | 'subdomain'): string {
  const timestamp = Date.now();

  switch (pattern) {
    case 'simple':
      return `user${timestamp}@test.com`;
    case 'complex':
      return `user.name+tag${timestamp}@subdomain.test.com`;
    case 'subdomain':
      return `user${timestamp}@mail.test.com`;
    default:
      return `user${timestamp}@test.com`;
  }
}

/**
 * Email fixtures for common test scenarios
 */
export const EMAIL_FIXTURES = {
  // Valid scenarios
  standard: () => generateTestEmail('standard'),
  withDots: () => `user.name.${Date.now()}@test.com`,
  withPlus: () => `user+tag.${Date.now()}@test.com`,
  withNumbers: () => `user123.${Date.now()}@test.com`,
  withUnderscore: () => `user_name.${Date.now()}@test.com`,

  // Invalid scenarios
  noAtSign: 'userexample.com',
  noDomain: 'user@',
  noUsername: '@example.com',
  doubleAt: 'user@@example.com',
  withSpaces: 'user name@example.com',
  noTLD: 'user@example',
  multipleDots: 'user@example..com',
  startWithDot: '.user@example.com',
  endWithDot: 'user@example.com.',

  // Edge cases
  veryLongEmail: `${'a'.repeat(50)}@${'b'.repeat(50)}.com`,
  shortEmail: 'a@b.co',
  international: 'user@тест.com', // Cyrillic domain
};

/**
 * Bulk email generator for load testing
 */
export function generateBulkEmails(count: number): string[] {
  return Array.from({ length: count }, (_, i) => generateTestEmail(`bulk${i}`));
}

/**
 * Check if two emails are equivalent (ignoring dots in Gmail-style)
 */
export function areEmailsEquivalent(email1: string, email2: string): boolean {
  const normalize = (email: string) => {
    const [username, domain] = email.toLowerCase().split('@');
    // Remove dots from username (Gmail-style)
    const normalizedUsername = username.replace(/\./g, '');
    return `${normalizedUsername}@${domain}`;
  };

  return normalize(email1) === normalize(email2);
}
