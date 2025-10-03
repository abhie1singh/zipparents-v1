/**
 * Admin Service - Sprint 7
 * Core admin functionality for user management and moderation
 */

import { getFirebaseDb } from '@/lib/firebase/clientApp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  Timestamp,
  serverTimestamp,
  startAfter,
  QueryConstraint,
  Firestore,
} from 'firebase/firestore';
import {
  Report,
  ModerationLog,
  ModerationAction,
  UserStatus,
  ReportStatus,
  PlatformMetrics,
} from '@/lib/types/admin';

/** Helper to get initialized Firestore instance */
function getDb(): Firestore {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not initialized');
  return db;
}

/**
 * Get all users with pagination
 */
export async function getUsers(pageSize = 50, lastDoc?: any) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(collection(getDb(), 'users'), ...constraints);
  const snapshot = await getDocs(q);

  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    users,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize,
  };
}

/**
 * Search users by email or display name
 */
export async function searchUsers(searchTerm: string) {
  const usersRef = collection(getDb(), 'users');
  const snapshot = await getDocs(usersRef);

  const users = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((user: any) => {
      const email = user.email?.toLowerCase() || '';
      const displayName = user.displayName?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();

      return email.includes(search) || displayName.includes(search);
    });

  return users.slice(0, 50); // Limit to 50 results
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const userDoc = await getDoc(doc(getDb(), 'users', userId));
  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  return {
    id: userDoc.id,
    ...userDoc.data(),
  };
}

/**
 * Update user status (suspend/unsuspend/ban/unban)
 */
export async function updateUserStatus(
  userId: string,
  status: UserStatus,
  adminId: string,
  reason?: string
) {
  await updateDoc(doc(getDb(), 'users', userId), {
    status,
    updatedAt: serverTimestamp(),
  });

  // Log the action
  await logModerationAction({
    action:
      status === 'suspended'
        ? 'suspend_user'
        : status === 'banned'
        ? 'ban_user'
        : status === 'active'
        ? 'unsuspend_user'
        : 'unban_user',
    performedBy: adminId,
    targetUserId: userId,
    reason,
  });
}

/**
 * Manually verify a user
 */
export async function verifyUser(userId: string, adminId: string) {
  await updateDoc(doc(getDb(), 'users', userId), {
    ageVerified: true,
    updatedAt: serverTimestamp(),
  });

  await logModerationAction({
    action: 'verify_user',
    performedBy: adminId,
    targetUserId: userId,
  });
}

/**
 * Get all reports
 */
