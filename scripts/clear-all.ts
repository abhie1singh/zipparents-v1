/**
 * Clear All Script
 *
 * Clears all data from Firestore and Auth
 */

import {
  initializeAdmin,
  getFirestore,
  getAuth,
  deleteCollection,
  deleteAllAuthUsers,
  getCollectionCount,
  confirmAction,
  getEnvironment,
} from './utils/firebase-admin';

const COLLECTIONS = [
  'users',
  'profiles',
  'connections',
  'conversations',
  'events',
  'reports',
  'moderationLogs',
  'posts',
  'notifications',
];

/**
 * Clear all data
 */
async function clearAll() {
  console.log('🗑️  Clear All Data\n');

  const env = getEnvironment();

  // Safety check for production
  if (env === 'prod') {
    console.error('❌ Cannot clear production data!');
    console.error('This script is disabled for production environment.');
    process.exit(1);
  }

  initializeAdmin(env);

  const db = getFirestore();

  console.log(`Environment: ${env}`);
  console.log('\nThis will delete ALL data including:');
  console.log('  - All Firestore collections');
  console.log('  - All Auth users');
  console.log('  - All credentials\n');

  // Confirm action
  const confirmed = await confirmAction('Are you sure you want to continue?');

  if (!confirmed) {
    console.log('\n❌ Operation cancelled');
    process.exit(0);
  }

  console.log('\n🗑️  Starting cleanup...\n');

  // Show collection counts before deletion
  console.log('Current collection counts:');
  for (const collection of COLLECTIONS) {
    try {
      const count = await getCollectionCount(collection);
      console.log(`  ${collection}: ${count} documents`);
    } catch (error) {
      console.log(`  ${collection}: 0 documents`);
    }
  }

  console.log('\n');

  // Delete all collections
  for (const collection of COLLECTIONS) {
    try {
      console.log(`Deleting ${collection}...`);
      await deleteCollection(collection);
      console.log(`✅ ${collection} deleted`);
    } catch (error: any) {
      console.error(`❌ Error deleting ${collection}:`, error.message);
    }
  }

  // Delete all Auth users
  try {
    console.log('\nDeleting all Auth users...');
    await deleteAllAuthUsers();
    console.log('✅ All Auth users deleted');
  } catch (error: any) {
    console.error('❌ Error deleting Auth users:', error.message);
  }

  // Delete credentials file
  try {
    const fs = require('fs');
    const path = require('path');
    const credentialsPath = path.join(process.cwd(), 'seed-credentials.json');

    if (fs.existsSync(credentialsPath)) {
      fs.unlinkSync(credentialsPath);
      console.log('✅ Credentials file deleted');
    }
  } catch (error: any) {
    console.error('❌ Error deleting credentials file:', error.message);
  }

  console.log('\n✅ All data cleared successfully!');
  console.log('\nYou can now re-seed the database with fresh data.');
}

// Run if called directly
if (require.main === module) {
  clearAll()
    .then(() => {
      console.log('\n✅ Clear all complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error clearing data:', error);
      process.exit(1);
    });
}

export { clearAll };
