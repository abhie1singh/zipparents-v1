/**
 * Events Service - Sprint 5
 * Handles event creation, RSVP, comments, and queries
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseDb, getFirebaseStorage } from '@/lib/firebase/clientApp';
import { getProfile } from '@/lib/profile/profile-helpers';
import {
  Event,
  EventWithOrganizer,
  CreateEventRequest,
  UpdateEventRequest,
  RSVPRequest,
  EventComment,
  EventCommentWithAuthor,
  EventFilters,
  EventStatus,
} from '@/types/event';

/**
 * Create a new event
 */
export async function createEvent(
  organizerId: string,
  request: CreateEventRequest
): Promise<Event> {
  const { title, description, location, zipCode, startTime, endTime, ageRanges, maxAttendees, safetyNotes, isPublicPlace, imageFile } = request;

  // Validation
  if (!title || title.trim().length < 3) {
    throw new Error('Event title must be at least 3 characters');
  }

  if (!description || description.trim().length < 10) {
    throw new Error('Event description must be at least 10 characters');
  }

  if (!location || location.trim().length < 3) {
    throw new Error('Event location is required');
  }

  if (!zipCode || !/^\d{5}$/.test(zipCode)) {
    throw new Error('Valid 5-digit zip code is required');
  }

  if (ageRanges.length === 0) {
    throw new Error('At least one age range must be selected');
  }

  if (startTime >= endTime) {
    throw new Error('End time must be after start time');
  }

  if (startTime < new Date()) {
    throw new Error('Event cannot start in the past');
  }

  if (maxAttendees && maxAttendees < 2) {
    throw new Error('Max attendees must be at least 2');
  }

  // Upload image if provided
  let imageUrl: string | undefined;
  if (imageFile) {
    const imageRef = ref(getFirebaseStorage()!, `events/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  // Determine initial status
  const now = new Date();
  let status: EventStatus = 'upcoming';
  if (startTime <= now && endTime > now) {
    status = 'ongoing';
  } else if (endTime <= now) {
    status = 'completed';
  }

  // Create event document
  const eventData = {
    organizerId,
    title: title.trim(),
    description: description.trim(),
    location: location.trim(),
    zipCode,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    ageRanges,
    maxAttendees: maxAttendees || null,
    attendeeCount: 0,
    attendeeIds: [],
    status,
    imageUrl: imageUrl || null,
    safetyNotes: safetyNotes?.trim() || null,
    isPublicPlace,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const eventRef = await addDoc(collection(getFirebaseDb()!, 'events'), eventData);
  const eventDoc = await getDoc(eventRef);

  return {
    id: eventRef.id,
    ...eventDoc.data(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Event;
}

/**
 * Get event by ID
 */
export async function getEvent(eventId: string): Promise<Event | null> {
  const eventRef = doc(getFirebaseDb()!, 'events', eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    return null;
  }

  const data = eventDoc.data();
  return {
    id: eventDoc.id,
    ...data,
    startTime: data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : data.startTime,
    endTime: data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : data.endTime,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    cancelledAt: data.cancelledAt instanceof Timestamp ? data.cancelledAt.toDate().toISOString() : data.cancelledAt,
  } as Event;
}

/**
 * Get event with organizer info
 */
export async function getEventWithOrganizer(eventId: string): Promise<EventWithOrganizer | null> {
  const event = await getEvent(eventId);
  if (!event) return null;

  const organizer = await getProfile(event.organizerId);
  if (!organizer) return null;

  return {
    ...event,
    organizer: {
      uid: organizer.uid,
      displayName: organizer.displayName,
      photoURL: organizer.photoURL,
      zipCode: organizer.zipCode,
    },
  };
}

/**
 * Update event
 */
export async function updateEvent(
  eventId: string,
  organizerId: string,
  request: UpdateEventRequest
): Promise<void> {
  const eventRef = doc(getFirebaseDb()!, 'events', eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    throw new Error('Event not found');
  }

  const event = eventDoc.data() as Event;

  // Verify organizer
  if (event.organizerId !== organizerId) {
    throw new Error('Only the event organizer can edit this event');
  }

  // Cannot edit cancelled events
  if (event.status === 'cancelled') {
    throw new Error('Cannot edit a cancelled event');
  }

  const updates: any = {
    updatedAt: serverTimestamp(),
  };

  if (request.title !== undefined) {
    if (request.title.trim().length < 3) {
      throw new Error('Event title must be at least 3 characters');
    }
    updates.title = request.title.trim();
  }

  if (request.description !== undefined) {
    if (request.description.trim().length < 10) {
      throw new Error('Event description must be at least 10 characters');
    }
    updates.description = request.description.trim();
  }

  if (request.location !== undefined) {
    if (request.location.trim().length < 3) {
      throw new Error('Event location is required');
    }
    updates.location = request.location.trim();
  }

  if (request.startTime !== undefined || request.endTime !== undefined) {
    const newStartTime = request.startTime || new Date(event.startTime);
    const newEndTime = request.endTime || new Date(event.endTime);

    if (newStartTime >= newEndTime) {
      throw new Error('End time must be after start time');
    }

    if (newStartTime < new Date()) {
      throw new Error('Event cannot start in the past');
    }

    if (request.startTime) updates.startTime = request.startTime.toISOString();
    if (request.endTime) updates.endTime = request.endTime.toISOString();
  }

  if (request.ageRanges !== undefined) {
    if (request.ageRanges.length === 0) {
      throw new Error('At least one age range must be selected');
    }
    updates.ageRanges = request.ageRanges;
  }

  if (request.maxAttendees !== undefined) {
    if (request.maxAttendees < event.attendeeCount) {
      throw new Error(`Cannot set max attendees below current attendee count (${event.attendeeCount})`);
    }
    updates.maxAttendees = request.maxAttendees;
  }

  if (request.safetyNotes !== undefined) {
    updates.safetyNotes = request.safetyNotes.trim() || null;
  }

  if (request.isPublicPlace !== undefined) {
    updates.isPublicPlace = request.isPublicPlace;
  }

  // Upload new image if provided
  if (request.imageFile) {
    const imageRef = ref(getFirebaseStorage()!, `events/${Date.now()}_${request.imageFile.name}`);
    await uploadBytes(imageRef, request.imageFile);
    updates.imageUrl = await getDownloadURL(imageRef);
  }

  await updateDoc(eventRef, updates);
}

/**
 * Cancel event
 */
export async function cancelEvent(
  eventId: string,
  organizerId: string,
  reason?: string
): Promise<void> {
  const eventRef = doc(getFirebaseDb()!, 'events', eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    throw new Error('Event not found');
  }

  const event = eventDoc.data() as Event;

  // Verify organizer
  if (event.organizerId !== organizerId) {
    throw new Error('Only the event organizer can cancel this event');
  }

  if (event.status === 'cancelled') {
    throw new Error('Event is already cancelled');
  }

  if (event.status === 'completed') {
    throw new Error('Cannot cancel a completed event');
  }

  await updateDoc(eventRef, {
    status: 'cancelled',
    cancelledAt: serverTimestamp(),
    cancellationReason: reason || null,
    updatedAt: serverTimestamp(),
  });

  // TODO: Send notifications to all attendees
}

/**
 * RSVP to event
 */
export async function rsvpToEvent(
  eventId: string,
  userId: string,
  request: RSVPRequest
): Promise<void> {
  const eventRef = doc(getFirebaseDb()!, 'events', eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    throw new Error('Event not found');
  }

  const event = eventDoc.data() as Event;

  if (event.status === 'cancelled') {
    throw new Error('Cannot RSVP to a cancelled event');
  }

  if (event.status === 'completed') {
    throw new Error('Cannot RSVP to a completed event');
  }

  if (event.attendeeIds.includes(userId)) {
    throw new Error('You have already RSVP\'d to this event');
  }

  if (event.maxAttendees && event.attendeeCount >= event.maxAttendees) {
    throw new Error('Event is at maximum capacity');
  }

  await updateDoc(eventRef, {
    attendeeIds: arrayUnion(userId),
    attendeeCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  // TODO: Create notification for organizer
}

/**
 * Cancel RSVP
 */
export async function cancelRSVP(eventId: string, userId: string): Promise<void> {
  const eventRef = doc(getFirebaseDb()!, 'events', eventId);
  const eventDoc = await getDoc(eventRef);

  if (!eventDoc.exists()) {
    throw new Error('Event not found');
  }

  const event = eventDoc.data() as Event;

  if (!event.attendeeIds.includes(userId)) {
    throw new Error('You have not RSVP\'d to this event');
  }

  await updateDoc(eventRef, {
    attendeeIds: arrayRemove(userId),
    attendeeCount: increment(-1),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Get events with filters
 */
export async function getEvents(filters?: EventFilters): Promise<EventWithOrganizer[]> {
  let q = query(collection(getFirebaseDb()!, 'events'));

  if (filters?.status && filters.status.length > 0) {
    q = query(q, where('status', 'in', filters.status));
  }

  if (filters?.zipCode) {
    q = query(q, where('zipCode', '==', filters.zipCode));
  }

  if (filters?.ageRanges && filters.ageRanges.length > 0) {
    q = query(q, where('ageRanges', 'array-contains-any', filters.ageRanges));
  }

  if (filters?.dateRange) {
    q = query(q, where('startTime', '>=', filters.dateRange.start.toISOString()));
    q = query(q, where('startTime', '<=', filters.dateRange.end.toISOString()));
  }

  q = query(q, orderBy('startTime', 'asc'), limit(100));

  const snapshot = await getDocs(q);
  const events: EventWithOrganizer[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const organizer = await getProfile(data.organizerId);

    if (!organizer) continue;

    events.push({
      id: doc.id,
      ...data,
      startTime: data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : data.startTime,
      endTime: data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : data.endTime,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      organizer: {
        uid: organizer.uid,
        displayName: organizer.displayName,
        photoURL: organizer.photoURL,
        zipCode: organizer.zipCode,
      },
    } as EventWithOrganizer);
  }

  // Apply client-side filters
  let filtered = events;

  if (filters?.myEvents) {
    // Implemented via organizerId filter
  }

  if (filters?.myRSVPs) {
    // Implemented via attendeeIds filter
  }

  return filtered;
}

/**
 * Get user's created events
 */
export async function getMyEvents(userId: string): Promise<EventWithOrganizer[]> {
  const q = query(
    collection(getFirebaseDb()!, 'events'),
    where('organizerId', '==', userId),
    orderBy('startTime', 'desc')
  );

  const snapshot = await getDocs(q);
  const events: EventWithOrganizer[] = [];

  const organizer = await getProfile(userId);
  if (!organizer) return [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    events.push({
      id: doc.id,
      ...data,
      startTime: data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : data.startTime,
      endTime: data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : data.endTime,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      organizer: {
        uid: organizer.uid,
        displayName: organizer.displayName,
        photoURL: organizer.photoURL,
        zipCode: organizer.zipCode,
      },
    } as EventWithOrganizer);
  }

  return events;
}

/**
 * Get user's RSVP'd events
 */
export async function getMyRSVPs(userId: string): Promise<EventWithOrganizer[]> {
  const q = query(
    collection(getFirebaseDb()!, 'events'),
    where('attendeeIds', 'array-contains', userId),
    orderBy('startTime', 'asc')
  );

  const snapshot = await getDocs(q);
  const events: EventWithOrganizer[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const organizer = await getProfile(data.organizerId);

    if (!organizer) continue;

    events.push({
      id: doc.id,
      ...data,
      startTime: data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : data.startTime,
      endTime: data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : data.endTime,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      organizer: {
        uid: organizer.uid,
        displayName: organizer.displayName,
        photoURL: organizer.photoURL,
        zipCode: organizer.zipCode,
      },
    } as EventWithOrganizer);
  }

  return events;
}

/**
 * Add comment to event
 */
export async function addEventComment(
  eventId: string,
  authorId: string,
  content: string
): Promise<EventComment> {
  if (!content || content.trim().length < 1) {
    throw new Error('Comment cannot be empty');
  }

  if (content.length > 1000) {
    throw new Error('Comment is too long (max 1000 characters)');
  }

  const commentData = {
    eventId,
    authorId,
    content: content.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const commentRef = await addDoc(collection(getFirebaseDb()!, 'eventComments'), commentData);
  const commentDoc = await getDoc(commentRef);

  return {
    id: commentRef.id,
    ...commentDoc.data(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as EventComment;
}

/**
 * Get event comments
 */
export async function getEventComments(eventId: string): Promise<EventCommentWithAuthor[]> {
  const q = query(
    collection(getFirebaseDb()!, 'eventComments'),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const comments: EventCommentWithAuthor[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const author = await getProfile(data.authorId);

    if (!author) continue;

    comments.push({
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      author: {
        uid: author.uid,
        displayName: author.displayName,
        photoURL: author.photoURL,
      },
    } as EventCommentWithAuthor);
  }

  return comments;
}

/**
 * Subscribe to events in date range
 */
export function subscribeToEvents(
  startDate: Date,
  endDate: Date,
  onUpdate: (events: EventWithOrganizer[]) => void
): () => void {
  const q = query(
    collection(getFirebaseDb()!, 'events'),
    where('startTime', '>=', startDate.toISOString()),
    where('startTime', '<=', endDate.toISOString()),
    orderBy('startTime', 'asc')
  );

  return onSnapshot(q, async (snapshot) => {
    const events: EventWithOrganizer[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const organizer = await getProfile(data.organizerId);

      if (!organizer) continue;

      events.push({
        id: doc.id,
        ...data,
        startTime: data.startTime instanceof Timestamp ? data.startTime.toDate().toISOString() : data.startTime,
        endTime: data.endTime instanceof Timestamp ? data.endTime.toDate().toISOString() : data.endTime,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        organizer: {
          uid: organizer.uid,
          displayName: organizer.displayName,
          photoURL: organizer.photoURL,
          zipCode: organizer.zipCode,
        },
      } as EventWithOrganizer);
    }

    onUpdate(events);
  });
}
