/**
 * Utility functions for zip code proximity calculations
 * Uses simplified US zip code data for proximity matching
 */

// Simplified zip code database with major US zip codes and their coordinates
// In a production app, this would be a full database or external API
export const ZIP_CODE_DATABASE: Record<string, { lat: number; lng: number }> = {
  // New York
  '10001': { lat: 40.7506, lng: -73.9971 },
  '10002': { lat: 40.7155, lng: -73.9862 },
  '10003': { lat: 40.7311, lng: -73.9880 },
  '10004': { lat: 40.6899, lng: -74.0165 },
  '10005': { lat: 40.7060, lng: -74.0086 },
  '10006': { lat: 40.7091, lng: -74.0127 },
  '10007': { lat: 40.7134, lng: -74.0080 },
  '10009': { lat: 40.7264, lng: -73.9780 },
  '10010': { lat: 40.7390, lng: -73.9819 },
  '10011': { lat: 40.7406, lng: -74.0008 },
  '10012': { lat: 40.7255, lng: -73.9983 },
  '10013': { lat: 40.7206, lng: -74.0041 },
  '10014': { lat: 40.7341, lng: -74.0065 },
  '10016': { lat: 40.7450, lng: -73.9786 },
  '10017': { lat: 40.7519, lng: -73.9724 },
  '10018': { lat: 40.7553, lng: -73.9933 },
  '10019': { lat: 40.7656, lng: -73.9863 },
  '10020': { lat: 40.7586, lng: -73.9787 },
  '10021': { lat: 40.7686, lng: -73.9588 },
  '10022': { lat: 40.7583, lng: -73.9675 },
  '10023': { lat: 40.7762, lng: -73.9822 },
  '10024': { lat: 40.7932, lng: -73.9736 },
  '10025': { lat: 40.7985, lng: -73.9665 },
  '10026': { lat: 40.8019, lng: -73.9524 },
  '10027': { lat: 40.8116, lng: -73.9533 },
  '10028': { lat: 40.7764, lng: -73.9532 },
  '10029': { lat: 40.7917, lng: -73.9438 },
  '10030': { lat: 40.8183, lng: -73.9428 },
  '10031': { lat: 40.8252, lng: -73.9496 },
  '10032': { lat: 40.8388, lng: -73.9423 },
  '10033': { lat: 40.8500, lng: -73.9343 },
  '10034': { lat: 40.8674, lng: -73.9226 },
  '10035': { lat: 40.7948, lng: -73.9291 },
  '10036': { lat: 40.7594, lng: -73.9908 },
  '10037': { lat: 40.8128, lng: -73.9372 },
  '10038': { lat: 40.7092, lng: -74.0026 },
  '10039': { lat: 40.8291, lng: -73.9360 },
  '10040': { lat: 40.8583, lng: -73.9302 },

  // Los Angeles
  '90001': { lat: 33.9731, lng: -118.2479 },
  '90002': { lat: 33.9495, lng: -118.2467 },
  '90003': { lat: 33.9642, lng: -118.2728 },
  '90004': { lat: 34.0760, lng: -118.3095 },
  '90005': { lat: 34.0599, lng: -118.3089 },
  '90006': { lat: 34.0484, lng: -118.2929 },
  '90007': { lat: 34.0278, lng: -118.2850 },
  '90008': { lat: 34.0087, lng: -118.3407 },
  '90010': { lat: 34.0620, lng: -118.2954 },
  '90011': { lat: 33.9980, lng: -118.2583 },
  '90012': { lat: 34.0639, lng: -118.2378 },
  '90013': { lat: 34.0446, lng: -118.2467 },
  '90014': { lat: 34.0433, lng: -118.2528 },
  '90015': { lat: 34.0408, lng: -118.2672 },
  '90016': { lat: 34.0280, lng: -118.3520 },
  '90017': { lat: 34.0549, lng: -118.2595 },
  '90018': { lat: 34.0262, lng: -118.3089 },
  '90019': { lat: 34.0426, lng: -118.3252 },
  '90020': { lat: 34.0668, lng: -118.3091 },
  '90021': { lat: 34.0318, lng: -118.2362 },
  '90022': { lat: 34.0246, lng: -118.1554 },
  '90023': { lat: 34.0210, lng: -118.2073 },
  '90024': { lat: 34.0634, lng: -118.4455 },
  '90025': { lat: 34.0500, lng: -118.4428 },
  '90026': { lat: 34.0775, lng: -118.2654 },
  '90027': { lat: 34.1066, lng: -118.2939 },
  '90028': { lat: 34.0990, lng: -118.3267 },

  // Chicago
  '60601': { lat: 41.8853, lng: -87.6246 },
  '60602': { lat: 41.8830, lng: -87.6293 },
  '60603': { lat: 41.8801, lng: -87.6290 },
  '60604': { lat: 41.8766, lng: -87.6290 },
  '60605': { lat: 41.8689, lng: -87.6194 },
  '60606': { lat: 41.8822, lng: -87.6386 },
  '60607': { lat: 41.8738, lng: -87.6531 },
  '60608': { lat: 41.8530, lng: -87.6714 },
  '60609': { lat: 41.8104, lng: -87.6514 },
  '60610': { lat: 41.9028, lng: -87.6369 },
  '60611': { lat: 41.8969, lng: -87.6233 },
  '60612': { lat: 41.8804, lng: -87.6867 },
  '60613': { lat: 41.9541, lng: -87.6564 },
  '60614': { lat: 41.9230, lng: -87.6529 },
  '60615': { lat: 41.8047, lng: -87.6009 },
  '60616': { lat: 41.8486, lng: -87.6308 },
  '60617': { lat: 41.7251, lng: -87.5578 },
  '60618': { lat: 41.9456, lng: -87.7034 },
  '60619': { lat: 41.7490, lng: -87.6061 },
  '60620': { lat: 41.7412, lng: -87.6500 },

  // San Francisco
  '94102': { lat: 37.7799, lng: -122.4194 },
  '94103': { lat: 37.7725, lng: -122.4108 },
  '94104': { lat: 37.7918, lng: -122.4021 },
  '94105': { lat: 37.7864, lng: -122.3892 },
  '94107': { lat: 37.7620, lng: -122.3991 },
  '94108': { lat: 37.7916, lng: -122.4078 },
  '94109': { lat: 37.7928, lng: -122.4205 },
  '94110': { lat: 37.7485, lng: -122.4147 },
  '94111': { lat: 37.7983, lng: -122.4039 },
  '94112': { lat: 37.7210, lng: -122.4420 },
  '94114': { lat: 37.7574, lng: -122.4350 },
  '94115': { lat: 37.7849, lng: -122.4372 },
  '94116': { lat: 37.7436, lng: -122.4855 },
  '94117': { lat: 37.7702, lng: -122.4408 },
  '94118': { lat: 37.7815, lng: -122.4616 },
  '94121': { lat: 37.7767, lng: -122.4935 },
  '94122': { lat: 37.7594, lng: -122.4864 },
  '94123': { lat: 37.8000, lng: -122.4367 },
  '94124': { lat: 37.7318, lng: -122.3899 },
  '94127': { lat: 37.7346, lng: -122.4592 },
  '94131': { lat: 37.7421, lng: -122.4371 },
  '94132': { lat: 37.7223, lng: -122.4770 },
  '94133': { lat: 37.8008, lng: -122.4098 },
  '94134': { lat: 37.7197, lng: -122.4148 },
};

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in miles
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Radius of the Earth in miles
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get coordinates for a zip code
 * @param zipCode 5-digit zip code
 * @returns Coordinates or null if not found
 */
