'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getReports } from '@/lib/admin/adminService';
import { Report, ReportStatus } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('pending');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  async function loadReports() {
    try {
      setLoading(true);
      setError(null);
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const data = await getReports(filter);
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports';
      setError(`Failed to load reports: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports Queue</h1>
        <Button variant="outline" onClick={loadReports}>
          Refresh
        </Button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-2">
          <FilterButton
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            label="All"
          />
          <FilterButton
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            label="Pending"
          />
          <FilterButton
            active={statusFilter === 'reviewing'}
            onClick={() => setStatusFilter('reviewing')}
            label="Reviewing"
          />
          <FilterButton
            active={statusFilter === 'resolved'}
            onClick={() => setStatusFilter('resolved')}
            label="Resolved"
          />
          <FilterButton
            active={statusFilter === 'dismissed'}
            onClick={() => setStatusFilter('dismissed')}
            label="Dismissed"
          />
        </div>
      </div>

      {/* Reports Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No reports found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reported User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <TypeBadge type={report.type} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {report.reportedUserDisplayName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {report.reason.substring(0, 50)}
                      {report.reason.length > 50 && '...'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/admin/reports/${report.id}`}>
                        <Button size="sm" variant="primary">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    message: 'bg-blue-100 text-blue-800',
    event: 'bg-purple-100 text-purple-800',
    profile: 'bg-green-100 text-green-800',
    user: 'bg-orange-100 text-orange-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}
