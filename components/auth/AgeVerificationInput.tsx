'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { getAgeVerificationError, calculateAge } from '@/lib/auth/age-verification';

interface AgeVerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export default function AgeVerificationInput({
  value,
  onChange,
  error,
  required = true,
}: AgeVerificationInputProps) {
  const [internalError, setInternalError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear internal error on change
    if (internalError) {
      setInternalError('');
    }
  };

  const handleBlur = () => {
    if (value) {
      const ageError = getAgeVerificationError(value);
      if (ageError) {
        setInternalError(ageError);
      } else {
        setInternalError('');
      }
    }
  };

  const displayError = error || internalError;
  const age = value ? calculateAge(value) : null;

  // Calculate max date (18 years ago)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Calculate min date (120 years ago)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div>
      <Input
        type="date"
        label="Date of Birth"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={displayError}
        required={required}
        max={maxDateString}
        min={minDateString}
        helperText="You must be 18 or older to use ZipParents (COPPA compliance)"
      />

      {value && !displayError && age !== null && (
        <p className="mt-1 text-sm text-success-600" role="status">
          Age verified: {age} years old
        </p>
      )}
    </div>
  );
}
