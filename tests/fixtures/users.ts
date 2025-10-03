/**
 * User Test Fixtures
 *
 * Provides predefined user data for testing different scenarios
 */

export interface UserFixture {
  email: string;
  password: string;
  displayName?: string;
  dateOfBirth?: string;
  zipCode?: string;
  role?: 'user' | 'admin' | 'moderator';
  emailVerified?: boolean;
  ageVerified?: boolean;
  status?: 'active' | 'suspended' | 'banned';
}

/**
 * Standard test users available after seeding
 */
export const TEST_USERS = {
  // Verified active user
  verified: {
    email: 'verified.parent@test.com',
    password: 'Test123!',
    displayName: 'Verified Parent',
    zipCode: '10001',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },

  // Unverified user (email not verified)
  unverified: {
    email: 'unverified.parent@test.com',
    password: 'Test123!',
    displayName: 'Unverified Parent',
    zipCode: '10002',
    role: 'user' as const,
    emailVerified: false,
    ageVerified: true,
    status: 'active' as const,
  },

  // New user (recently joined)
  new: {
    email: 'new.parent@test.com',
    password: 'Test123!',
    displayName: 'New Parent',
    zipCode: '10003',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },

  // Admin user
  admin: {
    email: 'admin.test@test.com',
    password: 'Test123!',
    displayName: 'Admin User',
    zipCode: '10001',
    role: 'admin' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },

  // Suspended user
  suspended: {
    email: 'suspended.parent@test.com',
    password: 'Test123!',
    displayName: 'Suspended Parent',
    zipCode: '10004',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'suspended' as const,
  },

  // Banned user
  banned: {
    email: 'banned.parent@test.com',
    password: 'Test123!',
    displayName: 'Banned Parent',
    zipCode: '10005',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'banned' as const,
  },

  // Local community user
  local: {
    email: 'local.parent@test.com',
    password: 'Test123!',
    displayName: 'Local Parent',
    zipCode: '10001',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },

  // Young parent
  young: {
    email: 'young.parent@test.com',
    password: 'Test123!',
    displayName: 'Young Parent',
    zipCode: '10002',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },

  // Working parent
  working: {
    email: 'working.parent@test.com',
    password: 'Test123!',
    displayName: 'Working Parent',
    zipCode: '10003',
    role: 'user' as const,
    emailVerified: true,
    ageVerified: true,
    status: 'active' as const,
  },
};

/**
 * User fixtures for different test scenarios
 */
export const USER_FIXTURES = {
  // Valid signup data
  validSignup: {
    email: 'newuser@test.com',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    dateOfBirth: '1990-01-01',
    zipCode: '10001',
  },

  // Under 18 (should fail)
  underAge: {
    email: 'underage@test.com',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    dateOfBirth: new Date(Date.now() - 15 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    zipCode: '10001',
  },

  // Exactly 18 (should pass)
  exactly18: {
    email: 'eighteen@test.com',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    dateOfBirth: new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    zipCode: '10001',
  },

  // Invalid email formats
  invalidEmail: {
    email: 'notanemail',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    dateOfBirth: '1990-01-01',
    zipCode: '10001',
  },

  // Weak password
  weakPassword: {
    email: 'weakpass@test.com',
    password: 'weak',
    confirmPassword: 'weak',
    dateOfBirth: '1990-01-01',
    zipCode: '10001',
  },

  // Password mismatch
  passwordMismatch: {
    email: 'mismatch@test.com',
    password: 'Test123!',
    confirmPassword: 'Different123!',
    dateOfBirth: '1990-01-01',
    zipCode: '10001',
  },

  // Invalid zip code
  invalidZipCode: {
    email: 'invalidzip@test.com',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    dateOfBirth: '1990-01-01',
    zipCode: '123', // Too short
  },
};

/**
 * Get a random test user
 */
export function getRandomUser(): UserFixture {
  const users = Object.values(TEST_USERS).filter(u => u.status === 'active');
  return users[Math.floor(Math.random() * users.length)];
}

/**
 * Get users by role
 */
export function getUsersByRole(role: 'user' | 'admin' | 'moderator'): UserFixture[] {
  return Object.values(TEST_USERS).filter(u => u.role === role);
}

/**
 * Get users by status
 */
export function getUsersByStatus(status: 'active' | 'suspended' | 'banned'): UserFixture[] {
  return Object.values(TEST_USERS).filter(u => u.status === status);
}
