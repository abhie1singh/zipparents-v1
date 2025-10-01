'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { searchParents, SearchFilters } from '@/lib/services/search';
import { getProfile } from '@/lib/profile/profile-helpers';
import { sendConnectionRequest } from '@/lib/services/connections';
import { PublicProfile } from '@/types/profile';
import ParentCard from '@/components/search/ParentCard';
import { useToast } from '@/components/toast/ToastProvider';
import {
  SEARCH_RADIUS_OPTIONS,
  DEFAULT_SEARCH_RADIUS,
  SearchRadius
} from '@/lib/utils/zipcode';
import {
  AGE_RANGES,
  CHILDREN_AGE_RANGES,
  INTERESTS,
  RELATIONSHIP_STATUSES
} from '@/lib/constants/profile';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { AgeRange, RelationshipStatus } from '@/types/user';

interface SearchResult {
  profile: PublicProfile;
  distance: number | null;
}

export default function SearchPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [userProfile, setUserProfile] = useState<PublicProfile | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [radius, setRadius] = useState<SearchRadius>(DEFAULT_SEARCH_RADIUS);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState<AgeRange[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedChildrenAges, setSelectedChildrenAges] = useState<string[]>([]);
  const [selectedRelationshipStatuses, setSelectedRelationshipStatuses] = useState<RelationshipStatus[]>([]);
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);

  // Load user profile
  useEffect(() => {
    async function loadProfile() {
      if (user) {
        try {
          const profile = await getProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error loading profile:', err);
          setError('Failed to load your profile. Please try again.');
        }
      }
    }
    loadProfile();
  }, [user]);

  // Initial search on mount
  useEffect(() => {
    if (userProfile) {
      handleSearch();
    }
  }, [userProfile]);

  const handleSearch = async () => {
    if (!user || !userProfile) return;

    setIsLoading(true);
    setError(null);

    try {
      const filters: SearchFilters = {
        zipCode: userProfile.zipCode,
        radius,
        ...(selectedAgeRanges.length > 0 && { ageRange: selectedAgeRanges }),
        ...(selectedInterests.length > 0 && { interests: selectedInterests }),
        ...(selectedChildrenAges.length > 0 && { childrenAgeRanges: selectedChildrenAges }),
        ...(selectedRelationshipStatuses.length > 0 && { relationshipStatus: selectedRelationshipStatuses }),
      };

      const response = await searchParents(user.uid, filters);
      setResults(response.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (userId: string) => {
    if (!user) return;

    setConnectingUserId(userId);
    try {
      await sendConnectionRequest(user.uid, { toUserId: userId });
      showToast('Connection request sent!', 'success');
    } catch (err: any) {
      console.error('Error sending connection:', err);
      if (err.message === 'Connection request already exists') {
        showToast('Connection request already exists', 'error');
      } else {
        showToast('Failed to send connection request', 'error');
      }
    } finally {
      setConnectingUserId(null);
    }
  };

  const clearFilters = () => {
    setRadius(DEFAULT_SEARCH_RADIUS);
    setSelectedAgeRanges([]);
    setSelectedInterests([]);
    setSelectedChildrenAges([]);
    setSelectedRelationshipStatuses([]);
  };

  const toggleAgeRange = (ageRange: AgeRange) => {
    setSelectedAgeRanges(prev =>
      prev.includes(ageRange)
        ? prev.filter(r => r !== ageRange)
        : [...prev, ageRange]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleChildrenAge = (age: string) => {
    setSelectedChildrenAges(prev =>
      prev.includes(age)
        ? prev.filter(a => a !== age)
        : [...prev, age]
    );
  };

  const toggleRelationshipStatus = (status: RelationshipStatus) => {
    setSelectedRelationshipStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const activeFiltersCount =
    (selectedAgeRanges.length > 0 ? 1 : 0) +
    (selectedInterests.length > 0 ? 1 : 0) +
    (selectedChildrenAges.length > 0 ? 1 : 0) +
    (selectedRelationshipStatuses.length > 0 ? 1 : 0);

  if (authLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Parents</h1>
          <p className="text-gray-600">
            Discover parents near you in {userProfile.zipCode}
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Radius Selector */}
            <div className="flex-1">
              <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
                Search Radius
              </label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value) as SearchRadius)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {SEARCH_RADIUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} miles
                  </option>
                ))}
              </select>
            </div>

            {/* Filters Button */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filters
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Button */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                &nbsp;
              </label>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Age Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AGE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => toggleAgeRange(range)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedAgeRanges.includes(range)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Children Age Ranges Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children Age Ranges
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CHILDREN_AGE_RANGES.map((range) => (
                      <button
                        key={range}
                        onClick={() => toggleChildrenAge(range)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedChildrenAges.includes(range)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedInterests.includes(interest)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Relationship Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONSHIP_STATUSES.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleRelationshipStatus(value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedRelationshipStatuses.includes(value)
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? 'Parent' : 'Parents'} Found`
                : 'No results'
              }
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map(({ profile, distance }) => (
                <ParentCard
                  key={profile.uid}
                  profile={profile}
                  distance={distance}
                  onConnect={handleConnect}
                  connectionStatus="none"
                  isLoading={connectingUserId === profile.uid}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parents found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or increasing the search radius
              </p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
