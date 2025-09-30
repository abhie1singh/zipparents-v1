import { test as base } from '@playwright/test';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeFirebase } from '@/lib/firebase/clientApp';

type AuthFixtures = {
  authenticatedUser: User;
  signOutUser: () => Promise<void>;
};

/**
 * Fixture that provides an authenticated user for tests
 * Usage: test.use({ authenticatedUser: true })
 */
export const test = base.extend<AuthFixtures>({
  authenticatedUser: async ({ page }, use) => {
    // Initialize Firebase
    const { auth } = initializeFirebase();

    // Sign in with test user
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    const userCredential = await signInWithEmailAndPassword(
      auth,
      testUser.email,
      testUser.password
    );

    // Wait for auth state to be set
    await page.waitForTimeout(1000);

    await use(userCredential.user);

    // Sign out after test
    await signOut(auth);
  },

  signOutUser: async ({ page }, use) => {
    const signOutFn = async () => {
      const { auth } = initializeFirebase();
      await signOut(auth);
      await page.waitForTimeout(500);
    };

    await use(signOutFn);
  },
});

export { expect } from '@playwright/test';
