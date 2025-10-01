/**
 * Connection types for Sprint 3
 */

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: ConnectionStatus;
  requestedAt: string;
  respondedAt?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionWithUser extends Connection {
  user: {
    uid: string;
    displayName: string;
    email: string;
    zipCode: string;
    bio?: string;
    interests?: string[];
    photoURL?: string;
    distance?: number;
  };
}

export interface ConnectionRequest {
  toUserId: string;
  message?: string;
}

export interface ConnectionResponse {
  connectionId: string;
  accept: boolean;
}
