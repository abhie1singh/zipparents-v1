import { adminAuth, adminDb } from '@/lib/firebase/adminApp';

/**
 * Clear all test data from Firebase
 * WARNING: This will delete ALL data in the Firebase project
 * Use with caution, especially in non-local environments
 */

async function clearCollection(collectionName: string) {
  console.log(`🗑️  Clearing collection: ${collectionName}...`);

  try {
    const snapshot = await adminDb.collection(collectionName).get();

    if (snapshot.empty) {
      console.log(`   ✓ Collection ${collectionName} is already empty`);
      return 0;
    }

    const batchSize = 500;
    let deletedCount = 0;

    while (true) {
      const batch = adminDb.batch();
      const docs = await adminDb.collection(collectionName).limit(batchSize).get();

      if (docs.empty) {
        break;
      }

      docs.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      deletedCount += docs.size;

      if (docs.size < batchSize) {
        break;
      }
    }

    console.log(`   ✓ Deleted ${deletedCount} documents from ${collectionName}`);
    return deletedCount;
  } catch (error) {
    console.error(`   ✗ Error clearing collection ${collectionName}:`, error);
    throw error;
  }
}

async function clearSubcollections(parentCollection: string, subcollectionName: string) {
  console.log(`🗑️  Clearing subcollections: ${parentCollection}/${subcollectionName}...`);

  try {
    const parentDocs = await adminDb.collection(parentCollection).get();
    let deletedCount = 0;

    for (const parentDoc of parentDocs.docs) {
      const subcollectionSnapshot = await parentDoc.ref
        .collection(subcollectionName)
        .get();

      const batch = adminDb.batch();
      subcollectionSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      if (subcollectionSnapshot.size > 0) {
        await batch.commit();
        deletedCount += subcollectionSnapshot.size;
      }
    }

    console.log(`   ✓ Deleted ${deletedCount} documents from ${parentCollection}/${subcollectionName}`);
    return deletedCount;
  } catch (error) {
    console.error(`   ✗ Error clearing subcollections:`, error);
    throw error;
  }
}

async function clearAuthUsers() {
  console.log('🗑️  Clearing Auth users...');

  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users;

    if (users.length === 0) {
      console.log('   ✓ No users to delete');
      return 0;
    }

    const deletePromises = users.map((user) => adminAuth.deleteUser(user.uid));
    await Promise.all(deletePromises);

    console.log(`   ✓ Deleted ${users.length} auth users`);
    return users.length;
  } catch (error) {
    console.error('   ✗ Error clearing auth users:', error);
    throw error;
  }
}

async function clearAllData() {
  console.log('\n🚨 WARNING: This will delete ALL data from Firebase!\n');

  // Check environment
  const env = process.env.FIREBASE_ENV || 'local';

  if (env === 'prod') {
    console.error('❌ Refusing to clear production data!');
    console.error('   If you really want to do this, modify the script.');
    process.exit(1);
  }

  if (env === 'dev' && !process.argv.includes('--force')) {
    console.error('❌ Clearing dev environment requires --force flag');
    console.error('   Run: npm run clear-data:dev -- --force');
    process.exit(1);
  }

  console.log(`🌍 Environment: ${env}\n`);
  console.log('⏳ Starting data deletion...\n');

  try {
    // Clear Firestore collections
    const collections = [
      'users',
      'posts',
      'comments',
      'groups',
      'events',
      'messages',
      'notifications',
    ];

    let totalDeleted = 0;

    for (const collection of collections) {
      const count = await clearCollection(collection);
      totalDeleted += count;
    }

    // Clear subcollections
    await clearSubcollections('groups', 'members');
    await clearSubcollections('events', 'attendees');

    // Clear Auth users (only for local)
    if (env === 'local') {
      await clearAuthUsers();
    } else {
      console.log('ℹ️  Skipping Auth user deletion (not in local environment)');
    }

    console.log('\n✅ Data clearing complete!');
    console.log(`📊 Total documents deleted: ${totalDeleted}\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during data clearing:', error);
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  clearAllData();
}

export { clearCollection, clearSubcollections, clearAuthUsers, clearAllData };
