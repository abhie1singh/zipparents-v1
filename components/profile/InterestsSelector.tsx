'use client';

import React from 'react';
import { INTERESTS } from '@/lib/constants/profile';

interface InterestsSelectorProps {
  selected: string[];
  onChange: (interests: string[]) => void;
  error?: string;
  minRequired?: number;
}

export default function InterestsSelector({ selected, onChange, error, minRequired = 3 }: InterestsSelectorProps) {
  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((i) => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Your Interests (at least {minRequired})
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
      <p className="mt-2 text-sm text-gray-500">
        {selected.length} selected {selected.length < minRequired && `(${minRequired - selected.length} more needed)`}
      </p>
    </div>
  );
}
