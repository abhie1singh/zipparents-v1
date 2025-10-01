import { adminDb } from '../../lib/firebase/adminApp';
import { DEFAULT_PRIVACY_SETTINGS } from '../../lib/constants/profile';

interface ProfileData {
  email: string;
  bio: string;
  relationshipStatus: string;
  childrenAgeRanges: string[];
  interests: string[];
  ageRange: string;
  verificationStatus: string;
  onboardingCompleted: boolean;
}

// Profile data for test users created in Sprint 1
const profilesData: ProfileData[] = [
  {
    email: 'verified.parent@test.com',
    bio: 'Mom of two amazing kids! Love exploring parks and organizing playdates. Always happy to connect with local parents.',
    relationshipStatus: 'married',
    childrenAgeRanges: ['3-5', '6-8'],
    interests: ['Outdoor Activities', 'Reading', 'Cooking', 'Arts & Crafts', 'Educational Activities'],
    ageRange: '35-44',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'unverified.parent@test.com',
    bio: 'Dad trying to balance work and family life. Love sports and outdoor adventures with my kids.',
    relationshipStatus: 'married',
    childrenAgeRanges: ['9-12', '13+'],
    interests: ['Sports', 'Outdoor Activities', 'Technology', 'Travel'],
    ageRange: '35-44',
    verificationStatus: 'unverified',
    onboardingCompleted: true
  },
  {
    email: 'new.parent@test.com',
    bio: 'First-time mom navigating the parenting journey. Would love to connect with others in similar situations!',
    relationshipStatus: 'married',
    childrenAgeRanges: ['0-2'],
    interests: ['Parenting Support', 'Health & Fitness', 'Reading', 'Photography'],
    ageRange: '25-34',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'local.parent@test.com',
    bio: 'Active in our local parent community. Love organizing events and connecting families.',
    relationshipStatus: 'married',
    childrenAgeRanges: ['6-8', '9-12'],
    interests: ['Community Events', 'Volunteering', 'Sports', 'Music', 'Cooking'],
    ageRange: '35-44',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'young.parent@test.com',
    bio: 'Young mom with lots of energy! Love staying active and trying new things with my little one.',
    relationshipStatus: 'single',
    childrenAgeRanges: ['0-2', '3-5'],
    interests: ['Health & Fitness', 'Music', 'Arts & Crafts', 'Social Meetups'],
    ageRange: '25-34',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'experienced.parent@test.com',
    bio: 'Father of three wonderful kids at different stages. Happy to share parenting tips and experiences!',
    relationshipStatus: 'married',
    childrenAgeRanges: ['6-8', '9-12', '13+'],
    interests: ['Educational Activities', 'Sports', 'Technology', 'Reading', 'Travel'],
    ageRange: '45-54',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'single.parent@test.com',
    bio: 'Single mom looking for support and friendship. We all need a village to raise our kids!',
    relationshipStatus: 'single',
    childrenAgeRanges: ['3-5', '6-8'],
    interests: ['Parenting Support', 'Social Meetups', 'Cooking', 'Arts & Crafts'],
    ageRange: '25-34',
    verificationStatus: 'pending',
    onboardingCompleted: true
  },
  {
    email: 'working.parent@test.com',
    bio: 'Working dad trying to make the most of family time. Always looking for efficient parenting hacks!',
    relationshipStatus: 'married',
    childrenAgeRanges: ['3-5', '6-8'],
    interests: ['Time Management', 'Sports', 'Technology', 'Outdoor Activities'],
    ageRange: '35-44',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'stayathome.parent@test.com',
    bio: 'Stay-at-home mom passionate about early childhood development and creative activities.',
    relationshipStatus: 'married',
    childrenAgeRanges: ['0-2', '3-5'],
    interests: ['Educational Activities', 'Arts & Crafts', 'Reading', 'Cooking', 'Outdoor Activities'],
    ageRange: '35-44',
    verificationStatus: 'verified',
    onboardingCompleted: true
  },
  {
    email: 'admin.test@test.com',
    bio: 'Platform admin - here to help and support our amazing parent community!',
    relationshipStatus: 'prefer-not-to-say',
    childrenAgeRanges: [],
    interests: ['Community Events', 'Technology', 'Parenting Support'],
    ageRange: '35-44',
    verificationStatus: 'verified',
    onboardingCompleted: true
  }
];

async function seedSprint2Profiles() {
  console.log('🌱 Starting Sprint 2 profile seeding...\n');

  try {
    // Get all users from the users collection
    const usersSnapshot = await adminDb.collection('users').get();

    if (usersSnapshot.empty) {
      console.log('⚠️  No users found. Please run Sprint 1 seed first.');
      return;
    }

    console.log(`📋 Found ${usersSnapshot.size} users\n`);

    let updated = 0;
    let skipped = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      const email = userData.email;

      // Find matching profile data
      const profileData = profilesData.find(p => p.email === email);

      if (!profileData) {
        console.log(`⏭️  Skipping ${email} - no profile data defined`);
        skipped++;
        continue;
      }

      // Prepare update data
      const updateData: any = {
        bio: profileData.bio,
        relationshipStatus: profileData.relationshipStatus,
        childrenAgeRanges: profileData.childrenAgeRanges,
        interests: profileData.interests,
        ageRange: profileData.ageRange,
        verificationStatus: profileData.verificationStatus,
        onboardingCompleted: profileData.onboardingCompleted,
        privacySettings: DEFAULT_PRIVACY_SETTINGS,
        updatedAt: new Date().toISOString()
      };

      // Update user document
      await adminDb.collection('users').doc(userId).update(updateData);

      console.log(`✅ Updated profile for: ${email}`);
      console.log(`   - Bio: ${profileData.bio.substring(0, 50)}...`);
      console.log(`   - Interests: ${profileData.interests.length} selected`);
      console.log(`   - Children: ${profileData.childrenAgeRanges.join(', ')}`);
      console.log(`   - Verification: ${profileData.verificationStatus}`);
      console.log('');

      updated++;
    }

    console.log('\n✨ Sprint 2 profile seeding complete!');
    console.log(`   - Updated: ${updated}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${updated + skipped}`);

  } catch (error) {
    console.error('❌ Error seeding Sprint 2 profiles:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedSprint2Profiles()
    .then(() => {
      console.log('\n✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedSprint2Profiles };
