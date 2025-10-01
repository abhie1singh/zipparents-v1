'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { requestVerification } from '@/lib/profile/profile-helpers';
import { useToast } from '@/components/toast/ToastProvider';

interface VerificationRequestFormProps {
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess?: () => void;
}

export default function VerificationRequestForm({
  userId,
  userEmail,
  userName,
  onSuccess,
}: VerificationRequestFormProps) {
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      error('Please provide information for verification');
      return;
    }

    setSubmitting(true);

    try {
      await requestVerification(userId, userEmail, userName, notes);
      success('Verification request submitted successfully!');
      setNotes('');
      onSuccess?.();
    } catch (err) {
      error(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Parent Verification</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        To get verified as a parent, please provide details about yourself and your family. 
        This helps us maintain a safe community. We may follow up via email for additional information.
      </p>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Tell us about yourself and your children *
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={6}
          placeholder="Example: I'm a parent of two children ages 5 and 8. I'm looking to connect with other local parents..."
          required
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" loading={submitting} className="flex-1">
          Submit Request
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        We typically review verification requests within 3-5 business days.
      </p>
    </form>
  );
}
