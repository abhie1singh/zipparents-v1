/**
 * Sprint 5 Seed Data: Events and Event Comments
 *
 * Run with: FIREBASE_ENV=local ./scripts/run-script.sh scripts/seed/sprint5-events.ts
 */

import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: 'demo-zipparents-v1',
  });
}

const auth = getAuth();
const db = getFirestore();

// Connect to emulators
db.settings({
  host: 'localhost:8080',
  ssl: false,
});

console.log('✅ Firebase Admin connected to emulators');

async function seedSprint5Data() {
  console.log('🌱 Starting Sprint 5 seed data...\n');

  try {
    // Get existing users
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (users.length < 4) {
      console.log('❌ Need at least 4 users. Please run Sprint 1 and 2 seeds first.');
      process.exit(1);
    }

    console.log(`📋 Found ${users.length} users\n`);

    // Helper function to create timestamps
    const now = new Date();
    const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000);
    const hoursFromNow = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    // Create diverse events
    console.log('📅 Creating events...\n');

    const eventTemplates = [
      // Past completed events
      {
        organizerId: users[0].id,
        title: 'Autumn Playdate at Central Park',
        description: 'Join us for a fun autumn playdate! We\'ll meet at the main playground area for some outdoor fun. Bring snacks and drinks for your little ones. Weather permitting!',
        location: 'Central Park Main Playground, New York, NY',
        zipCode: '10001',
        startTime: daysAgo(5),
        endTime: daysAgo(5).getTime() + 2 * 60 * 60 * 1000, // 2 hours later
        ageRanges: ['3-5', '6-8'],
        maxAttendees: 15,
        attendeeIds: [users[0].id, users[1].id, users[2].id, users[3].id, users[4]?.id].filter(Boolean),
        status: 'completed',
        isPublicPlace: true,
        safetyNotes: 'Please supervise your children on the playground equipment. Restrooms available nearby.',
      },
      {
        organizerId: users[1].id,
        title: 'Toddler Music & Movement Class',
        description: 'A fun-filled music and movement class for toddlers! We\'ll sing songs, dance, and explore musical instruments together. Perfect for energetic little ones.',
        location: 'Community Center, 123 Main St, Brooklyn, NY',
        zipCode: '11201',
        startTime: daysAgo(3),
        endTime: daysAgo(3).getTime() + 1 * 60 * 60 * 1000, // 1 hour
        ageRanges: ['0-2', '3-5'],
        maxAttendees: 10,
        attendeeIds: [users[1].id, users[2].id, users[5]?.id].filter(Boolean),
        status: 'completed',
        isPublicPlace: true,
        safetyNotes: 'Please bring water bottles. Clean socks required for all participants.',
      },
      {
        organizerId: users[2].id,
        title: 'Weekend Soccer Practice',
        description: 'Casual soccer practice for kids! We\'ll work on basic skills, teamwork, and have fun playing together. All skill levels welcome.',
        location: 'Riverside Park Soccer Field, Queens, NY',
        zipCode: '11102',
        startTime: daysAgo(2),
        endTime: daysAgo(2).getTime() + 1.5 * 60 * 60 * 1000, // 1.5 hours
        ageRanges: ['6-8', '9-12'],
        maxAttendees: 20,
        attendeeIds: [users[2].id, users[3].id, users[4]?.id, users[6]?.id].filter(Boolean),
        status: 'completed',
        isPublicPlace: true,
        safetyNotes: 'Bring shin guards, water, and appropriate footwear. First aid kit on site.',
      },

      // Ongoing events
      {
        organizerId: users[3].id,
        title: 'Saturday Morning Art Workshop',
        description: 'Creative art workshop happening right now! We\'re doing watercolor painting and crafts. Drop by if you\'re in the area!',
        location: 'The Art Studio, 456 Creative Ave, Manhattan, NY',
        zipCode: '10002',
        startTime: hoursAgo(1),
        endTime: hoursFromNow(2),
        ageRanges: ['3-5', '6-8'],
        maxAttendees: 12,
        attendeeIds: [users[3].id, users[0].id, users[1].id, users[5]?.id].filter(Boolean),
        status: 'ongoing',
        isPublicPlace: true,
        safetyNotes: 'Smocks provided. Please note there are stairs to the second floor studio.',
      },
      {
        organizerId: users[4]?.id || users[0].id,
        title: 'Family Board Game Afternoon',
        description: 'Join us for board games and snacks! We have games for all ages. Currently in progress - come on over!',
        location: 'Brooklyn Public Library, Community Room, Brooklyn, NY',
        zipCode: '11215',
        startTime: hoursAgo(0.5),
        endTime: hoursFromNow(1.5),
        ageRanges: ['6-8', '9-12', '13+'],
        attendeeIds: [users[4]?.id || users[0].id, users[2].id].filter(Boolean),
        status: 'ongoing',
        isPublicPlace: true,
        safetyNotes: 'Library rules apply. Snacks are nut-free.',
      },

      // Upcoming events
      {
        organizerId: users[0].id,
        title: 'Library Storytime & Crafts',
        description: 'Join us for an enchanting storytime session followed by themed crafts! We\'ll read age-appropriate stories and create fun projects together. Perfect for introducing little ones to the library.',
        location: 'Queens Public Library, Children\'s Section, Queens, NY',
        zipCode: '11103',
        startTime: daysFromNow(2),
        endTime: new Date(daysFromNow(2).getTime() + 1 * 60 * 60 * 1000),
        ageRanges: ['3-5', '6-8'],
        maxAttendees: 15,
        attendeeIds: [users[0].id, users[1].id, users[3].id],
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Please arrive 5 minutes early. Quiet voices in the library, please.',
      },
      {
        organizerId: users[1].id,
        title: 'Toddler Swimming Lessons',
        description: 'Beginner swimming lessons for toddlers with parent participation. We\'ll focus on water safety and basic swimming skills in a fun, supportive environment.',
        location: 'YMCA Pool, 789 Water St, Manhattan, NY',
        zipCode: '10003',
        startTime: daysFromNow(3),
        endTime: new Date(daysFromNow(3).getTime() + 1 * 60 * 60 * 1000),
        ageRanges: ['0-2', '3-5'],
        maxAttendees: 8,
        attendeeIds: [users[1].id, users[2].id, users[4]?.id].filter(Boolean),
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Swim diapers required for non-potty trained children. Lifeguard on duty.',
      },
      {
        organizerId: users[2].id,
        title: 'Emma\'s 7th Birthday Party',
        description: 'Come celebrate Emma\'s 7th birthday! We\'ll have games, pizza, cake, and lots of fun. Please RSVP so we can plan accordingly. Siblings welcome!',
        location: 'Bounce House Fun Center, 321 Party Ln, Brooklyn, NY',
        zipCode: '11220',
        startTime: daysFromNow(5),
        endTime: new Date(daysFromNow(5).getTime() + 3 * 60 * 60 * 1000),
        ageRanges: ['6-8'],
        maxAttendees: 20,
        attendeeIds: [users[2].id, users[0].id, users[1].id, users[3].id],
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Socks required for bounce house. Please inform us of any food allergies.',
      },
      {
        organizerId: users[3].id,
        title: 'Nature Walk & Scavenger Hunt',
        description: 'Join us for an educational nature walk! We\'ll explore local trails and complete a fun scavenger hunt. Great for curious minds who love the outdoors.',
        location: 'Prospect Park Nature Trail, Brooklyn, NY',
        zipCode: '11225',
        startTime: daysFromNow(7),
        endTime: new Date(daysFromNow(7).getTime() + 2 * 60 * 60 * 1000),
        ageRanges: ['6-8', '9-12'],
        maxAttendees: 15,
        attendeeIds: [users[3].id, users[5]?.id].filter(Boolean),
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Wear comfortable walking shoes. Bring water and sunscreen. Bug spray recommended.',
      },
      {
        organizerId: users[4]?.id || users[0].id,
        title: 'Teen Game Development Workshop',
        description: 'Learn the basics of game development! We\'ll introduce coding concepts and create simple games together. No prior experience needed.',
        location: 'Tech Hub NYC, 555 Innovation Blvd, Manhattan, NY',
        zipCode: '10004',
        startTime: daysFromNow(10),
        endTime: new Date(daysFromNow(10).getTime() + 3 * 60 * 60 * 1000),
        ageRanges: ['13+'],
        maxAttendees: 12,
        attendeeIds: [users[4]?.id || users[0].id],
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Bring a laptop if possible. Devices available for those who need them.',
      },
      {
        organizerId: users[5]?.id || users[1].id,
        title: 'Spring Picnic & Kite Flying',
        description: 'Family-friendly picnic and kite flying event! Bring your favorite picnic foods and kites. We\'ll provide blankets and some extra kites to share.',
        location: 'Battery Park Great Lawn, Manhattan, NY',
        zipCode: '10280',
        startTime: daysFromNow(12),
        endTime: new Date(daysFromNow(12).getTime() + 3 * 60 * 60 * 1000),
        ageRanges: ['all-ages'],
        attendeeIds: [users[5]?.id || users[1].id, users[0].id, users[2].id],
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Event is weather dependent. Sunscreen recommended. No pets please.',
      },

      // Event at max capacity
      {
        organizerId: users[0].id,
        title: 'Popular Cooking Class for Kids',
        description: 'FULL - Hands-on cooking class where kids learn to make simple, healthy snacks! This event has reached maximum capacity.',
        location: 'Culinary Kids Studio, 777 Chef St, Queens, NY',
        zipCode: '11104',
        startTime: daysFromNow(4),
        endTime: new Date(daysFromNow(4).getTime() + 2 * 60 * 60 * 1000),
        ageRanges: ['6-8', '9-12'],
        maxAttendees: 10,
        attendeeIds: [users[0].id, users[1].id, users[2].id, users[3].id, users[4]?.id, users[5]?.id, users[6]?.id, users[7]?.id, users[8]?.id, users[9]?.id].filter(Boolean).slice(0, 10),
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Please inform us of any food allergies. Aprons and chef hats provided.',
      },

      // Event with no RSVPs (only organizer)
      {
        organizerId: users[6]?.id || users[2].id,
        title: 'Beginner Yoga for Parents',
        description: 'Relaxing yoga session designed for busy parents. All levels welcome! Take some time for self-care and mindfulness.',
        location: 'Zen Studio, 888 Peace Rd, Brooklyn, NY',
        zipCode: '11230',
        startTime: daysFromNow(8),
        endTime: new Date(daysFromNow(8).getTime() + 1 * 60 * 60 * 1000),
        ageRanges: ['all-ages'],
        maxAttendees: 20,
        attendeeIds: [users[6]?.id || users[2].id],
        status: 'upcoming',
        isPublicPlace: true,
        safetyNotes: 'Bring your own yoga mat. Childcare not provided.',
      },

      // Cancelled event
      {
        organizerId: users[1].id,
        title: 'Outdoor Movie Night',
        description: 'CANCELLED - Family-friendly outdoor movie screening. Unfortunately this event has been cancelled due to predicted rain.',
        location: 'McCarren Park, Brooklyn, NY',
        zipCode: '11211',
        startTime: daysFromNow(6),
        endTime: new Date(daysFromNow(6).getTime() + 2.5 * 60 * 60 * 1000),
        ageRanges: ['all-ages'],
        maxAttendees: 50,
        attendeeIds: [users[1].id, users[0].id, users[2].id],
        status: 'cancelled',
        cancelledAt: hoursAgo(12),
        cancellationReason: 'Weather forecast predicts heavy rain. We\'ll reschedule for next month!',
        isPublicPlace: true,
        safetyNotes: 'Bring blankets and snacks.',
      },
    ];

    const createdEvents = [];

    for (const template of eventTemplates) {
      const { startTime, endTime, cancelledAt, attendeeIds, ...rest } = template;

      const eventData = {
        ...rest,
        startTime: startTime.toISOString(),
        endTime: new Date(endTime).toISOString(),
        attendeeCount: attendeeIds.length,
        attendeeIds,
        ...(cancelledAt && { cancelledAt: new Date(cancelledAt).toISOString() }),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const eventRef = await db.collection('events').add(eventData);
      const eventDoc = await eventRef.get();

      createdEvents.push({
        id: eventRef.id,
        ...eventDoc.data(),
      });

      console.log(`✅ Created event: ${template.title} (${template.status})`);
    }

    console.log(`\n✅ Created ${createdEvents.length} events\n`);

    // Create event comments
    console.log('💬 Creating event comments...\n');

    const commentTemplates = [
      {
        eventIndex: 0, // Autumn Playdate
        authorIndex: 1,
        content: 'Thanks for organizing this! My kids had such a great time. We should do this again soon!',
        hoursAgo: 118,
      },
      {
        eventIndex: 0,
        authorIndex: 2,
        content: 'It was wonderful meeting everyone! The weather was perfect too.',
        hoursAgo: 117,
      },
      {
        eventIndex: 2, // Soccer Practice
        authorIndex: 3,
        content: 'Great practice session! My son is already asking when the next one is.',
        hoursAgo: 47,
      },
      {
        eventIndex: 3, // Art Workshop (ongoing)
        authorIndex: 0,
        content: 'We\'re having so much fun! The instructor is amazing with the kids.',
        hoursAgo: 0.5,
      },
      {
        eventIndex: 6, // Library Storytime
        authorIndex: 1,
        content: 'Can\'t wait for this! My daughter loves storytime.',
        hoursAgo: 2,
      },
      {
        eventIndex: 6,
        authorIndex: 3,
        content: 'See you there! Should we grab lunch afterwards?',
        hoursAgo: 1,
      },
      {
        eventIndex: 8, // Emma's Birthday
        authorIndex: 0,
        content: 'We\'ll be there! What should we bring as a gift? Any preferences?',
        hoursAgo: 24,
      },
      {
        eventIndex: 8,
        authorIndex: 1,
        content: 'Looking forward to it! Emma is so excited!',
        hoursAgo: 20,
      },
      {
        eventIndex: 13, // Cancelled event
        authorIndex: 0,
        content: 'Oh no! That\'s too bad. Hope we can reschedule soon.',
        hoursAgo: 10,
      },
      {
        eventIndex: 13,
        authorIndex: 2,
        content: 'Thanks for letting us know. Looking forward to the rescheduled date!',
        hoursAgo: 9,
      },
    ];

    let commentCount = 0;

    for (const template of commentTemplates) {
      const event = createdEvents[template.eventIndex];
      if (!event) continue;

      const authorId = users[template.authorIndex]?.id;
      if (!authorId) continue;

      const timestamp = new Date(Date.now() - template.hoursAgo * 60 * 60 * 1000);

      await db.collection('eventComments').add({
        eventId: event.id,
        authorId,
        content: template.content,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      commentCount++;
    }

    console.log(`✅ Created ${commentCount} event comments\n`);

    console.log('\n✨ Sprint 5 seed data complete!\n');
    console.log('Summary:');
    console.log(`   - Total Events: ${createdEvents.length}`);
    console.log(`   - Completed Events: ${createdEvents.filter((e: any) => e.status === 'completed').length}`);
    console.log(`   - Ongoing Events: ${createdEvents.filter((e: any) => e.status === 'ongoing').length}`);
    console.log(`   - Upcoming Events: ${createdEvents.filter((e: any) => e.status === 'upcoming').length}`);
    console.log(`   - Cancelled Events: ${createdEvents.filter((e: any) => e.status === 'cancelled').length}`);
    console.log(`   - Event Comments: ${commentCount}\n`);

  } catch (error) {
    console.error('❌ Error seeding Sprint 5 data:', error);
    throw error;
  }
}

// Run the seed function
seedSprint5Data()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
