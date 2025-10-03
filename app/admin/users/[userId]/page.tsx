'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserById,
  getUserActivityLogs,
  updateUserStatus,
  verifyUser,
} from '@/lib/admin/adminService';
import Button from '@/components/ui/Button';

interface UserDetails {
  id: string;
  email: string;
  displayName: string;
  status?: string;
  role?: string;
  ageVerified?: boolean;
  zipCode?: string;
  bio?: string;
  createdAt?: any;
  updatedAt?: any;
  [key: string]: any;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params.userId as string;

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [userId]);

  async function loadUserDetails() {
    try {
      setLoading(true);
      const [details, logs] = await Promise.all([
        getUserById(userId),
        getUserActivityLogs(userId, 50),
      ]);
      setUserDetails(details as UserDetails);
      setActivityLogs(logs as ActivityLog[]);
    } catch (err) {
      console.error('Error loading user details:', err);
      setError('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }

  async function handleSuspend() {
    if (!user) return;
    const reason = prompt('Enter reason for suspension:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await updateUserStatus(userId, 'suspended', user.uid, reason);
      await loadUserDetails();
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnsuspend() {
    if (!user) return;
    if (!confirm('Are you sure you want to unsuspend this user?')) return;

    try {
      setActionLoading(true);
      await updateUserStatus(userId, 'active', user.uid, 'Unsuspended by admin');
      await loadUserDetails();
    } catch (err) {
      console.error('Error unsuspending user:', err);
      alert('Failed to unsuspend user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBan() {
    if (!user) return;
    const reason = prompt('Enter reason for ban (this is a serious action):');
    if (!reason) return;
    if (!confirm('Are you SURE you want to BAN this user?')) return;

    try {
      setActionLoading(true);
      await updateUserStatus(userId, 'banned', user.uid, reason);
      await loadUserDetails();
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnban() {
    if (!user) return;
    if (!confirm('Are you sure you want to unban this user?')) return;

    try {
      setActionLoading(true);
      await updateUserStatus(userId, 'active', user.uid, 'Unbanned by admin');
      await loadUserDetails();
    } catch (err) {
      console.error('Error unbanning user:', err);
      alert('Failed to unban user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleVerify() {
    if (!user) return;

    try {
      setActionLoading(true);
      await verifyUser(userId, user.uid);
      await loadUserDetails();
    } catch (err) {
      console.error('Error verifying user:', err);
      alert('Failed to verify user');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/admin/users')}>
          Back to Users
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.push('/admin/users')} size="sm">
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">User Details</h1>
        </div>
        <div className="flex gap-2">
          {!userDetails.ageVerified && (
            <Button onClick={handleVerify} loading={actionLoading}>
              Verify User
            </Button>
          )}
          {userDetails.status === 'suspended' ? (
            <Button variant="primary" onClick={handleUnsuspend} loading={actionLoading}>
              Unsuspend
            </Button>
          ) : userDetails.status !== 'banned' && (
            <Button variant="outline" onClick={handleSuspend} loading={actionLoading}>
              Suspend
            </Button>
          )}
          {userDetails.status === 'banned' ? (
            <Button variant="primary" onClick={handleUnban} loading={actionLoading}>
              Unban
            </Button>
          ) : (
            <Button variant="danger" onClick={handleBan} loading={actionLoading}>
              Ban
            </Button>
          )}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="User ID" value={userDetails.id} />
          <InfoRow label="Email" value={userDetails.email} />
          <InfoRow label="Display Name" value={userDetails.displayName} />
          <InfoRow label="Status" value={
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              userDetails.status === 'banned' ? 'bg-red-100 text-red-800' :
              userDetails.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }`}>
              {userDetails.status || 'active'}
            </span>
          } />
          <InfoRow label="Role" value={userDetails.role || 'user'} />
          <InfoRow label="Age Verified" value={userDetails.ageVerified ? 'Yes' : 'No'} />
          <InfoRow label="Zip Code" value={userDetails.zipCode || '-'} />
          <InfoRow label="Created At" value={userDetails.createdAt?.toDate ? userDetails.createdAt.toDate().toLocaleString() : '-'} />
          <InfoRow label="Updated At" value={userDetails.updatedAt?.toDate ? userDetails.updatedAt.toDate().toLocaleString() : '-'} />
        </div>
        {userDetails.bio && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Bio</h3>
            <p className="text-sm text-gray-600">{userDetails.bio}</p>
          </div>
        )}
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Logs</h2>
        {activityLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity logs available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {activityLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{log.action}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.metadata ? JSON.stringify(log.metadata) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="text-sm font-semibold text-gray-700">{label}:</span>
      <div className="text-sm text-gray-900 mt-1">{value}</div>
    </div>
  );
}
