/**
 * Search service for finding parents by filters
 */

import { getFirestore, collection, query, where, getDocs, Query, DocumentData, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { getZipCodeDistance, filterZipCodesByProximity, DEFAULT_SEARCH_RADIUS, SearchRadius } from '../utils/zipcode';
import { PublicProfile } from '@/types/profile';
import { AgeRange, RelationshipStatus } from '@/types/user';

export interface SearchFilters {
  zipCode: string;
  radius?: SearchRadius;
  ageRange?: AgeRange | AgeRange[];
  interests?: string[];
  childrenAgeRanges?: string[];
  relationshipStatus?: RelationshipStatus[];
  limit?: number;
}

export interface SearchResult {
  profile: PublicProfile;
  distance: number | null;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}

/**
 * Search for parents based on filters
 * @param currentUserId The ID of the user performing the search (to exclude them)
 * @param filters Search filters
 * @returns Search results with distance calculations
 */
export async function searchParents(
  currentUserId: string,
  filters: SearchFilters
): Promise<SearchResponse> {
  const db = getFirestore();
  const profilesRef = collection(db, 'profiles');

  // Build Firestore query
  let q: Query<DocumentData> = query(profilesRef);

  // Always exclude current user
  q = query(q, where('uid', '!=', currentUserId));

  // Filter by age range if specified
  if (filters.ageRange) {
    const ageRanges = Array.isArray(filters.ageRange) ? filters.ageRange : [filters.ageRange];
    q = query(q, where('ageRange', 'in', ageRanges));
  }

  // Filter by relationship status if specified
  if (filters.relationshipStatus && filters.relationshipStatus.length > 0) {
    q = query(q, where('relationshipStatus', 'in', filters.relationshipStatus));
  }

  // Filter by interests if specified (array-contains only works with one value)
  if (filters.interests && filters.interests.length > 0) {
    // For now, we'll filter by the first interest and do additional filtering in memory
    q = query(q, where('interests', 'array-contains', filters.interests[0]));
  }

  // Filter by children age ranges if specified
  if (filters.childrenAgeRanges && filters.childrenAgeRanges.length > 0) {
    // Similar to interests, array-contains works with one value
    q = query(q, where('childrenAgeRanges', 'array-contains', filters.childrenAgeRanges[0]));
  }

  // Add limit
  const queryLimit = filters.limit || 50;
  q = query(q, firestoreLimit(queryLimit + 1)); // Get one extra to check if there are more results

  // Execute query
  const snapshot = await getDocs(q);

  // Convert to profiles
  let profiles: PublicProfile[] = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data() as Omit<PublicProfile, 'uid'>
  }));

  // Filter by additional interests in memory (if more than one specified)
  if (filters.interests && filters.interests.length > 1) {
    profiles = profiles.filter(profile => {
      if (!profile.interests) return false;
      return filters.interests!.some(interest => profile.interests!.includes(interest));
    });
  }

  // Filter by additional children age ranges in memory (if more than one specified)
  if (filters.childrenAgeRanges && filters.childrenAgeRanges.length > 1) {
    profiles = profiles.filter(profile => {
      if (!profile.childrenAgeRanges) return false;
      return filters.childrenAgeRanges!.some(range => profile.childrenAgeRanges!.includes(range));
    });
  }

  // Calculate distances and filter by radius
  const radius = filters.radius || DEFAULT_SEARCH_RADIUS;
  const resultsWithDistance: SearchResult[] = profiles
    .map(profile => {
      const distance = getZipCodeDistance(filters.zipCode, profile.zipCode);
      return {
        profile,
        distance
      };
    })
    .filter(result => {
      // Filter out profiles with invalid zip codes or outside radius
      return result.distance !== null && result.distance <= radius;
    })
    .sort((a, b) => {
      // Sort by distance, closest first
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  // Check if there are more results
  const hasMore = resultsWithDistance.length > queryLimit;
  const results = hasMore ? resultsWithDistance.slice(0, queryLimit) : resultsWithDistance;

  return {
    results,
    total: results.length,
    hasMore
  };
}

/**
 * Get nearby parents (simple search by zip code and radius only)
 * @param currentUserId Current user's ID
 * @param zipCode User's zip code
 * @param radius Search radius in miles
 * @param limitCount Maximum number of results
 * @returns Nearby parents sorted by distance
 */
export async function getNearbyParents(
  currentUserId: string,
  zipCode: string,
  radius: SearchRadius = DEFAULT_SEARCH_RADIUS,
  limitCount: number = 20
): Promise<SearchResult[]> {
  const result = await searchParents(currentUserId, {
    zipCode,
    radius,
    limit: limitCount
  });

  return result.results;
}

/**
 * Search for parents with similar interests
 * @param currentUserId Current user's ID
 * @param currentUserProfile Current user's profile for matching
 * @param radius Search radius in miles
 * @param limitCount Maximum number of results
 * @returns Parents with matching interests sorted by distance
 */
export async function searchSimilarParents(
  currentUserId: string,
  currentUserProfile: PublicProfile,
  radius: SearchRadius = DEFAULT_SEARCH_RADIUS,
  limitCount: number = 20
): Promise<SearchResult[]> {
  if (!currentUserProfile.interests || currentUserProfile.interests.length === 0) {
    // Fall back to nearby search if user has no interests
    return getNearbyParents(currentUserId, currentUserProfile.zipCode, radius, limitCount);
  }

  const result = await searchParents(currentUserId, {
    zipCode: currentUserProfile.zipCode,
    radius,
    interests: currentUserProfile.interests,
    limit: limitCount
  });

  return result.results;
}
