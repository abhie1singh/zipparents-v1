'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingProgress from '@/components/profile/OnboardingProgress';
import ZipCodeInput from '@/components/profile/ZipCodeInput';
import InterestsSelector from '@/components/profile/InterestsSelector';
import PhotoUpload from '@/components/profile/PhotoUpload';
import PrivacySettings from '@/components/profile/PrivacySettings';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/toast/ToastProvider';
import { completeOnboarding, uploadProfilePhoto } from '@/lib/profile/profile-helpers';
import { validateZipCode, validateDisplayName, validateInterests, getAgeRangeFromAge } from '@/lib/profile/validation';
import { AGE_RANGES, CHILDREN_AGE_RANGES, RELATIONSHIP_STATUSES, DEFAULT_PRIVACY_SETTINGS } from '@/lib/constants/profile';
import { AgeRange, RelationshipStatus, PrivacySettings as PrivacySettingsType } from '@/types/user';

const STEP_LABELS = ['Basic Info', 'About You', 'Interests', 'Privacy & Photo'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Basic Info
  const [displayName, setDisplayName] = useState('');
  const [ageRange, setAgeRange] = useState<AgeRange>('25-34');
  const [zipCode, setZipCode] = useState('');

  // Step 2: About You
  const [bio, setBio] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>('prefer-not-to-say');
  const [childrenAgeRanges, setChildrenAgeRanges] = useState<string[]>([]);

  // Step 3: Interests
  const [interests, setInterests] = useState<string[]>([]);

  // Step 4: Privacy & Photo
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType>(DEFAULT_PRIVACY_SETTINGS);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already completed onboarding
  useEffect(() => {
    if (!authLoading && userData && userData.onboardingCompleted) {
      router.push('/feed');
    }
  }, [authLoading, userData, router]);

  // Pre-fill existing data
  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setZipCode(userData.zipCode || '');
      if (userData.age) {
        setAgeRange(getAgeRangeFromAge(userData.age));
      }
      if (userData.bio) setBio(userData.bio);
      if (userData.relationshipStatus) setRelationshipStatus(userData.relationshipStatus);
      if (userData.childrenAgeRanges) setChildrenAgeRanges(userData.childrenAgeRanges);
      if (userData.interests) setInterests(userData.interests);
      if (userData.privacySettings) setPrivacySettings(userData.privacySettings);
      if (userData.photoURL) setPhotoURL(userData.photoURL);
    }
  }, [userData]);

  const validateStep1 = (): boolean => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    const interestsValidation = validateInterests(interests);
    if (!interestsValidation.valid) {
      newErrors.interests = interestsValidation.error || 'Invalid interests';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) isValid = validateStep1();
    else if (currentStep === 2) isValid = validateStep2();
    else if (currentStep === 3) isValid = validateStep3();
    else isValid = true;

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
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

  const handleSubmit = async () => {
    if (!user) return;

    setSubmitting(true);
    setErrors({});

    try {
      let uploadedPhotoURL = photoURL;

      // Upload photo if new file selected
      if (photoFile) {
        uploadedPhotoURL = await uploadProfilePhoto(photoFile, user.uid);
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

      await completeOnboarding(user.uid, profileData);

      success('Profile completed successfully!');
      router.push('/feed');
    } catch (err) {
      console.error('Onboarding error:', err);
      error(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setSubmitting(false);
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
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">Let's set up your parent profile to connect with your local community</p>
        </div>

        <OnboardingProgress currentStep={currentStep} totalSteps={4} stepLabels={STEP_LABELS} />

        <div className="bg-white rounded-lg shadow p-6 sm:p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Basic Information</h2>

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
          )}

          {/* Step 2: About You */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About You</h2>

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
          )}

          {/* Step 3: Interests */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Interests</h2>
              <InterestsSelector
                selected={interests}
                onChange={setInterests}
                error={errors.interests}
              />
            </div>
          )}

          {/* Step 4: Privacy & Photo */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy & Photo</h2>

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
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={submitting}
              >
                Back
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="flex-1"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                loading={submitting}
                className="flex-1"
              >
                Complete Profile
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Step {currentStep} of 4
        </p>
      </div>
    </div>
  );
}
