/**
 * Profile Test Fixtures
 *
 * Provides predefined profile data for testing
 */

export interface ProfileFixture {
  displayName: string;
  bio: string;
  interests: string[];
  childrenAgeRanges: string[];
  zipCode: string;
  profileImage?: string;
}

/**
 * Profile fixtures for different scenarios
 */
export const PROFILE_FIXTURES = {
  // Complete profile
  complete: {
    displayName: 'Sarah Johnson',
    bio: 'Mom of two wonderful kids. Love organizing playdates and outdoor activities!',
    interests: ['Outdoor Activities', 'Reading', 'Cooking', 'Arts & Crafts'],
    childrenAgeRanges: ['0-2', '3-5'],
    zipCode: '10001',
  },

  // Minimal profile
  minimal: {
    displayName: 'John Doe',
    bio: 'Parent looking to connect',
    interests: ['Reading', 'Sports', 'Music'],
    childrenAgeRanges: ['6-8'],
    zipCode: '10002',
  },

  // Profile with many interests
  manyInterests: {
    displayName: 'Emily Chen',
    bio: 'Active parent who loves trying new things with the kids!',
    interests: [
      'Outdoor Activities',
      'Reading',
      'Cooking',
      'Arts & Crafts',
      'Sports',
      'Music',
      'Technology',
      'Travel',
    ],
    childrenAgeRanges: ['3-5', '6-8', '9-12'],
    zipCode: '10003',
  },

  // Profile with all age ranges
  allAgeRanges: {
    displayName: 'Maria Garcia',
    bio: 'Experienced mom with kids of all ages!',
    interests: ['Parenting Tips', 'Education', 'Health & Wellness'],
    childrenAgeRanges: ['0-2', '3-5', '6-8', '9-12', '13+'],
    zipCode: '10004',
  },

  // Single parent profile
  singleParent: {
    displayName: 'Michael Brown',
    bio: 'Single dad looking for support and friendship in the community.',
    interests: ['Sports', 'Outdoor Activities', 'Gaming'],
    childrenAgeRanges: ['6-8'],
    zipCode: '10005',
  },

  // Working parent profile
  workingParent: {
    displayName: 'Lisa Wang',
    bio: 'Working mom balancing career and family. Looking for weekend playdates!',
    interests: ['Cooking', 'Reading', 'Yoga'],
    childrenAgeRanges: ['3-5'],
    zipCode: '10001',
  },

  // Stay-at-home parent
  stayAtHomeParent: {
    displayName: 'David Miller',
    bio: 'Stay-at-home dad. Available for daytime playdates and activities!',
    interests: ['Arts & Crafts', 'Music', 'Outdoor Activities'],
    childrenAgeRanges: ['0-2', '3-5'],
    zipCode: '10002',
  },
};

/**
 * Invalid profile fixtures for negative testing
 */
export const INVALID_PROFILE_FIXTURES = {
  // Empty bio
  emptyBio: {
    displayName: 'Test User',
    bio: '',
    interests: ['Reading'],
    childrenAgeRanges: ['3-5'],
    zipCode: '10001',
  },

  // Bio too long (over 500 characters)
  bioTooLong: {
    displayName: 'Test User',
    bio: 'A'.repeat(501),
    interests: ['Reading'],
    childrenAgeRanges: ['3-5'],
    zipCode: '10001',
  },

  // Too few interests (need at least 3)
  tooFewInterests: {
    displayName: 'Test User',
    bio: 'Parent looking to connect',
    interests: ['Reading'],
    childrenAgeRanges: ['3-5'],
    zipCode: '10001',
  },

  // No age ranges selected
  noAgeRanges: {
    displayName: 'Test User',
    bio: 'Parent looking to connect',
    interests: ['Reading', 'Sports', 'Music'],
    childrenAgeRanges: [],
    zipCode: '10001',
  },

  // Invalid zip code
  invalidZipCode: {
    displayName: 'Test User',
    bio: 'Parent looking to connect',
    interests: ['Reading', 'Sports', 'Music'],
    childrenAgeRanges: ['3-5'],
    zipCode: '123',
  },
};

/**
 * Available interests for profiles
 */
export const AVAILABLE_INTERESTS = [
  'Outdoor Activities',
  'Reading',
  'Cooking',
  'Arts & Crafts',
  'Sports',
  'Music',
  'Technology',
  'Travel',
  'Parenting Tips',
  'Education',
  'Health & Wellness',
  'Gaming',
  'Photography',
  'Yoga',
  'DIY Projects',
];

/**
 * Available age ranges
 */
export const AVAILABLE_AGE_RANGES = [
  '0-2',
  '3-5',
  '6-8',
  '9-12',
  '13+',
];

/**
 * Generate a random profile
 */
export function generateRandomProfile(): ProfileFixture {
  const firstNames = ['Sarah', 'John', 'Emily', 'Michael', 'Lisa', 'David', 'Maria', 'James'];
  const lastNames = ['Johnson', 'Smith', 'Chen', 'Brown', 'Garcia', 'Miller', 'Wang', 'Davis'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  const numInterests = 3 + Math.floor(Math.random() * 5);
  const interests = AVAILABLE_INTERESTS
    .sort(() => 0.5 - Math.random())
    .slice(0, numInterests);

  const numAgeRanges = 1 + Math.floor(Math.random() * 3);
  const childrenAgeRanges = AVAILABLE_AGE_RANGES
    .sort(() => 0.5 - Math.random())
    .slice(0, numAgeRanges);

  const zipCodes = ['10001', '10002', '10003', '10004', '10005'];
  const zipCode = zipCodes[Math.floor(Math.random() * zipCodes.length)];

  const bios = [
    `Parent of ${numAgeRanges === 1 ? 'one' : numAgeRanges} looking to connect!`,
    'Love organizing playdates and family activities.',
    'New to the area, excited to meet other parents!',
    'Looking for friends and support in the community.',
    'Passionate about creating fun experiences for kids.',
  ];

  return {
    displayName: `${firstName} ${lastName}`,
    bio: bios[Math.floor(Math.random() * bios.length)],
    interests,
    childrenAgeRanges,
    zipCode,
  };
}
