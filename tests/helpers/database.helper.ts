/**
 * Database Test Helper
 *
 * Provides utilities for checking and manipulating Firestore during tests
 */

import { Page } from '@playwright/test';

/**
 * Check if document exists in Firestore
 */
export async function documentExists(
  page: Page,
  collection: string,
  docId: string
): Promise<boolean> {
  const exists = await page.evaluate(
    async ({ collection, docId }) => {
      // This assumes Firebase is available on the client
      const firestore = (window as any).firestore;
      if (!firestore) return false;

      try {
        const docRef = firestore.collection(collection).doc(docId);
        const doc = await docRef.get();
        return doc.exists;
      } catch {
        return false;
      }
    },
    { collection, docId }
  );

  return exists;
}

/**
 * Get document data from Firestore
 */
export async function getDocument(
  page: Page,
  collection: string,
  docId: string
): Promise<any> {
  const data = await page.evaluate(
    async ({ collection, docId }) => {
      const firestore = (window as any).firestore;
      if (!firestore) return null;

      try {
        const docRef = firestore.collection(collection).doc(docId);
        const doc = await docRef.get();
        return doc.exists ? doc.data() : null;
      } catch {
        return null;
      }
    },
    { collection, docId }
  );

  return data;
}

/**
 * Get collection documents count
 */
export async function getCollectionCount(
  page: Page,
  collection: string,
  whereConditions?: Array<{ field: string; operator: string; value: any }>
): Promise<number> {
  const count = await page.evaluate(
    async ({ collection, whereConditions }) => {
      const firestore = (window as any).firestore;
      if (!firestore) return 0;

      try {
        let query: any = firestore.collection(collection);

        if (whereConditions) {
          whereConditions.forEach(({ field, operator, value }) => {
            query = query.where(field, operator, value);
          });
        }

        const snapshot = await query.get();
        return snapshot.size;
      } catch {
        return 0;
      }
    },
    { collection, whereConditions }
  );

  return count;
}

/**
 * Query collection documents
 */
export async function queryCollection(
  page: Page,
  collection: string,
  options?: {
    where?: Array<{ field: string; operator: string; value: any }>;
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
  }
): Promise<any[]> {
  const docs = await page.evaluate(
    async ({ collection, options }) => {
      const firestore = (window as any).firestore;
      if (!firestore) return [];

      try {
        let query: any = firestore.collection(collection);

        if (options?.where) {
          options.where.forEach(({ field, operator, value }) => {
            query = query.where(field, operator, value);
          });
        }

        if (options?.orderBy) {
          query = query.orderBy(options.orderBy.field, options.orderBy.direction);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const snapshot = await query.get();
        return snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch {
        return [];
      }
    },
    { collection, options }
  );

  return docs;
}

/**
 * Wait for document to exist
 */
export async function waitForDocument(
  page: Page,
  collection: string,
  docId: string,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const exists = await documentExists(page, collection, docId);
    if (exists) return;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Document ${collection}/${docId} not found within ${timeout}ms`);
}

/**
 * Wait for document with specific data
 */
export async function waitForDocumentData(
  page: Page,
  collection: string,
  docId: string,
  expectedData: Record<string, any>,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const data = await getDocument(page, collection, docId);
    if (data) {
      const matches = Object.entries(expectedData).every(
        ([key, value]) => data[key] === value
      );
      if (matches) return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Document ${collection}/${docId} with expected data not found within ${timeout}ms`);
}

/**
 * Wait for collection to have specific count
 */
export async function waitForCollectionCount(
  page: Page,
  collection: string,
  count: number,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const currentCount = await getCollectionCount(page, collection);
    if (currentCount === count) return;
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  throw new Error(`Collection ${collection} did not reach count ${count} within ${timeout}ms`);
}

/**
 * Get user document
 */
export async function getUserDocument(page: Page, userId: string): Promise<any> {
  return await getDocument(page, 'users', userId);
}

/**
 * Get user posts
 */
export async function getUserPosts(page: Page, userId: string): Promise<any[]> {
  return await queryCollection(page, 'posts', {
    where: [{ field: 'authorId', operator: '==', value: userId }],
    orderBy: { field: 'createdAt', direction: 'desc' },
  });
}

/**
 * Get user events
 */
export async function getUserEvents(page: Page, userId: string): Promise<any[]> {
  return await queryCollection(page, 'events', {
    where: [{ field: 'organizerId', operator: '==', value: userId }],
    orderBy: { field: 'createdAt', direction: 'desc' },
  });
}

/**
 * Get conversations for user
 */
export async function getUserConversations(page: Page, userId: string): Promise<any[]> {
  return await queryCollection(page, 'conversations', {
    where: [{ field: 'participants', operator: 'array-contains', value: userId }],
    orderBy: { field: 'lastMessageAt', direction: 'desc' },
  });
}

/**
 * Get messages in conversation
 */
export async function getConversationMessages(
  page: Page,
  conversationId: string
): Promise<any[]> {
  return await queryCollection(page, `conversations/${conversationId}/messages`, {
    orderBy: { field: 'createdAt', direction: 'asc' },
  });
}

/**
 * Check if user is verified
 */
export async function isUserVerified(page: Page, userId: string): Promise<boolean> {
  const user = await getUserDocument(page, userId);
  return user?.emailVerified === true && user?.ageVerified === true;
}

/**
 * Check if users are connected
 */
export async function areUsersConnected(
  page: Page,
  userId1: string,
  userId2: string
): Promise<boolean> {
  const connections = await queryCollection(page, 'connections', {
    where: [
      { field: 'userId1', operator: '==', value: userId1 },
      { field: 'userId2', operator: '==', value: userId2 },
      { field: 'status', operator: '==', value: 'accepted' },
    ],
  });

  if (connections.length > 0) return true;

  // Check reverse connection
  const reverseConnections = await queryCollection(page, 'connections', {
    where: [
      { field: 'userId1', operator: '==', value: userId2 },
      { field: 'userId2', operator: '==', value: userId1 },
      { field: 'status', operator: '==', value: 'accepted' },
    ],
  });

  return reverseConnections.length > 0;
}

/**
 * Get pending reports count
 */
export async function getPendingReportsCount(page: Page): Promise<number> {
  return await getCollectionCount(page, 'reports', [
    { field: 'status', operator: '==', value: 'pending' },
  ]);
}

/**
 * Get moderation logs count
 */
export async function getModerationLogsCount(page: Page): Promise<number> {
  return await getCollectionCount(page, 'moderationLogs');
}

/**
 * Verify data was saved correctly
 */
export async function verifyDataSaved(
  page: Page,
  collection: string,
  docId: string,
  expectedData: Record<string, any>
): Promise<boolean> {
  const data = await getDocument(page, collection, docId);
  if (!data) return false;

  return Object.entries(expectedData).every(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(data[key]) === JSON.stringify(value);
    }
    return data[key] === value;
  });
}

/**
 * Get real-time updates count
 */
export async function subscribeToCollection(
  page: Page,
  collection: string,
  callback: (docs: any[]) => void
): Promise<() => void> {
  await page.evaluate(
    ({ collection }) => {
      const firestore = (window as any).firestore;
      if (!firestore) return;

      const unsubscribe = firestore.collection(collection).onSnapshot((snapshot: any) => {
        const docs = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        (window as any).collectionCallback?.(docs);
      });

      (window as any).unsubscribe = unsubscribe;
    },
    { collection }
  );

  // Set callback
  await page.exposeFunction('collectionCallback', callback);

  // Return unsubscribe function
  return async () => {
    await page.evaluate(() => {
      (window as any).unsubscribe?.();
    });
  };
}
