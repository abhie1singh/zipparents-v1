/**
 * Messaging service for conversations and messages
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
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  increment,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseApp, getFirebaseStorage } from '@/lib/firebase/clientApp';
import { getProfile } from '@/lib/profile/profile-helpers';
import { getConnectionStatus } from '@/lib/services/connections';
import {
  Message,
  Conversation,
  ConversationWithParticipants,
  SendMessageRequest,
  CreateConversationRequest,
} from '@/types/message';
import { validateMessageContent, sanitizeInput } from '@/lib/utils/content-filter';

/**
 * Create or get existing conversation between two users
 */
export async function createConversation(
  currentUserId: string,
  request: CreateConversationRequest
): Promise<Conversation> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const { participantId } = request;

  // Verify users are connected
  const connectionStatus = await getConnectionStatus(currentUserId, participantId);
  if (connectionStatus !== 'accepted') {
    throw new Error('Can only message connected users');
  }

  // Check if conversation already exists
  const existing = await getExistingConversation(currentUserId, participantId);
  if (existing) {
    return existing;
  }

  // Create new conversation
  const conversationsRef = collection(db, 'conversations');
  const conversationData = {
    participantIds: [currentUserId, participantId].sort(),
    unreadCount: {
      [currentUserId]: 0,
      [participantId]: 0,
    },
    mutedBy: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(conversationsRef, conversationData);
  const newDoc = await getDoc(docRef);

  return {
    id: docRef.id,
    ...newDoc.data(),
    createdAt: (newDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (newDoc.data()?.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Conversation;
}

/**
 * Get existing conversation between two users
 */
async function getExistingConversation(
  userId1: string,
  userId2: string
): Promise<Conversation | null> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const conversationsRef = collection(db, 'conversations');

  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId1)
  );

  const snapshot = await getDocs(q);

  const conversation = snapshot.docs.find(doc => {
    const data = doc.data();
    return data.participantIds.includes(userId2);
  });

  if (!conversation) return null;

  return {
    id: conversation.id,
    ...conversation.data(),
    createdAt: (conversation.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (conversation.data().updatedAt as Timestamp)?.toDate().toISOString(),
  } as Conversation;
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  userId: string,
  request: SendMessageRequest
): Promise<Message> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const { conversationId, type, content, imageFile } = request;

  // Validate content
  const validation = validateMessageContent(content);
  if (!validation.valid) {
    throw new Error(validation.reason);
  }

  // Verify user is participant
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);

  if (!conversationDoc.exists()) {
    throw new Error('Conversation not found');
  }

  const conversation = conversationDoc.data() as Conversation;
  if (!conversation.participantIds.includes(userId)) {
    throw new Error('Not a participant in this conversation');
  }

  // Upload image if provided
  let imageUrl: string | undefined;
  if (type === 'image' && imageFile) {
    imageUrl = await uploadMessageImage(imageFile, userId, conversationId);
  }

  // Create message
  const messagesRef = collection(db, 'messages');
  const messageData = {
    conversationId,
    senderId: userId,
    type,
    content: sanitizeInput(content),
    ...(imageUrl && { imageUrl }),
    readBy: [userId],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(messagesRef, messageData);
  const newDoc = await getDoc(docRef);

  // Update conversation
  const otherUserId = conversation.participantIds.find(id => id !== userId);
  await updateDoc(conversationRef, {
    lastMessage: {
      content: type === 'image' ? '📷 Image' : content.substring(0, 100),
      senderId: userId,
      createdAt: serverTimestamp(),
    },
    [`unreadCount.${otherUserId}`]: increment(1),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    ...newDoc.data(),
    createdAt: (newDoc.data()?.createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (newDoc.data()?.updatedAt as Timestamp)?.toDate().toISOString(),
  } as Message;
}

/**
 * Upload message image to storage
 */
async function uploadMessageImage(
  file: File,
  userId: string,
  conversationId: string
): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error('Firebase Storage not initialized');

  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}.${extension}`;
  const storagePath = `messages/${conversationId}/${userId}/${filename}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file);

  return await getDownloadURL(storageRef);
}

/**
 * Get all conversations for a user
 */
