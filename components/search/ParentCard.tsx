'use client';

import { PublicProfile } from '@/types/profile';
import { MapPinIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface ParentCardProps {
  profile: PublicProfile;
  distance: number | null;
  onConnect?: (userId: string) => void;
  connectionStatus?: 'none' | 'pending' | 'connected' | 'sent';
  isLoading?: boolean;
}

export default function ParentCard({
  profile,
  distance,
  onConnect,
  connectionStatus = 'none',
  isLoading = false
}: ParentCardProps) {
  const handleConnect = () => {
    if (onConnect && connectionStatus === 'none') {
      onConnect(profile.uid);
    }
  };

  const getConnectionButton = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium"
          >
            <HeartIconSolid className="w-5 h-5" />
            Connected
          </button>
        );
      case 'pending':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium"
          >
            Request Received
          </button>
        );
      case 'sent':
        return (
          <button
            disabled
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
          >
            Request Sent
          </button>
        );
      default:
        return (
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HeartIcon className="w-5 h-5" />
            Connect
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{profile.displayName}</h3>
              {profile.ageRange && (
                <p className="text-sm text-gray-600">{profile.ageRange} years old</p>
              )}
            </div>
            {distance !== null && (
              <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0">
                <MapPinIcon className="w-4 h-4" />
                <span>{distance} mi</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">{profile.bio}</p>
          )}

          {/* Children Age Ranges */}
          {profile.childrenAgeRanges && profile.childrenAgeRanges.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Children:</p>
              <div className="flex flex-wrap gap-1">
                {profile.childrenAgeRanges.map((range) => (
                  <span
                    key={range}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                  >
                    {range}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Interests:</p>
              <div className="flex flex-wrap gap-1">
                {profile.interests.slice(0, 5).map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {interest}
                  </span>
                ))}
                {profile.interests.length > 5 && (
                  <span className="px-2 py-1 text-gray-500 text-xs">
                    +{profile.interests.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Relationship Status */}
          {profile.relationshipStatus && (
            <p className="text-sm text-gray-600 mb-3 capitalize">
              {profile.relationshipStatus.replace(/-/g, ' ')}
            </p>
          )}

          {/* Action Button */}
          <div className="mt-4">
            {getConnectionButton()}
          </div>
        </div>
      </div>
    </div>
  );
}
