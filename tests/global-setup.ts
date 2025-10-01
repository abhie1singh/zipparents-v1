import { execSync } from 'child_process';

async function globalSetup() {
  console.log('\n🧹 Cleaning test database...');

  try {
    // Clear Firebase emulator data
    execSync('rm -rf firebase-emulator-data', { stdio: 'inherit' });
    console.log('✅ Cleared emulator data');

    // Wait a bit for emulators to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Seed Sprint 1 users
    console.log('\n🌱 Seeding Sprint 1 users...');
    execSync('FIREBASE_ENV=local ./scripts/run-script.sh scripts/seed/sprint1-users.ts', {
      stdio: 'inherit',
      timeout: 30000
    });

    // Seed Sprint 2 profiles
    console.log('\n🌱 Seeding Sprint 2 profiles...');
    execSync('FIREBASE_ENV=local ./scripts/run-script.sh scripts/seed/sprint2-profiles.ts', {
      stdio: 'inherit',
      timeout: 30000
    });

    console.log('\n✅ Test database setup complete!\n');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    throw error;
  }
}

export default globalSetup;
