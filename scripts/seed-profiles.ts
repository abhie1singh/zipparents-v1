/**
 * Seed Profiles Script
 *
 * Creates complete profiles for all seeded users
 */

import * as admin from 'firebase-admin';
import {
  initializeAdmin,
  getFirestore,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

const INTERESTS = [
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
  'Theater',
];

const AGE_RANGES = ['0-2', '3-5', '6-8', '9-12', '13-17'];

const BIOS = [
  'Parent of two wonderful kids. Love organizing playdates and outdoor adventures!',
  'Stay-at-home dad to three energetic boys. Always looking for new activities.',
  'Mom of one. Passionate about arts & crafts and creative play.',
  'Working parent trying to balance it all. Love meeting other families!',
  'Parent to twin girls. Enjoy reading and educational activities.',
  'Outdoor enthusiast and parent of two. Always up for a park playdate.',
  'Homeschooling parent. Love connecting with other families.',
  'New to the area and looking to make friends with other parents.',
  'Parent to a curious toddler. Love science and discovery activities.',
  'Sports-loving parent. Coach little league and love active kids!',
];

const PROFILE_PICTURE_URLS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=8',
  'https://i.pravatar.cc/150?img=9',
  'https://i.pravatar.cc/150?img=12',
  'https://i.pravatar.cc/150?img=15',
  'https://i.pravatar.cc/150?img=20',
  'https://i.pravatar.cc/150?img=25',
];

/**
 * Get random items from array
 */
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Seed profiles
 */
async function seedProfiles() {
  console.log('🌱 Seeding profiles...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  // Get all users
  const usersSnapshot = await db.collection('users').get();
  const users = usersSnapshot.docs;

  console.log(`Found ${users.length} users to create profiles for`);

  const progress = new ProgressLogger(users.length, 'Creating profiles');

  for (const userDoc of users) {
    const userId = userDoc.id;
    const userData = userDoc.data();

    // Skip if profile already exists
    const profileDoc = await db.collection('profiles').doc(userId).get();
    if (profileDoc.exists) {
      progress.increment();
      continue;
    }

    // Generate profile data
    const interestCount = 3 + Math.floor(Math.random() * 5); // 3-7 interests
    const interests = getRandomItems(INTERESTS, interestCount);

    const ageRangeCount = 1 + Math.floor(Math.random() * 3); // 1-3 age ranges
    const childrenAgeRanges = getRandomItems(AGE_RANGES, ageRangeCount);

    const bio = getRandomItem(BIOS);
    const profilePictureUrl = Math.random() > 0.3 ? getRandomItem(PROFILE_PICTURE_URLS) : null;

    const phoneNumber = Math.random() > 0.5
      ? `${200 + Math.floor(Math.random() * 800)}-${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`
      : null;

    try {
      await db.collection('profiles').doc(userId).set({
        userId,
        displayName: userData.displayName,
        bio,
        zipCode: userData.zipCode,
        phoneNumber,
        interests,
        childrenAgeRanges,
        profilePictureUrl,
        coverPhotoUrl: null,
        website: null,
        socialLinks: {},
        visibility: 'public',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update user document to mark profile as complete
      await db.collection('users').doc(userId).update({
        profileComplete: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating profile for user ${userId}:`, error.message);
    }
  }

  progress.complete();

  console.log(`\n✅ Successfully seeded ${users.length} profiles!`);
  console.log(`👤 Profile pictures: ~70% with avatars`);
  console.log(`📱 Phone numbers: ~50% provided`);
  console.log(`🎯 Interests: 3-7 per user`);
  console.log(`👶 Age ranges: 1-3 per user`);
}

// Run if called directly
if (require.main === module) {
  seedProfiles()
    .then(() => {
      console.log('\n✅ Seed profiles complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding profiles:', error);
      process.exit(1);
    });
}

export { seedProfiles };
