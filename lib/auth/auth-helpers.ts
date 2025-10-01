'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/clientApp';
import { SignUpData, User } from '@/types/user';
import { calculateAge, isAgeVerified } from './age-verification';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signUp(data: SignUpData): Promise<{ user: FirebaseUser; requiresEmailVerification: boolean }> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  if (!auth || !db) {
    throw new AuthError('Firebase not initialized');
  }

  // Validate age
  const age = calculateAge(data.dateOfBirth);
  if (!isAgeVerified(data.dateOfBirth)) {
    throw new AuthError('You must be 18 or older to sign up', 'age-verification-failed');
  }

  // Validate terms acceptance
  if (!data.acceptedTerms || !data.acceptedPrivacy) {
    throw new AuthError('You must accept the Terms of Service and Privacy Policy', 'terms-not-accepted');
  }

  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const { user } = userCredential;

    // Update display name
    await updateProfile(user, {
      displayName: data.displayName,
    });

    // Reload user to ensure auth token is fresh
    await user.reload();

    // Get fresh ID token to ensure auth context is available for Firestore rules
    await user.getIdToken(true);

    // Create user document in Firestore
    const userData: User = {
      uid: user.uid,
      email: data.email,
      displayName: data.displayName,
      emailVerified: false,
      zipCode: data.zipCode,
      role: 'user',
      dateOfBirth: data.dateOfBirth,
      age,
      ageVerified: true,
      ageVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    // Send email verification
    await sendEmailVerification(user);

    return {
      user,
      requiresEmailVerification: true,
    };
  } catch (error: any) {
    console.error('Sign up error:', error);

    // Map Firebase errors to user-friendly messages
    if (error.code === 'auth/email-already-in-use') {
      throw new AuthError('This email is already registered', error.code);
    } else if (error.code === 'auth/weak-password') {
      throw new AuthError('Password should be at least 6 characters', error.code);
    } else if (error.code === 'auth/invalid-email') {
      throw new AuthError('Invalid email address', error.code);
    }

    throw new AuthError(error.message || 'Failed to sign up', error.code);
  }
}

export async function login(email: string, password: string): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new AuthError('Firebase not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);

    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new AuthError('Invalid email or password', error.code);
    } else if (error.code === 'auth/user-disabled') {
      throw new AuthError('This account has been disabled', error.code);
    } else if (error.code === 'auth/too-many-requests') {
      throw new AuthError('Too many failed attempts. Please try again later', error.code);
    }

    throw new AuthError(error.message || 'Failed to login', error.code);
  }
}

export async function logout(): Promise<void> {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new AuthError('Firebase not initialized');
  }

  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new AuthError(error.message || 'Failed to logout', error.code);
  }
}

export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new AuthError('Firebase not initialized');
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Password reset error:', error);

    if (error.code === 'auth/user-not-found') {
      throw new AuthError('No account found with this email', error.code);
    } else if (error.code === 'auth/invalid-email') {
      throw new AuthError('Invalid email address', error.code);
    }

    throw new AuthError(error.message || 'Failed to send password reset email', error.code);
  }
}

export async function resendVerificationEmail(user: FirebaseUser): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (error: any) {
    console.error('Resend verification error:', error);
    throw new AuthError(error.message || 'Failed to send verification email', error.code);
  }
}

export async function getUserData(uid: string): Promise<User | null> {
  const db = getFirebaseDb();

  if (!db) {
    throw new AuthError('Firebase not initialized');
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      return null;
    }

    return {
      uid,
      ...userDoc.data(),
    } as User;
  } catch (error: any) {
    console.error('Get user data error:', error);
    throw new AuthError(error.message || 'Failed to get user data', error.code);
  }
}
