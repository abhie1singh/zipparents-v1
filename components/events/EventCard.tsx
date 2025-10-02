'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  XCircleIcon,
  CheckCircleIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { EventWithOrganizer, AgeRange } from '@/types/event';
import { format, parseISO } from 'date-fns';

interface EventCardProps {
  event: EventWithOrganizer;
}

const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  '0-2': '0-2 years',
  '3-5': '3-5 years',
  '6-8': '6-8 years',
  '9-12': '9-12 years',
  '13+': '13+ years',
  'all-ages': 'All Ages',
};

const STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    icon: CalendarIcon,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
  },
  ongoing: {
    label: 'Happening Now',
    icon: PlayCircleIcon,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircleIcon,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircleIcon,
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
  },
};

export default function EventCard({ event }: EventCardProps) {
  const statusConfig = STATUS_CONFIG[event.status];
  const StatusIcon = statusConfig.icon;

  const startDate = parseISO(event.startTime);
  const endDate = parseISO(event.endTime);

  const formattedDate = format(startDate, 'MMM d, yyyy');
  const formattedStartTime = format(startDate, 'h:mm a');
  const formattedEndTime = format(endDate, 'h:mm a');

  const isFull = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false;

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer">
        {/* Event Image */}
        {event.imageUrl && (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </span>

            {isFull && event.status === 'upcoming' && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                Full
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {event.title}
            </h3>
          </div>

          {/* Date and Time */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              <span>{formattedStartTime} - {formattedEndTime}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Age Ranges */}
          <div className="flex flex-wrap gap-2">
            {event.ageRanges.map((range) => (
              <span
                key={range}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded border border-purple-200"
              >
                {AGE_RANGE_LABELS[range]}
              </span>
            ))}
          </div>

          {/* Organizer and Attendees */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {/* Organizer */}
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {event.organizer.photoURL ? (
                  <Image
                    src={event.organizer.photoURL}
                    alt={event.organizer.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-medium">
                    {event.organizer.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {event.organizer.displayName}
              </span>
            </div>

            {/* Attendee Count */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <UserGroupIcon className="w-4 h-4" />
              <span className="font-medium">
                {event.attendeeCount}
                {event.maxAttendees && ` / ${event.maxAttendees}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
