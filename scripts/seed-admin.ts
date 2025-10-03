/**
 * Seed Admin Script
 *
 * Creates admin user with proper permissions
 */

import {
  initializeAdmin,
  createUser,
  setUserClaims,
  getFirestore,
  getEnvironment,
  saveCredentials,
  loadCredentials,
} from './utils/firebase-admin';

/**
 * Seed admin user
 */
async function seedAdmin() {
  console.log('🌱 Seeding admin user...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  const adminEmail = 'admin@zipparents.com';
  const adminPassword = 'Admin123!';
  const adminDisplayName = 'Admin User';

  console.log('Creating admin user...');

  try {
    // Create admin user
    const { uid } = await createUser({
      email: adminEmail,
      password: adminPassword,
      displayName: adminDisplayName,
      emailVerified: true,
    });

    console.log(`✅ Admin user created with UID: ${uid}`);

    // Set admin custom claims
    await setUserClaims(uid, { admin: true, role: 'admin' });
    console.log('✅ Admin custom claims set');

    // Update Firestore user document
    await db.collection('users').doc(uid).set({
      email: adminEmail,
      displayName: adminDisplayName,
      role: 'admin',
      emailVerified: true,
      ageVerified: true,
      status: 'active',
      profileComplete: true,
      zipCode: '10001',
      dateOfBirth: '1985-01-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Admin user document created in Firestore');

    // Create admin profile
    await db.collection('profiles').doc(uid).set({
      userId: uid,
      displayName: adminDisplayName,
      bio: 'Platform Administrator',
      zipCode: '10001',
      interests: ['Technology', 'Community'],
      childrenAgeRanges: [],
      phoneNumber: null,
      profilePictureUrl: null,
      coverPhotoUrl: null,
      website: null,
      socialLinks: {},
      visibility: 'public',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Admin profile created');

    // Load existing credentials and add admin
    const credentials = loadCredentials();
    credentials.push({
      email: adminEmail,
      password: adminPassword,
      displayName: adminDisplayName,
      role: 'admin',
    });

    saveCredentials(credentials);

    console.log('\n✅ Admin user seeded successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👑 Role: admin`);
    console.log(`🆔 UID: ${uid}`);
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      console.log('⚠️  Admin user already exists');
    } else {
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('\n✅ Seed admin complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding admin:', error);
      process.exit(1);
    });
}

export { seedAdmin };
