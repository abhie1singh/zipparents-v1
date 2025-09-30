/**
 * User type definitions
 */

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
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
