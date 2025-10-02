'use client';

import React from 'react';
import { ExclamationTriangleIcon, MapPinIcon, ClockIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function EventSafetyTips() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-semibold text-amber-900 mb-3">Safety Tips for Event Meetups</h3>

          <div className="space-y-4">
            {/* Public Place */}
            <div className="flex items-start gap-3">
              <MapPinIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Meet in Public Places</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Always choose well-populated, public locations for meetups. Parks, libraries, community centers,
                  and family-friendly restaurants are great options.
                </p>
              </div>
            </div>

            {/* Timing */}
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Choose Appropriate Times</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Schedule events during daylight hours when possible. Avoid early morning or late evening meetups,
                  especially for first-time gatherings.
                </p>
              </div>
            </div>

            {/* What to Bring */}
            <div className="flex items-start gap-3">
              <UserGroupIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">What to Bring</h4>
                <ul className="text-sm text-amber-800 mt-1 list-disc list-inside space-y-1">
                  <li>Your phone (fully charged)</li>
                  <li>Emergency contact information</li>
                  <li>Any necessary items for your children (snacks, water, first aid)</li>
                  <li>Don't share too much personal information initially</li>
                </ul>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="flex items-start gap-3">
              <PhoneIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Stay Connected</h4>
                <p className="text-sm text-amber-800 mt-1">
                  Let someone know where you're going and when you expect to return. Keep your phone accessible
                  and trust your instincts - if something feels off, it's okay to leave.
                </p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-sm text-amber-900 font-medium">
              Remember: Your safety and your children's safety always come first. If you feel uncomfortable
              at any time, trust your judgment and prioritize your well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
