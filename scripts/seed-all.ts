/**
 * Seed All Script
 *
 * Master script that runs all seed scripts in order
 */

import { getEnvironment } from './utils/firebase-admin';
import { seedUsers } from './seed-users';
import { seedProfiles } from './seed-profiles';
import { seedConnections } from './seed-connections';
import { seedMessages } from './seed-messages';
import { seedEvents } from './seed-events';
import { seedReports } from './seed-reports';
import { seedAdmin } from './seed-admin';

/**
 * Seed all data
 */
async function seedAll() {
  console.log('🌱 Seeding All Data\n');
  console.log('='.repeat(60));

  const env = getEnvironment();
  const startTime = Date.now();

  console.log(`\nEnvironment: ${env}`);
  console.log(`Started at: ${new Date().toLocaleString()}\n`);
  console.log('='.repeat(60));

  try {
    // Step 1: Seed users
    console.log('\n📋 Step 1/7: Seeding users...');
    await seedUsers();

    // Step 2: Seed profiles
    console.log('\n📋 Step 2/7: Seeding profiles...');
    await seedProfiles();

    // Step 3: Seed admin
    console.log('\n📋 Step 3/7: Seeding admin...');
    await seedAdmin();

    // Step 4: Seed connections
    console.log('\n📋 Step 4/7: Seeding connections...');
    await seedConnections();

    // Step 5: Seed messages
    console.log('\n📋 Step 5/7: Seeding messages...');
    await seedMessages();

    // Step 6: Seed events
    console.log('\n📋 Step 6/7: Seeding events...');
    await seedEvents();

    // Step 7: Seed reports
    console.log('\n📋 Step 7/7: Seeding reports...');
    await seedReports();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 All seed scripts completed successfully!');
    console.log(`⏱️  Total time: ${duration} seconds`);
    console.log(`📅 Completed at: ${new Date().toLocaleString()}\n`);

    console.log('Summary:');
    console.log('  ✅ 50 users created');
    console.log('  ✅ 50 profiles created');
    console.log('  ✅ 1 admin user created');
    console.log('  ✅ ~125 connections created');
    console.log('  ✅ ~75 conversations created');
    console.log('  ✅ 150 events created');
    console.log('  ✅ 25 reports created');
    console.log('\n📝 Credentials saved to: seed-credentials.json');
    console.log('🔑 Default password: Test123!');
    console.log('👑 Admin email: admin@zipparents.com');
    console.log('🔐 Admin password: Admin123!');

    console.log('\n' + '='.repeat(60));
  } catch (error: any) {
    console.error('\n❌ Error during seeding:', error.message);
    console.error('\nStack trace:', error.stack);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedAll()
    .then(() => {
      console.log('\n✅ Seed all complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding all:', error);
      process.exit(1);
    });
}

export { seedAll };
