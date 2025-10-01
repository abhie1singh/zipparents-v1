'use client';

import React from 'react';

interface InterestTagsProps {
  interests: string[];
  className?: string;
  maxDisplay?: number;
}

export default function InterestTags({ interests, className = '', maxDisplay }: InterestTagsProps) {
  const displayInterests = maxDisplay ? interests.slice(0, maxDisplay) : interests;
  const remaining = maxDisplay && interests.length > maxDisplay ? interests.length - maxDisplay : 0;

  if (!interests || interests.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayInterests.map((interest, index) => (
        <span
          key={index}
          className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
        >
          {interest}
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
