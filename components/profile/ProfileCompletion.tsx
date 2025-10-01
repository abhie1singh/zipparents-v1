/**
 * Profile Completion Component
 * Shows progress bar for profile completeness
 */

import React from 'react';

interface ProfileCompletionProps {
  completeness: number;
  className?: string;
  showPercentage?: boolean;
}

export default function ProfileCompletion({ completeness = 0, className = '', showPercentage = true }: ProfileCompletionProps) {
  const percentage = Math.min(100, Math.max(0, completeness));
  
  const getColor = () => {
    if (percentage >= 80) return 'bg-success-600';
    if (percentage >= 50) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const getMessage = () => {
    if (percentage === 100) return 'Profile Complete!';
    if (percentage >= 80) return 'Almost there!';
    if (percentage >= 50) return 'Keep going!';
    return 'Let\'s complete your profile';
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{getMessage()}</span>
        {showPercentage && (
          <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
