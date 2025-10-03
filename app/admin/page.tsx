'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPlatformMetrics, getModerationLogs } from '@/lib/admin/adminService';
import { PlatformMetrics, ModerationLog } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      try {
        setLoading(true);
        const [metricsData, logsData] = await Promise.all([
          getPlatformMetrics(),
          getModerationLogs(10),
        ]);
        setMetrics(metricsData);
        setRecentLogs(logsData);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
      </div>

      {/* Platform Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Users"
            value={metrics.totalUsers}
            icon="users"
            color="blue"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers}
            icon="check"
            color="green"
          />
          <MetricCard
            title="Verified Users"
            value={metrics.verifiedUsers}
            icon="shield"
            color="purple"
          />
          <MetricCard
            title="Pending Reports"
            value={metrics.pendingReports}
            icon="warning"
            color="yellow"
          />
          <MetricCard
            title="Total Events"
            value={metrics.totalEvents}
            icon="calendar"
            color="indigo"
          />
          <MetricCard
            title="Total Messages"
            value={metrics.totalMessages}
            icon="message"
            color="pink"
          />
        </div>
      )}

      {/* Recent Moderation Logs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Moderation Actions</h2>

        {recentLogs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No moderation actions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Admin</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Target User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{log.performedByName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{log.targetUserName || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{log.reason || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
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

interface MetricCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          {getIcon(icon)}
        </div>
      </div>
    </div>
  );
}

function getIcon(icon: string) {
  const iconMap: Record<string, JSX.Element> = {
    users: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    check: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    shield: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    warning: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    calendar: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    message: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  };
  return iconMap[icon] || iconMap.users;
}

function getActionColor(action: string): string {
  const colors: Record<string, string> = {
    ban_user: 'bg-red-100 text-red-800',
    suspend_user: 'bg-orange-100 text-orange-800',
    warn_user: 'bg-yellow-100 text-yellow-800',
    remove_content: 'bg-purple-100 text-purple-800',
    dismiss_report: 'bg-gray-100 text-gray-800',
    verify_user: 'bg-green-100 text-green-800',
    unsuspend_user: 'bg-blue-100 text-blue-800',
    unban_user: 'bg-green-100 text-green-800',
  };
  return colors[action] || 'bg-gray-100 text-gray-800';
}

function formatAction(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
