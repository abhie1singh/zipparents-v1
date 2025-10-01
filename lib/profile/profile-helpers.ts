/**
 * Profile helper functions for CRUD operations
 */

import { getFirestore, doc, getDoc, updateDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseApp, getFirebaseStorage } from '@/lib/firebase/clientApp';
import { User } from '@/types/user';
import { PublicProfile, VerificationRequest } from '@/types/profile';
import { calculateProfileCompleteness, sanitizeProfileForPublic } from './validation';

/**
 * Updates user profile
 */
export async function updateProfile(userId: string, data: Partial<User>): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);

  // Calculate profile completeness if profile data changed
  const updatedData = {
    ...data,
    profileCompleteness: calculateProfileCompleteness({ ...data } as Partial<User>),
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(userRef, updatedData);
}

/**
 * Completes onboarding and marks profile as complete
 */
export async function completeOnboarding(userId: string, profileData: Partial<User>): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);

  const updatedData = {
    ...profileData,
    onboardingCompleted: true,
    profileCompleteness: calculateProfileCompleteness(profileData),
    updatedAt: new Date().toISOString(),
  };

  await updateDoc(userRef, updatedData);
}

/**
 * Uploads profile photo to Firebase Storage
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage not initialized');

  // Create unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}.${extension}`;
  const storagePath = `profile-photos/${userId}/${filename}`;

  // Upload file
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

/**
 * Deletes old profile photo from Storage
 */
export async function deleteProfilePhoto(photoURL: string): Promise<void> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage not initialized');

  try {
    // Extract path from URL
    const url = new URL(photoURL);
    const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
    if (!pathMatch) return;

    const path = decodeURIComponent(pathMatch[1]);
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    // Don't throw - old photo deletion is not critical
  }
}

/**
 * Updates profile photo (deletes old, uploads new)
 */
export async function updateProfilePhoto(file: File, userId: string, oldPhotoURL?: string): Promise<string> {
  // Upload new photo
  const newPhotoURL = await uploadProfilePhoto(file, userId);

  // Delete old photo if exists
  if (oldPhotoURL) {
    await deleteProfilePhoto(oldPhotoURL);
  }

  // Update user document
  await updateProfile(userId, { photoURL: newPhotoURL });

  return newPhotoURL;
}

/**
 * Gets public profile for viewing
 */
export async function getPublicProfile(userId: string, viewerUid?: string): Promise<PublicProfile | null> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const userData = userSnap.data() as User;
  return sanitizeProfileForPublic(userData, viewerUid);
}

/**
 * Requests verification
 */
export async function requestVerification(userId: string, userEmail: string, userName: string, notes: string): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);

  // Create verification request
  const requestData: VerificationRequest = {
    userId,
    userEmail,
    displayName: userName,
    requestedAt: new Date().toISOString(),
    status: 'pending',
    notes,
  };

  await addDoc(collection(db, 'verificationRequests'), requestData);

  // Update user's verification status
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    verificationStatus: 'pending',
    verificationRequestedAt: new Date().toISOString(),
    verificationNotes: notes,
    updatedAt: new Date().toISOString(),
  });
}

/**
 * Gets user profile data
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return userSnap.data() as User;
}

/**
 * Updates last active timestamp
 */
export async function updateLastActive(userId: string): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);

  await updateDoc(userRef, {
    lastActive: new Date().toISOString(),
  });
}