export async function getUserConversations(
  userId: string
): Promise<ConversationWithParticipants[]> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const conversationsRef = collection(db, 'conversations');

  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  const conversations = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const conversation: Conversation = {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
      } as Conversation;

      // Get participant profiles
      const participants = await Promise.all(
        conversation.participantIds.map(async (participantId) => {
          const profile = await getProfile(participantId);
          return {
            uid: profile.uid,
            displayName: profile.displayName,
            photoURL: profile.photoURL || undefined,
            zipCode: profile.zipCode,
          };
        })
      );

      const otherParticipant = participants.find(p => p.uid !== userId);

      return {
        ...conversation,
        participants,
        otherParticipant,
      };
    })
  );

  return conversations;
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(
  conversationId: string,
  userId: string,
  limitCount: number = 50
): Promise<Message[]> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);

  // Verify user is participant
  const conversationRef = doc(db, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);

  if (!conversationDoc.exists()) {
    throw new Error('Conversation not found');
  }

  const conversation = conversationDoc.data() as Conversation;
  if (!conversation.participantIds.includes(userId)) {
    throw new Error('Not a participant in this conversation');
  }

  // Get messages
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);

  const messages = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
  })) as Message[];

  return messages.reverse();
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);

  // Update conversation unread count
  const conversationRef = doc(db, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    [`unreadCount.${userId}`]: 0,
  });

  // Update messages readBy
  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('senderId', '!=', userId)
  );

  const snapshot = await getDocs(q);

  const updatePromises = snapshot.docs.map(async (messageDoc) => {
    const message = messageDoc.data();
    if (!message.readBy?.includes(userId)) {
      await updateDoc(doc(db, 'messages', messageDoc.id), {
        readBy: arrayUnion(userId),
      });
    }
  });

  await Promise.all(updatePromises);
}

/**
 * Mute/unmute conversation
 */
export async function toggleMuteConversation(
  conversationId: string,
  userId: string,
  mute: boolean
): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const conversationRef = doc(db, 'conversations', conversationId);

  const conversationDoc = await getDoc(conversationRef);
  if (!conversationDoc.exists()) {
    throw new Error('Conversation not found');
  }

  const conversation = conversationDoc.data() as Conversation;
  const mutedBy = conversation.mutedBy || [];

  if (mute && !mutedBy.includes(userId)) {
    await updateDoc(conversationRef, {
      mutedBy: arrayUnion(userId),
    });
  } else if (!mute && mutedBy.includes(userId)) {
    const updated = mutedBy.filter(id => id !== userId);
    await updateDoc(conversationRef, {
      mutedBy: updated,
    });
  }
}

/**
 * Delete message (soft delete)
 */
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<void> {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const messageRef = doc(db, 'messages', messageId);

  const messageDoc = await getDoc(messageRef);
  if (!messageDoc.exists()) {
    throw new Error('Message not found');
  }

  const message = messageDoc.data();
  if (message.senderId !== userId) {
    throw new Error('Can only delete your own messages');
  }

  await updateDoc(messageRef, {
    deletedAt: serverTimestamp(),
    deletedBy: userId,
    content: '[Message deleted]',
  });
}

/**
 * Subscribe to conversation messages in real-time
 */
export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: Message[]) => void
): () => void {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const messagesRef = collection(db, 'messages');

  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate().toISOString(),
    })) as Message[];

    onUpdate(messages);
  });

  return unsubscribe;
}

/**
 * Subscribe to user conversations in real-time
 */
export function subscribeToConversations(
  userId: string,
  onUpdate: (conversations: ConversationWithParticipants[]) => void
): () => void {
  const app = getFirebaseApp();
  if (!app) throw new Error('Firebase not initialized');

  const db = getFirestore(app);
  const conversationsRef = collection(db, 'conversations');

  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, async (snapshot: QuerySnapshot<DocumentData>) => {
    const conversations = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const conversation: Conversation = {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString(),
        } as Conversation;

        const participants = await Promise.all(
          conversation.participantIds.map(async (participantId) => {
            const profile = await getProfile(participantId);
            return {
              uid: profile.uid,
              displayName: profile.displayName,
              photoURL: profile.photoURL || undefined,
              zipCode: profile.zipCode,
            };
          })
        );

        const otherParticipant = participants.find(p => p.uid !== userId);

        return {
          ...conversation,
          participants,
          otherParticipant,
        };
      })
    );

    onUpdate(conversations);
  });

  return unsubscribe;
}
