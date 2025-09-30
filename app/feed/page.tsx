'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import { useAuth } from '@/contexts/AuthContext';

export default function FeedPage() {
  const { userData } = useAuth();

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <EmailVerificationBanner />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome{userData?.displayName ? `, ${userData.displayName}` : ''}!
            </h1>
            <p className="text-gray-600">
              You're now connected with parents in your area. This is your feed where you'll see updates from your community.
            </p>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-primary-900 mb-2">
              Feed Coming in Sprint 2!
            </h2>
            <p className="text-primary-800 mb-6">
              We're building an amazing feed experience where you'll be able to:
            </p>

            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Share Posts</h3>
                <p className="text-sm text-gray-600">
                  Share updates, questions, and experiences with your local community
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Comment & React</h3>
                <p className="text-sm text-gray-600">
                  Engage with other parents' posts through comments and reactions
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Filter by Location</h3>
                <p className="text-sm text-gray-600">
                  See posts from parents in your zip code or nearby areas
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Connect & Message</h3>
                <p className="text-sm text-gray-600">
                  Send direct messages to arrange playdates and build friendships
                </p>
              </div>
            </div>
          </div>

          {/* Your Info Section */}
          {userData && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Display Name:</span>
                  <span className="font-medium text-gray-900">{userData.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zip Code:</span>
                  <span className="font-medium text-gray-900">{userData.zipCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Verified:</span>
                  <span className={`font-medium ${userData.emailVerified ? 'text-success-600' : 'text-warning-600'}`}>
                    {userData.emailVerified ? 'Yes' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Verified:</span>
                  <span className="font-medium text-success-600">
                    {userData.ageVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
