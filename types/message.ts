/**
 * Message and conversation types
 */

export type MessageType = 'text' | 'image';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  imageUrl?: string;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  unreadCount: {
    [userId: string]: number;
  };
  mutedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationWithParticipants extends Conversation {
  participants: Array<{
    uid: string;
    displayName: string;
    photoURL?: string;
    zipCode: string;
  }>;
  otherParticipant?: {
    uid: string;
    displayName: string;
    photoURL?: string;
    zipCode: string;
  };
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  displayName: string;
  timestamp: string;
}

export interface SendMessageRequest {
  conversationId: string;
  type: MessageType;
  content: string;
  imageFile?: File;
}

export interface CreateConversationRequest {
  participantId: string;
}
