'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import {
  CalendarIcon,
  ListBulletIcon,
  PlusIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/toast/useToast';
import { subscribeToEvents } from '@/lib/services/events';
import { EventWithOrganizer, AgeRange } from '@/types/event';

type ViewMode = 'month' | 'week' | 'day';
type DisplayMode = 'calendar' | 'list';

const AGE_RANGES: AgeRange[] = ['0-2', '3-5', '6-8', '9-12', '13+', 'all-ages'];

const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  '0-2': 'Infants (0-2)',
  '3-5': 'Preschool (3-5)',
  '6-8': 'Early School (6-8)',
  '9-12': 'Tweens (9-12)',
  '13+': 'Teens (13+)',
  'all-ages': 'All Ages',
};

export default function CalendarPage() {
  const router = useRouter();
  const { userData, loading: authLoading } = useAuth();
  const toast = useToast();

  // View states
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Data states
  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filterMyEvents, setFilterMyEvents] = useState(false);
  const [filterMyRSVPs, setFilterMyRSVPs] = useState(false);
  const [filterNearby, setFilterNearby] = useState(false);
  const [filterAgeRanges, setFilterAgeRanges] = useState<AgeRange[]>([]);

  // Calculate date range based on view mode
  const dateRange = useMemo(() => {
    switch (viewMode) {
      case 'month':
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        };
      case 'week':
        return {
          start: startOfWeek(selectedDate),
          end: endOfWeek(selectedDate),
        };
      case 'day':
        return {
          start: new Date(selectedDate.setHours(0, 0, 0, 0)),
          end: new Date(selectedDate.setHours(23, 59, 59, 999)),
        };
      default:
        return {
          start: startOfMonth(selectedDate),
          end: endOfMonth(selectedDate),
        };
    }
  }, [viewMode, selectedDate]);

  // Subscribe to events
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToEvents(
      dateRange.start,
      dateRange.end,
      (updatedEvents) => {
        setEvents(updatedEvents);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dateRange]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Filter by My Events
    if (filterMyEvents && userData) {
      filtered = filtered.filter(event => event.organizerId === userData.uid);
    }

    // Filter by My RSVPs
    if (filterMyRSVPs && userData) {
      filtered = filtered.filter(event => event.attendeeIds.includes(userData.uid));
    }

    // Filter by Nearby (same zip code)
    if (filterNearby && userData?.zipCode) {
      filtered = filtered.filter(event => event.zipCode === userData.zipCode);
    }

    // Filter by Age Ranges
    if (filterAgeRanges.length > 0) {
      filtered = filtered.filter(event =>
        event.ageRanges.some(range => filterAgeRanges.includes(range))
      );
    }

    return filtered;
  }, [events, filterMyEvents, filterMyRSVPs, filterNearby, filterAgeRanges, userData]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event =>
      isSameDay(parseISO(event.startTime), date)
    );
  };

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, filteredEvents]);

  // Tile content for calendar (event markers)
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateEvents = getEventsForDate(date);
      if (dateEvents.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
          </div>
        );
      }
    }
    return null;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle event click
  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  // Handle create event
  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  // Toggle age range filter
  const toggleAgeRange = (range: AgeRange) => {
    setFilterAgeRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterMyEvents(false);
    setFilterMyRSVPs(false);
    setFilterNearby(false);
    setFilterAgeRanges([]);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterMyEvents) count++;
    if (filterMyRSVPs) count++;
    if (filterNearby) count++;
    if (filterAgeRanges.length > 0) count++;
    return count;
  }, [filterMyEvents, filterMyRSVPs, filterNearby, filterAgeRanges]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Sign In Required</h1>
          <p className="text-text-secondary">Please sign in to view the calendar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-text-primary">Community Calendar</h1>

            <div className="flex items-center gap-3">
              {/* Create Event Button */}
              <button
                onClick={handleCreateEvent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Event
              </button>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 text-sm font-medium border ${
                  viewMode === 'month'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                } rounded-l-md transition-colors`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  viewMode === 'week'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                } transition-colors`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 text-sm font-medium border ${
                  viewMode === 'day'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                } rounded-r-md transition-colors`}
              >
                Day
              </button>
            </div>

            {/* Display Mode Toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => setDisplayMode('calendar')}
                className={`px-4 py-2 text-sm font-medium border ${
                  displayMode === 'calendar'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                } rounded-l-md transition-colors`}
              >
                <CalendarIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`px-4 py-2 text-sm font-medium border ${
                  displayMode === 'list'
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                } rounded-r-md transition-colors`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {/* Quick Filters */}
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Quick Filters</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterMyEvents(!filterMyEvents)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                      filterMyEvents
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    My Events
                  </button>
                  <button
                    onClick={() => setFilterMyRSVPs(!filterMyRSVPs)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                      filterMyRSVPs
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    My RSVPs
                  </button>
                  <button
                    onClick={() => setFilterNearby(!filterNearby)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                      filterNearby
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Nearby ({userData.zipCode})
                  </button>
                </div>
              </div>

              {/* Age Range Filters */}
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Age Ranges</h4>
                <div className="flex flex-wrap gap-2">
                  {AGE_RANGES.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleAgeRange(range)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${
                        filterAgeRanges.includes(range)
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-text-primary border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {AGE_RANGE_LABELS[range]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {displayMode === 'calendar' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <Calendar
                  onChange={handleDateClick}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full border-0"
                />
              </div>
            </div>

            {/* Selected Date Events */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map(event => (
                      <button
                        key={event.id}
                        onClick={() => handleEventClick(event.id)}
                        className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-medium text-text-primary mb-1">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {format(parseISO(event.startTime), 'h:mm a')}
                          </span>
                          <span className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {event.attendeeCount}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-text-secondary">No events on this date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          {event.title}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {format(parseISO(event.startTime), 'MMM d, h:mm a')} - {format(parseISO(event.endTime), 'h:mm a')}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>

                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>
                              {event.attendeeCount} attending
                              {event.maxAttendees && ` / ${event.maxAttendees} max`}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <span className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded-full">
                              {event.ageRanges.map(r => AGE_RANGE_LABELS[r]).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-24 h-24 object-cover rounded-lg ml-4 flex-shrink-0"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No events found</h3>
                <p className="text-text-secondary mb-4">
                  {activeFiltersCount > 0
                    ? 'Try adjusting your filters or create a new event.'
                    : 'Be the first to create an event in your community!'}
                </p>
                <button
                  onClick={handleCreateEvent}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create Event
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
