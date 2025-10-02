/**
 * Safety and moderation types
 */

export type ReportType = 'user' | 'message' | 'profile';
export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'fake_profile'
  | 'safety_concern'
  | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  type: ReportType;
  reason: ReportReason;
  description: string;
  messageId?: string;
  conversationId?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface ReportRequest {
  reportedUserId: string;
  type: ReportType;
  reason: ReportReason;
  description: string;
  messageId?: string;
  conversationId?: string;
}

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: string;
}

export interface BlockedUserWithProfile extends BlockedUser {
  blockedUser: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
}
