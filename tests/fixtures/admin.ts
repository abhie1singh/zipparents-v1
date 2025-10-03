/**
 * Admin Test Fixtures
 *
 * Provides predefined admin-related data for testing
 */

export interface ReportFixture {
  type: 'user' | 'post' | 'event' | 'message';
  reason: string;
  description?: string;
  reportedUserId?: string;
  reportedContentId?: string;
}

export interface ModerationActionFixture {
  action: 'warn' | 'suspend' | 'ban' | 'remove_content' | 'dismiss';
  reason: string;
  duration?: number; // For suspensions (in days)
  notes?: string;
}

/**
 * Report reason fixtures
 */
export const REPORT_REASONS = {
  spam: 'Spam or misleading content',
  harassment: 'Harassment or bullying',
  inappropriate: 'Inappropriate content',
  fake: 'Fake profile or impersonation',
  safety: 'Safety concern',
  other: 'Other',
};

/**
 * Report fixtures for different scenarios
 */
export const REPORT_FIXTURES = {
  // User report - spam
  userSpam: {
    type: 'user' as const,
    reason: REPORT_REASONS.spam,
    description: 'This user is sending spam messages to multiple parents',
  },

  // User report - harassment
  userHarassment: {
    type: 'user' as const,
    reason: REPORT_REASONS.harassment,
    description: 'This user sent threatening messages',
  },

  // User report - fake profile
  fakeProfile: {
    type: 'user' as const,
    reason: REPORT_REASONS.fake,
    description: 'This appears to be a fake profile using stock photos',
  },

  // Post report - inappropriate
  postInappropriate: {
    type: 'post' as const,
    reason: REPORT_REASONS.inappropriate,
    description: 'This post contains inappropriate language',
  },

  // Post report - spam
  postSpam: {
    type: 'post' as const,
    reason: REPORT_REASONS.spam,
    description: 'This post is advertising commercial services',
  },

  // Event report - safety concern
  eventSafety: {
    type: 'event' as const,
    reason: REPORT_REASONS.safety,
    description: 'This event seems suspicious and may not be safe',
  },

  // Event report - inappropriate
  eventInappropriate: {
    type: 'event' as const,
    reason: REPORT_REASONS.inappropriate,
    description: 'This event has inappropriate content in the description',
  },

  // Message report - harassment
  messageHarassment: {
    type: 'message' as const,
    reason: REPORT_REASONS.harassment,
    description: 'This message contains harassing content',
  },

  // Message report - spam
  messageSpam: {
    type: 'message' as const,
    reason: REPORT_REASONS.spam,
    description: 'This user is sending spam messages',
  },

  // Generic report
  genericReport: {
    type: 'user' as const,
    reason: REPORT_REASONS.other,
    description: 'General concern about this user\'s behavior',
  },
};

/**
 * Moderation action fixtures
 */
export const MODERATION_ACTION_FIXTURES = {
  // Warning
  warning: {
    action: 'warn' as const,
    reason: 'First offense - inappropriate language',
    notes: 'User has been warned about community guidelines',
  },

  // Suspension - 7 days
  suspension7Days: {
    action: 'suspend' as const,
    reason: 'Multiple violations of community guidelines',
    duration: 7,
    notes: 'User suspended for 7 days after repeated warnings',
  },

  // Suspension - 14 days
  suspension14Days: {
    action: 'suspend' as const,
    reason: 'Continued inappropriate behavior after warning',
    duration: 14,
    notes: 'Extended suspension due to pattern of violations',
  },

  // Suspension - 30 days
  suspension30Days: {
    action: 'suspend' as const,
    reason: 'Serious violation of community guidelines',
    duration: 30,
    notes: 'Maximum suspension period before ban consideration',
  },

  // Ban
  permanentBan: {
    action: 'ban' as const,
    reason: 'Severe violation - harassment and threats',
    notes: 'Permanent ban due to serious safety concerns',
  },

  // Remove content
  removeContent: {
    action: 'remove_content' as const,
    reason: 'Content violates community guidelines',
    notes: 'Content removed and user notified',
  },

  // Dismiss report
  dismissReport: {
    action: 'dismiss' as const,
    reason: 'Report found to be invalid after review',
    notes: 'No violation found, reporter may have misunderstood guidelines',
  },

  // Dismiss - false report
  dismissFalse: {
    action: 'dismiss' as const,
    reason: 'False report',
    notes: 'Content reviewed and found to be within guidelines',
  },
};

