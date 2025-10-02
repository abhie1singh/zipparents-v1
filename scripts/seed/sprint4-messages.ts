/**
 * Sprint 4 Seed Data: Messages, Conversations, Reports, and Blocked Users
 *
 * Run with: FIREBASE_ENV=local ./scripts/run-script.sh scripts/seed/sprint4-messages.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
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

async function seedSprint4Data() {
  console.log('🌱 Starting Sprint 4 seed data...\n');

  try {
    // Get existing users
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (users.length < 4) {
      console.log('❌ Need at least 4 users. Please run Sprint 1 and 2 seeds first.');
      return;
    }

    console.log(`📋 Found ${users.length} users\n`);

    // Create conversations between connected users
    console.log('💬 Creating conversations...\n');

    const conversations = [
      {
        participantIds: [users[0].id, users[2].id].sort(),
        description: `${users[0].displayName} and ${users[2].displayName}`,
      },
      {
        participantIds: [users[1].id, users[3].id].sort(),
        description: `${users[1].displayName} and ${users[3].displayName}`,
      },
      {
        participantIds: [users[0].id, users[4]?.id || users[1].id].sort(),
        description: `${users[0].displayName} and ${users[4]?.displayName || users[1].displayName}`,
      },
    ];

    const createdConversations = [];

    for (const conv of conversations) {
      const conversationRef = await db.collection('conversations').add({
        participantIds: conv.participantIds,
        unreadCount: {
          [conv.participantIds[0]]: 0,
          [conv.participantIds[1]]: 0,
        },
        mutedBy: [],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const conversationDoc = await conversationRef.get();
      createdConversations.push({
        id: conversationRef.id,
        ...conv,
        ...conversationDoc.data(),
      });

      console.log(`✅ Created conversation: ${conv.description}`);
    }

    console.log(`\n✅ Created ${createdConversations.length} conversations\n`);

    // Create messages in conversations
    console.log('📨 Creating messages...\n');

    const messageTemplates = [
      {
        conversationIndex: 0,
        senderIndex: 0,
        content: "Hi! How are you doing? Would love to connect and share parenting experiences!",
        minutesAgo: 120,
      },
      {
        conversationIndex: 0,
        senderIndex: 1,
        content: "Hey! I'm doing great, thanks for reaching out! How old are your kids?",
        minutesAgo: 115,
      },
      {
        conversationIndex: 0,
        senderIndex: 0,
        content: "I have two kids, ages 5 and 8. They keep me busy! What about you?",
        minutesAgo: 110,
      },
      {
        conversationIndex: 0,
        senderIndex: 1,
        content: "Mine are similar ages! We should set up a playdate sometime.",
        minutesAgo: 105,
      },
      {
        conversationIndex: 0,
        senderIndex: 0,
        content: "That would be wonderful! Are you free this weekend?",
        minutesAgo: 5,
      },
      {
        conversationIndex: 1,
        senderIndex: 0,
        content: "Hello! I saw we're in the same area. Do you know any good parks nearby?",
        minutesAgo: 60,
      },
      {
        conversationIndex: 1,
        senderIndex: 1,
        content: "Yes! Central Park is amazing, and there's a great playground at Riverside. My kids love it there!",
        minutesAgo: 55,
      },
      {
        conversationIndex: 1,
        senderIndex: 0,
        content: "Thanks for the recommendation! We'll definitely check it out this week.",
        minutesAgo: 10,
      },
      {
        conversationIndex: 2,
        senderIndex: 0,
        content: "Hi there! Just wanted to say hello and see how you're settling in.",
        minutesAgo: 30,
      },
      {
        conversationIndex: 2,
        senderIndex: 1,
        content: "Thank you! It's been great connecting with other parents in the area.",
        minutesAgo: 25,
      },
    ];

    let messageCount = 0;

    for (const template of messageTemplates) {
      const conversation = createdConversations[template.conversationIndex];
      if (!conversation) continue;

      const senderUserId = conversation.participantIds[template.senderIndex];
      const timestamp = new Date(Date.now() - template.minutesAgo * 60 * 1000);

      await db.collection('messages').add({
        conversationId: conversation.id,
        senderId: senderUserId,
        type: 'text',
        content: template.content,
        readBy: [senderUserId],
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      messageCount++;
    }

    // Update conversation last messages
    for (let i = 0; i < createdConversations.length; i++) {
      const conversationMessages = messageTemplates.filter(m => m.conversationIndex === i);
      if (conversationMessages.length > 0) {
        const lastMessage = conversationMessages[conversationMessages.length - 1];
        const conversation = createdConversations[i];
        const senderUserId = conversation.participantIds[lastMessage.senderIndex];
        const otherUserId = conversation.participantIds.find((id: string) => id !== senderUserId);

        await db.collection('conversations').doc(conversation.id).update({
          lastMessage: {
            content: lastMessage.content,
            senderId: senderUserId,
            createdAt: new Date(Date.now() - lastMessage.minutesAgo * 60 * 1000),
          },
          [`unreadCount.${otherUserId}`]: 1,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    console.log(`✅ Created ${messageCount} messages\n`);

    // Create sample reports
    console.log('🚨 Creating sample reports...\n');

    const reports = [
      {
        reporterId: users[0].id,
        reportedUserId: users[5]?.id || users[1].id,
        type: 'user',
        reason: 'spam',
        description: 'This user keeps sending spam messages promoting products.',
        status: 'pending',
      },
      {
        reporterId: users[2].id,
        reportedUserId: users[6]?.id || users[3].id,
        type: 'user',
        reason: 'inappropriate_content',
        description: 'Inappropriate language and behavior in messages.',
        status: 'pending',
      },
    ];

    for (const report of reports) {
      await db.collection('reports').add({
        ...report,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    console.log(`✅ Created ${reports.length} sample reports\n`);

    // Create sample blocked users
    console.log('🚫 Creating sample blocked users...\n');

    const blocks = [
      {
        blockerId: users[1].id,
        blockedUserId: users[7]?.id || users[2].id,
        reason: 'Unwanted messages',
      },
    ];

    for (const block of blocks) {
      await db.collection('blockedUsers').add({
        ...block,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    console.log(`✅ Created ${blocks.length} blocked user relationships\n`);

    console.log('\n✨ Sprint 4 seed data complete!\n');
    console.log('Summary:');
    console.log(`   - Conversations: ${createdConversations.length}`);
    console.log(`   - Messages: ${messageCount}`);
    console.log(`   - Reports: ${reports.length}`);
    console.log(`   - Blocks: ${blocks.length}\n`);

  } catch (error) {
    console.error('❌ Error seeding Sprint 4 data:', error);
    throw error;
  }
}

// Run the seed function
seedSprint4Data()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
