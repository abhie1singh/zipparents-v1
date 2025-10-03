/**
 * Profile Factory
 *
 * Factory for generating profile test data dynamically
 */

import {
  randomFullName,
  randomBio,
  randomInterests,
  randomAgeRanges,
  randomPhoneNumber,
} from '../utils/random.util';
import { getRandomZipCode } from '../utils/zipcode.util';

export interface ProfileFactoryOptions {
  displayName?: string;
  bio?: string;
  zipCode?: string;
  phoneNumber?: string;
  interests?: string[];
  childrenAgeRanges?: string[];
  profilePictureUrl?: string;
  coverPhotoUrl?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

/**
 * Profile Factory Class
 */
export class ProfileFactory {
  /**
   * Create a basic profile
   */
  static createProfile(options: ProfileFactoryOptions = {}): any {
    return {
      displayName: options.displayName || randomFullName(),
      bio: options.bio || randomBio(),
      zipCode: options.zipCode || getRandomZipCode(),
      phoneNumber: options.phoneNumber || randomPhoneNumber(),
      interests: options.interests || randomInterests(),
      childrenAgeRanges: options.childrenAgeRanges || randomAgeRanges(),
      profilePictureUrl: options.profilePictureUrl || null,
      coverPhotoUrl: options.coverPhotoUrl || null,
      website: options.website || null,
      socialLinks: options.socialLinks || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create a minimal profile (only required fields)
   */
  static createMinimalProfile(options: ProfileFactoryOptions = {}): any {
    return {
      displayName: options.displayName || randomFullName(),
      bio: options.bio || randomBio(),
      zipCode: options.zipCode || getRandomZipCode(),
      interests: options.interests || randomInterests(2),
      childrenAgeRanges: options.childrenAgeRanges || randomAgeRanges(1),
    };
  }

  /**
   * Create a complete profile (all fields filled)
   */
  static createCompleteProfile(options: ProfileFactoryOptions = {}): any {
    return {
      ...this.createProfile(options),
      profilePictureUrl: options.profilePictureUrl || 'https://example.com/profile.jpg',
      coverPhotoUrl: options.coverPhotoUrl || 'https://example.com/cover.jpg',
      website: options.website || 'https://example.com',
      socialLinks: options.socialLinks || {
        facebook: 'https://facebook.com/user',
        instagram: 'https://instagram.com/user',
        twitter: 'https://twitter.com/user',
      },
      interests: options.interests || randomInterests(6),
      childrenAgeRanges: options.childrenAgeRanges || randomAgeRanges(2),
    };
  }

  /**
   * Create profile with many interests
   */
  static createProfileWithManyInterests(options: ProfileFactoryOptions = {}): any {
    return this.createProfile({
      ...options,
      interests: randomInterests(10),
    });
  }

  /**
   * Create profile with all age ranges
   */
  static createProfileWithAllAgeRanges(options: ProfileFactoryOptions = {}): any {
    return this.createProfile({
      ...options,
      childrenAgeRanges: ['0-2', '3-5', '6-8', '9-12', '13-17'],
    });
  }

  /**
   * Create profile update data
   */
  static createProfileUpdate(options: ProfileFactoryOptions = {}): any {
    return {
      displayName: options.displayName,
      bio: options.bio,
      interests: options.interests,
      childrenAgeRanges: options.childrenAgeRanges,
      website: options.website,
      socialLinks: options.socialLinks,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create invalid profile (for negative testing)
   */
  static createInvalidProfile(invalidField: 'bio' | 'interests' | 'ageRanges' | 'displayName'): any {
    const baseProfile = this.createProfile();

    switch (invalidField) {
      case 'bio':
        return { ...baseProfile, bio: '' }; // Empty bio

      case 'interests':
        return { ...baseProfile, interests: [] }; // No interests

      case 'ageRanges':
        return { ...baseProfile, childrenAgeRanges: [] }; // No age ranges

      case 'displayName':
        return { ...baseProfile, displayName: '' }; // Empty display name

      default:
        return baseProfile;
    }
  }

  /**
   * Create profile for specific scenario
   */
  static createForScenario(scenario: 'new-parent' | 'experienced-parent' | 'multi-age-parent'): any {
    switch (scenario) {
      case 'new-parent':
        return this.createProfile({
          childrenAgeRanges: ['0-2'],
          interests: randomInterests(3),
        });

      case 'experienced-parent':
        return this.createProfile({
          childrenAgeRanges: ['6-8', '9-12'],
          interests: randomInterests(8),
        });

      case 'multi-age-parent':
        return this.createProfile({
          childrenAgeRanges: ['0-2', '3-5', '6-8'],
          interests: randomInterests(6),
        });

      default:
        return this.createProfile();
    }
  }

  /**
   * Create batch of profiles
   */
  static createBatch(count: number, options: ProfileFactoryOptions = {}): any[] {
    const profiles: any[] = [];
    for (let i = 0; i < count; i++) {
      profiles.push(this.createProfile(options));
    }
    return profiles;
  }

  /**
   * Create profile with specific zip code
   */
  static createProfileInZipCode(zipCode: string, options: ProfileFactoryOptions = {}): any {
    return this.createProfile({
      ...options,
      zipCode,
    });
  }

  /**
   * Create profile with specific interests
   */
  static createProfileWithInterests(interests: string[], options: ProfileFactoryOptions = {}): any {
    return this.createProfile({
      ...options,
      interests,
    });
  }

  /**
   * Create profile with specific age ranges
   */
  static createProfileWithAgeRanges(ageRanges: string[], options: ProfileFactoryOptions = {}): any {
    return this.createProfile({
      ...options,
      childrenAgeRanges: ageRanges,
    });
  }
}
