'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { resendVerificationEmail } from '@/lib/auth/auth-helpers';
import { useToast } from '@/components/toast/useToast';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isResending, setIsResending] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.emailVerified) {
        router.push('/feed');
      }
    }
  }, [user, loading, router]);

  const handleResendEmail = async () => {
    if (!user) return;

    // Rate limiting: only allow resend every 60 seconds
    if (lastSentAt && Date.now() - lastSentAt < 60000) {
      const secondsLeft = Math.ceil((60000 - (Date.now() - lastSentAt)) / 1000);
      toast.warning(`Please wait ${secondsLeft} seconds before resending`);
      return;
    }

    setIsResending(true);

    try {
      await resendVerificationEmail(user);
      setLastSentAt(Date.now());
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error(error.message || 'Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        toast.success('Email verified! Redirecting...');
        router.push('/feed');
      } else {
        toast.info('Email not verified yet. Please check your inbox.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading..." fullScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary-600 mb-2">ZipParents</h1>
          </Link>

          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify your email</h2>

          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{user.email}</strong>
          </p>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-800">
              Please check your email and click the verification link to activate your account.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleRefresh} fullWidth>
              I've Verified My Email
            </Button>

            <Button
              variant="outline"
              onClick={handleResendEmail}
              loading={isResending}
              fullWidth
            >
              Resend Verification Email
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/login"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
