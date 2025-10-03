/**
 * Seed Events Script
 *
 * Creates 100+ events with various dates, locations, and RSVPs
 */

import * as admin from 'firebase-admin';
import {
  initializeAdmin,
  getFirestore,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

const EVENT_TITLES = [
  'Playground Meetup',
  'Weekend Park Playdate',
  'Kids Soccer Practice',
  'Arts & Crafts Workshop',
  'Story Time at the Library',
  'Nature Walk',
  'Swimming Pool Fun',
  'Parent Coffee Meetup',
  'Movie Afternoon',
  'Science Discovery Day',
  'Music & Movement Class',
  'Outdoor Sports Day',
  'Baking Workshop',
  'Pet Petting Zoo Visit',
  'Children\'s Museum Trip',
];

const EVENT_DESCRIPTIONS = [
  'Join us for a fun playdate at the local playground!',
  'Casual meetup for kids to play and parents to connect.',
  'Active play and sports activities for energetic kids.',
  'Creative workshop where kids can express themselves.',
  'Educational and fun activity for the whole family.',
  'Great opportunity to meet other families in the area.',
  'Perfect for kids to make new friends and have fun.',
  'Parents can relax while kids play together.',
  'Bring snacks and enjoy quality time together.',
  'Weather permitting - check for updates closer to date.',
];

const LOCATIONS = [
  'Central Park Playground',
  'Community Center',
  'Public Library',
  'Riverside Park',
  'Children\'s Museum',
  'Sports Complex',
  'Recreation Center',
  'Botanical Garden',
  'City Pool',
  'Local School Gym',
];

const CATEGORIES = ['Playdate', 'Workshop', 'Sports', 'Educational', 'Social', 'Arts'];

const AGE_RANGES = ['0-2', '3-5', '6-8', '9-12', '13-17'];

/**
 * Get random items from array
 */
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random future date (1-60 days from now)
 */
function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Get random past date (1-60 days ago)
 */
function getPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Get random time
 */
function getRandomTime(): string {
  const hour = 9 + Math.floor(Math.random() * 9); // 9 AM to 5 PM
  const minute = Math.random() > 0.5 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

/**
 * Seed events
 */
async function seedEvents() {
  console.log('🌱 Seeding events...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  // Get all users
  const usersSnapshot = await db.collection('users').where('status', '==', 'active').get();
  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    zipCode: doc.data().zipCode,
  }));

  console.log(`Found ${users.length} active users to create events for`);

  const eventCount = 150;
  const progress = new ProgressLogger(eventCount, 'Creating events');

  for (let i = 0; i < eventCount; i++) {
    // Pick random organizer
    const organizer = getRandomItem(users);

    // Determine if past, current, or future (30% past, 10% today, 60% future)
    const rand = Math.random();
    let date: string;
    let isPast = false;

    if (rand < 0.3) {
      // Past event
      date = getPastDate(1 + Math.floor(Math.random() * 60));
      isPast = true;
    } else if (rand < 0.4) {
      // Today
      date = new Date().toISOString().split('T')[0];
    } else {
      // Future event
      date = getFutureDate(1 + Math.floor(Math.random() * 60));
    }

    const startTime = getRandomTime();
    const startHour = parseInt(startTime.split(':')[0]);
    const endTime = `${(startHour + 2).toString().padStart(2, '0')}:${startTime.split(':')[1]}`;

    const ageRangeCount = 1 + Math.floor(Math.random() * 3);
    const ageRanges = getRandomItems(AGE_RANGES, ageRangeCount);

    const maxAttendees = 5 + Math.floor(Math.random() * 20);

    // Determine RSVP count (0 to maxAttendees)
    const rsvpCount = isPast
      ? Math.floor(Math.random() * (maxAttendees + 1))
      : Math.floor(Math.random() * maxAttendees);

    // Pick random attendees
    const attendees = getRandomItems(
      users.filter(u => u.id !== organizer.id),
      rsvpCount
    ).map(u => u.id);

    try {
      const eventRef = db.collection('events').doc();

      await eventRef.set({
        organizerId: organizer.id,
        title: getRandomItem(EVENT_TITLES),
        description: getRandomItem(EVENT_DESCRIPTIONS),
        location: `${getRandomItem(LOCATIONS)}, ${organizer.zipCode}`,
        zipCode: organizer.zipCode,
        date,
        startTime,
        endTime,
        ageRanges,
        maxAttendees,
        attendees,
        category: getRandomItem(CATEGORIES),
        isPublicPlace: Math.random() > 0.2,
        isCancelled: isPast && Math.random() < 0.05, // 5% of past events cancelled
        tags: [],
        visibility: 'public',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating event:`, error.message);
    }
  }

  progress.complete();

  console.log(`\n✅ Successfully seeded ${eventCount} events!`);
  console.log(`📅 ~30% past events, ~10% today, ~60% future events`);
  console.log(`🎯 Events spread across ${users.length} organizers`);
  console.log(`👥 Various attendance levels (0 to max capacity)`);
  console.log(`🏠 ~80% public places, ~20% private`);
}

// Run if called directly
if (require.main === module) {
  seedEvents()
    .then(() => {
      console.log('\n✅ Seed events complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding events:', error);
      process.exit(1);
    });
}

export { seedEvents };
