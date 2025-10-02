'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/toast/ToastProvider';
import {
  subscribeToMessages,
  sendMessage,
  markMessagesAsRead,
  toggleMuteConversation,
  deleteMessage,
} from '@/lib/services/messaging';
import { getProfile } from '@/lib/profile/profile-helpers';
import { submitReport, blockUser } from '@/lib/services/safety';
import { Message } from '@/types/message';
import {
  PaperAirplaneIcon,
  PhotoIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ExclamationTriangleIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';

export default function MessageThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const conversationId = params.conversationId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !conversationId) return;

    const unsubscribe = subscribeToMessages(conversationId, async (updated) => {
      setMessages(updated);

      // Get other user info from first message
      if (updated.length > 0 && !otherUser) {
        const otherUserId = updated[0].senderId === user.uid
          ? updated.find(m => m.senderId !== user.uid)?.senderId
          : updated[0].senderId;

        if (otherUserId) {
          const profile = await getProfile(otherUserId);
          setOtherUser(profile);
        }
      }

      // Mark as read
      await markMessagesAsRead(conversationId, user.uid);
    });

    return () => unsubscribe();
  }, [user, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(user.uid, {
        conversationId,
        type: 'text',
        content: newMessage.trim(),
      });
      setNewMessage('');
    } catch (error: any) {
      showToast(error.message || 'Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(user.uid, {
        conversationId,
        type: 'image',
        content: 'Sent an image',
        imageFile: file,
      });
    } catch (error: any) {
      showToast(error.message || 'Failed to send image', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleMuteConversation = async () => {
    if (!user) return;
    try {
      await toggleMuteConversation(conversationId, user.uid, true);
      showToast('Conversation muted', 'success');
      setShowMenu(false);
    } catch (error) {
      showToast('Failed to mute conversation', 'error');
    }
  };

  const handleBlockUser = async () => {
    if (!user || !otherUser) return;
    if (!confirm(`Are you sure you want to block ${otherUser.displayName}?`)) return;

    try {
      await blockUser(user.uid, otherUser.uid);
      showToast('User blocked', 'success');
      router.push('/messages');
    } catch (error: any) {
      showToast(error.message || 'Failed to block user', 'error');
    }
  };

  const handleSubmitReport = async () => {
    if (!user || !otherUser || !reportReason || !reportDescription.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      await submitReport(user.uid, {
        reportedUserId: otherUser.uid,
        type: 'user',
        reason: reportReason as any,
        description: reportDescription.trim(),
        conversationId,
      });
      showToast('Report submitted. Thank you for helping keep our community safe.', 'success');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error: any) {
      showToast(error.message || 'Failed to submit report', 'error');
    }
  };

  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/messages')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
            {otherUser && (
              <>
                {otherUser.photoURL ? (
                  <img
                    src={otherUser.photoURL}
                    alt={otherUser.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">{otherUser.displayName}</h2>
                  <p className="text-xs text-gray-500">{otherUser.zipCode}</p>
                </div>
              </>
            )}
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={handleMuteConversation}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  🔇 Mute conversation
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  Report user
                </button>
                <button
                  onClick={handleBlockUser}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <NoSymbolIcon className="w-4 h-4" />
                  Block user
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.senderId === user.uid;

            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {message.type === 'image' && message.imageUrl ? (
                    <img
                      src={message.imageUrl}
                      alt="Shared image"
                      className="rounded-lg max-w-full h-auto"
                    />
                  ) : null}

                  {message.content && message.content !== '[Message deleted]' ? (
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  ) : message.deletedAt ? (
                    <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-500 italic">
                      <p className="text-sm">Message deleted</p>
                    </div>
                  ) : null}

                  <p className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {formatMessageTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <label className="cursor-pointer p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <PhotoIcon className="w-6 h-6" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isSending}
              />
            </label>

            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                disabled={isSending}
              />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Report User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="fake_profile">Fake Profile</option>
                  <option value="safety_concern">Safety Concern</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Please provide details..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
