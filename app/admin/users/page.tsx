'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, searchUsers, updateUserStatus, verifyUser } from '@/lib/admin/adminService';
import Button from '@/components/ui/Button';

interface User {
  id: string;
  email: string;
  displayName: string;
  status?: string;
  role?: string;
  ageVerified?: boolean;
  createdAt?: any;
  [key: string]: any;
}

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const result = await getUsers(100);
      setUsers(result.users as User[]);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setSearching(true);
      const results = await searchUsers(searchTerm);
      setUsers(results as User[]);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  }

  async function handleSuspend(userId: string) {
    if (!user) return;
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      setActionLoading(userId);
      await updateUserStatus(userId, 'suspended', user.uid, 'Suspended by admin');
      await loadUsers();
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('Failed to suspend user');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleBan(userId: string) {
    if (!user) return;
    if (!confirm('Are you sure you want to BAN this user? This is a serious action.')) return;

    try {
      setActionLoading(userId);
      await updateUserStatus(userId, 'banned', user.uid, 'Banned by admin');
      await loadUsers();
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVerify(userId: string) {
    if (!user) return;

    try {
      setActionLoading(userId);
      await verifyUser(userId, user.uid);
      await loadUsers();
    } catch (err) {
      console.error('Error verifying user:', err);
      alert('Failed to verify user');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <Button variant="outline" onClick={loadUsers}>
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by email or display name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={handleSearch} loading={searching}>
            Search
          </Button>
          {searchTerm && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                loadUsers();
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Display Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age Verified</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{u.email}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{u.displayName}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={u.status || 'active'} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u.ageVerified ? (
                        <span className="text-green-600 text-sm">Yes</span>
                      ) : (
                        <span className="text-gray-400 text-sm">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/users/${u.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        {!u.ageVerified && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleVerify(u.id)}
                            loading={actionLoading === u.id}
                          >
                            Verify
                          </Button>
                        )}
                        {u.status !== 'suspended' && u.status !== 'banned' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspend(u.id)}
                            loading={actionLoading === u.id}
                          >
                            Suspend
                          </Button>
                        )}
                        {u.status !== 'banned' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleBan(u.id)}
                            loading={actionLoading === u.id}
                          >
                            Ban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {users.length} user{users.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-orange-100 text-orange-800',
    banned: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.active}`}>
      {status || 'active'}
    </span>
  );
}
