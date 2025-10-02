/**
 * Safety and moderation service
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { getFirebaseApp } from '@/lib/firebase/clientApp';
import { getProfile } from '@/lib/profile/profile-helpers';
import {
  Report,
  ReportRequest,
  BlockedUser,
  BlockedUserWithProfile,
} from '@/types/safety';

/**
 * Submit a report
 */
export async function submitReport(
  reporterId: string,
  request: ReportRequest
): Promise<Report> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const reportsRef = collection(db, 'reports');

  // Validate request
  if (!request.description || request.description.trim().length < 10) {
    throw new Error('Please provide a detailed description (minimum 10 characters)');
  }

  // Check if user has already reported this
  const existingReport = await getExistingReport(
    reporterId,
    request.reportedUserId,
    request.type,
    request.messageId
  );

  if (existingReport) {
    throw new Error('You have already reported this');
  }

  const reportData = {
    reporterId,
    reportedUserId: request.reportedUserId,
    type: request.type,
    reason: request.reason,
    description: request.description.trim(),
    ...(request.messageId && { messageId: request.messageId }),
    ...(request.conversationId && { conversationId: request.conversationId }),
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(reportsRef, reportData);
  const newDoc = await getDoc(docRef);

  return {
    id: docRef.id,
    ...newDoc.data(),
    createdAt: (newDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (newDoc.data()?.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Report;
}

/**
 * Check for existing report
 */
async function getExistingReport(
  reporterId: string,
  reportedUserId: string,
  type: string,
  messageId?: string
): Promise<Report | null> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const reportsRef = collection(db, 'reports');

  let q = query(
    reportsRef,
    where('reporterId', '==', reporterId),
    where('reportedUserId', '==', reportedUserId),
    where('type', '==', type)
  );

  if (messageId) {
    q = query(q, where('messageId', '==', messageId));
  }

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
  } as Report;
}

/**
 * Block a user
 */
export async function blockUser(
  blockerId: string,
  blockedUserId: string,
  reason?: string
): Promise<BlockedUser> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);

  if (blockerId === blockedUserId) {
    throw new Error('Cannot block yourself');
  }

  // Check if already blocked
  const existing = await getBlockedUser(blockerId, blockedUserId);
  if (existing) {
    throw new Error('User is already blocked');
  }

  // Create block record
  const blockedUsersRef = collection(db, 'blockedUsers');
  const blockData = {
    blockerId,
    blockedUserId,
    ...(reason && { reason }),
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(blockedUsersRef, blockData);
  const newDoc = await getDoc(docRef);

  // Also update connections to blocked status if exists
  const connectionsRef = collection(db, 'connections');
  const connectionQuery = query(
    connectionsRef,
    where('fromUserId', '==', blockerId),
    where('toUserId', '==', blockedUserId)
  );

  const connectionSnapshot = await getDocs(connectionQuery);
  if (!connectionSnapshot.empty) {
    const connectionDoc = connectionSnapshot.docs[0];
    await updateDoc(doc(db, 'connections', connectionDoc.id), {
      status: 'blocked',
      updatedAt: serverTimestamp(),
    });
  }

  return {
    id: docRef.id,
    ...newDoc.data(),
    createdAt: (newDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
  } as BlockedUser;
}

/**
 * Unblock a user
 */
export async function unblockUser(
  blockerId: string,
  blockedUserId: string
): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);

  const blockedUser = await getBlockedUser(blockerId, blockedUserId);
  if (!blockedUser) {
    throw new Error('User is not blocked');
  }

  await deleteDoc(doc(db, 'blockedUsers', blockedUser.id));
}

/**
 * Get blocked user relationship
 */
async function getBlockedUser(
  blockerId: string,
  blockedUserId: string
): Promise<BlockedUser | null> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const blockedUsersRef = collection(db, 'blockedUsers');

  const q = query(
    blockedUsersRef,
    where('blockerId', '==', blockerId),
    where('blockedUserId', '==', blockedUserId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
  } as BlockedUser;
}

/**
 * Get all blocked users for a user
 */
export async function getBlockedUsers(
  userId: string
): Promise<BlockedUserWithProfile[]> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const blockedUsersRef = collection(db, 'blockedUsers');

  const q = query(
    blockedUsersRef,
    where('blockerId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const blockedUsers = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const blocked: BlockedUser = {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      } as BlockedUser;

      const profile = await getProfile(blocked.blockedUserId);

      return {
        ...blocked,
        blockedUser: {
          uid: profile.uid,
          displayName: profile.displayName,
          photoURL: profile.photoURL || undefined,
        },
      };
    })
  );

  return blockedUsers;
}

/**
 * Check if a user is blocked
 */
export async function isUserBlocked(
  userId: string,
  targetUserId: string
): Promise<boolean> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const blockedUsersRef = collection(db, 'blockedUsers');

  // Check both directions
  const q1 = query(
    blockedUsersRef,
    where('blockerId', '==', userId),
    where('blockedUserId', '==', targetUserId)
  );

  const q2 = query(
    blockedUsersRef,
    where('blockerId', '==', targetUserId),
    where('blockedUserId', '==', userId)
  );

  const [snapshot1, snapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2),
  ]);

  return !snapshot1.empty || !snapshot2.empty;
}

/**
 * Get user's reports
 */
export async function getUserReports(userId: string): Promise<Report[]> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const reportsRef = collection(db, 'reports');

  const q = query(
    reportsRef,
    where('reporterId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
  })) as Report[];
}
