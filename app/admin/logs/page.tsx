'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getModerationLogs } from '@/lib/admin/adminService';
import { ModerationLog, ModerationAction } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

export default function ModerationLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<ModerationAction | 'all'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      const data = await getModerationLogs(200);
      setLogs(data);
    } catch (err) {
      console.error('Error loading logs:', err);
      setError('Failed to load moderation logs');
    } finally {
      setLoading(false);
    }
  }

  const filteredLogs = actionFilter === 'all'
    ? logs
    : logs.filter(log => log.action === actionFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Moderation Logs</h1>
        <Button variant="outline" onClick={loadLogs}>
          Refresh
        </Button>
      </div>

      {/* Action Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={actionFilter === 'all'}
            onClick={() => setActionFilter('all')}
            label="All"
          />
          <FilterButton
            active={actionFilter === 'dismiss_report'}
            onClick={() => setActionFilter('dismiss_report')}
            label="Dismiss Report"
          />
          <FilterButton
            active={actionFilter === 'warn_user'}
            onClick={() => setActionFilter('warn_user')}
            label="Warn User"
          />
          <FilterButton
            active={actionFilter === 'remove_content'}
            onClick={() => setActionFilter('remove_content')}
            label="Remove Content"
          />
          <FilterButton
            active={actionFilter === 'suspend_user'}
            onClick={() => setActionFilter('suspend_user')}
            label="Suspend User"
          />
          <FilterButton
            active={actionFilter === 'ban_user'}
            onClick={() => setActionFilter('ban_user')}
            label="Ban User"
          />
          <FilterButton
            active={actionFilter === 'verify_user'}
            onClick={() => setActionFilter('verify_user')}
            label="Verify User"
          />
          <FilterButton
            active={actionFilter === 'unsuspend_user'}
            onClick={() => setActionFilter('unsuspend_user')}
            label="Unsuspend User"
          />
          <FilterButton
            active={actionFilter === 'unban_user'}
            onClick={() => setActionFilter('unban_user')}
            label="Unban User"
          />
        </div>
      </div>

      {/* Logs Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No logs found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Admin</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Target User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {log.performedByName}
                      <div className="text-xs text-gray-500">{log.performedBy.substring(0, 8)}...</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {log.targetUserName || '-'}
                      {log.targetUserId && (
                        <div className="text-xs text-gray-500">{log.targetUserId.substring(0, 8)}...</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.reason || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {log.contentId && (
                        <div className="text-xs">
                          Content: {log.contentId.substring(0, 8)}...
                        </div>
                      )}
                      {log.reportId && (
                        <div className="text-xs">
                          Report: {log.reportId.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
        {actionFilter !== 'all' && ` (filtered by ${formatAction(actionFilter)})`}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function ActionBadge({ action }: { action: string }) {
  const colors: Record<string, string> = {
    ban_user: 'bg-red-100 text-red-800',
    suspend_user: 'bg-orange-100 text-orange-800',
    warn_user: 'bg-yellow-100 text-yellow-800',
    remove_content: 'bg-purple-100 text-purple-800',
    dismiss_report: 'bg-gray-100 text-gray-800',
    verify_user: 'bg-green-100 text-green-800',
    unsuspend_user: 'bg-blue-100 text-blue-800',
    unban_user: 'bg-green-100 text-green-800',
    cancel_event: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[action] || 'bg-gray-100 text-gray-800'}`}>
      {formatAction(action)}
    </span>
  );
}

function formatAction(action: string): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
