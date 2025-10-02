'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/toast/ToastProvider';
import {
  getEventWithOrganizer,
  rsvpToEvent,
  cancelRSVP,
  cancelEvent,
  getEventComments,
  addEventComment,
} from '@/lib/services/events';
import { EventWithOrganizer, EventCommentWithAuthor, AgeRange } from '@/types/event';
import EventSafetyTips from '@/components/events/EventSafetyTips';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  PencilIcon,
  XCircleIcon,
  FlagIcon,
  MapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast } from 'date-fns';

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

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.eventId as string;
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState<EventWithOrganizer | null>(null);
  const [comments, setComments] = useState<EventCommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    loadEvent();
    loadComments();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const eventData = await getEventWithOrganizer(eventId);
      if (!eventData) {
        toast.error('Event not found');
        router.push('/events');
        return;
      }
      setEvent(eventData);
    } catch (error) {
      console.error('Error loading event:', error);
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await getEventComments(eventId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      toast.info('Please log in to RSVP');
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (!event) return;

    setActionLoading(true);
    try {
      await rsvpToEvent(eventId, user.uid, { eventId });
      toast.success('RSVP successful! See you there!');
      await loadEvent();
    } catch (error) {
      console.error('Error RSVPing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    if (!user || !event) return;

    if (!confirm('Are you sure you want to cancel your RSVP?')) return;

    setActionLoading(true);
    try {
      await cancelRSVP(eventId, user.uid);
      toast.success('RSVP cancelled');
      await loadEvent();
    } catch (error) {
      console.error('Error cancelling RSVP:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel RSVP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!user || !event) return;

    const reason = prompt('Please provide a reason for cancelling (optional):');
    if (reason === null) return; // User clicked cancel

    setActionLoading(true);
    try {
      await cancelEvent(eventId, user.uid, reason || undefined);
      toast.success('Event cancelled');
      await loadEvent();
    } catch (error) {
      console.error('Error cancelling event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to cancel event');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.info('Please log in to comment');
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setCommentLoading(true);
    try {
      await addEventComment(eventId, user.uid, commentText);
      setCommentText('');
      toast.success('Comment added');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReportEvent = () => {
    // Placeholder for reporting functionality
    toast.info('Report feature coming soon');
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

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Event not found</p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[event.status];
  const StatusIcon = statusConfig.icon;
  const isOrganizer = user?.uid === event.organizerId;
  const hasRSVPd = user ? event.attendeeIds.includes(user.uid) : false;
  const isFull = event.maxAttendees ? event.attendeeCount >= event.maxAttendees : false;
  const canRSVP = !hasRSVPd && !isFull && event.status === 'upcoming';
  const canCancelRSVP = hasRSVPd && (event.status === 'upcoming' || event.status === 'ongoing');
  const eventPast = isPast(parseISO(event.endTime));

  const startDate = parseISO(event.startTime);
  const endDate = parseISO(event.endTime);
  const formattedDate = format(startDate, 'EEEE, MMMM d, yyyy');
  const formattedStartTime = format(startDate, 'h:mm a');
  const formattedEndTime = format(endDate, 'h:mm a');

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>

      {/* Event Image */}
      {event.imageUrl && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6 bg-gray-200">
          <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor}`}
          >
            <StatusIcon className="w-5 h-5" />
            {statusConfig.label}
          </span>

          {isFull && event.status === 'upcoming' && (
            <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded">
              Event Full
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

        {/* Organizer */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {event.organizer.photoURL ? (
              <Image
                src={event.organizer.photoURL}
                alt={event.organizer.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-lg font-medium">
                {event.organizer.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Organized by</p>
            <p className="font-medium text-gray-900">{event.organizer.displayName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {canRSVP && (
            <button
              onClick={handleRSVP}
              disabled={actionLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {actionLoading ? 'Processing...' : 'RSVP to Event'}
            </button>
          )}

          {canCancelRSVP && (
            <button
              onClick={handleCancelRSVP}
              disabled={actionLoading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:bg-gray-400"
            >
              {actionLoading ? 'Processing...' : 'Cancel RSVP'}
            </button>
          )}

          {isOrganizer && event.status === 'upcoming' && (
            <>
              <Link
                href={`/events/${eventId}/edit`}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Event
              </Link>
              <button
                onClick={handleCancelEvent}
                disabled={actionLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 inline-flex items-center gap-2"
              >
                <XCircleIcon className="w-4 h-4" />
                Cancel Event
              </button>
            </>
          )}

          {!isOrganizer && (
            <button
              onClick={handleReportEvent}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
            >
              <FlagIcon className="w-4 h-4" />
              Report
            </button>
          )}
        </div>

        {/* Cancellation Message */}
        {event.status === 'cancelled' && event.cancellationReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-900">Cancellation Reason:</p>
            <p className="text-sm text-red-800 mt-1">{event.cancellationReason}</p>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>

        {/* Date and Time */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">{formattedDate}</p>
              <p className="text-sm text-gray-600">
                {formattedStartTime} - {formattedEndTime}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPinIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{event.location}</p>
              <p className="text-sm text-gray-600">Zip Code: {event.zipCode}</p>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-1"
              >
                <MapIcon className="w-4 h-4" />
                View on Map
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <UserGroupIcon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">
                {event.attendeeCount} {event.attendeeCount === 1 ? 'attendee' : 'attendees'}
                {event.maxAttendees && ` / ${event.maxAttendees} max`}
              </p>
            </div>
          </div>
        </div>

        {/* Age Ranges */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Age Ranges</h3>
          <div className="flex flex-wrap gap-2">
            {event.ageRanges.map((range) => (
              <span
                key={range}
                className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded border border-purple-200"
              >
                {AGE_RANGE_LABELS[range]}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Safety Notes */}
        {event.safetyNotes && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Safety Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{event.safetyNotes}</p>
          </div>
        )}

        {/* Public Place Badge */}
        {event.isPublicPlace && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
            <CheckCircleIcon className="w-5 h-5" />
            <span>This event is held in a public place</span>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="mb-6">
        <EventSafetyTips />
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-500">
                {commentText.length} / 1000 characters
              </span>
              <button
                type="submit"
                disabled={commentLoading || !commentText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {commentLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600">
              <Link href={`/login?redirect=/events/${eventId}`} className="text-blue-600 hover:text-blue-700 font-medium">
                Log in
              </Link>{' '}
              to add a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {comment.author.photoURL ? (
                      <Image
                        src={comment.author.photoURL}
                        alt={comment.author.displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-medium">
                        {comment.author.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="font-medium text-gray-900">{comment.author.displayName}</p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
