/**
 * Zip Code Utility Functions
 *
 * Provides zip code test data and validation utilities
 */

/**
 * Test zip codes by region
 */
export const TEST_ZIP_CODES = {
  // Northeast
  newYork: '10001',
  boston: '02101',
  philadelphia: '19019',
  washington: '20001',

  // Southeast
  atlanta: '30301',
  miami: '33101',
  charlotte: '28201',
  nashville: '37201',

  // Midwest
  chicago: '60601',
  detroit: '48201',
  cleveland: '44101',
  minneapolis: '55401',

  // Southwest
  dallas: '75201',
  houston: '77001',
  austin: '78701',
  phoenix: '85001',

  // West
  losAngeles: '90001',
  sanFrancisco: '94101',
  seattle: '98101',
  portland: '97201',

  // Mountain
  denver: '80201',
  saltLakeCity: '84101',
  albuquerque: '87101',
  boise: '83701',
};

/**
 * All test zip codes as array
 */
export const ALL_TEST_ZIP_CODES = Object.values(TEST_ZIP_CODES);

/**
 * Valid zip code patterns for testing
 */
export const VALID_ZIP_CODES = [
  '10001', // New York
  '90001', // Los Angeles
  '60601', // Chicago
  '77001', // Houston
  '85001', // Phoenix
  '19019', // Philadelphia
  '78701', // Austin
  '94101', // San Francisco
  '98101', // Seattle
  '02101', // Boston
];

/**
 * Invalid zip codes for negative testing
 */
export const INVALID_ZIP_CODES = [
  '00000', // All zeros
  '99999', // Non-existent
  '12345', // Generic
  'ABCDE', // Letters
  '123',   // Too short
  '123456', // Too long
  '',      // Empty
  '1234a', // Mixed
];

/**
 * Get random valid zip code
 */
export function getRandomZipCode(): string {
  return VALID_ZIP_CODES[Math.floor(Math.random() * VALID_ZIP_CODES.length)];
}

/**
 * Get random invalid zip code
 */
export function getRandomInvalidZipCode(): string {
  return INVALID_ZIP_CODES[Math.floor(Math.random() * INVALID_ZIP_CODES.length)];
}

/**
 * Validate zip code format (5 digits)
 */
export function isValidZipCodeFormat(zipCode: string): boolean {
  return /^\d{5}$/.test(zipCode);
}

/**
 * Get zip codes for specific region
 */
export function getZipCodesForRegion(region: 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west' | 'mountain'): string[] {
  const regions = {
    northeast: [TEST_ZIP_CODES.newYork, TEST_ZIP_CODES.boston, TEST_ZIP_CODES.philadelphia, TEST_ZIP_CODES.washington],
    southeast: [TEST_ZIP_CODES.atlanta, TEST_ZIP_CODES.miami, TEST_ZIP_CODES.charlotte, TEST_ZIP_CODES.nashville],
    midwest: [TEST_ZIP_CODES.chicago, TEST_ZIP_CODES.detroit, TEST_ZIP_CODES.cleveland, TEST_ZIP_CODES.minneapolis],
    southwest: [TEST_ZIP_CODES.dallas, TEST_ZIP_CODES.houston, TEST_ZIP_CODES.austin, TEST_ZIP_CODES.phoenix],
    west: [TEST_ZIP_CODES.losAngeles, TEST_ZIP_CODES.sanFrancisco, TEST_ZIP_CODES.seattle, TEST_ZIP_CODES.portland],
    mountain: [TEST_ZIP_CODES.denver, TEST_ZIP_CODES.saltLakeCity, TEST_ZIP_CODES.albuquerque, TEST_ZIP_CODES.boise],
  };

  return regions[region];
}

/**
 * Get nearby zip codes (for testing proximity features)
 * Returns array of zip codes that could be considered "nearby"
 */
