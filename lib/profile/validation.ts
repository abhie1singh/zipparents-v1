/**
 * Profile validation utilities
 */

import { User, AgeRange } from '@/types/user';
import { PublicProfile } from '@/types/profile';
import { VALIDATION_RULES } from '@/lib/constants/profile';

/**
 * Validates a US zip code (5 digits)
 */
export function validateZipCode(zip: string): boolean {
  if (!zip || typeof zip !== 'string') {
    return false;
  }

  // Must be exactly 5 digits
  return VALIDATION_RULES.zipCode.pattern.test(zip.trim());
}

/**
 * Validates display name
 */
export function validateDisplayName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Display name is required' };
  }

  const trimmed = name.trim();

  if (trimmed.length < VALIDATION_RULES.displayName.minLength) {
    return { valid: false, error: `Display name must be at least ${VALIDATION_RULES.displayName.minLength} characters` };
  }

  if (trimmed.length > VALIDATION_RULES.displayName.maxLength) {
    return { valid: false, error: `Display name must be less than ${VALIDATION_RULES.displayName.maxLength} characters` };
  }

  return { valid: true };
}

/**
 * Validates bio
 */
export function validateBio(bio: string): { valid: boolean; error?: string } {
  if (!bio || typeof bio !== 'string') {
    return { valid: true }; // Bio is optional
  }

  if (bio.length > VALIDATION_RULES.bio.maxLength) {
    return { valid: false, error: `Bio must be less than ${VALIDATION_RULES.bio.maxLength} characters` };
  }

  return { valid: true };
}

/**
 * Validates interests array
 */
export function validateInterests(interests: string[]): { valid: boolean; error?: string } {
  if (!Array.isArray(interests)) {
    return { valid: false, error: 'Interests must be an array' };
  }

  if (interests.length < VALIDATION_RULES.interests.minCount) {
    return { valid: false, error: `Please select at least ${VALIDATION_RULES.interests.minCount} interests` };
  }

  return { valid: true };
}

/**
 * Calculates profile completeness percentage
 */
export function calculateProfileCompleteness(user: Partial<User>): number {
  let score = 0;
  const weights = {
    displayName: 10,
    bio: 10,
    ageRange: 10,
    zipCode: 10,
    photoURL: 15,
    interests: 15,
    childrenAgeRanges: 10,
    relationshipStatus: 10,
    phoneNumber: 10,
    privacySettings: 10,
  };

  if (user.displayName?.trim()) score += weights.displayName;
  if (user.bio?.trim()) score += weights.bio;
  if (user.ageRange) score += weights.ageRange;
  if (user.zipCode && validateZipCode(user.zipCode)) score += weights.zipCode;
  if (user.photoURL) score += weights.photoURL;
  if (user.interests && user.interests.length >= VALIDATION_RULES.interests.minCount) score += weights.interests;
  if (user.childrenAgeRanges && user.childrenAgeRanges.length > 0) score += weights.childrenAgeRanges;
  if (user.relationshipStatus) score += weights.relationshipStatus;
  if (user.phoneNumber?.trim()) score += weights.phoneNumber;
  if (user.privacySettings) score += weights.privacySettings;

  return score;
}

/**
 * Gets age range from age number
 */
export function getAgeRangeFromAge(age: number): AgeRange {
  if (age >= 18 && age <= 24) return '18-24';
  if (age >= 25 && age <= 34) return '25-34';
  if (age >= 35 && age <= 44) return '35-44';
  if (age >= 45 && age <= 54) return '45-54';
  return '55+';
}

/**
 * Sanitizes profile for public viewing based on privacy settings
 */
export function sanitizeProfileForPublic(user: User, viewerUid?: string): PublicProfile {
  const isOwnProfile = viewerUid === user.uid;
  const privacySettings = user.privacySettings;

  // Determine if profile should be visible
  const isPublic = !privacySettings || privacySettings.profileVisibility === 'public';
  const isVerifiedOnly = privacySettings?.profileVisibility === 'verified-only';
  const isPrivate = privacySettings?.profileVisibility === 'private';

  // Base public profile
  const publicProfile: PublicProfile = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    bio: user.bio,
    ageRange: user.ageRange,
    zipCode: user.zipCode,
    interests: user.interests,
    childrenAgeRanges: user.childrenAgeRanges,
    relationshipStatus: user.relationshipStatus,
    verificationStatus: user.verificationStatus,
    profileCompleteness: user.profileCompleteness,
    lastActive: user.lastActive,
    showsExactLocation: privacySettings?.showExactLocation !== false,
    isPublic,
  };

  // Handle zip code privacy
  if (!isOwnProfile && privacySettings?.showExactLocation === false) {
    publicProfile.zipCode = user.zipCode.substring(0, 3) + 'XX';
  }

  // Handle email privacy
  if (isOwnProfile || privacySettings?.showEmail === true) {
    publicProfile.email = user.email;
  }

  // Handle phone privacy
  if (isOwnProfile || privacySettings?.showPhone === true) {
    publicProfile.phoneNumber = user.phoneNumber;
  }

  return publicProfile;
}

/**
 * Validates profile photo file
 */
export function validateProfilePhoto(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
}
