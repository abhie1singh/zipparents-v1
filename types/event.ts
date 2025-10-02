/**
 * Event Types for Sprint 5: Community Calendar & Events
 */

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type AgeRange = '0-2' | '3-5' | '6-8' | '9-12' | '13+' | 'all-ages';

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  location: string;
  zipCode: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  ageRanges: AgeRange[];
  maxAttendees?: number;
  attendeeCount: number;
  attendeeIds: string[];
  status: EventStatus;
  imageUrl?: string;
  safetyNotes?: string;
  isPublicPlace: boolean;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface EventWithOrganizer extends Event {
  organizer: {
    uid: string;
    displayName: string;
    photoURL?: string;
    zipCode: string;
  };
}

export interface CreateEventRequest {
  title: string;
  description: string;
  location: string;
  zipCode: string;
  startTime: Date;
  endTime: Date;
  ageRanges: AgeRange[];
  maxAttendees?: number;
  safetyNotes?: string;
  isPublicPlace: boolean;
  imageFile?: File;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  ageRanges?: AgeRange[];
  maxAttendees?: number;
  safetyNotes?: string;
  isPublicPlace?: boolean;
  imageFile?: File;
}

export interface RSVPRequest {
  eventId: string;
  notes?: string;
}

export interface EventComment {
  id: string;
  eventId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventCommentWithAuthor extends EventComment {
  author: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
}

export interface EventFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  ageRanges?: AgeRange[];
  zipCode?: string;
  maxDistance?: number; // miles
  myEvents?: boolean;
  myRSVPs?: boolean;
  status?: EventStatus[];
}
