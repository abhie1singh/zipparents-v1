import { adminAuth, adminDb } from '../../lib/firebase/adminApp';
import { faker } from '@faker-js/faker';

interface TestUser {
  email: string;
  password: string;
  displayName: string;
  dateOfBirth: string;
  age: number;
  zipCode: string;
  scenario: string;
}

// Test users with different scenarios
const testUsers: TestUser[] = [
  {
    email: 'verified.parent@test.com',
    password: 'Test123!',
    displayName: 'Sarah Johnson',
    dateOfBirth: '1990-05-15',
    age: 34,
    zipCode: '10001',
    scenario: 'Verified email, active parent'
  },
  {
    email: 'unverified.parent@test.com',
    password: 'Test123!',
    displayName: 'Mike Chen',
    dateOfBirth: '1988-03-22',
    age: 36,
    zipCode: '10001',
    scenario: 'Unverified email, needs verification'
  },
  {
    email: 'new.parent@test.com',
    password: 'Test123!',
    displayName: 'Emily Rodriguez',
    dateOfBirth: '1995-11-08',
    age: 29,
    zipCode: '10002',
    scenario: 'Recently joined, verified'
  },
  {
    email: 'local.parent@test.com',
    password: 'Test123!',
    displayName: 'David Thompson',
    dateOfBirth: '1987-07-30',
    age: 37,
    zipCode: '10003',
    scenario: 'Active in local community'
  },
  {
    email: 'young.parent@test.com',
    password: 'Test123!',
    displayName: 'Jessica Williams',
    dateOfBirth: '1999-12-25',
    age: 25,
    zipCode: '10001',
    scenario: 'Younger parent, verified'
  },
  {
    email: 'experienced.parent@test.com',
    password: 'Test123!',
    displayName: 'Robert Martinez',
    dateOfBirth: '1980-04-18',
    age: 44,
    zipCode: '10002',
    scenario: 'Experienced parent, multiple children'
  },
  {
    email: 'single.parent@test.com',
    password: 'Test123!',
    displayName: 'Amanda Davis',
    dateOfBirth: '1992-09-12',
    age: 32,
    zipCode: '10003',
    scenario: 'Single parent, looking for support'
  },
  {
    email: 'working.parent@test.com',
    password: 'Test123!',
    displayName: 'James Wilson',
    dateOfBirth: '1985-06-05',
    age: 39,
    zipCode: '10001',
    scenario: 'Working parent, limited time'
  },
  {
    email: 'stayathome.parent@test.com',
    password: 'Test123!',
    displayName: 'Lisa Anderson',
    dateOfBirth: '1991-02-28',
    age: 33,
    zipCode: '10002',
    scenario: 'Stay-at-home parent'
  },
  {
    email: 'admin.test@test.com',
    password: 'Test123!',
    displayName: 'Admin User',
    dateOfBirth: '1985-01-01',
    age: 39,
    zipCode: '10001',
    scenario: 'Admin account for testing'
  }
];

async function seedUsers() {
  console.log('Starting Sprint 1 seed data...');

  const auth = adminAuth;
  const db = adminDb;

  if (!auth || !db) {
    throw new Error('Firebase Admin not initialized');
  }

  console.log('\nCreating test users...');

  for (const userData of testUsers) {
    try {
      console.log(`\nProcessing: ${userData.email}`);
      console.log(`  Scenario: ${userData.scenario}`);

      // Check if user already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(userData.email);
        console.log(`  User already exists, deleting...`);
        await auth.deleteUser(userRecord.uid);
        console.log(`  Deleted existing user`);
      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }
      }

      // Create Firebase Auth user
      userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: userData.scenario.includes('verified') && !userData.scenario.includes('Unverified'),
      });

      console.log(`  Created Auth user: ${userRecord.uid}`);

      // Create Firestore user document
      const isAdmin = userData.email.includes('admin.test');
      const userDoc = {
        uid: userRecord.uid,
        email: userData.email,
        displayName: userData.displayName,
        emailVerified: userRecord.emailVerified,
        zipCode: userData.zipCode,
        role: isAdmin ? 'admin' : 'user',
        dateOfBirth: userData.dateOfBirth,
        age: userData.age,
        ageVerified: true,
        ageVerifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Optional fields
        bio: faker.lorem.sentence(),
        phoneNumber: null,
        photoURL: null,
      };

      await db.collection('users').doc(userRecord.uid).set(userDoc);
      console.log(`  Created Firestore document`);
      console.log(`  Email Verified: ${userRecord.emailVerified}`);
      console.log(`  Age Verified: ${userDoc.ageVerified}`);

    } catch (error: any) {
      console.error(`  Error creating user ${userData.email}:`, error.message);
    }
  }

  console.log('\n✅ Sprint 1 seed data complete!\n');
  console.log('Test User Credentials:');
  console.log('=====================\n');

  testUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.displayName}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Scenario: ${user.scenario}`);
    console.log(`   Zip Code: ${user.zipCode}\n`);
  });

  console.log('\nNotes:');
  console.log('- All users are 18+ with age verification');
  console.log('- Mix of verified and unverified emails');
  console.log('- Different zip codes for location testing');
  console.log('- Password for all users: Test123!');
  console.log('- Admin account: admin.test@test.com\n');
}

// Run the seed script
seedUsers()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
