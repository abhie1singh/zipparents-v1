import React from 'react';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata = {
  title: 'Sign Up - ZipParents',
  description: 'Create your ZipParents account to connect with parents in your area',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">ZipParents</h1>
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Create your account</h2>
          <p className="mt-1 text-sm text-gray-600">
            Join our community of parents
          </p>
        </div>

        <SignUpForm />

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline">
              Terms
            </Link>
            ,{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
              Privacy Policy
            </Link>
            , and{' '}
            <Link href="/guidelines" className="text-primary-600 hover:text-primary-700 underline">
              Community Guidelines
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
