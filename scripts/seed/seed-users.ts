import { adminAuth, adminDb } from '@/lib/firebase/adminApp';
import { faker } from '@faker-js/faker';

/**
 * Seed users into Firebase Auth and Firestore
 * Creates a set of test users with realistic data
 */

interface SeedUser {
  email: string;
  password: string;
  displayName: string;
  zipCode: string;
  phoneNumber?: string;
  bio?: string;
  role: 'user' | 'admin';
}

const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@zipparents.com',
    password: 'Admin123!',
    displayName: 'Admin User',
    zipCode: '94102',
    role: 'admin',
    bio: 'Platform administrator',
  },
  {
    email: 'test@example.com',
    password: 'Test123!',
    displayName: 'Test Parent',
    zipCode: '94102',
    role: 'user',
    bio: 'Parent of two wonderful kids',
  },
  {
    email: 'sarah@example.com',
    password: 'Test123!',
    displayName: 'Sarah Johnson',
    zipCode: '94102',
    phoneNumber: '+14155551234',
    role: 'user',
    bio: 'Mom of 3, love organizing playdates!',
  },
  {
    email: 'mike@example.com',
    password: 'Test123!',
    displayName: 'Mike Chen',
    zipCode: '94103',
    phoneNumber: '+14155555678',
    role: 'user',
    bio: 'Dad to twin boys, always up for park adventures',
  },
  {
    email: 'emily@example.com',
    password: 'Test123!',
    displayName: 'Emily Rodriguez',
    zipCode: '94103',
    role: 'user',
    bio: 'First time mom, love connecting with other parents',
  },
];

async function seedUsers() {
  console.log('🌱 Starting user seeding...\n');

  const createdUsers: Array<{ uid: string; email: string }> = [];

  for (const userData of SEED_USERS) {
    try {
      // Check if user already exists
      let user;
      try {
        user = await adminAuth.getUserByEmail(userData.email);
        console.log(`✓ User ${userData.email} already exists (${user.uid})`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create new user
          user = await adminAuth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName,
            emailVerified: true,
          });
          console.log(`✓ Created user ${userData.email} (${user.uid})`);
        } else {
          throw error;
        }
      }

      // Create or update Firestore document
      await adminDb.collection('users').doc(user.uid).set(
        {
          email: userData.email,
          displayName: userData.displayName,
          zipCode: userData.zipCode,
          phoneNumber: userData.phoneNumber || null,
          bio: userData.bio || '',
          role: userData.role,
          profilePicture: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      createdUsers.push({ uid: user.uid, email: userData.email });
    } catch (error) {
      console.error(`✗ Error seeding user ${userData.email}:`, error);
    }
  }

  console.log(`\n✅ User seeding complete! Created/verified ${createdUsers.length} users\n`);
  return createdUsers;
}

// Generate additional random users if needed
async function seedRandomUsers(count: number = 10) {
  console.log(`🌱 Creating ${count} random users...\n`);

  const zipCodes = ['94102', '94103', '94104', '94105', '94107'];
  const createdUsers: Array<{ uid: string; email: string }> = [];

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email().toLowerCase();
    const displayName = faker.person.fullName();

    try {
      // Check if user exists
      let user;
      try {
        user = await adminAuth.getUserByEmail(email);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          user = await adminAuth.createUser({
            email,
            password: 'Test123!',
            displayName,
            emailVerified: true,
          });
        } else {
          throw error;
        }
      }

      // Create Firestore document
      await adminDb.collection('users').doc(user.uid).set(
        {
          email,
          displayName,
          zipCode: faker.helpers.arrayElement(zipCodes),
          phoneNumber: faker.phone.number(),
          bio: faker.lorem.sentence(),
          role: 'user',
          profilePicture: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      createdUsers.push({ uid: user.uid, email });
      console.log(`✓ Created random user ${email} (${user.uid})`);
    } catch (error) {
      console.error(`✗ Error creating random user ${email}:`, error);
    }
  }

  console.log(`\n✅ Random user seeding complete! Created ${createdUsers.length} users\n`);
  return createdUsers;
}

// Main execution
async function main() {
  try {
    const seedOnlyBasicUsers = process.argv.includes('--basic');

    const basicUsers = await seedUsers();

    if (!seedOnlyBasicUsers) {
      const randomUsers = await seedRandomUsers(10);
      console.log(`\n📊 Total users: ${basicUsers.length + randomUsers.length}`);
    } else {
      console.log(`\n📊 Total users: ${basicUsers.length}`);
    }

    console.log('\n✅ All seeding complete!');
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

export { seedUsers, seedRandomUsers };
