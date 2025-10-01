'use client';

import React, { useState } from 'react';
import { validateZipCode } from '@/lib/profile/validation';
import Input from '@/components/ui/Input';

interface ZipCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export default function ZipCodeInput({ value, onChange, error, label = 'Zip Code', required = true }: ZipCodeInputProps) {
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(newValue);
    
    if (newValue && !validateZipCode(newValue)) {
      setLocalError('Must be a valid 5-digit US zip code');
    } else {
      setLocalError('');
    }
  };

  return (
    <Input
      type="text"
      label={label}
      value={value}
      onChange={handleChange}
      error={error || localError}
      placeholder="12345"
      maxLength={5}
      pattern="[0-9]{5}"
      required={required}
    />
  );
}
