/**
 * Admin Middleware - Sprint 7
 * Protects admin routes and validates admin permissions
 */

import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '@/lib/types/admin';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    if (!db) return false;

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    return userData.role === 'admin' || userData.role === 'moderator';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  try {
    const db = getFirebaseDb();
    if (!db) return 'user';

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return 'user';

    const userData = userDoc.data();
    return userData.role || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
}

/**
 * Require admin authentication
 * Throws error if user is not admin
 */
export async function requireAdmin(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase not initialized');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const adminStatus = await isAdmin(user.uid);
  if (!adminStatus) {
    throw new Error('Unauthorized: Admin access required');
  }
}

/**
 * Check if user has permission for specific action
 */
export async function hasPermission(
  userId: string,
  permission: 'view_users' | 'moderate_content' | 'ban_users' | 'view_reports' | 'manage_events'
): Promise<boolean> {
  const role = await getUserRole(userId);

  // Admin has all permissions
  if (role === 'admin') return true;

  // Moderator has limited permissions
  if (role === 'moderator') {
    return ['view_users', 'moderate_content', 'view_reports'].includes(permission);
  }

  return false;
}
