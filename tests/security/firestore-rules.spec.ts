import { test, expect } from '@playwright/test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Sprint 8: Firestore Security Rules Tests
 *
 * Tests Firebase security rules to prevent unauthorized data access
 */

let testEnv: RulesTestEnvironment;

test.beforeAll(async () => {
  // Read firestore rules
  const rulesPath = path.join(__dirname, '../../firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf8');

  // Initialize test environment
  testEnv = await initializeTestEnvironment({
    projectId: 'zipparents-rules-test',
    firestore: {
      rules,
      host: 'localhost',
      port: 8080,
    },
  });
});

test.afterAll(async () => {
  await testEnv.cleanup();
});

test.afterEach(async () => {
  await testEnv.clearFirestore();
});

test.describe('User Document Security', () => {
  test('unauthenticated users cannot read user documents', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();

    await assertFails(
      unauthedDb.collection('users').doc('testUser').get()
    );
  });

  test('authenticated users can read their own user document', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await authedDb.collection('users').doc(userId).set({
      email: 'test@test.com',
      displayName: 'Test User',
    });

    await assertSucceeds(
      authedDb.collection('users').doc(userId).get()
    );
  });

  test('authenticated users cannot read other user documents', async () => {
    const userId = 'user123';
    const otherUserId = 'user456';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await authedDb.collection('users').doc(otherUserId).set({
      email: 'other@test.com',
      displayName: 'Other User',
    });

    await assertFails(
      authedDb.collection('users').doc(otherUserId).get()
    );
  });

  test('users can only update their own documents', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await authedDb.collection('users').doc(userId).set({
      email: 'test@test.com',
      displayName: 'Test User',
    });

    // Should succeed updating own document
    await assertSucceeds(
      authedDb.collection('users').doc(userId).update({
        displayName: 'Updated Name',
      })
    );

    // Should fail updating other user's document
    await assertFails(
      authedDb.collection('users').doc('otherUser').update({
        displayName: 'Hacked',
      })
    );
  });

  test('users cannot change their own role', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await authedDb.collection('users').doc(userId).set({
      email: 'test@test.com',
      displayName: 'Test User',
      role: 'user',
    });

    // Should fail trying to make self admin
    await assertFails(
      authedDb.collection('users').doc(userId).update({
        role: 'admin',
      })
    );
  });
});

test.describe('Post Security', () => {
  test('authenticated users can create posts', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertSucceeds(
      authedDb.collection('posts').add({
        authorId: userId,
        content: 'Test post',
        createdAt: new Date(),
      })
    );
  });

  test('users cannot create posts as other users', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertFails(
      authedDb.collection('posts').add({
        authorId: 'differentUser',
        content: 'Impersonation attempt',
        createdAt: new Date(),
      })
    );
  });

  test('users can delete their own posts', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    const postRef = await authedDb.collection('posts').add({
      authorId: userId,
      content: 'Test post',
      createdAt: new Date(),
    });

    await assertSucceeds(postRef.delete());
  });

  test('users cannot delete other users posts', async () => {
    const userId = 'user123';
    const otherUserId = 'user456';

    // Create post as other user
    const otherUserDb = testEnv.authenticatedContext(otherUserId).firestore();
    const postRef = await otherUserDb.collection('posts').add({
      authorId: otherUserId,
      content: 'Other user post',
      createdAt: new Date(),
    });

    // Try to delete as different user
    const authedDb = testEnv.authenticatedContext(userId).firestore();
    await assertFails(
      authedDb.collection('posts').doc(postRef.id).delete()
    );
  });
});

test.describe('Event Security', () => {
  test('authenticated users can read events', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    const eventRef = await authedDb.collection('events').add({
      title: 'Test Event',
      organizerId: userId,
      date: new Date(),
    });

    await assertSucceeds(
      authedDb.collection('events').doc(eventRef.id).get()
    );
  });

  test('users can create events', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertSucceeds(
      authedDb.collection('events').add({
        title: 'My Event',
        organizerId: userId,
        date: new Date(),
      })
    );
  });

  test('only event organizer can edit event', async () => {
    const organizerId = 'user123';
    const otherUserId = 'user456';

    const organizerDb = testEnv.authenticatedContext(organizerId).firestore();
    const eventRef = await organizerDb.collection('events').add({
      title: 'Test Event',
      organizerId,
      date: new Date(),
    });

    // Organizer should succeed
    await assertSucceeds(
      organizerDb.collection('events').doc(eventRef.id).update({
        title: 'Updated Event',
      })
    );

    // Other user should fail
    const otherDb = testEnv.authenticatedContext(otherUserId).firestore();
    await assertFails(
      otherDb.collection('events').doc(eventRef.id).update({
        title: 'Hacked Event',
      })
    );
  });
});

test.describe('Message Security', () => {
  test('users can only read messages they are part of', async () => {
    const user1 = 'user123';
    const user2 = 'user456';
    const user3 = 'user789';

    const user1Db = testEnv.authenticatedContext(user1).firestore();

    // Create message between user1 and user2
    const messageRef = await user1Db.collection('messages').add({
      senderId: user1,
      receiverId: user2,
      content: 'Private message',
      createdAt: new Date(),
    });

    // User2 should be able to read
    const user2Db = testEnv.authenticatedContext(user2).firestore();
    await assertSucceeds(
      user2Db.collection('messages').doc(messageRef.id).get()
    );

    // User3 should NOT be able to read
    const user3Db = testEnv.authenticatedContext(user3).firestore();
    await assertFails(
      user3Db.collection('messages').doc(messageRef.id).get()
    );
  });

  test('users cannot send messages as other users', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertFails(
      authedDb.collection('messages').add({
        senderId: 'differentUser',
        receiverId: 'someone',
        content: 'Impersonation',
        createdAt: new Date(),
      })
    );
  });
});

test.describe('Admin-Only Collections', () => {
  test('regular users cannot access moderation logs', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertFails(
      authedDb.collection('moderationLogs').get()
    );
  });

  test('regular users cannot access reports', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    await assertFails(
      authedDb.collection('reports').get()
    );
  });

  test('admin users can access moderation logs', async () => {
    const adminId = 'admin123';
    const adminDb = testEnv.authenticatedContext(adminId, {
      role: 'admin',
    }).firestore();

    await assertSucceeds(
      adminDb.collection('moderationLogs').get()
    );
  });
});

test.describe('Data Validation', () => {
  test('posts must have required fields', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    // Missing content
    await assertFails(
      authedDb.collection('posts').add({
        authorId: userId,
        createdAt: new Date(),
      })
    );

    // Missing authorId
    await assertFails(
      authedDb.collection('posts').add({
        content: 'Test',
        createdAt: new Date(),
      })
    );
  });

  test('email must be valid format in user creation', async () => {
    const userId = 'user123';
    const authedDb = testEnv.authenticatedContext(userId).firestore();

    // Invalid email
    await assertFails(
      authedDb.collection('users').doc(userId).set({
        email: 'notanemail',
        displayName: 'Test',
      })
    );

    // Valid email
    await assertSucceeds(
      authedDb.collection('users').doc(userId).set({
        email: 'test@example.com',
        displayName: 'Test',
      })
    );
  });
});
