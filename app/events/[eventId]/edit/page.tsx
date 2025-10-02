'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/toast/ToastProvider';
import { getEvent, updateEvent } from '@/lib/services/events';
import { Event, AgeRange } from '@/types/event';
import EventSafetyTips from '@/components/events/EventSafetyTips';
import { PhotoIcon, CalendarIcon, ClockIcon, MapPinIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '0-2', label: '0-2 years (Infants/Toddlers)' },
  { value: '3-5', label: '3-5 years (Preschool)' },
  { value: '6-8', label: '6-8 years (Early Elementary)' },
  { value: '9-12', label: '9-12 years (Tweens)' },
  { value: '13+', label: '13+ years (Teens)' },
  { value: 'all-ages', label: 'All Ages' },
];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    ageRanges: [] as AgeRange[],
    maxAttendees: '',
    safetyNotes: '',
    isPublicPlace: false,
    imageFile: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const eventData = await getEvent(eventId);
      if (!eventData) {
        toast.error('Event not found');
        router.push('/events');
        return;
      }

      // Check if user is the organizer
      if (user && eventData.organizerId !== user.uid) {
        toast.error('You can only edit your own events');
        router.push(`/events/${eventId}`);
        return;
      }

      // Check if event can be edited
      if (eventData.status === 'cancelled') {
        toast.error('Cannot edit a cancelled event');
        router.push(`/events/${eventId}`);
        return;
      }

      setEvent(eventData);

      // Parse dates
      const startDate = parseISO(eventData.startTime);
      const endDate = parseISO(eventData.endTime);

      // Populate form
      setFormData({
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        startDate: format(startDate, 'yyyy-MM-dd'),
        startTime: format(startDate, 'HH:mm'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        endTime: format(endDate, 'HH:mm'),
        ageRanges: eventData.ageRanges,
        maxAttendees: eventData.maxAttendees?.toString() || '',
        safetyNotes: eventData.safetyNotes || '',
        isPublicPlace: eventData.isPublicPlace,
        imageFile: null,
      });

      if (eventData.imageUrl) {
        setImagePreview(eventData.imageUrl);
      }
    } catch (error) {
      console.error('Error loading event:', error);
      toast.error('Failed to load event');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      router.push(`/login?redirect=/events/${eventId}/edit`);
    }
  }, [user, loading, router, eventId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAgeRangeToggle = (range: AgeRange) => {
    setFormData((prev) => {
      const newRanges = prev.ageRanges.includes(range)
        ? prev.ageRanges.filter((r) => r !== range)
        : [...prev.ageRanges, range];
      return { ...prev, ageRanges: newRanges };
    });

    if (errors.ageRanges) {
      setErrors((prev) => ({ ...prev, ageRanges: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, imageFile: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location || formData.location.trim().length < 3) {
      newErrors.location = 'Location is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.ageRanges.length === 0) {
      newErrors.ageRanges = 'Please select at least one age range';
    }

    if (!formData.isPublicPlace) {
      newErrors.isPublicPlace = 'Events must be held in public places for safety';
    }

    // Validate dates
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (startDateTime >= endDateTime) {
        newErrors.endDate = 'End time must be after start time';
      }

      if (startDateTime < new Date()) {
        newErrors.startDate = 'Event cannot start in the past';
      }
    }

    // Validate max attendees
    if (formData.maxAttendees) {
      const maxAttendees = parseInt(formData.maxAttendees);
      if (maxAttendees < 2) {
        newErrors.maxAttendees = 'Max attendees must be at least 2';
      }
      if (event && maxAttendees < event.attendeeCount) {
        newErrors.maxAttendees = `Cannot set max attendees below current attendee count (${event.attendeeCount})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !event) {
      toast.error('You must be logged in to edit this event');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSaving(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      await updateEvent(eventId, user.uid, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startTime: startDateTime,
        endTime: endDateTime,
        ageRanges: formData.ageRanges,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        safetyNotes: formData.safetyNotes || undefined,
        isPublicPlace: formData.isPublicPlace,
        imageFile: formData.imageFile || undefined,
      });

      toast.success('Event updated successfully!');
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!user || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push(`/events/${eventId}`)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Event
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">
          Update your event details. Note: Some fields like organizer and creation date cannot be changed.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Playground Meetup at Central Park"
              minLength={3}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your event, what activities you'll do, what to bring, etc."
              minLength={10}
              required
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, imageFile: null }));
                      setImagePreview(event.imageUrl || null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="text-sm text-gray-500">
                <p>JPG, PNG or GIF</p>
                <p>Max 5MB</p>
                {formData.imageFile && <p className="text-blue-600 mt-1">New image selected</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Location & Time</h2>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-4 h-4 inline mr-1" />
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Central Park, Main Playground Area"
              required
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Zip Code - Read Only */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={event.zipCode}
              disabled
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">Zip code cannot be changed</p>
          </div>

          {/* Start Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
            </div>
          </div>

          {/* End Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>
        </div>

        {/* Age Ranges & Capacity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Age Ranges & Capacity</h2>

          {/* Age Ranges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Age Ranges <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {AGE_RANGES.map((range) => (
                <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.ageRanges.includes(range.value)}
                    onChange={() => handleAgeRangeToggle(range.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
            {errors.ageRanges && <p className="mt-2 text-sm text-red-600">{errors.ageRanges}</p>}
          </div>

          {/* Max Attendees */}
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Attendees (Optional)
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleInputChange}
              min={event.attendeeCount}
              className={`w-full max-w-xs px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Leave empty for unlimited"
            />
            {errors.maxAttendees && <p className="mt-1 text-sm text-red-600">{errors.maxAttendees}</p>}
            <p className="mt-1 text-sm text-gray-500">
              Current attendees: {event.attendeeCount}. Cannot set below this number.
            </p>
          </div>
        </div>

        {/* Safety Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Safety Information</h2>

          {/* Safety Notes */}
          <div>
            <label htmlFor="safetyNotes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Safety Notes (Optional)
            </label>
            <textarea
              id="safetyNotes"
              name="safetyNotes"
              value={formData.safetyNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any specific safety information attendees should know..."
            />
          </div>

          {/* Public Place Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPublicPlace"
                checked={formData.isPublicPlace}
                onChange={handleInputChange}
                className={`mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                  errors.isPublicPlace ? 'border-red-500' : ''
                }`}
                required
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  This event will be held in a public place <span className="text-red-500">*</span>
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  For everyone's safety, all events must be held in public locations
                </p>
              </div>
            </label>
            {errors.isPublicPlace && <p className="mt-2 text-sm text-red-600">{errors.isPublicPlace}</p>}
          </div>

          {/* Safety Tips */}
          <EventSafetyTips />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/events/${eventId}`)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
