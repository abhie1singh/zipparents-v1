'use client';

import React, { useState, useRef } from 'react';
import { validateProfilePhoto } from '@/lib/profile/validation';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PhotoUploadProps {
  currentPhotoURL?: string | null;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

export default function PhotoUpload({ currentPhotoURL, onUpload, disabled = false }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateProfilePhoto(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    
    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(currentPhotoURL || null);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl border-4 border-gray-300">
            <span>👤</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <LoadingSpinner size="md" color="white" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        disabled={disabled || uploading}
        loading={uploading}
      >
        {preview ? 'Change Photo' : 'Upload Photo'}
      </Button>

      {error && <p className="text-sm text-danger-600">{error}</p>}
      <p className="text-xs text-gray-500 text-center">
        JPG, PNG or WebP. Max 5MB.
      </p>
    </div>
  );
}
