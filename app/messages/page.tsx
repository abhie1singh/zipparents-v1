'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { subscribeToConversations } from '@/lib/services/messaging';
import { ConversationWithParticipants } from '@/types/message';
import {
  ChatBubbleLeftRightIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithParticipants[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    const unsubscribe = subscribeToConversations(user.uid, (updated) => {
      setConversations(updated);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleConversationClick = (conversationId: string) => {
    router.push(`/messages/${conversationId}`);
  };

  const getUnreadCount = (conversation: ConversationWithParticipants): number => {
    if (!user) return 0;
    return conversation.unreadCount?.[user.uid] || 0;
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">
            Chat with your connected parents
          </p>
        </div>

        {/* Conversations List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading conversations...</p>
          </div>
        ) : conversations.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
            {conversations.map((conversation) => {
              const unread = getUnreadCount(conversation);
              const isMuted = conversation.mutedBy?.includes(user.uid);

              return (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation.id)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {conversation.otherParticipant?.photoURL ? (
                        <img
                          src={conversation.otherParticipant.photoURL}
                          alt={conversation.otherParticipant.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-semibold truncate ${unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                          {conversation.otherParticipant?.displayName || 'Unknown User'}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTimestamp(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      {conversation.lastMessage && (
                        <div className="flex items-center gap-2">
                          <p className={`text-sm truncate ${unread > 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {conversation.lastMessage.senderId === user.uid && 'You: '}
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Indicators */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {unread > 0 && (
                        <span className="bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          {unread}
                        </span>
                      )}
                      {isMuted && (
                        <span className="text-xs text-gray-400">🔇</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with other parents to start messaging
            </p>
            <a
              href="/search"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Find Parents
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
