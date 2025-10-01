import { adminDb } from '../../lib/firebase/adminApp';
import { FieldValue } from 'firebase-admin/firestore';

interface ConnectionData {
  fromEmail: string;
  toEmail: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
}

// Sample connections for testing Sprint 3 features
const connectionsData: ConnectionData[] = [
  // Accepted connections
  {
    fromEmail: 'verified.parent@test.com',
    toEmail: 'local.parent@test.com',
    status: 'accepted',
    message: 'Hi! Would love to connect and organize some playdates!'
  },
  {
    fromEmail: 'new.parent@test.com',
    toEmail: 'stayathome.parent@test.com',
    status: 'accepted',
    message: 'First-time mom here, would love to connect!'
  },
  {
    fromEmail: 'young.parent@test.com',
    toEmail: 'verified.parent@test.com',
    status: 'accepted'
  },
  {
    fromEmail: 'experienced.parent@test.com',
    toEmail: 'working.parent@test.com',
    status: 'accepted',
    message: 'Dad to dad - let\'s share some parenting tips!'
  },

  // Pending connections (requests sent)
  {
    fromEmail: 'verified.parent@test.com',
    toEmail: 'new.parent@test.com',
    status: 'pending',
    message: 'I see we both love outdoor activities! Would love to connect.'
  },
  {
    fromEmail: 'local.parent@test.com',
    toEmail: 'young.parent@test.com',
    status: 'pending',
    message: 'Hi! I organize local parent events. Would you like to join?'
  },
  {
    fromEmail: 'working.parent@test.com',
    toEmail: 'verified.parent@test.com',
    status: 'pending'
  },
  {
    fromEmail: 'stayathome.parent@test.com',
    toEmail: 'young.parent@test.com',
    status: 'pending',
    message: 'Love your energy! Let\'s connect our little ones.'
  },
  {
    fromEmail: 'unverified.parent@test.com',
    toEmail: 'experienced.parent@test.com',
    status: 'pending'
  },

  // Declined connections
  {
    fromEmail: 'single.parent@test.com',
    toEmail: 'verified.parent@test.com',
    status: 'declined'
  }
];

// Additional profiles with varied zip codes for search testing
interface AdditionalProfile {
  email: string;
  displayName: string;
  zipCode: string;
  bio: string;
  ageRange: string;
  relationshipStatus: string;
  childrenAgeRanges: string[];
  interests: string[];
}

const additionalProfiles: AdditionalProfile[] = [
  {
    email: 'brooklyn.parent@test.com',
    displayName: 'Sarah Brooklyn',
    zipCode: '11201', // Brooklyn, NY
    bio: 'Brooklyn mom who loves exploring the city with my kids!',
    ageRange: '35-44',
    relationshipStatus: 'married',
    childrenAgeRanges: ['3-5', '6-12'],
    interests: ['Outdoor Activities', 'Arts & Crafts', 'Food & Cooking', 'Music']
  },
  {
    email: 'manhattan.parent@test.com',
    displayName: 'Michael Manhattan',
    zipCode: '10001', // Manhattan, NY
    bio: 'Manhattan dad balancing city life and parenting.',
    ageRange: '35-44',
    relationshipStatus: 'married',
    childrenAgeRanges: ['6-12'],
    interests: ['Sports', 'Technology', 'Education', 'Travel']
  },
  {
    email: 'queens.parent@test.com',
    displayName: 'Lisa Queens',
    zipCode: '11101', // Queens, NY
    bio: 'Queens mom passionate about education and community.',
    ageRange: '25-34',
    relationshipStatus: 'single',
    childrenAgeRanges: ['0-2', '3-5'],
    interests: ['Education', 'Parenting Tips', 'Reading', 'Health & Wellness']
  },
  {
    email: 'chicago.parent@test.com',
    displayName: 'Robert Chicago',
    zipCode: '60601', // Chicago, IL
    bio: 'Chicago parent who loves sports and outdoor activities.',
    ageRange: '35-44',
    relationshipStatus: 'married',
    childrenAgeRanges: ['6-12', '13-17'],
    interests: ['Sports', 'Outdoor Activities', 'Travel', 'Technology']
  },
  {
    email: 'sf.parent@test.com',
    displayName: 'Jennifer SF',
    zipCode: '94102', // San Francisco, CA
    bio: 'SF mom working in tech and raising amazing kids.',
    ageRange: '25-34',
    relationshipStatus: 'partnered',
    childrenAgeRanges: ['0-2'],
    interests: ['Technology', 'Health & Wellness', 'Work-Life Balance', 'Food & Cooking']
  }
];

