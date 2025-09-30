import { adminDb } from '@/lib/firebase/adminApp';
import { faker } from '@faker-js/faker';
import { seedUsers, seedRandomUsers } from './seed-users';

/**
 * Seed comprehensive test data including posts, groups, events, etc.
 */

async function seedGroups(userIds: string[]) {
  console.log('🌱 Seeding groups...\n');

  const zipCodes = ['94102', '94103', '94104', '94105', '94107'];
  const groups = [
    {
      name: 'San Francisco Moms',
      description: 'A supportive community for moms in San Francisco',
      zipCode: '94102',
      isPublic: true,
    },
    {
      name: 'New Parents Support Group',
      description: 'For parents with babies 0-12 months',
      zipCode: '94103',
      isPublic: true,
    },
    {
      name: 'Playdate Organizers',
      description: 'Organize and join local playdates',
      zipCode: '94102',
      isPublic: true,
    },
    {
      name: 'Working Parents Network',
      description: 'Support network for working parents',
      zipCode: '94104',
      isPublic: true,
    },
  ];

  const createdGroups: string[] = [];

  for (const groupData of groups) {
    try {
      const createdBy = faker.helpers.arrayElement(userIds);
      const groupRef = await adminDb.collection('groups').add({
        ...groupData,
        createdBy,
        admins: [createdBy],
        memberCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Add members
      const memberCount = faker.number.int({ min: 5, max: 15 });
      const members = faker.helpers.arrayElements(userIds, memberCount);

      for (const memberId of members) {
        await adminDb
          .collection('groups')
          .doc(groupRef.id)
          .collection('members')
          .doc(memberId)
          .set({
            joinedAt: new Date().toISOString(),
            role: 'member',
          });
      }

      await adminDb
        .collection('groups')
        .doc(groupRef.id)
        .update({ memberCount: members.length + 1 });

      createdGroups.push(groupRef.id);
      console.log(`✓ Created group: ${groupData.name} (${groupRef.id})`);
    } catch (error) {
      console.error(`✗ Error creating group ${groupData.name}:`, error);
    }
  }

  console.log(`\n✅ Created ${createdGroups.length} groups\n`);
  return createdGroups;
}

async function seedPosts(userIds: string[], groupIds: string[]) {
  console.log('🌱 Seeding posts...\n');

  const postCount = 50;
  const createdPosts: string[] = [];

  for (let i = 0; i < postCount; i++) {
    try {
      const authorId = faker.helpers.arrayElement(userIds);
      const hasGroup = faker.datatype.boolean({ probability: 0.6 });
      const groupId = hasGroup ? faker.helpers.arrayElement(groupIds) : null;

      const postRef = await adminDb.collection('posts').add({
        authorId,
        groupId,
        content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
        likes: faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: 10 })),
        commentCount: faker.number.int({ min: 0, max: 20 }),
        images: [],
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        updatedAt: new Date().toISOString(),
      });

      createdPosts.push(postRef.id);
    } catch (error) {
      console.error('✗ Error creating post:', error);
    }
  }

  console.log(`✅ Created ${createdPosts.length} posts\n`);
  return createdPosts;
}

async function seedComments(userIds: string[], postIds: string[]) {
  console.log('🌱 Seeding comments...\n');

  let totalComments = 0;

  for (const postId of postIds) {
    try {
      const commentCount = faker.number.int({ min: 0, max: 10 });

      for (let i = 0; i < commentCount; i++) {
        await adminDb.collection('comments').add({
          postId,
          authorId: faker.helpers.arrayElement(userIds),
          content: faker.lorem.paragraph(),
          likes: faker.helpers.arrayElements(userIds, faker.number.int({ min: 0, max: 5 })),
          createdAt: faker.date.recent({ days: 20 }).toISOString(),
          updatedAt: new Date().toISOString(),
        });

        totalComments++;
      }
    } catch (error) {
      console.error(`✗ Error creating comments for post ${postId}:`, error);
    }
  }

  console.log(`✅ Created ${totalComments} comments\n`);
  return totalComments;
}

async function seedEvents(userIds: string[]) {
  console.log('🌱 Seeding events...\n');

  const zipCodes = ['94102', '94103', '94104', '94105', '94107'];
  const eventCount = 20;
  const createdEvents: string[] = [];

  for (let i = 0; i < eventCount; i++) {
    try {
      const startDate = faker.date.future({ years: 0.5 });
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + faker.number.int({ min: 1, max: 4 }));

      const eventRef = await adminDb.collection('events').add({
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraphs(2),
        location: `${faker.location.streetAddress()}, San Francisco, CA`,
        zipCode: faker.helpers.arrayElement(zipCodes),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createdBy: faker.helpers.arrayElement(userIds),
        maxAttendees: faker.number.int({ min: 10, max: 50 }),
        attendeeCount: 0,
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Add some attendees
      const attendeeCount = faker.number.int({ min: 0, max: 15 });
      const attendees = faker.helpers.arrayElements(userIds, attendeeCount);

      for (const attendeeId of attendees) {
        await adminDb
          .collection('events')
          .doc(eventRef.id)
          .collection('attendees')
          .doc(attendeeId)
          .set({
            rsvpStatus: faker.helpers.arrayElement(['going', 'maybe', 'interested']),
            rsvpAt: new Date().toISOString(),
          });
      }

      await adminDb
        .collection('events')
        .doc(eventRef.id)
        .update({ attendeeCount: attendees.length });

      createdEvents.push(eventRef.id);
    } catch (error) {
      console.error('✗ Error creating event:', error);
    }
  }

  console.log(`✅ Created ${createdEvents.length} events\n`);
  return createdEvents;
}

async function seedMessages(userIds: string[]) {
  console.log('🌱 Seeding messages...\n');

  const conversationCount = 10;
  let totalMessages = 0;

  for (let i = 0; i < conversationCount; i++) {
    try {
      const [user1, user2] = faker.helpers.arrayElements(userIds, 2);
      const conversationId = [user1, user2].sort().join('_');
      const messageCount = faker.number.int({ min: 5, max: 20 });

      for (let j = 0; j < messageCount; j++) {
        const senderId = faker.helpers.arrayElement([user1, user2]);
        const recipientId = senderId === user1 ? user2 : user1;

        await adminDb.collection('messages').add({
          conversationId,
          senderId,
          recipientId,
          content: faker.lorem.sentence(),
          read: faker.datatype.boolean(),
          createdAt: faker.date.recent({ days: 30 }).toISOString(),
        });

        totalMessages++;
      }
    } catch (error) {
      console.error('✗ Error creating messages:', error);
    }
  }

  console.log(`✅ Created ${totalMessages} messages in ${conversationCount} conversations\n`);
  return totalMessages;
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting comprehensive test data seeding...\n');

    // Seed users first
    const basicUsers = await seedUsers();
    const randomUsers = await seedRandomUsers(20);
    const allUserIds = [...basicUsers, ...randomUsers].map((u) => u.uid);

    console.log(`📊 Total users: ${allUserIds.length}\n`);

    // Seed groups
    const groupIds = await seedGroups(allUserIds);

    // Seed posts
    const postIds = await seedPosts(allUserIds, groupIds);

    // Seed comments
    await seedComments(allUserIds, postIds);

    // Seed events
    await seedEvents(allUserIds);

    // Seed messages
    await seedMessages(allUserIds);

    console.log('\n✅ All test data seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${allUserIds.length}`);
    console.log(`   Groups: ${groupIds.length}`);
    console.log(`   Posts: ${postIds.length}`);
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { seedGroups, seedPosts, seedComments, seedEvents, seedMessages };
