/**
 * Admin Panel Types - Sprint 7
 */

export type UserRole = 'user' | 'admin' | 'moderator';

export type UserStatus = 'active' | 'suspended' | 'banned';

export type ReportType = 'message' | 'event' | 'profile' | 'user';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export type ModerationAction =
  | 'dismiss_report'
  | 'warn_user'
  | 'remove_content'
  | 'suspend_user'
  | 'ban_user'
  | 'verify_user'
  | 'unsuspend_user'
  | 'unban_user'
  | 'cancel_event';

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;
  reportedBy: string;
  reportedUserId: string;
  reportedUserDisplayName: string;
  contentId?: string; // message/event/profile ID
  reason: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
  metadata?: {
    messageText?: string;
    eventTitle?: string;
    profileUrl?: string;
  };
}

export interface ModerationLog {
  id: string;
  action: ModerationAction;
  performedBy: string;
  performedByName: string;
  targetUserId: string;
  targetUserName: string;
  reason?: string;
  contentId?: string;
  reportId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  profilePictureUrl?: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  suspendedUsers: number;
  bannedUsers: number;
  totalPosts: number;
  totalEvents: number;
  totalMessages: number;
  pendingReports: number;
  resolvedReports: number;
  timestamp: Date;
}
