/**
 * Connection service for managing parent connections
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  or,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  Connection,
  ConnectionStatus,
  ConnectionRequest,
  ConnectionResponse,
  ConnectionWithUser
} from '@/types/connection';
import { getProfile } from '@/lib/profile/profile-helpers';

/**
 * Send a connection request to another user
 * @param fromUserId ID of the user sending the request
 * @param request Connection request data
 * @returns The created connection
 */
export async function sendConnectionRequest(
  fromUserId: string,
  request: ConnectionRequest
): Promise<Connection> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  // Check if connection already exists
  const existing = await getExistingConnection(fromUserId, request.toUserId);
  if (existing) {
    throw new Error('Connection request already exists');
  }

  // Create connection
  const connectionData = {
    fromUserId,
    toUserId: request.toUserId,
    status: 'pending' as ConnectionStatus,
    message: request.message || '',
    requestedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(connectionsRef, connectionData);
  const newDoc = await getDoc(docRef);

  return {
    id: docRef.id,
    ...newDoc.data(),
    requestedAt: (newDoc.data()?.requestedAt as Timestamp)?.toDate().toISOString(),
    createdAt: (newDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (newDoc.data()?.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Connection;
}

/**
 * Respond to a connection request (accept or decline)
 * @param userId ID of the user responding
 * @param response Connection response data
 * @returns Updated connection
 */
export async function respondToConnection(
  userId: string,
  response: ConnectionResponse
): Promise<Connection> {
  const db = getFirestore();
  const connectionRef = doc(db, 'connections', response.connectionId);

  const connectionDoc = await getDoc(connectionRef);
  if (!connectionDoc.exists()) {
    throw new Error('Connection not found');
  }

  const connection = connectionDoc.data() as Connection;

  // Verify user is the recipient
  if (connection.toUserId !== userId) {
    throw new Error('Unauthorized to respond to this connection');
  }

  // Update connection status
  const newStatus: ConnectionStatus = response.accept ? 'accepted' : 'declined';
  await updateDoc(connectionRef, {
    status: newStatus,
    respondedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const updatedDoc = await getDoc(connectionRef);
  return {
    id: connectionRef.id,
    ...updatedDoc.data(),
    requestedAt: (updatedDoc.data()?.requestedAt as Timestamp)?.toDate().toISOString(),
    respondedAt: (updatedDoc.data()?.respondedAt as Timestamp)?.toDate().toISOString(),
    createdAt: (updatedDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (updatedDoc.data()?.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Connection;
}

/**
 * Block a user
 * @param userId ID of the user doing the blocking
 * @param targetUserId ID of the user to block
 */
export async function blockUser(userId: string, targetUserId: string): Promise<void> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  // Find existing connection
  const existing = await getExistingConnection(userId, targetUserId);

  if (existing) {
    // Update existing connection to blocked
    const connectionRef = doc(db, 'connections', existing.id);
    await updateDoc(connectionRef, {
      status: 'blocked' as ConnectionStatus,
      updatedAt: serverTimestamp(),
    });
  } else {
    // Create new blocked connection
    await addDoc(connectionsRef, {
      fromUserId: userId,
      toUserId: targetUserId,
      status: 'blocked' as ConnectionStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Get all connections for a user
 * @param userId User ID
 * @param status Optional status filter
 * @returns List of connections with user details
 */
export async function getUserConnections(
  userId: string,
  status?: ConnectionStatus
): Promise<ConnectionWithUser[]> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  // Query for connections where user is either sender or recipient
  let q = query(
    connectionsRef,
    or(
      where('fromUserId', '==', userId),
      where('toUserId', '==', userId)
    ),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);

  let connections = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    requestedAt: (doc.data().requestedAt as Timestamp)?.toDate().toISOString(),
    respondedAt: (doc.data().respondedAt as Timestamp)?.toDate().toISOString(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
  })) as Connection[];

  // Filter by status if provided
  if (status) {
    connections = connections.filter(c => c.status === status);
  }

  // Fetch user details for each connection
  const connectionsWithUsers = await Promise.all(
    connections.map(async (connection) => {
      // Get the other user's ID
      const otherUserId = connection.fromUserId === userId
        ? connection.toUserId
        : connection.fromUserId;

      // Fetch their profile
      const profile = await getProfile(otherUserId);

      return {
        ...connection,
        user: {
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email || '',
          zipCode: profile.zipCode,
          bio: profile.bio,
          interests: profile.interests,
          photoURL: profile.photoURL || undefined,
        }
      };
    })
  );

  return connectionsWithUsers;
}

/**
 * Get pending connection requests received by a user
 * @param userId User ID
 * @returns List of pending requests with sender details
 */
export async function getPendingRequests(userId: string): Promise<ConnectionWithUser[]> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  const q = query(
    connectionsRef,
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('requestedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const requests = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const connection = {
        id: doc.id,
        ...doc.data(),
        requestedAt: (doc.data().requestedAt as Timestamp)?.toDate().toISOString(),
        createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
      } as Connection;

      const profile = await getProfile(connection.fromUserId);

      return {
        ...connection,
        user: {
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email || '',
          zipCode: profile.zipCode,
          bio: profile.bio,
          interests: profile.interests,
          photoURL: profile.photoURL || undefined,
        }
      };
    })
  );

  return requests;
}

/**
 * Get accepted connections for a user
 * @param userId User ID
 * @returns List of accepted connections with user details
 */
export async function getAcceptedConnections(userId: string): Promise<ConnectionWithUser[]> {
  return getUserConnections(userId, 'accepted');
}

/**
 * Check connection status between two users
 * @param userId1 First user ID
 * @param userId2 Second user ID
 * @returns Connection status or 'none' if no connection exists
 */
export async function getConnectionStatus(
  userId1: string,
  userId2: string
): Promise<ConnectionStatus | 'none'> {
  const connection = await getExistingConnection(userId1, userId2);
  return connection ? connection.status : 'none';
}

/**
 * Get existing connection between two users (helper function)
 * @param userId1 First user ID
 * @param userId2 Second user ID
 * @returns Connection if exists, null otherwise
 */
async function getExistingConnection(
  userId1: string,
  userId2: string
): Promise<Connection | null> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  const q = query(
    connectionsRef,
    or(
      where('fromUserId', '==', userId1),
      where('toUserId', '==', userId1)
    )
  );

  const snapshot = await getDocs(q);

  const connection = snapshot.docs.find(doc => {
    const data = doc.data();
    return (
      (data.fromUserId === userId1 && data.toUserId === userId2) ||
      (data.fromUserId === userId2 && data.toUserId === userId1)
    );
  });

  if (!connection) return null;

  return {
    id: connection.id,
    ...connection.data(),
    requestedAt: (connection.data().requestedAt as Timestamp)?.toDate().toISOString(),
    respondedAt: (connection.data().respondedAt as Timestamp)?.toDate().toISOString(),
    createdAt: (connection.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (connection.data().updatedAt as Timestamp)?.toDate().toISOString(),
  } as Connection;
}

/**
 * Get count of pending requests for a user
 * @param userId User ID
 * @returns Number of pending requests
 */
export async function getPendingRequestsCount(userId: string): Promise<number> {
  const db = getFirestore();
  const connectionsRef = collection(db, 'connections');

  const q = query(
    connectionsRef,
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}
