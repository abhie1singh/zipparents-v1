# ZipParents Testing Guide

## Overview

Comprehensive testing strategy for ZipParents covering unit tests, integration tests, E2E tests, security tests, and accessibility tests.

## Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [E2E Tests](#e2e-tests)
6. [Security Tests](#security-tests)
7. [Accessibility Tests](#accessibility-tests)
8. [Performance Tests](#performance-tests)
9. [Writing Tests](#writing-tests)
10. [CI/CD Integration](#cicd-integration)

## Test Structure

```
tests/
├── unit/                    # Unit tests
├── integration/             # Integration tests
├── e2e/                     # End-to-end tests
│   ├── sprint1/            # Sprint-specific tests
│   ├── sprint2/
│   ├── ...
│   ├── sprint7/
│   └── critical-flows/     # Critical user journeys
├── security/               # Security tests
│   ├── auth-security.spec.ts
│   └── firestore-rules.spec.ts
├── accessibility/          # Accessibility tests
│   └── axe-core.spec.ts
├── performance/            # Performance tests
│   └── lighthouse.spec.ts
└── helpers/                # Test utilities
    └── auth-test-helpers.ts
```

## Running Tests

### All Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Specific Test Suites

```bash
# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# E2E tests for specific sprint
npm run test:e2e tests/e2e/sprint7

# Security tests
npm run test:security

# Accessibility tests
npm run test:a11y

# Performance tests
npm run test:performance
```

### Test Options

```bash
# Run specific test file
npm test -- tests/e2e/sprint7/admin-access.spec.ts

# Run tests matching pattern
npm test -- --grep "authentication"

# Run tests in headed mode (see browser)
npm run test:e2e -- --headed

# Run tests in specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# Debug mode
npm run test:e2e -- --debug

# Generate HTML report
npm run test:e2e -- --reporter=html
```

## Unit Tests

### What to Test

- Individual functions and utilities
- React component logic
- State management
- Form validation
- Data transformations

### Example

```typescript
import { validateEmail } from '@/lib/utils/validation';

describe('Email Validation', () => {
  test('validates correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('rejects invalid email', () => {
    expect(validateEmail('notanemail')).toBe(false);
  });
});
```

### Best Practices

- Test one thing per test
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Aim for 80%+ coverage on critical paths

## Integration Tests

### What to Test

- Component integration with context
- API route handlers
- Database queries
- Third-party integrations

### Example

```typescript
describe('User Profile API', () => {
  test('returns user profile data', async () => {
    const response = await fetch('/api/profile/123');
    const data = await response.json();

    expect(data).toHaveProperty('displayName');
    expect(data).toHaveProperty('bio');
  });
});
```

## E2E Tests

### Critical User Journeys

Located in `tests/e2e/critical-flows/`:

1. **Complete User Journey** (`complete-user-journey.spec.ts`)
   - Signup → Profile setup → Browse → Search → Connect → Event → Logout

2. **Messaging Flow** (`messaging-flow.spec.ts`)
   - Send message → Receive → Reply → Delete

### Sprint-Specific Tests

Each sprint has its own test suite:

- **Sprint 1**: User registration, age verification
- **Sprint 2**: Profile setup, interests
- **Sprint 3**: Community feed, posts
- **Sprint 4**: Event creation, RSVP
- **Sprint 5**: Event updates, cancellation
- **Sprint 6**: SEO, meta tags
- **Sprint 7**: Admin panel, moderation

### Running E2E Tests

```bash
# Development mode (with emulators)
TEST_ENV=local npm run test:e2e

# Against deployed environment
TEST_URL=https://zipparents-dev.vercel.app npm run test:e2e

# Specific flow
npm run test:e2e tests/e2e/critical-flows/complete-user-journey.spec.ts
```

### E2E Best Practices

- Use data-testid attributes for stable selectors
- Wait for elements explicitly
- Clean up test data after tests
- Use page objects for reusable interactions
- Test both success and error paths

## Security Tests

### Authentication Security

```bash
npm run test:security -- tests/security/auth-security.spec.ts
```

Tests:
- Unauthorized access prevention
- Rate limiting
- Password strength
- Session management
- Input validation
- XSS prevention

### Firestore Rules Testing

```bash
npm run test:security -- tests/security/firestore-rules.spec.ts
```

Tests:
- User document access control
- Post ownership validation
- Message privacy
- Admin-only collections
- Data validation rules

### Running Security Tests

```bash
# All security tests
npm run test:security

# With Firebase emulator
firebase emulators:exec --only firestore "npm run test:security"
```

## Accessibility Tests

### Automated A11y Tests

```bash
npm run test:a11y
```

Tests with axe-core:
- WCAG 2.1 AA compliance
- Color contrast
- Keyboard navigation
- Screen reader support
- Form labels
- ARIA attributes

### Manual Testing Checklist

- [ ] Keyboard navigation works on all pages
- [ ] Focus indicators are visible
- [ ] Screen reader announces all content
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Error messages are accessible
- [ ] Modals can be closed with Escape
- [ ] Skip links are present

### Tools

- axe DevTools browser extension
- Lighthouse accessibility audit
- WAVE browser extension
- Screen reader (NVDA, JAWS, VoiceOver)

## Performance Tests

### Lighthouse Tests

```bash
npm run test:performance
```

Metrics tested:
- Performance score (>70)
- First Contentful Paint (<1.8s)
- Largest Contentful Paint (<2.5s)
- Cumulative Layout Shift (<0.1)
- Time to Interactive (<3.8s)

### Load Testing

```bash
# Using k6
k6 run tests/performance/load-test.js
```

### Performance Budget

Monitor bundle sizes:

```bash
npm run analyze
```

Limits:
- Main bundle: <500KB
- Individual chunks: <100KB
- Images: Optimized and lazy-loaded

## Writing Tests

### Test File Naming

- Unit: `*.test.ts` or `*.test.tsx`
- E2E: `*.spec.ts`
- Location: Next to file being tested or in `tests/` directory

### Test Structure

```typescript
import { test, expect, describe } from '@playwright/test';

describe('Feature Name', () => {
  // Setup
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  // Cleanup
  test.afterEach(async ({ page }) => {
    // Cleanup
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('h1')).toHaveText('Expected');
  });
});
```

### Using Test Helpers

```typescript
import { login, TEST_USERS } from '../helpers/auth-test-helpers';

test('authenticated user can access profile', async ({ page }) => {
  await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);
  await page.goto('/profile');
  await expect(page).toHaveURL('/profile');
});
```

### Custom Matchers

```typescript
expect.extend({
  toHaveValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      pass,
      message: () => `Expected ${received} to be a valid email`,
    };
  },
});
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Every push to feature branches
- Pull requests to main
- Scheduled nightly runs

### Test Pipeline

1. **Linting** → 2. **Type Check** → 3. **Unit Tests** → 4. **Integration Tests** → 5. **E2E Tests** → 6. **Deploy**

### Required Checks

Before merging PR:
- ✓ All tests passing
- ✓ No linting errors
- ✓ Type check passes
- ✓ Coverage >70%
- ✓ E2E critical flows pass

## Test Data Management

### Seed Data

```bash
# Seed development data
npm run seed:dev

# Seed test data for specific sprint
npm run seed:sprint7
```

### Test Users

Defined in `tests/helpers/auth-test-helpers.ts`:

- `TEST_USERS.verified`: Verified parent
- `TEST_USERS.unverified`: Unverified parent
- `TEST_USERS.admin`: Admin user

### Cleanup

```bash
# Clean test database
npm run test:cleanup

# Reset emulator data
firebase emulators:exec --only firestore "npm run test:e2e"
```

## Debugging Tests

### Visual Debugging

```bash
# Open test in browser
npm run test:e2e -- --headed --debug

# Slow down execution
npm run test:e2e -- --headed --slow-mo=1000
```

### Screenshots and Videos

```bash
# Automatically captured on failure
# Located in: test-results/

# Force screenshot
await page.screenshot({ path: 'debug.png' });
```

### Trace Viewer

```bash
# Run with trace
npm run test:e2e -- --trace on

# View trace
npx playwright show-trace trace.zip
```

## Test Coverage

### Generate Coverage Report

```bash
npm run test:coverage
```

### Coverage Requirements

- Statements: >70%
- Branches: >70%
- Functions: >70%
- Lines: >70%

### Viewing Coverage

```bash
# Open HTML report
open coverage/index.html
```

## Continuous Improvement

### Regular Tasks

- Review and update test data quarterly
- Add tests for new features
- Remove obsolete tests
- Update dependencies monthly
- Review flaky tests weekly

### Metrics to Track

- Test execution time
- Flaky test rate
- Coverage percentage
- Number of tests per feature
- Time to fix failing tests

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
- [Firebase Testing Guide](https://firebase.google.com/docs/rules/unit-tests)