/**
 * Admin user scenarios
 */
export const ADMIN_SCENARIOS = {
  // First time moderator
  newModerator: {
    role: 'moderator',
    permissions: ['view_reports', 'moderate_content'],
    actionsPerformed: 0,
  },

  // Experienced moderator
  experiencedModerator: {
    role: 'moderator',
    permissions: ['view_reports', 'moderate_content', 'warn_users'],
    actionsPerformed: 50,
  },

  // Senior admin
  seniorAdmin: {
    role: 'admin',
    permissions: [
      'view_reports',
      'moderate_content',
      'warn_users',
      'suspend_users',
      'ban_users',
      'view_logs',
      'manage_users',
    ],
    actionsPerformed: 200,
  },

  // Super admin
  superAdmin: {
    role: 'admin',
    permissions: ['*'], // All permissions
    actionsPerformed: 500,
  },
};

/**
 * Moderation log fixtures
 */
export const MODERATION_LOG_FIXTURES = {
  // Content removal log
  contentRemoval: {
    action: 'remove_content',
    adminId: 'admin123',
    targetUserId: 'user456',
    contentId: 'post789',
    contentType: 'post',
    reason: 'Inappropriate content',
    timestamp: new Date().toISOString(),
  },

  // User suspension log
  userSuspension: {
    action: 'suspend_user',
    adminId: 'admin123',
    targetUserId: 'user456',
    reason: 'Multiple violations',
    duration: 7,
    timestamp: new Date().toISOString(),
  },

  // User ban log
  userBan: {
    action: 'ban_user',
    adminId: 'admin123',
    targetUserId: 'user456',
    reason: 'Severe harassment',
    timestamp: new Date().toISOString(),
  },

  // Report dismissal log
  reportDismissal: {
    action: 'dismiss_report',
    adminId: 'admin123',
    reportId: 'report789',
    reason: 'No violation found',
    timestamp: new Date().toISOString(),
  },
};

/**
 * Platform metrics fixtures
 */
export const PLATFORM_METRICS_FIXTURES = {
  // Healthy platform
  healthy: {
    totalUsers: 1000,
    activeUsers: 750,
    verifiedUsers: 900,
    suspendedUsers: 5,
    bannedUsers: 2,
    totalPosts: 5000,
    totalEvents: 200,
    totalMessages: 10000,
    pendingReports: 3,
    resolvedReports: 147,
  },

  // Platform with issues
  needsAttention: {
    totalUsers: 1000,
    activeUsers: 600,
    verifiedUsers: 850,
    suspendedUsers: 30,
    bannedUsers: 15,
    totalPosts: 5000,
    totalEvents: 200,
    totalMessages: 10000,
    pendingReports: 45,
    resolvedReports: 100,
  },

  // Small platform
  small: {
    totalUsers: 50,
    activeUsers: 40,
    verifiedUsers: 45,
    suspendedUsers: 0,
    bannedUsers: 0,
    totalPosts: 100,
    totalEvents: 10,
    totalMessages: 200,
    pendingReports: 0,
    resolvedReports: 5,
  },

  // Large platform
  large: {
    totalUsers: 10000,
    activeUsers: 7500,
    verifiedUsers: 9500,
    suspendedUsers: 50,
    bannedUsers: 25,
    totalPosts: 50000,
    totalEvents: 2000,
    totalMessages: 100000,
    pendingReports: 20,
    resolvedReports: 2000,
  },
};

/**
 * Generate random moderation reason
 */
export function generateModerationReason(): string {
  const reasons = [
    'Violation of community guidelines',
    'Inappropriate content',
    'Spam or commercial activity',
    'Harassment or bullying',
    'Safety concern',
    'Multiple user reports',
    'Fake or misleading information',
    'Repeated violations after warning',
  ];

  return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * Generate random report
 */
export function generateRandomReport(): ReportFixture {
  const types: Array<'user' | 'post' | 'event' | 'message'> = ['user', 'post', 'event', 'message'];
  const reasons = Object.values(REPORT_REASONS);

  return {
    type: types[Math.floor(Math.random() * types.length)],
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    description: `This is a test report with detailed description of the issue.`,
  };
}
