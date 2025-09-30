import React from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Log In - ZipParents',
  description: 'Log in to your ZipParents account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary-600">ZipParents</h1>
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-600">
            Log in to your account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
