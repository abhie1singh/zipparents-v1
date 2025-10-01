/**
 * Verification Badge Component
 * Displays verification status with appropriate styling
 */

import React from 'react';
import { VerificationStatus } from '@/types/user';

interface VerificationBadgeProps {
  status?: VerificationStatus;
  className?: string;
  showText?: boolean;
}

export default function VerificationBadge({ status = 'unverified', className = '', showText = true }: VerificationBadgeProps) {
  const badgeStyles = {
    verified: 'bg-success-100 text-success-700 border-success-300',
    pending: 'bg-warning-100 text-warning-700 border-warning-300',
    rejected: 'bg-danger-100 text-danger-700 border-danger-300',
    unverified: 'bg-gray-100 text-gray-700 border-gray-300',
  };

  const icons = {
    verified: '✓',
    pending: '⏳',
    rejected: '✗',
    unverified: '',
  };

  const labels = {
    verified: 'Verified Parent',
    pending: 'Verification Pending',
    rejected: 'Verification Rejected',
    unverified: 'Not Verified',
  };

  if (status === 'unverified' && !showText) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badgeStyles[status]} ${className}`}
    >
      {icons[status] && <span>{icons[status]}</span>}
      {showText && <span>{labels[status]}</span>}
    </span>
  );
}
