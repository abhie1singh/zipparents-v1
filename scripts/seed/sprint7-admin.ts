import { adminAuth, adminDb } from '../../lib/firebase/adminApp';
import { faker } from '@faker-js/faker';

/**
 * Sprint 7 Seed Data - Admin Panel & Content Moderation
 *
 * Creates:
 * - Admin user
 * - Sample reports (message, event, profile, user)
 * - Moderation action logs
 * - Activity logs
 * - Users with different statuses (suspended, banned)
 */

async function seedAdminData() {
  console.log('Starting Sprint 7 seed data...');

  const auth = adminAuth;
  const db = adminDb;

  if (!auth || !db) {
    throw new Error('Firebase Admin not initialized');
  }

  // Get existing users to use as references
  const usersSnapshot = await db.collection('users').get();
  let users = usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  if (users.length < 3) {
    console.error('Not enough users found. Please run sprint1-users seed first.');
    process.exit(1);
  }

  console.log(`\nFound ${users.length} existing users`);

  // Get or create admin user
  // Priority: admin.test@test.com > verified.parent@test.com > first user
  let adminUser: any = users.find((u: any) => u.email === 'admin.test@test.com');

  if (!adminUser) {
    console.log('admin.test@test.com not found, trying verified.parent@test.com...');
    adminUser = users.find((u: any) => u.email === 'verified.parent@test.com');
  }

  if (!adminUser) {
    console.log('No known admin user found, using first user as admin...');
    // Use the first user and make them admin
    adminUser = users[0];
  }

  // Ensure admin user has admin role
  await db.collection('users').doc(adminUser.id).update({
    role: 'admin',
    updatedAt: new Date().toISOString(),
  });

  console.log(`\nAdmin user: ${adminUser.displayName || adminUser.email} (${adminUser.id})`);

  // 1. Create users with different statuses
  console.log('\n1. Creating users with different statuses...');

  // Suspended user
  const suspendedUserId = users[1].id;
  await db.collection('users').doc(suspendedUserId).update({
    status: 'suspended',
    updatedAt: new Date().toISOString(),
  });
  console.log(`  - Suspended user: ${users[1].displayName}`);

  // Banned user (if we have enough users)
  if (users.length > 2) {
    const bannedUserId = users[2].id;
    await db.collection('users').doc(bannedUserId).update({
      status: 'banned',
      updatedAt: new Date().toISOString(),
    });
    console.log(`  - Banned user: ${users[2].displayName}`);
  }

  // 2. Create sample reports
  console.log('\n2. Creating sample reports...');

  const reportTypes = ['message', 'event', 'profile', 'user'];
  const reportReasons = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam or scam',
    'Fake profile',
    'Offensive language',
    'Sharing personal information',
  ];

  const reportStatuses: Array<'pending' | 'reviewing' | 'resolved' | 'dismissed'> = [
    'pending',
    'pending',
    'pending',
    'reviewing',
    'reviewing',
    'resolved',
    'resolved',
    'dismissed',
  ];

  const reports = [];

  for (let i = 0; i < 8; i++) {
    const reporter = users[i % users.length];
    const reportedUser = users[(i + 1) % users.length];
    const reportType = reportTypes[i % reportTypes.length];
    const status = reportStatuses[i];

    const report: any = {
      type: reportType,
      status: status,
      reportedBy: reporter.id,
      reportedUserId: reportedUser.id,
      reportedUserDisplayName: reportedUser.displayName,
      reason: reportReasons[i % reportReasons.length],
      description: faker.lorem.paragraph(),
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Spread over last 8 days
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    };

    // Only add contentId if not a user report
    if (reportType !== 'user') {
      report.contentId = `${reportType}_${faker.string.alphanumeric(8)}`;
    }

    // Only add review fields if resolved or dismissed
    if (status === 'resolved' || status === 'dismissed') {
      report.reviewedBy = adminUser.id;
      report.reviewedAt = new Date(Date.now() - i * 43200000).toISOString();
      report.resolution = status === 'resolved'
        ? 'Content removed and user warned'
        : 'No violation found';
    }

    // Only add metadata if applicable
    if (reportType === 'message') {
      report.metadata = { messageText: faker.lorem.sentence() };
    } else if (reportType === 'event') {
      report.metadata = { eventTitle: faker.lorem.words(3) };
    } else if (reportType === 'profile') {
      report.metadata = { profileUrl: `/profile/${reportedUser.id}` };
    }

    const reportRef = await db.collection('reports').add(report);
    reports.push({ id: reportRef.id, ...report });
    console.log(`  - Created ${status} ${reportType} report`);
  }

  // 3. Create moderation logs
  console.log('\n3. Creating moderation action logs...');

  const moderationActions = [
    {
      action: 'suspend_user',
      targetUserId: suspendedUserId,
      targetUserName: users[1].displayName,
      reason: 'Multiple violations of community guidelines',
    },
    {
      action: 'ban_user',
      targetUserId: users.length > 2 ? users[2].id : users[1].id,
      targetUserName: users.length > 2 ? users[2].displayName : users[1].displayName,
      reason: 'Severe violation - harassment',
    },
    {
      action: 'remove_content',
      targetUserId: users[3 % users.length].id,
      targetUserName: users[3 % users.length].displayName,
      contentId: 'message_abc123',
      reason: 'Inappropriate content',
      reportId: reports[0].id,
    },
    {
      action: 'dismiss_report',
      targetUserId: '',
      targetUserName: '',
      reportId: reports[reports.length - 1].id,
      reason: 'No violation found after review',
    },
    {
      action: 'verify_user',
      targetUserId: users[4 % users.length].id,
      targetUserName: users[4 % users.length].displayName,
      reason: 'Manual verification approved',
    },
    {
      action: 'warn_user',
      targetUserId: users[5 % users.length].id,
      targetUserName: users[5 % users.length].displayName,
      reason: 'First time offense - warned about inappropriate language',
    },
  ];

  for (let i = 0; i < moderationActions.length; i++) {
    const action = moderationActions[i];
    const log: any = {
      action: action.action,
      performedBy: adminUser.id,
      performedByName: adminUser.displayName,
      targetUserId: action.targetUserId,
      targetUserName: action.targetUserName,
      reason: action.reason,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(), // Spread over last 6 hours
      metadata: {},
    };

    // Only add contentId and reportId if they exist
    if (action.contentId) {
      log.contentId = action.contentId;
    }
    if (action.reportId) {
      log.reportId = action.reportId;
    }

    await db.collection('moderationLogs').add(log);
    console.log(`  - Logged action: ${action.action}`);
  }

  // 4. Create activity logs for users
  console.log('\n4. Creating user activity logs...');

  const activityTypes = [
    'user_login',
    'profile_updated',
    'event_created',
    'message_sent',
    'connection_request_sent',
    'connection_request_accepted',
    'post_created',
    'report_submitted',
  ];

  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    const activityType = activityTypes[i % activityTypes.length];

    const log = {
      userId: user.id,
      action: activityType,
      timestamp: new Date(Date.now() - i * 1800000).toISOString(), // Spread over last 10 hours
      metadata: {
        userAgent: faker.internet.userAgent(),
        ipAddress: faker.internet.ip(),
      },
    };

    await db.collection('activityLogs').add(log);
  }
  console.log(`  - Created 20 activity log entries`);

  console.log('\n✅ Sprint 7 seed data complete!\n');
  console.log('Summary:');
  console.log('========\n');
  console.log(`- Admin User: ${adminUser.displayName} (${adminUser.email})`);
  console.log(`- Reports Created: ${reports.length}`);
  console.log(`  - Pending: ${reports.filter(r => r.status === 'pending').length}`);
  console.log(`  - Reviewing: ${reports.filter(r => r.status === 'reviewing').length}`);
  console.log(`  - Resolved: ${reports.filter(r => r.status === 'resolved').length}`);
  console.log(`  - Dismissed: ${reports.filter(r => r.status === 'dismissed').length}`);
  console.log(`- Moderation Logs: ${moderationActions.length}`);
  console.log(`- Activity Logs: 20`);
  console.log(`- Suspended Users: 1`);
  console.log(`- Banned Users: ${users.length > 2 ? '1' : '0'}`);
  console.log('\nTo access admin panel:');
  console.log('1. Login as: admin.test@test.com');
  console.log('2. Password: Test123!');
  console.log('3. Navigate to: /admin\n');
}

// Run the seed script
seedAdminData()
  .then(() => {
    console.log('Seed script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
