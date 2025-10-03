'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getReportById,
  dismissReport,
  removeContent,
  updateUserStatus,
} from '@/lib/admin/adminService';
import { Report } from '@/lib/types/admin';
import Button from '@/components/ui/Button';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  async function loadReport() {
    try {
      setLoading(true);
      const data = await getReportById(reportId);
      setReport(data);
    } catch (err) {
      console.error('Error loading report:', err);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  }

  async function handleDismiss() {
    if (!user || !report) return;
    const reason = prompt('Enter reason for dismissing this report:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await dismissReport(reportId, user.uid, reason);
      await loadReport();
      alert('Report dismissed successfully');
    } catch (err) {
      console.error('Error dismissing report:', err);
      alert('Failed to dismiss report');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleWarnUser() {
    if (!user || !report) return;
    const reason = prompt('Enter warning message for the user:');
    if (!reason) return;

    try {
      setActionLoading(true);
      // In a real implementation, you would send a warning notification to the user
      // For now, we'll just update the report status
      await dismissReport(reportId, user.uid, `User warned: ${reason}`);
      await loadReport();
      alert('User warned successfully');
    } catch (err) {
      console.error('Error warning user:', err);
      alert('Failed to warn user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveContent() {
    if (!user || !report) return;
    if (!report.contentId) {
      alert('No content ID associated with this report');
      return;
    }

    const reason = prompt('Enter reason for removing this content:');
    if (!reason) return;
    if (!confirm('Are you sure you want to remove this content?')) return;

    try {
      setActionLoading(true);
      const contentType = report.type === 'message' ? 'message' : report.type === 'event' ? 'event' : 'post';
      await removeContent(reportId, report.contentId, contentType as any, user.uid, reason);
      await loadReport();
      alert('Content removed successfully');
    } catch (err) {
      console.error('Error removing content:', err);
      alert('Failed to remove content');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBanUser() {
    if (!user || !report) return;
    const reason = prompt('Enter reason for banning this user (this is a serious action):');
    if (!reason) return;
    if (!confirm(`Are you SURE you want to BAN ${report.reportedUserDisplayName}?`)) return;

    try {
      setActionLoading(true);
      await updateUserStatus(report.reportedUserId, 'banned', user.uid, reason);
      await dismissReport(reportId, user.uid, `User banned: ${reason}`);
      await loadReport();
      alert('User banned successfully');
    } catch (err) {
      console.error('Error banning user:', err);
      alert('Failed to ban user');
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.push('/admin/reports')}>
          Back to Reports
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error || 'Report not found'}</p>
        </div>
      </div>
    );
  }

  const isPending = report.status === 'pending' || report.status === 'reviewing';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.push('/admin/reports')} size="sm">
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Report Details</h1>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDismiss} loading={actionLoading}>
              Dismiss
            </Button>
            <Button variant="outline" onClick={handleWarnUser} loading={actionLoading}>
              Warn User
            </Button>
            {report.contentId && (
              <Button variant="danger" onClick={handleRemoveContent} loading={actionLoading}>
                Remove Content
              </Button>
            )}
            <Button variant="danger" onClick={handleBanUser} loading={actionLoading}>
              Ban User
            </Button>
          </div>
        )}
      </div>

      {/* Report Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Report Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Report ID" value={report.id} />
          <InfoRow label="Type" value={
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
              {report.type}
            </span>
          } />
          <InfoRow label="Status" value={
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          } />
          <InfoRow label="Reported User" value={report.reportedUserDisplayName} />
          <InfoRow label="Reporter ID" value={report.reportedBy} />
          <InfoRow label="Created At" value={new Date(report.createdAt).toLocaleString()} />
          {report.reviewedBy && (
            <>
              <InfoRow label="Reviewed By" value={report.reviewedBy} />
              <InfoRow label="Reviewed At" value={report.reviewedAt ? new Date(report.reviewedAt).toLocaleString() : '-'} />
            </>
          )}
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Report Reason</h2>
        <p className="text-gray-900 mb-4">{report.reason}</p>
        {report.description && (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Details</h3>
            <p className="text-gray-700">{report.description}</p>
          </>
        )}
      </div>

      {/* Content Preview */}
      {report.metadata && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Reported Content</h2>
          {report.metadata.messageText && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Message Text:</h3>
              <p className="text-gray-900">{report.metadata.messageText}</p>
            </div>
          )}
          {report.metadata.eventTitle && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Event Title:</h3>
              <p className="text-gray-900">{report.metadata.eventTitle}</p>
            </div>
          )}
          {report.metadata.profileUrl && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Profile URL:</h3>
              <p className="text-gray-900">{report.metadata.profileUrl}</p>
            </div>
          )}
        </div>
      )}

      {/* Resolution */}
      {report.resolution && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-900 mb-2">Resolution</h2>
          <p className="text-green-800">{report.resolution}</p>
        </div>
      )}
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

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    message: 'bg-blue-100 text-blue-800',
    event: 'bg-purple-100 text-purple-800',
    profile: 'bg-green-100 text-green-800',
    user: 'bg-orange-100 text-orange-800',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewing: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
