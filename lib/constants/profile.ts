/**
 * Profile-related constants
 */

import { AgeRange, RelationshipStatus } from '@/types/user';

export const AGE_RANGES: AgeRange[] = [
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55+',
];

export const CHILDREN_AGE_RANGES = [
  'Expecting',
  '0-2',
  '3-5',
  '6-12',
  '13-17',
  '18+',
];

export const INTERESTS = [
  'Playdates',
  'Parenting Tips',
  'Local Events',
  'Education',
  'Health & Wellness',
  'Activities',
  'Sports',
  'Arts & Crafts',
  'Reading',
  'Outdoor Activities',
  'Music',
  'Food & Cooking',
  'Travel',
  'Technology',
  'Work-Life Balance',
  'Special Needs',
  'Single Parenting',
  'Co-parenting',
  'Adoption',
  'Foster Care',
];

export const RELATIONSHIP_STATUSES: { value: RelationshipStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'partnered', label: 'Partnered' },
  { value: 'married', label: 'Married' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

export const DEFAULT_PRIVACY_SETTINGS = {
  showEmail: false,
  showPhone: false,
  showExactLocation: true,
  profileVisibility: 'public' as const,
};

export const PROFILE_PHOTO_MAX_SIZE = 5 * 1024 * 1024; // 5MB
export const PROFILE_PHOTO_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const VALIDATION_RULES = {
  displayName: {
    minLength: 2,
    maxLength: 50,
  },
  bio: {
    maxLength: 500,
  },
  interests: {
    minCount: 3,
  },
  zipCode: {
    length: 5,
    pattern: /^\d{5}$/,
  },
};