async function seedSprint3Connections() {
  console.log('🌱 Starting Sprint 3 connections seeding...\n');

  try {
    // First, create additional profiles if they don't exist
    console.log('📋 Creating additional profiles for search testing...\n');

    for (const profile of additionalProfiles) {
      // Check if user already exists
      const existingUsers = await adminDb.collection('users')
        .where('email', '==', profile.email)
        .get();

      if (existingUsers.empty) {
        const userRef = adminDb.collection('users').doc();
        const now = new Date().toISOString();

        await userRef.set({
          uid: userRef.id,
          email: profile.email,
          displayName: profile.displayName,
          zipCode: profile.zipCode,
          dateOfBirth: '1985-01-01',
          age: 39,
          ageVerified: true,
          emailVerified: true,
          role: 'user',
          bio: profile.bio,
          ageRange: profile.ageRange,
          relationshipStatus: profile.relationshipStatus,
          childrenAgeRanges: profile.childrenAgeRanges,
          interests: profile.interests,
          verificationStatus: 'verified',
          onboardingCompleted: true,
          privacySettings: {
            showEmail: false,
            showPhone: false,
            showExactLocation: true,
            profileVisibility: 'public'
          },
          createdAt: now,
          updatedAt: now
        });

        // Also create profile document
        await adminDb.collection('profiles').doc(userRef.id).set({
          uid: userRef.id,
          displayName: profile.displayName,
          email: profile.email,
          zipCode: profile.zipCode,
          bio: profile.bio,
          ageRange: profile.ageRange,
          relationshipStatus: profile.relationshipStatus,
          childrenAgeRanges: profile.childrenAgeRanges,
          interests: profile.interests,
          verificationStatus: 'verified',
          profileCompleteness: 100,
          isPublic: true,
          showsExactLocation: true,
          createdAt: now,
          updatedAt: now
        });

        console.log(`✅ Created profile: ${profile.displayName} (${profile.zipCode})`);
      } else {
        console.log(`⏭️  Profile already exists: ${profile.email}`);
      }
    }

    console.log('\n📋 Creating connections...\n');

    // Get all users to map emails to UIDs
    const usersSnapshot = await adminDb.collection('users').get();
    const emailToUid = new Map<string, string>();

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data();
      emailToUid.set(data.email, doc.id);
    });

    let created = 0;
    let skipped = 0;

    for (const connection of connectionsData) {
      const fromUserId = emailToUid.get(connection.fromEmail);
      const toUserId = emailToUid.get(connection.toEmail);

      if (!fromUserId || !toUserId) {
        console.log(`⏭️  Skipping connection: ${connection.fromEmail} -> ${connection.toEmail} (user not found)`);
        skipped++;
        continue;
      }

      // Check if connection already exists
      const existingConnection = await adminDb.collection('connections')
        .where('fromUserId', '==', fromUserId)
        .where('toUserId', '==', toUserId)
        .get();

      if (!existingConnection.empty) {
        console.log(`⏭️  Connection already exists: ${connection.fromEmail} -> ${connection.toEmail}`);
        skipped++;
        continue;
      }

      // Create connection
      const now = FieldValue.serverTimestamp();
      const connectionData: any = {
        fromUserId,
        toUserId,
        status: connection.status,
        message: connection.message || '',
        requestedAt: now,
        createdAt: now,
        updatedAt: now
      };

      if (connection.status === 'accepted' || connection.status === 'declined') {
        connectionData.respondedAt = now;
      }

      await adminDb.collection('connections').add(connectionData);

      const statusEmoji = connection.status === 'accepted' ? '✅' :
                         connection.status === 'pending' ? '⏳' : '❌';
      console.log(`${statusEmoji} Created ${connection.status} connection: ${connection.fromEmail} -> ${connection.toEmail}`);

      created++;
    }

    console.log('\n✨ Sprint 3 connections seeding complete!');
    console.log(`   - Created: ${created}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${created + skipped}`);
    console.log(`   - Additional profiles: ${additionalProfiles.length}`);

  } catch (error) {
    console.error('❌ Error seeding Sprint 3 connections:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedSprint3Connections()
    .then(() => {
      console.log('\n✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedSprint3Connections };
