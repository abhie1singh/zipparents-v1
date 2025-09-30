'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth/auth-helpers';
import { SignUpData } from '@/types/user';
import { useToast } from '@/components/toast/useToast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AgeVerificationInput from './AgeVerificationInput';

export default function SignUpForm() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpData, string>>>({});

  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    displayName: '',
    dateOfBirth: '',
    zipCode: '',
    acceptedTerms: false,
    acceptedPrivacy: false,
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field
    if (errors[name as keyof SignUpData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignUpData, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== confirmPassword) {
      newErrors.password = 'Passwords do not match';
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.zipCode) {
      newErrors.zipCode = 'Zip code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid zip code format';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the Terms of Service';
    }

    if (!formData.acceptedPrivacy) {
      newErrors.acceptedPrivacy = 'You must accept the Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await signUp(formData);
      toast.success('Account created! Please check your email to verify your account.');
      router.push('/verify-email');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
        autoComplete="email"
      />

      <Input
        type="text"
        name="displayName"
        label="Display Name"
        value={formData.displayName}
        onChange={handleChange}
        error={errors.displayName}
        required
        helperText="This is how other parents will see you"
      />

      <Input
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
        autoComplete="new-password"
        helperText="Must be at least 6 characters"
      />

      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        autoComplete="new-password"
      />

      <AgeVerificationInput
        value={formData.dateOfBirth}
        onChange={(value) => setFormData((prev) => ({ ...prev, dateOfBirth: value }))}
        error={errors.dateOfBirth}
        required
      />

      <Input
        type="text"
        name="zipCode"
        label="Zip Code"
        value={formData.zipCode}
        onChange={handleChange}
        error={errors.zipCode}
        required
        helperText="Connect with parents in your area"
        pattern="\d{5}(-\d{4})?"
      />

      <div className="space-y-2">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptedTerms"
            name="acceptedTerms"
            checked={formData.acceptedTerms}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            aria-describedby="terms-error"
            aria-invalid={!!errors.acceptedTerms}
          />
          <label htmlFor="acceptedTerms" className="ml-2 text-sm text-gray-700">
            I accept the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
              Terms of Service
            </Link>
            <span className="text-danger-500 ml-1" aria-label="required">*</span>
          </label>
        </div>
        {errors.acceptedTerms && (
          <p id="terms-error" className="text-sm text-danger-600" role="alert">
            {errors.acceptedTerms}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="acceptedPrivacy"
            name="acceptedPrivacy"
            checked={formData.acceptedPrivacy}
            onChange={handleChange}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            aria-describedby="privacy-error"
            aria-invalid={!!errors.acceptedPrivacy}
          />
          <label htmlFor="acceptedPrivacy" className="ml-2 text-sm text-gray-700">
            I accept the{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">
              Privacy Policy
            </Link>
            <span className="text-danger-500 ml-1" aria-label="required">*</span>
          </label>
        </div>
        {errors.acceptedPrivacy && (
          <p id="privacy-error" className="text-sm text-danger-600" role="alert">
            {errors.acceptedPrivacy}
          </p>
        )}
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Sign Up
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Log in
        </Link>
      </p>
    </form>
  );
}
