/**
 * User type definitions
 */

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type RelationshipStatus = 'single' | 'partnered' | 'married' | 'prefer-not-to-say';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type ProfileVisibility = 'public' | 'verified-only' | 'private';

export interface PrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showExactLocation: boolean; // if false, show only first 3 digits of zip
  profileVisibility: ProfileVisibility;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  emailVerified: boolean;
  zipCode: string;
  phoneNumber?: string;
  bio?: string;
  role: 'user' | 'admin';
  dateOfBirth: string; // ISO date string
  age: number;
  ageVerified: boolean;
  ageVerifiedAt?: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;

  // Sprint 2 additions
  ageRange?: AgeRange;
  interests?: string[];
  childrenAgeRanges?: string[];
  relationshipStatus?: RelationshipStatus;
  verificationStatus?: VerificationStatus;
  verificationRequestedAt?: string;
  verificationNotes?: string;
  privacySettings?: PrivacySettings;
  profileCompleteness?: number;
  onboardingCompleted?: boolean;
  lastActive?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  zipCode: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}