export async function getReports(status?: ReportStatus, pageSize = 50) {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(pageSize)];

  if (status) {
    constraints.unshift(where('status', '==', status));
  }

  const q = query(collection(getDb(), 'reports'), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt.toDate()) : undefined,
      updatedAt: data.updatedAt ? (typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt.toDate()) : undefined,
      reviewedAt: data.reviewedAt ? (typeof data.reviewedAt === 'string' ? new Date(data.reviewedAt) : data.reviewedAt.toDate()) : undefined,
    };
  }) as Report[];
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string): Promise<Report> {
  const reportDoc = await getDoc(doc(getDb(), 'reports', reportId));
  if (!reportDoc.exists()) {
    throw new Error('Report not found');
  }

  const data = reportDoc.data();
  return {
    id: reportDoc.id,
    ...data,
    createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? new Date(data.createdAt) : data.createdAt.toDate()) : undefined,
    updatedAt: data.updatedAt ? (typeof data.updatedAt === 'string' ? new Date(data.updatedAt) : data.updatedAt.toDate()) : undefined,
    reviewedAt: data.reviewedAt ? (typeof data.reviewedAt === 'string' ? new Date(data.reviewedAt) : data.reviewedAt.toDate()) : undefined,
  } as Report;
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminId: string,
  resolution?: string
) {
  await updateDoc(doc(getDb(), 'reports', reportId), {
    status,
    reviewedBy: adminId,
    reviewedAt: serverTimestamp(),
    resolution,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Dismiss a report
 */
export async function dismissReport(reportId: string, adminId: string, reason?: string) {
  await updateReportStatus(reportId, 'dismissed', adminId, reason);

  await logModerationAction({
    action: 'dismiss_report',
    performedBy: adminId,
    targetUserId: '', // No specific user for dismiss
    reportId,
    reason,
  });
}

/**
 * Remove reported content
 */
export async function removeContent(
  reportId: string,
  contentId: string,
  contentType: 'message' | 'event' | 'post',
  adminId: string,
  reason?: string
) {
  // Mark content as removed
  const contentCollection = contentType === 'message' ? 'messages' : contentType === 'event' ? 'events' : 'posts';

  await updateDoc(doc(getDb(), contentCollection, contentId), {
    removed: true,
    removedBy: adminId,
    removedAt: serverTimestamp(),
    removalReason: reason,
  });

  // Update report
  await updateReportStatus(reportId, 'resolved', adminId, `Content removed: ${reason}`);

  // Log action
  await logModerationAction({
    action: 'remove_content',
    performedBy: adminId,
    targetUserId: '',
    contentId,
    reportId,
    reason,
  });
}

/**
 * Log moderation action
 */
export async function logModerationAction(params: {
  action: ModerationAction;
  performedBy: string;
  targetUserId: string;
  reason?: string;
  contentId?: string;
  reportId?: string;
  metadata?: Record<string, any>;
}) {
  const { action, performedBy, targetUserId, reason, contentId, reportId, metadata } = params;

  // Get admin info
  const adminDoc = await getDoc(doc(getDb(), 'users', performedBy));
  const adminData = adminDoc.data();

  // Get target user info if applicable
  let targetUserName = '';
  if (targetUserId) {
    const targetDoc = await getDoc(doc(getDb(), 'users', targetUserId));
    targetUserName = targetDoc.data()?.displayName || 'Unknown User';
  }

  await addDoc(collection(getDb(), 'moderationLogs'), {
    action,
    performedBy,
    performedByName: adminData?.displayName || 'Unknown Admin',
    targetUserId,
    targetUserName,
    reason,
    contentId,
    reportId,
    metadata,
    timestamp: serverTimestamp(),
  });
}

/**
 * Get moderation logs
 */
export async function getModerationLogs(limitCount = 100) {
  const q = query(
    collection(getDb(), 'moderationLogs'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp ? (typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp.toDate()) : undefined,
    };
  }) as ModerationLog[];
}

/**
 * Get platform metrics
 */
export async function getPlatformMetrics(): Promise<PlatformMetrics> {
  // Get users
  const usersSnapshot = await getDocs(collection(getDb(), 'users'));
  const users = usersSnapshot.docs.map((doc) => doc.data());

  // Get posts
  const postsSnapshot = await getDocs(collection(getDb(), 'posts'));

  // Get events
  const eventsSnapshot = await getDocs(collection(getDb(), 'events'));

  // Get messages
  const messagesSnapshot = await getDocs(collection(getDb(), 'messages'));

  // Get reports
  const reportsSnapshot = await getDocs(collection(getDb(), 'reports'));
  const reports = reportsSnapshot.docs.map((doc) => doc.data());

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === 'active' || !u.status).length,
    verifiedUsers: users.filter((u) => u.ageVerified).length,
    suspendedUsers: users.filter((u) => u.status === 'suspended').length,
    bannedUsers: users.filter((u) => u.status === 'banned').length,
    totalPosts: postsSnapshot.size,
    totalEvents: eventsSnapshot.size,
    totalMessages: messagesSnapshot.size,
    pendingReports: reports.filter((r) => r.status === 'pending' || r.status === 'reviewing')
      .length,
    resolvedReports: reports.filter((r) => r.status === 'resolved' || r.status === 'dismissed')
      .length,
    timestamp: new Date(),
  };
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(userId: string, limitCount = 50) {
  const q = query(
    collection(getDb(), 'activityLogs'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp ? (typeof data.timestamp === 'string' ? new Date(data.timestamp) : data.timestamp.toDate()) : undefined,
    };
  });
}

/**
 * Warn a user
 */
export async function warnUser(userId: string, adminId: string, reason?: string) {
  await logModerationAction({
    action: 'warn_user',
    performedBy: adminId,
    targetUserId: userId,
    reason,
  });
}

/**
 * Ban user from a report
 */
export async function banUser(userId: string, adminId: string, reason?: string, reportId?: string) {
  await updateUserStatus(userId, 'banned', adminId, reason);

  if (reportId) {
    await updateReportStatus(reportId, 'resolved', adminId, `User banned: ${reason}`);
  }
}
