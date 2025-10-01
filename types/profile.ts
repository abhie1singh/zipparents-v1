/**
 * Profile-related type definitions
 */

import { User, AgeRange, RelationshipStatus, PrivacySettings } from './user';

/**
 * Form data for profile updates
 */
export interface ProfileFormData {
  displayName: string;
  bio: string;
  ageRange: AgeRange;
  zipCode: string;
  phoneNumber?: string;
  relationshipStatus?: RelationshipStatus;
  childrenAgeRanges: string[];
  interests: string[];
  privacySettings: PrivacySettings;
}

/**
 * Onboarding form data (multi-step)
 */
export interface OnboardingStep1Data {
  displayName: string;
  ageRange: AgeRange;
  zipCode: string;
}

export interface OnboardingStep2Data {
  bio: string;
  relationshipStatus?: RelationshipStatus;
  childrenAgeRanges: string[];
}

export interface OnboardingStep3Data {
  interests: string[];
}

export interface OnboardingStep4Data {
  privacySettings: PrivacySettings;
  photoFile?: File | null;
}

/**
 * Public profile - sanitized for viewing by other users
 */
export interface PublicProfile {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  bio?: string;
  ageRange?: AgeRange;
  zipCode: string; // May be partial based on privacy settings
  interests?: string[];
  childrenAgeRanges?: string[];
  relationshipStatus?: RelationshipStatus;
  verificationStatus?: string;
  profileCompleteness?: number;
  lastActive?: string;

  // Conditionally shown based on privacy settings
  email?: string;
  phoneNumber?: string;

  // Metadata about privacy
  showsExactLocation: boolean;
  isPublic: boolean;
}

/**
 * Verification request data
 */
export interface VerificationRequest {
  userId: string;
  userEmail: string;
  displayName: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}
