/**
 * Seed Users Script
 *
 * Creates 50 test users with various ages, locations, and verification statuses
 */

import {
  initializeAdmin,
  createUser,
  saveCredentials,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

// Test user data
const FIRST_NAMES = [
  'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Ashley', 'Robert',
  'Amanda', 'John', 'Jennifer', 'William', 'Lisa', 'Christopher', 'Michelle',
  'Matthew', 'Laura', 'Daniel', 'Nicole', 'Joseph', 'Elizabeth', 'Charles',
  'Rebecca', 'Thomas', 'Kimberly', 'Andrew', 'Linda', 'Ryan', 'Angela', 'Jason',
  'Melissa', 'Kevin', 'Maria', 'Brian', 'Stephanie', 'Timothy', 'Rachel', 'Steven',
  'Christina', 'Eric', 'Samantha', 'Jeffrey', 'Heather', 'Gary', 'Amy', 'Scott',
  'Patricia', 'Mark', 'Karen', 'Paul'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter',
  'Roberts', 'Phillips'
];

const ZIP_CODES = [
  '10001', // New York
  '10002', '10003', '10004', '10005', // More NYC
  '90001', // Los Angeles
  '90002', '90003', '90004', '90005', // More LA
  '60601', // Chicago
  '60602', '60603', '60604', '60605', // More Chicago
  '77001', // Houston
  '77002', '77003', '77004', '77005', // More Houston
  '85001', // Phoenix
  '19019', // Philadelphia
  '78701', // Austin
  '94101', // San Francisco
  '98101', // Seattle
  '02101', // Boston
  '30301', // Atlanta
  '33101', // Miami
  '80201', // Denver
  '97201', // Portland
];

/**
 * Generate random date of birth (age 25-50)
 */
function getRandomDateOfBirth(): string {
  const age = 25 + Math.floor(Math.random() * 25); // 25-50 years old
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  date.setMonth(Math.floor(Math.random() * 12));
  date.setDate(1 + Math.floor(Math.random() * 28));
  return date.toISOString().split('T')[0];
}

/**
 * Seed users
 */
async function seedUsers() {
  console.log('🌱 Seeding users...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const userCount = 50;
  const credentials: Array<{ email: string; password: string; displayName: string; role: string }> = [];
  const progress = new ProgressLogger(userCount, 'Creating users');

  for (let i = 0; i < userCount; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const displayName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@test.com`;
    const password = 'Test123!';
    const zipCode = ZIP_CODES[i % ZIP_CODES.length];
    const dateOfBirth = getRandomDateOfBirth();

    // Vary verification status (80% verified, 20% unverified)
    const emailVerified = Math.random() > 0.2;
    const ageVerified = emailVerified; // Age verified same as email

    // Vary status (90% active, 5% suspended, 5% banned)
    const rand = Math.random();
    let status = 'active';
    let suspendedUntil = null;
    let suspensionReason = null;
    let bannedAt = null;
    let banReason = null;

    if (rand < 0.05) {
      status = 'suspended';
      suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      suspensionReason = 'Violation of community guidelines';
    } else if (rand < 0.1) {
      status = 'banned';
      bannedAt = new Date().toISOString();
      banReason = 'Multiple violations of terms of service';
    }

    try {
      const { uid } = await createUser({
        email,
        password,
        displayName,
        emailVerified,
      });

      // Save to Firestore with additional data
      const db = require('firebase-admin').firestore();
      await db.collection('users').doc(uid).set({
        email,
        displayName,
        zipCode,
        dateOfBirth,
        emailVerified,
        ageVerified,
        status,
        suspendedUntil,
        suspensionReason,
        bannedAt,
        banReason,
        role: 'user',
        phoneNumber: null,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      credentials.push({
        email,
        password,
        displayName,
        role: 'user',
      });

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating user ${email}:`, error.message);
    }
  }

  progress.complete();

  // Save credentials
  saveCredentials(credentials);

  console.log(`\n✅ Successfully seeded ${userCount} users!`);
  console.log(`📧 Email domain: @test.com`);
  console.log(`🔑 Default password: Test123!`);
  console.log(`📍 Zip codes distributed across: ${ZIP_CODES.length} locations`);
  console.log(`✉️ ~80% email verified, ~20% unverified`);
  console.log(`👥 ~90% active, ~5% suspended, ~5% banned`);
}

// Run if called directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('\n✅ Seed users complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding users:', error);
      process.exit(1);
    });
}

export { seedUsers };
