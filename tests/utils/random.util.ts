/**
 * Random Data Generator Utilities
 *
 * Provides functions to generate random test data
 */

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate random number between min and max (inclusive)
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random email
 */
export function randomEmail(domain: string = 'test.com'): string {
  const username = randomString(8).toLowerCase();
  return `${username}@${domain}`;
}

/**
 * Generate random password that meets requirements
 * Requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export function randomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';

  // Ensure all requirements are met
  let password = '';
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += special.charAt(Math.floor(Math.random() * special.length));

  // Fill rest with random chars
  const allChars = uppercase + lowercase + numbers + special;
  const remainingLength = randomNumber(4, 8);
  for (let i = 0; i < remainingLength; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Generate random first name
 */
export function randomFirstName(): string {
  const names = [
    'Sarah', 'John', 'Emily', 'Michael', 'Jessica', 'David',
    'Ashley', 'Christopher', 'Amanda', 'Matthew', 'Jennifer', 'Daniel',
    'Lisa', 'James', 'Michelle', 'Robert', 'Laura', 'William',
    'Nicole', 'Joseph', 'Elizabeth', 'Charles', 'Rebecca', 'Thomas'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate random last name
 */
export function randomLastName(): string {
  const names = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia',
    'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez',
    'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore',
    'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

/**
 * Generate random full name
 */
export function randomFullName(): string {
  return `${randomFirstName()} ${randomLastName()}`;
}

/**
 * Generate random display name
 */
export function randomDisplayName(): string {
  return randomFullName();
}

/**
 * Generate random phone number
 */
export function randomPhoneNumber(): string {
  const areaCode = randomNumber(200, 999);
  const exchange = randomNumber(200, 999);
  const subscriber = randomNumber(1000, 9999);
  return `${areaCode}-${exchange}-${subscriber}`;
}

/**
 * Generate random bio
 */
export function randomBio(): string {
  const hobbies = [
    'organizing playdates',
    'reading with my kids',
    'outdoor adventures',
    'arts and crafts',
    'cooking together',
    'exploring nature',
    'visiting museums',
    'playing board games'
  ];

  const descriptions = [
    'Parent of wonderful kids',
    'Mom of two energetic boys',
    'Dad to three amazing children',
    'Parent to a curious toddler',
    'Mom and teacher',
    'Dad and coach'
  ];

  const hobby = hobbies[Math.floor(Math.random() * hobbies.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  return `${description}. Love ${hobby}!`;
}

/**
 * Generate random interests (subset of available interests)
 */
export function randomInterests(count: number = 4): string[] {
  const allInterests = [
    'Outdoor Activities',
    'Reading',
    'Cooking',
    'Arts & Crafts',
    'Sports',
    'Music',
    'Science',
    'Technology',
    'Gaming',
    'Photography',
    'Gardening',
    'Fitness',
    'Travel',
    'Movies',
    'Theater'
  ];

  // Shuffle and take first 'count' items
  const shuffled = [...allInterests].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allInterests.length));
}

/**
 * Generate random age ranges
 */
export function randomAgeRanges(count: number = 2): string[] {
  const allRanges = ['0-2', '3-5', '6-8', '9-12', '13-17'];
  const shuffled = [...allRanges].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allRanges.length));
}

/**
 * Pick random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick random items from array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate random boolean
 */
export function randomBoolean(): boolean {
  return Math.random() > 0.5;
}

/**
 * Generate random UUID-like string
 */
export function randomId(): string {
  return `${randomString(8)}-${randomString(4)}-${randomString(4)}-${randomString(4)}-${randomString(12)}`;
}

/**
 * Generate random event title
 */
export function randomEventTitle(): string {
  const adjectives = ['Fun', 'Casual', 'Exciting', 'Educational', 'Active', 'Creative'];
  const activities = ['Playdate', 'Meetup', 'Workshop', 'Activity', 'Gathering', 'Event'];
  const locations = ['at the Park', 'at the Library', 'at the Museum', 'at the Playground', 'Downtown'];

  const adjective = randomItem(adjectives);
  const activity = randomItem(activities);
  const location = randomBoolean() ? ` ${randomItem(locations)}` : '';

  return `${adjective} ${activity}${location}`;
}

/**
 * Generate random event description
 */
export function randomEventDescription(): string {
  const templates = [
    'Join us for a fun activity with other parents and kids!',
    'A great opportunity to meet other families in the area.',
    'Bring your kids for a fun and engaging experience.',
    'Connect with other parents while the kids play together.',
    'Educational and entertaining event for the whole family.'
  ];

  return randomItem(templates);
}

/**
 * Generate random location
 */
export function randomLocation(): string {
  const venues = [
    'Central Park',
    'Public Library',
    'Community Center',
    'Children\'s Museum',
    'Recreation Center',
    'Botanical Garden',
    'City Playground',
    'Sports Complex'
  ];

  const streets = [
    '123 Main St',
    '456 Oak Ave',
    '789 Elm St',
    '321 Pine Rd',
    '654 Maple Dr'
  ];

  const venue = randomItem(venues);
  const street = randomItem(streets);

  return `${venue}, ${street}`;
}

/**
 * Generate random message content
 */
export function randomMessageContent(): string {
  const messages = [
    'Hi! Would you like to connect?',
    'I saw your profile and thought we might have similar interests.',
    'Are you interested in setting up a playdate?',
    'Would you like to meet up sometime?',
    'Your kids seem to be around the same age as mine!',
    'I love your profile! Let\'s chat.',
    'Do you go to the playground on weekends?',
    'Have you been to the children\'s museum yet?'
  ];

  return randomItem(messages);
}

/**
 * Generate random username
 */
export function randomUsername(): string {
  return `${randomFirstName().toLowerCase()}${randomNumber(100, 999)}`;
}

/**
 * Generate test data with random fields
 */
export function randomTestUser() {
  return {
    email: randomEmail(),
    password: randomPassword(),
    displayName: randomFullName(),
    bio: randomBio(),
    interests: randomInterests(),
    phoneNumber: randomPhoneNumber(),
  };
}