export function getZipCodeCoordinates(zipCode: string): { lat: number; lng: number } | null {
  return ZIP_CODE_DATABASE[zipCode] || null;
}

/**
 * Calculate distance between two zip codes
 * @param zipCode1 First zip code
 * @param zipCode2 Second zip code
 * @returns Distance in miles or null if either zip code is invalid
 */
export function getZipCodeDistance(zipCode1: string, zipCode2: string): number | null {
  const coords1 = getZipCodeCoordinates(zipCode1);
  const coords2 = getZipCodeCoordinates(zipCode2);

  if (!coords1 || !coords2) {
    return null;
  }

  return calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
}

/**
 * Check if two zip codes are within a certain radius
 * @param zipCode1 First zip code
 * @param zipCode2 Second zip code
 * @param radiusMiles Maximum distance in miles
 * @returns True if within radius, false otherwise
 */
export function isWithinRadius(
  zipCode1: string,
  zipCode2: string,
  radiusMiles: number
): boolean {
  const distance = getZipCodeDistance(zipCode1, zipCode2);
  return distance !== null && distance <= radiusMiles;
}

/**
 * Filter a list of zip codes by proximity to a target zip code
 * @param targetZipCode The zip code to search from
 * @param zipCodes List of zip codes to filter
 * @param radiusMiles Maximum distance in miles
 * @returns Array of zip codes within the radius, sorted by distance
 */
export function filterZipCodesByProximity(
  targetZipCode: string,
  zipCodes: string[],
  radiusMiles: number
): Array<{ zipCode: string; distance: number }> {
  const results: Array<{ zipCode: string; distance: number }> = [];

  for (const zipCode of zipCodes) {
    const distance = getZipCodeDistance(targetZipCode, zipCode);
    if (distance !== null && distance <= radiusMiles) {
      results.push({ zipCode, distance });
    }
  }

  // Sort by distance, closest first
  return results.sort((a, b) => a.distance - b.distance);
}

/**
 * Get all zip codes within a radius of a target zip code
 * @param targetZipCode The zip code to search from
 * @param radiusMiles Maximum distance in miles
 * @returns Array of zip codes within the radius, sorted by distance
 */
export function getZipCodesWithinRadius(
  targetZipCode: string,
  radiusMiles: number
): Array<{ zipCode: string; distance: number }> {
  const allZipCodes = Object.keys(ZIP_CODE_DATABASE);
  return filterZipCodesByProximity(targetZipCode, allZipCodes, radiusMiles);
}

/**
 * Common search radius options in miles
 */
export const SEARCH_RADIUS_OPTIONS = [5, 10, 25, 50, 100] as const;
export type SearchRadius = typeof SEARCH_RADIUS_OPTIONS[number];

/**
 * Default search radius in miles
 */
export const DEFAULT_SEARCH_RADIUS: SearchRadius = 25;
