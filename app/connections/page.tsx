'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserConnections,
  getPendingRequests,
  getAcceptedConnections,
  respondToConnection
} from '@/lib/services/connections';
import { ConnectionWithUser } from '@/types/connection';
import {
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/toast/ToastProvider';

type TabType = 'all' | 'pending' | 'accepted';

export default function ConnectionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [connections, setConnections] = useState<ConnectionWithUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionWithUser[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<ConnectionWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  const loadConnections = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const [all, pending, accepted] = await Promise.all([
        getUserConnections(user.uid),
        getPendingRequests(user.uid),
        getAcceptedConnections(user.uid)
      ]);

      setConnections(all);
      setPendingRequests(pending);
      setAcceptedConnections(accepted);
    } catch (err) {
      console.error('Error loading connections:', err);
      setError('Failed to load connections. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (connectionId: string) => {
    if (!user) return;

    setProcessingId(connectionId);
    try {
      await respondToConnection(user.uid, { connectionId, accept: true });
      showToast('Connection accepted!', 'success');
      await loadConnections(); // Reload to update lists
    } catch (err) {
      console.error('Error accepting connection:', err);
      showToast('Failed to accept connection', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (connectionId: string) => {
    if (!user) return;

    setProcessingId(connectionId);
    try {
      await respondToConnection(user.uid, { connectionId, accept: false });
      showToast('Connection declined', 'info');
      await loadConnections(); // Reload to update lists
    } catch (err) {
      console.error('Error declining connection:', err);
      showToast('Failed to decline connection', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const getDisplayedConnections = () => {
    switch (activeTab) {
      case 'pending':
        return pendingRequests;
      case 'accepted':
        return acceptedConnections;
      default:
        return connections;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connections</h1>
          <p className="text-gray-600">
            Manage your parent connections and requests
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Pending
                {pendingRequests.length > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('accepted')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'accepted'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserGroupIcon className="w-5 h-5" />
                Connected ({acceptedConnections.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({connections.length})
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Connections List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading connections...</p>
          </div>
        ) : getDisplayedConnections().length > 0 ? (
          <div className="space-y-4">
            {getDisplayedConnections().map((connection) => {
              const isPending = connection.status === 'pending' && connection.toUserId === user?.uid;

              return (
                <div
                  key={connection.id}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* User Photo */}
                    <div className="flex-shrink-0">
                      {connection.user.photoURL ? (
                        <img
                          src={connection.user.photoURL}
                          alt={connection.user.displayName}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {connection.user.displayName}
                          </h3>
                          <p className="text-sm text-gray-600">{connection.user.zipCode}</p>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                            connection.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : connection.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : connection.status === 'declined'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                        </span>
                      </div>

                      {/* Bio */}
                      {connection.user.bio && (
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                          {connection.user.bio}
                        </p>
                      )}

                      {/* Interests */}
                      {connection.user.interests && connection.user.interests.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {connection.user.interests.slice(0, 5).map((interest) => (
                              <span
                                key={interest}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {interest}
                              </span>
                            ))}
                            {connection.user.interests.length > 5 && (
                              <span className="px-2 py-1 text-gray-500 text-xs">
                                +{connection.user.interests.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Message */}
                      {connection.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 italic">"{connection.message}"</p>
                        </div>
                      )}

                      {/* Action Buttons for Pending Requests */}
                      {isPending && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleAccept(connection.id)}
                            disabled={processingId === connection.id}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckIcon className="w-5 h-5" />
                            Accept
                          </button>
                          <button
                            onClick={() => handleDecline(connection.id)}
                            disabled={processingId === connection.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XMarkIcon className="w-5 h-5" />
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 mt-3">
                        Requested {new Date(connection.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <UserGroupIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'pending' ? 'pending requests' : activeTab === 'accepted' ? 'connections' : 'connections'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'pending'
                ? 'You have no pending connection requests'
                : activeTab === 'accepted'
                ? 'You have no accepted connections yet'
                : 'You have no connections yet'}
            </p>
            {activeTab !== 'all' && (
              <a
                href="/search"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Find Parents
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
