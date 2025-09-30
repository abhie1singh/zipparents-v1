import { adminAuth, adminDb } from '@/lib/firebase/adminApp';
import type { UserRecord } from 'firebase-admin/auth';

/**
 * Helper functions for Firebase operations in tests
 */

export async function createTestUser(
  email: string,
  password: string,
  userData: {
    displayName?: string;
    zipCode?: string;
    phoneNumber?: string;
  } = {}
): Promise<UserRecord> {
  try {
    // Create auth user
    const user = await adminAuth.createUser({
      email,
      password,
      displayName: userData.displayName || 'Test User',
      emailVerified: true,
    });

    // Create user document in Firestore
    await adminDb.collection('users').doc(user.uid).set({
      email,
      displayName: userData.displayName || 'Test User',
      zipCode: userData.zipCode || '94102',
      phoneNumber: userData.phoneNumber || null,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

export async function deleteTestUser(uid: string): Promise<void> {
  try {
    // Delete user document
    await adminDb.collection('users').doc(uid).delete();

    // Delete auth user
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting test user:', error);
    throw error;
  }
}

export async function cleanupTestData(collectionName: string): Promise<void> {
  try {
    const snapshot = await adminDb.collection(collectionName).get();
    const batch = adminDb.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error(`Error cleaning up ${collectionName}:`, error);
    throw error;
  }
}

export async function createTestPost(
  authorId: string,
  content: string,
  groupId?: string
): Promise<string> {
  const postRef = await adminDb.collection('posts').add({
    authorId,
    content,
    groupId: groupId || null,
    likes: [],
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return postRef.id;
}

export async function createTestGroup(
  name: string,
  createdBy: string,
  zipCode: string
): Promise<string> {
  const groupRef = await adminDb.collection('groups').add({
    name,
    description: `Test group for ${zipCode}`,
    zipCode,
    createdBy,
    admins: [createdBy],
    memberCount: 1,
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return groupRef.id;
}
