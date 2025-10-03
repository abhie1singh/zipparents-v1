/**
 * Seed Reports Script
 *
 * Creates sample reports for testing moderation features
 */

import * as admin from 'firebase-admin';
import {
  initializeAdmin,
  getFirestore,
  getEnvironment,
  ProgressLogger,
} from './utils/firebase-admin';

const REPORT_TYPES = ['user', 'post', 'event', 'message'];

const REPORT_REASONS = {
  user: [
    'Spam or misleading content',
    'Harassment or bullying',
    'Inappropriate behavior',
    'Fake profile',
    'Safety concerns',
  ],
  post: [
    'Spam or misleading content',
    'Inappropriate content',
    'Harassment or hate speech',
    'Scam or fraud',
    'Violence or dangerous content',
  ],
  event: [
    'Inappropriate event',
    'Spam or fake event',
    'Safety concerns',
    'Misleading information',
    'Scam or fraud',
  ],
  message: [
    'Harassment or threatening',
    'Spam',
    'Inappropriate content',
    'Scam or fraud',
    'Unwanted contact',
  ],
};

const REPORT_DESCRIPTIONS = [
  'This user has been sending spam messages to multiple people.',
  'Inappropriate content that violates community guidelines.',
  'I received harassing messages from this person.',
  'This appears to be a fake profile with stolen photos.',
  'Suspicious behavior that raises safety concerns.',
  'Multiple spam posts in short period of time.',
  'Content contains hate speech and offensive language.',
  'This event seems like a scam to collect personal information.',
  'Threatening messages that make me feel unsafe.',
  'Content is not appropriate for a family-friendly platform.',
];

/**
 * Get random item from array
 */
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random date within range
 */
function getRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(9 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));
  return date.toISOString();
}

/**
 * Seed reports
 */
async function seedReports() {
  console.log('🌱 Seeding reports...\n');

  const env = getEnvironment();
  initializeAdmin(env);

  const db = getFirestore();

  // Get all users
  const usersSnapshot = await db.collection('users').get();
  const users = usersSnapshot.docs.map(doc => doc.id);

  console.log(`Found ${users.length} users`);

  const reportCount = 25; // Create 25 sample reports
  const progress = new ProgressLogger(reportCount, 'Creating reports');

  for (let i = 0; i < reportCount; i++) {
    // Pick random reporter and reported user
    const reporterId = getRandomItem(users);
    const reportedUserId = getRandomItem(users.filter(u => u !== reporterId));

    // Pick random report type
    const type = getRandomItem(REPORT_TYPES) as keyof typeof REPORT_REASONS;
    const reason = getRandomItem(REPORT_REASONS[type]);
    const description = getRandomItem(REPORT_DESCRIPTIONS);

    // Determine status (60% pending, 30% resolved, 10% dismissed)
    const rand = Math.random();
    let status: 'pending' | 'resolved' | 'dismissed';
    let resolvedAt = null;
    let resolvedBy = null;
    let resolution = null;

    if (rand < 0.6) {
      status = 'pending';
    } else if (rand < 0.9) {
      status = 'resolved';
      resolvedAt = getRandomDate(7);
      resolvedBy = 'admin-user-id'; // Would be actual admin ID
      resolution = 'User warned and content removed';
    } else {
      status = 'dismissed';
      resolvedAt = getRandomDate(7);
      resolvedBy = 'admin-user-id';
      resolution = 'No violation found';
    }

    // Determine severity (50% low, 30% medium, 20% high)
    const severityRand = Math.random();
    const severity = severityRand < 0.5 ? 'low' : severityRand < 0.8 ? 'medium' : 'high';

    try {
      const reportRef = db.collection('reports').doc();

      await reportRef.set({
        reporterId,
        reportedUserId,
        type,
        reason,
        description,
        status,
        severity,
        resolvedAt,
        resolvedBy,
        resolution,
        createdAt: getRandomDate(30),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // If resolved, create moderation log
      if (status === 'resolved') {
        const logRef = db.collection('moderationLogs').doc();
        await logRef.set({
          adminId: 'admin-user-id',
          action: 'resolve_report',
          targetUserId: reportedUserId,
          reportId: reportRef.id,
          reason: resolution,
          details: {
            originalReason: reason,
            reportType: type,
          },
          createdAt: resolvedAt,
        });
      }

      progress.increment();
    } catch (error: any) {
      console.error(`\n❌ Error creating report:`, error.message);
    }
  }

  progress.complete();

  console.log(`\n✅ Successfully seeded ${reportCount} reports!`);
  console.log(`📊 ~60% pending, ~30% resolved, ~10% dismissed`);
  console.log(`⚠️ Severity: ~50% low, ~30% medium, ~20% high`);
  console.log(`📝 Types: ${REPORT_TYPES.join(', ')}`);
}

// Run if called directly
if (require.main === module) {
  seedReports()
    .then(() => {
      console.log('\n✅ Seed reports complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error seeding reports:', error);
      process.exit(1);
    });
}

export { seedReports };