export function getNearbyZipCodes(baseZipCode: string): string[] {
  // Map of zip codes to their "nearby" codes for testing
  const nearbyMap: Record<string, string[]> = {
    '10001': ['10002', '10003', '10004', '10005'], // NYC
    '90001': ['90002', '90003', '90004', '90005'], // LA
    '60601': ['60602', '60603', '60604', '60605'], // Chicago
    '77001': ['77002', '77003', '77004', '77005'], // Houston
    '85001': ['85002', '85003', '85004', '85005'], // Phoenix
  };

  return nearbyMap[baseZipCode] || [];
}

/**
 * Get distant zip codes (for testing distance filtering)
 * Returns array of zip codes that are far from the base
 */
export function getDistantZipCodes(baseZipCode: string): string[] {
  // Map of zip codes to distant codes for testing
  const distantMap: Record<string, string[]> = {
    '10001': ['90001', '85001', '98101'], // NYC -> LA, Phoenix, Seattle
    '90001': ['10001', '02101', '33101'], // LA -> NYC, Boston, Miami
    '60601': ['94101', '85001', '33101'], // Chicago -> SF, Phoenix, Miami
  };

  return distantMap[baseZipCode] || [];
}

/**
 * Zip code test data with city names
 */
export const ZIP_CODE_DATA = [
  { zipCode: '10001', city: 'New York', state: 'NY', region: 'Northeast' },
  { zipCode: '90001', city: 'Los Angeles', state: 'CA', region: 'West' },
  { zipCode: '60601', city: 'Chicago', state: 'IL', region: 'Midwest' },
  { zipCode: '77001', city: 'Houston', state: 'TX', region: 'Southwest' },
  { zipCode: '85001', city: 'Phoenix', state: 'AZ', region: 'Southwest' },
  { zipCode: '19019', city: 'Philadelphia', state: 'PA', region: 'Northeast' },
  { zipCode: '78701', city: 'Austin', state: 'TX', region: 'Southwest' },
  { zipCode: '94101', city: 'San Francisco', state: 'CA', region: 'West' },
  { zipCode: '98101', city: 'Seattle', state: 'WA', region: 'West' },
  { zipCode: '02101', city: 'Boston', state: 'MA', region: 'Northeast' },
  { zipCode: '30301', city: 'Atlanta', state: 'GA', region: 'Southeast' },
  { zipCode: '33101', city: 'Miami', state: 'FL', region: 'Southeast' },
  { zipCode: '80201', city: 'Denver', state: 'CO', region: 'Mountain' },
  { zipCode: '97201', city: 'Portland', state: 'OR', region: 'West' },
];

/**
 * Get city name for zip code
 */
export function getCityForZipCode(zipCode: string): string | null {
  const data = ZIP_CODE_DATA.find(d => d.zipCode === zipCode);
  return data ? data.city : null;
}

/**
 * Get state for zip code
 */
export function getStateForZipCode(zipCode: string): string | null {
  const data = ZIP_CODE_DATA.find(d => d.zipCode === zipCode);
  return data ? data.state : null;
}

/**
 * Get region for zip code
 */
export function getRegionForZipCode(zipCode: string): string | null {
  const data = ZIP_CODE_DATA.find(d => d.zipCode === zipCode);
  return data ? data.region : null;
}

/**
 * Format zip code (ensure 5 digits with leading zeros)
 */
export function formatZipCode(zipCode: string | number): string {
  return String(zipCode).padStart(5, '0');
}

/**
 * Check if two zip codes are in the same region
 */
export function areInSameRegion(zipCode1: string, zipCode2: string): boolean {
  const region1 = getRegionForZipCode(zipCode1);
  const region2 = getRegionForZipCode(zipCode2);
  return region1 !== null && region1 === region2;
}

/**
 * Get zip codes for testing search radius
 * Returns different sets based on radius
 */
export function getZipCodesInRadius(centerZipCode: string, radiusMiles: number): string[] {
  if (radiusMiles <= 5) {
    return getNearbyZipCodes(centerZipCode).slice(0, 2);
  } else if (radiusMiles <= 25) {
    return getNearbyZipCodes(centerZipCode);
  } else {
    // Include nearby and some distant for larger radius
    return [...getNearbyZipCodes(centerZipCode), ...getDistantZipCodes(centerZipCode).slice(0, 2)];
  }
}
