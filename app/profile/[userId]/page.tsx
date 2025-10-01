'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import ProfileHeader from '@/components/profile/ProfileHeader';
import InterestTags from '@/components/profile/InterestTags';
import VerificationRequestForm from '@/components/profile/VerificationRequestForm';
import { getPublicProfile } from '@/lib/profile/profile-helpers';
import { PublicProfile } from '@/types/user';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);

  const isOwnProfile = user?.uid === params.userId;

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const profileData = await getPublicProfile(params.userId, user?.uid);

        if (!profileData) {
          setError('Profile not found');
          return;
        }

        setProfile(profileData);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchProfile();
    }
  }, [params.userId, user?.uid, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This profile does not exist or is private'}</p>
          <Button onClick={() => router.push('/feed')}>Go to Feed</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <ProfileHeader
            displayName={profile.displayName}
            photoURL={profile.photoURL}
            verificationStatus={profile.verificationStatus}
            memberSince={profile.memberSince}
            location={profile.location}
            completeness={profile.completeness}
          />

          {/* Edit Button for Own Profile */}
          {isOwnProfile && (
            <div className="px-6 pb-6">
              <Button
                variant="primary"
                onClick={() => router.push('/profile/edit')}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>

          <div className="space-y-3">
            {profile.ageRange && (
              <div className="flex justify-between">
                <span className="text-gray-600">Age Range:</span>
                <span className="font-medium text-gray-900">{profile.ageRange}</span>
              </div>
            )}

            {profile.relationshipStatus && profile.relationshipStatus !== 'prefer-not-to-say' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Relationship Status:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {profile.relationshipStatus.replace(/-/g, ' ')}
                </span>
              </div>
            )}

            {profile.childrenAgeRanges && profile.childrenAgeRanges.length > 0 && (
              <div>
                <span className="text-gray-600">Children's Ages:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.childrenAgeRanges.map((range) => (
                    <span
                      key={range}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {range}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interests Section */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Interests</h2>
            <InterestTags interests={profile.interests} />
          </div>
        )}

        {/* Verification Request (Only for Own Profile) */}
        {isOwnProfile && userData?.verificationStatus === 'unverified' && (
          <div className="mb-6">
            {!showVerificationForm ? (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-2">Get Verified</h3>
                <p className="text-primary-700 mb-4">
                  Verified profiles build trust and credibility in our community.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowVerificationForm(true)}
                >
                  Request Verification
                </Button>
              </div>
            ) : (
              <VerificationRequestForm
                userId={user!.uid}
                userEmail={user!.email || ''}
                userName={userData.displayName}
                onSuccess={() => setShowVerificationForm(false)}
              />
            )}
          </div>
        )}

        {/* Pending Verification Notice */}
        {isOwnProfile && userData?.verificationStatus === 'pending' && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-warning-900 mb-2">Verification Pending</h3>
            <p className="text-warning-700">
              Your verification request is being reviewed. We'll notify you via email once it's processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
