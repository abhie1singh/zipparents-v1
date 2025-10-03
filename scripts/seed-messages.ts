/**
 * Seed Messages Script
 *
 * Creates conversations and messages between connected users
 */

import * as admin from 'firebase-admin';
import {
  initializeAdmin,
  getFirestore,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

const MESSAGES = [
  'Hi! I saw your profile and thought we might have similar interests.',
  'Would you like to meet up for a playdate this weekend?',
  'Do you know any good playgrounds in the area?',
  'My kids love outdoor activities too! Maybe we can connect sometime?',
  'Thanks for connecting! Looking forward to meeting you.',
  'Are you free next Saturday for a park meetup?',
  'How old are your kids? Mine are 5 and 7.',
  'I noticed you\'re into arts & crafts. My daughter loves that too!',
  'What area do you usually go to for playdates?',
  'Great meeting you today! The kids had a blast.',
  'Let me know if you\'d like to join us for the next event.',
  'I have a few ideas for activities if you\'re interested.',
  'My kids really enjoyed playing with yours!',
  'Would you be interested in organizing a group playdate?',
  'I\'m planning a trip to the zoo. Want to join?',
];

const RESPONSES = [
  'That sounds great! I\'d love to connect.',
  'Yes, I\'d be interested! What time works for you?',
  'Thanks for reaching out! Let\'s coordinate schedules.',
  'I know a great park nearby. I can share the details.',
  'My kids are around the same age. They\'d love to meet new friends.',
  'That would be wonderful! Let me check my calendar.',
  'I\'m free most weekends. Just let me know!',
  'Definitely! I\'m always looking for new activities.',
  'I usually go to Central Park. It\'s great for kids.',
  'It was great meeting you too! We should do it again soon.',
  'Count us in! What date were you thinking?',
  'I\'d love to hear your ideas!',
  'Same here! My kids had so much fun.',
  'Yes! That would be amazing. I\'ll help organize.',
  'The zoo sounds perfect! When are you planning to go?',
];

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random date within range
 */
function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
  return date.toISOString();
}

/**
 * Seed messages
 */
async function seedMessages() {
  console.log('🌱 Seeding messages...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  // Get all accepted connections
  const connectionsSnapshot = await db
    .collection('connections')
    .where('status', '==', 'accepted')
    .get();

  const connections = connectionsSnapshot.docs.map(doc => ({
    id: doc.id,
    requesterId: doc.data().requesterId,
    recipientId: doc.data().recipientId,
  }));

  console.log(`Found ${connections.length} accepted connections`);

  // Create conversations for ~60% of accepted connections
  const conversationCount = Math.floor(connections.length * 0.6);
  const progress = new ProgressLogger(conversationCount, 'Creating conversations');

  for (let i = 0; i < conversationCount; i++) {
    const connection = connections[i];
    const participants = [connection.requesterId, connection.recipientId];

    // Check if conversation already exists
    const existingConvo = await db
      .collection('conversations')
      .where('participants', 'array-contains', participants[0])
      .get();

    const alreadyExists = existingConvo.docs.some(doc => {
      const data = doc.data();
      return data.participants.includes(participants[1]);
    });

    if (alreadyExists) {
      progress.increment();
      continue;
    }

    try {
      // Create conversation
      const conversationRef = db.collection('conversations').doc();
      const conversationId = conversationRef.id;

      // Determine number of messages (1-10)
      const messageCount = 1 + Math.floor(Math.random() * 10);
      const messages: any[] = [];
      let lastMessageText = '';
      let lastMessageAt = getRandomDate(30); // Within last 30 days

      // Create messages
      for (let j = 0; j < messageCount; j++) {
        const senderId = participants[j % 2];
        const recipientId = participants[(j + 1) % 2];
        const isInitialMessage = j === 0;

        const content = isInitialMessage
          ? getRandomItem(MESSAGES)
          : getRandomItem(RESPONSES);

        const createdAt = getRandomDate(30 - j); // Earlier messages are older

        lastMessageText = content;
        lastMessageAt = createdAt;

        messages.push({
          conversationId,
          senderId,
          recipientId,
          content,
          type: 'text',
          read: j < messageCount - 1, // Last message is unread
          createdAt,
        });
      }

      // Determine unread count (0-2)
      const unreadCount = Math.floor(Math.random() * 3);

      // Create conversation document
      await conversationRef.set({
        participants,
        lastMessage: lastMessageText,
        lastMessageAt,
        unreadCount: {
          [participants[0]]: unreadCount,
          [participants[1]]: 0,
        },
        createdAt: messages[0].createdAt,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create message documents
      const batch = db.batch();
      for (const message of messages) {
        const messageRef = conversationRef.collection('messages').doc();
        batch.set(messageRef, {
          ...message,
          createdAt: admin.firestore.Timestamp.fromDate(new Date(message.createdAt)),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating conversation:`, error.message);
    }
  }

  progress.complete();

  console.log(`\n✅ Successfully seeded ${conversationCount} conversations!`);
  console.log(`💬 1-10 messages per conversation`);
  console.log(`📅 Messages spread over last 30 days`);
  console.log(`👁️ Most messages read, some unread`);
}

// Run if called directly
if (require.main === module) {
  seedMessages()
    .then(() => {
      console.log('\n✅ Seed messages complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding messages:', error);
      process.exit(1);
    });
}

export { seedMessages };
