'use client';

import React from 'react';
import { PublicProfile } from '@/types/profile';
import VerificationBadge from './VerificationBadge';
import ProfileCompletion from './ProfileCompletion';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface ProfileHeaderProps {
  profile: PublicProfile;
  isOwnProfile?: boolean;
  className?: string;
}

export default function ProfileHeader({ profile, isOwnProfile = false, className = '' }: ProfileHeaderProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Profile Photo */}
          <div className="relative">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-5xl border-4 border-gray-300">
                👤
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.displayName}
                  </h1>
                  {profile.verificationStatus && (
                    <VerificationBadge status={profile.verificationStatus} />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  {profile.ageRange && (
                    <span>{profile.ageRange}</span>
                  )}
                  {profile.zipCode && (
                    <span className="flex items-center gap-1">
                      📍 {profile.zipCode}
                    </span>
                  )}
                  {profile.relationshipStatus && (
                    <span>{profile.relationshipStatus}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Link href="/profile/edit">
                    <Button variant="primary">Edit Profile</Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>
                    Send Message
                  </Button>
                )}
              </div>
            </div>

            {/* Profile Completion (only for own profile) */}
            {isOwnProfile && profile.profileCompleteness !== undefined && profile.profileCompleteness < 100 && (
              <div className="mt-4">
                <ProfileCompletion completeness={profile.profileCompleteness} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
