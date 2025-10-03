/**
 * User Factory
 *
 * Factory for generating user test data dynamically
 */

import {
  randomEmail,
  randomPassword,
  randomFullName,
  randomBio,
  randomInterests,
  randomAgeRanges,
  randomPhoneNumber,
} from '../utils/random.util';
import { getAdultDateOfBirth, getMinorDateOfBirth } from '../utils/date.util';
import { getRandomZipCode } from '../utils/zipcode.util';

export interface UserFactoryOptions {
  email?: string;
  password?: string;
  displayName?: string;
  dateOfBirth?: string;
  zipCode?: string;
  phoneNumber?: string;
  bio?: string;
  interests?: string[];
  childrenAgeRanges?: string[];
  role?: 'user' | 'admin';
  emailVerified?: boolean;
  ageVerified?: boolean;
  status?: 'active' | 'suspended' | 'banned';
  profileComplete?: boolean;
}

/**
 * User Factory Class
 */
export class UserFactory {
  /**
   * Create a basic user
   */
  static createUser(options: UserFactoryOptions = {}): any {
    return {
      email: options.email || randomEmail(),
      password: options.password || randomPassword(),
      displayName: options.displayName || randomFullName(),
      dateOfBirth: options.dateOfBirth || getAdultDateOfBirth(),
      zipCode: options.zipCode || getRandomZipCode(),
      phoneNumber: options.phoneNumber || randomPhoneNumber(),
      role: options.role || 'user',
      emailVerified: options.emailVerified ?? false,
      ageVerified: options.ageVerified ?? false,
      status: options.status || 'active',
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Create a verified user
   */
  static createVerifiedUser(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      emailVerified: true,
      ageVerified: true,
    });
  }

  /**
   * Create an unverified user
   */
  static createUnverifiedUser(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      emailVerified: false,
      ageVerified: false,
    });
  }

  /**
   * Create an admin user
   */
  static createAdmin(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      role: 'admin',
      emailVerified: true,
      ageVerified: true,
    });
  }

  /**
   * Create a suspended user
   */
  static createSuspendedUser(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      status: 'suspended',
      suspendedAt: new Date().toISOString(),
      suspendedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      suspensionReason: 'Violation of community guidelines',
    });
  }

  /**
   * Create a banned user
   */
  static createBannedUser(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      status: 'banned',
      bannedAt: new Date().toISOString(),
      banReason: 'Multiple violations of terms of service',
    });
  }

  /**
   * Create user with complete profile
   */
  static createUserWithProfile(options: UserFactoryOptions = {}): any {
    return {
      ...this.createVerifiedUser(options),
      bio: options.bio || randomBio(),
      interests: options.interests || randomInterests(),
      childrenAgeRanges: options.childrenAgeRanges || randomAgeRanges(),
      profileComplete: true,
    };
  }

  /**
   * Create minor (under 18) - for negative testing
   */
  static createMinor(options: UserFactoryOptions = {}): any {
    return this.createUser({
      ...options,
      dateOfBirth: getMinorDateOfBirth(),
      ageVerified: false,
    });
  }

  /**
   * Create batch of users
   */
  static createBatch(count: number, options: UserFactoryOptions = {}): any[] {
    const users: any[] = [];
    for (let i = 0; i < count; i++) {
      users.push(this.createUser(options));
    }
    return users;
  }

  /**
   * Create batch of verified users
   */
  static createVerifiedBatch(count: number, options: UserFactoryOptions = {}): any[] {
    const users: any[] = [];
    for (let i = 0; i < count; i++) {
      users.push(this.createVerifiedUser(options));
    }
    return users;
  }

  /**
   * Create signup data
   */
  static createSignupData(options: UserFactoryOptions = {}): any {
    const password = options.password || randomPassword();
    return {
      email: options.email || randomEmail(),
      password,
      confirmPassword: password,
      dateOfBirth: options.dateOfBirth || getAdultDateOfBirth(),
      zipCode: options.zipCode || getRandomZipCode(),
      acceptTerms: true,
    };
  }

  /**
   * Create login credentials
   */
  static createLoginCredentials(options: UserFactoryOptions = {}): any {
    return {
      email: options.email || randomEmail(),
      password: options.password || randomPassword(),
    };
  }

  /**
   * Create user for specific test scenario
   */
  static createForScenario(scenario: 'new-user' | 'active-user' | 'power-user' | 'inactive-user'): any {
    switch (scenario) {
      case 'new-user':
        return this.createVerifiedUser({ profileComplete: false });

      case 'active-user':
        return this.createUserWithProfile({
          emailVerified: true,
          ageVerified: true,
        });

      case 'power-user':
        return this.createUserWithProfile({
          emailVerified: true,
          ageVerified: true,
          interests: randomInterests(8), // More interests
          childrenAgeRanges: randomAgeRanges(3), // More age ranges
        });

      case 'inactive-user':
        return this.createVerifiedUser({
          lastActiveAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
        });

      default:
        return this.createUser();
    }
  }
}
