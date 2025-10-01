'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ZipCodeInput from '@/components/profile/ZipCodeInput';
import InterestsSelector from '@/components/profile/InterestsSelector';
import PhotoUpload from '@/components/profile/PhotoUpload';
import PrivacySettings from '@/components/profile/PrivacySettings';
import { useToast } from '@/components/toast/ToastProvider';
import { updateProfile, updateProfilePhoto } from '@/lib/profile/profile-helpers';
import { validateDisplayName, validateZipCode, validateInterests, getAgeRangeFromAge } from '@/lib/profile/validation';
import { AGE_RANGES, CHILDREN_AGE_RANGES, RELATIONSHIP_STATUSES, DEFAULT_PRIVACY_SETTINGS } from '@/lib/constants/profile';
import { AgeRange, RelationshipStatus, PrivacySettings as PrivacySettingsType } from '@/types/user';

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange>('25-34');
  const [zipCode, setZipCode] = useState('');
  const [bio, setBio] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>('prefer-not-to-say');
  const [childrenAgeRanges, setChildrenAgeRanges] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType>(DEFAULT_PRIVACY_SETTINGS);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  // Pre-fill existing data
  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setZipCode(userData.zipCode || '');
      if (userData.age) {
        setAgeRange(getAgeRangeFromAge(userData.age));
      } else if (userData.ageRange) {
        setAgeRange(userData.ageRange);
      }
      if (userData.bio) setBio(userData.bio);
      if (userData.relationshipStatus) setRelationshipStatus(userData.relationshipStatus);
      if (userData.childrenAgeRanges) setChildrenAgeRanges(userData.childrenAgeRanges);
      if (userData.interests) setInterests(userData.interests);
      if (userData.privacySettings) setPrivacySettings(userData.privacySettings);
      if (userData.photoURL) setPhotoURL(userData.photoURL);
    }
  }, [userData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateDisplayName(displayName);
    if (!nameValidation.valid) {
      newErrors.displayName = nameValidation.error || 'Invalid name';
    }

    if (!ageRange) {
      newErrors.ageRange = 'Please select your age range';
    }

    if (!validateZipCode(zipCode)) {
      newErrors.zipCode = 'Must be a valid 5-digit US zip code';
    }

    if (bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    const interestsValidation = validateInterests(interests);
    if (!interestsValidation.valid) {
      newErrors.interests = interestsValidation.error || 'Invalid interests';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    setPhotoFile(file);
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!validateForm()) {
      error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      let uploadedPhotoURL = photoURL;

      // Upload photo if new file selected
      if (photoFile) {
        uploadedPhotoURL = await updateProfilePhoto(photoFile, user.uid, userData?.photoURL);
      }

      // Prepare profile data
      const profileData = {
        displayName,
        ageRange,
        zipCode,
        bio,
        relationshipStatus,
        childrenAgeRanges,
        interests,
        privacySettings,
        photoURL: uploadedPhotoURL,
      };

      await updateProfile(user.uid, profileData);

      success('Profile updated successfully!');
      router.push(`/profile/${user.uid}`);
    } catch (err) {
      console.error('Profile update error:', err);
      error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      router.push(`/profile/${user.uid}`);
    } else {
      router.push('/feed');
    }
  };

  const toggleChildrenAgeRange = (range: string) => {
    if (childrenAgeRanges.includes(range)) {
      setChildrenAgeRanges(childrenAgeRanges.filter(r => r !== range));
    } else {
      setChildrenAgeRanges([...childrenAgeRanges, range]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
          <p className="text-gray-600">Update your information and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 sm:p-8 space-y-6">
          {/* Basic Info */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <Input
                label="Display Name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={errors.displayName}
                required
                placeholder="Your name"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range *</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value as AgeRange)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  {AGE_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                {errors.ageRange && <p className="mt-1 text-sm text-danger-600">{errors.ageRange}</p>}
              </div>

              <ZipCodeInput
                value={zipCode}
                onChange={setZipCode}
                error={errors.zipCode}
                required
              />
            </div>
          </div>

          {/* About You */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About You</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  maxLength={500}
                  placeholder="Tell other parents about yourself..."
                />
                <p className="mt-1 text-sm text-gray-500">{bio.length}/500 characters</p>
                {errors.bio && <p className="mt-1 text-sm text-danger-600">{errors.bio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Status</label>
                <select
                  value={relationshipStatus}
                  onChange={(e) => setRelationshipStatus(e.target.value as RelationshipStatus)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {RELATIONSHIP_STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Children's Age Ranges</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHILDREN_AGE_RANGES.map(range => {
                    const isSelected = childrenAgeRanges.includes(range);
                    return (
                      <button
                        key={range}
                        type="button"
                        onClick={() => toggleChildrenAgeRange(range)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interests</h2>
            <InterestsSelector
              selected={interests}
              onChange={setInterests}
              error={errors.interests}
            />
          </div>

          {/* Photo & Privacy */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photo & Privacy</h2>

            <div className="mb-6">
              <PhotoUpload
                currentPhotoURL={photoURL}
                onUpload={handlePhotoUpload}
                disabled={submitting}
              />
            </div>

            <PrivacySettings
              settings={privacySettings}
              onChange={setPrivacySettings}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
