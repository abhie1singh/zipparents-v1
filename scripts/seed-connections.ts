/**
 * Seed Connections Script
 *
 * Creates connections between users with various statuses
 */

import * as admin from 'firebase-admin';
import {
  initializeAdmin,
  getFirestore,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

/**
 * Seed connections
 */
async function seedConnections() {
  console.log('🌱 Seeding connections...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  // Get all users
  const usersSnapshot = await db.collection('users').where('status', '==', 'active').get();
  const users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    data: doc.data(),
  }));

  console.log(`Found ${users.length} active users`);

  // Create connections (each user connected to 3-8 others)
  const connectionCount = Math.floor(users.length * 2.5); // Average of 5 connections per user
  const progress = new ProgressLogger(connectionCount, 'Creating connections');

  const createdConnections = new Set<string>();

  for (let i = 0; i < connectionCount; i++) {
    // Pick two random users
    const user1 = users[Math.floor(Math.random() * users.length)];
    const user2 = users[Math.floor(Math.random() * users.length)];

    // Skip if same user
    if (user1.id === user2.id) {
      continue;
    }

    // Create a unique connection key (sorted to avoid duplicates)
    const connectionKey = [user1.id, user2.id].sort().join('_');

    // Skip if connection already created
    if (createdConnections.has(connectionKey)) {
      continue;
    }

    createdConnections.add(connectionKey);

    // Determine connection status (70% accepted, 20% pending, 10% declined)
    const rand = Math.random();
    let status: 'pending' | 'accepted' | 'declined';
    let acceptedAt = null;
    let declinedAt = null;

    if (rand < 0.7) {
      status = 'accepted';
      acceptedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(); // Within last 30 days
    } else if (rand < 0.9) {
      status = 'pending';
    } else {
      status = 'declined';
      declinedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(); // Within last 7 days
    }

    // Determine who sent the request
    const requesterId = Math.random() > 0.5 ? user1.id : user2.id;
    const recipientId = requesterId === user1.id ? user2.id : user1.id;

    try {
      // Create connection document
      const connectionRef = db.collection('connections').doc();
      await connectionRef.set({
        requesterId,
        recipientId,
        status,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(), // Within last 60 days
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        acceptedAt,
        declinedAt,
      });

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating connection:`, error.message);
    }
  }

  progress.complete();

  console.log(`\n✅ Successfully seeded ${createdConnections.size} connections!`);
  console.log(`🤝 ~70% accepted connections`);
  console.log(`⏳ ~20% pending connections`);
  console.log(`❌ ~10% declined connections`);
  console.log(`📊 Average ~${(createdConnections.size / users.length).toFixed(1)} connections per user`);
}

// Run if called directly
if (require.main === module) {
  seedConnections()
    .then(() => {
      console.log('\n✅ Seed connections complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding connections:', error);
      process.exit(1);
    });
}

export { seedConnections };
