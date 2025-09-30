'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { resendVerificationEmail } from '@/lib/auth/auth-helpers';
import { useToast } from '@/components/toast/useToast';
import Button from '@/components/ui/Button';

export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const toast = useToast();
  const [isResending, setIsResending] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResendEmail = async () => {
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

  return (
    <div
      className="bg-warning-50 border-l-4 border-warning-500 p-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-warning-600"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-warning-800">
            Email verification required
          </h3>
          <p className="mt-1 text-sm text-warning-700">
            Please verify your email address to access all features. Check your inbox for a verification link.
          </p>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendEmail}
              loading={isResending}
              className="!text-warning-800 !border-warning-600 hover:!bg-warning-100"
            >
              Resend verification email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
