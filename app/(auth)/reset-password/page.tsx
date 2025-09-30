import React from 'react';
import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - ZipParents',
  description: 'Reset your ZipParents password',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">ZipParents</h1>
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Reset your password</h2>
          <p className="mt-1 text-sm text-gray-600">
            We'll send you a link to reset it
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
