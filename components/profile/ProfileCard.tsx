'use client';

import React from 'react';
import Link from 'next/link';
import { PublicProfile } from '@/types/profile';
import VerificationBadge from './VerificationBadge';
import InterestTags from './InterestTags';

interface ProfileCardProps {
  profile: PublicProfile;
  className?: string;
}

export default function ProfileCard({ profile, className = '' }: ProfileCardProps) {
  return (
    <Link href={`/profile/${profile.uid}`} className={`block ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">
              👤
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {profile.displayName}
              </h3>
              {profile.verificationStatus === 'verified' && (
                <VerificationBadge status="verified" showText={false} />
              )}
            </div>

            {profile.ageRange && (
              <p className="text-sm text-gray-600">{profile.ageRange}</p>
            )}

            <p className="text-sm text-gray-500 mb-2">
              📍 {profile.zipCode}
            </p>

            {profile.bio && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                {profile.bio}
              </p>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <InterestTags interests={profile.interests} maxDisplay={3} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
