'use client';

import React from 'react';
import { PrivacySettings as PrivacySettingsType } from '@/types/user';

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onChange: (settings: PrivacySettingsType) => void;
}

export default function PrivacySettings({ settings, onChange }: PrivacySettingsProps) {
  const handleToggle = (key: keyof PrivacySettingsType, value: any) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
      
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Show Email Address</label>
            <p className="text-xs text-gray-500">Allow other users to see your email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showEmail}
              onChange={(e) => handleToggle('showEmail', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Show Phone Number</label>
            <p className="text-xs text-gray-500">Allow other users to see your phone</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showPhone}
              onChange={(e) => handleToggle('showPhone', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Show Exact Location</label>
            <p className="text-xs text-gray-500">Show full zip code (or just first 3 digits)</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showExactLocation}
              onChange={(e) => handleToggle('showExactLocation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="pt-3 border-t">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Profile Visibility</label>
          <div className="space-y-2">
            {[
              { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
              { value: 'verified-only', label: 'Verified Only', desc: 'Only verified parents can see' },
              { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={option.value}
                  checked={settings.profileVisibility === option.value}
                  onChange={() => handleToggle('profileVisibility', option.value)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
