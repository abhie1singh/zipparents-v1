/**
 * Event Factory
 *
 * Factory for generating event test data dynamically
 */

import {
  randomEventTitle,
  randomEventDescription,
  randomLocation,
  randomAgeRanges,
  randomNumber,
} from '../utils/random.util';
import {
  getFutureDate,
  getMorningTime,
  getAfternoonTime,
  getEveningTime,
  addHoursToTime,
  getEventDateRange,
} from '../utils/date.util';
import { getRandomZipCode } from '../utils/zipcode.util';

export interface EventFactoryOptions {
  title?: string;
  description?: string;
  location?: string;
  zipCode?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  ageRanges?: string[];
  maxAttendees?: number;
  isPublicPlace?: boolean;
  organizerId?: string;
  category?: string;
  tags?: string[];
}

/**
 * Event Factory Class
 */
export class EventFactory {
  /**
   * Create a basic event
   */
  static createEvent(options: EventFactoryOptions = {}): any {
    const startTime = options.startTime || getMorningTime();
    const endTime = options.endTime || addHoursToTime(startTime, 2);

    return {
      title: options.title || randomEventTitle(),
      description: options.description || randomEventDescription(),
      location: options.location || randomLocation(),
      zipCode: options.zipCode || getRandomZipCode(),
      date: options.date || getFutureDate(7),
      startTime,
      endTime,
      ageRanges: options.ageRanges || randomAgeRanges(),
      maxAttendees: options.maxAttendees || randomNumber(5, 20),
      isPublicPlace: options.isPublicPlace ?? true,
      organizerId: options.organizerId || 'test-organizer-id',
      category: options.category || 'Playdate',
      tags: options.tags || [],
      attendees: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create upcoming event
   */
  static createUpcomingEvent(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      date: getFutureDate(randomNumber(1, 30)),
    });
  }

  /**
   * Create past event
   */
  static createPastEvent(options: EventFactoryOptions = {}): any {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - randomNumber(1, 30));

    return this.createEvent({
      ...options,
      date: pastDate.toISOString().split('T')[0],
    });
  }

  /**
   * Create morning event
   */
  static createMorningEvent(options: EventFactoryOptions = {}): any {
    const startTime = getMorningTime();
    return this.createEvent({
      ...options,
      startTime,
      endTime: addHoursToTime(startTime, 2),
    });
  }

  /**
   * Create afternoon event
   */
  static createAfternoonEvent(options: EventFactoryOptions = {}): any {
    const startTime = getAfternoonTime();
    return this.createEvent({
      ...options,
      startTime,
      endTime: addHoursToTime(startTime, 2),
    });
  }

  /**
   * Create evening event
   */
  static createEveningEvent(options: EventFactoryOptions = {}): any {
    const startTime = getEveningTime();
    return this.createEvent({
      ...options,
      startTime,
      endTime: addHoursToTime(startTime, 2),
    });
  }

  /**
   * Create playdate event
   */
  static createPlaydate(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      title: 'Playground Playdate',
      category: 'Playdate',
      isPublicPlace: true,
      maxAttendees: randomNumber(5, 10),
    });
  }

  /**
   * Create workshop event
   */
  static createWorkshop(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      title: 'Parenting Workshop',
      category: 'Workshop',
      isPublicPlace: true,
      maxAttendees: randomNumber(15, 30),
    });
  }

  /**
   * Create sports event
   */
  static createSportsEvent(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      title: 'Kids Soccer Practice',
      category: 'Sports',
      isPublicPlace: true,
      maxAttendees: randomNumber(10, 20),
      ageRanges: ['6-8', '9-12'],
    });
  }

  /**
   * Create all-ages event
   */
  static createAllAgesEvent(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      ageRanges: ['0-2', '3-5', '6-8', '9-12', '13-17'],
    });
  }

  /**
   * Create event at capacity
   */
  static createFullEvent(options: EventFactoryOptions = {}): any {
    const maxAttendees = options.maxAttendees || 10;
    const attendees = Array.from({ length: maxAttendees }, (_, i) => `attendee-${i}`);

    return this.createEvent({
      ...options,
      maxAttendees,
      attendees,
    });
  }

  /**
   * Create private location event
   */
  static createPrivateEvent(options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      isPublicPlace: false,
      location: 'Private residence (address shared with attendees)',
    });
  }

  /**
   * Create invalid event (for negative testing)
   */
  static createInvalidEvent(
    invalidField: 'pastDate' | 'invalidTime' | 'noAgeRanges' | 'emptyTitle'
  ): any {
    const baseEvent = this.createEvent();

    switch (invalidField) {
      case 'pastDate':
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        return { ...baseEvent, date: pastDate.toISOString().split('T')[0] };

      case 'invalidTime':
        return { ...baseEvent, startTime: '25:00', endTime: '26:00' };

      case 'noAgeRanges':
        return { ...baseEvent, ageRanges: [] };

      case 'emptyTitle':
        return { ...baseEvent, title: '' };

      default:
        return baseEvent;
    }
  }

  /**
   * Create event with specific organizer
   */
  static createEventForOrganizer(organizerId: string, options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      organizerId,
    });
  }

  /**
   * Create event in specific zip code
   */
  static createEventInZipCode(zipCode: string, options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      zipCode,
    });
  }

  /**
   * Create event for specific age range
   */
  static createEventForAgeRange(ageRange: string, options: EventFactoryOptions = {}): any {
    return this.createEvent({
      ...options,
      ageRanges: [ageRange],
    });
  }

  /**
   * Create batch of events
   */
  static createBatch(count: number, options: EventFactoryOptions = {}): any[] {
    const events: any[] = [];
    for (let i = 0; i < count; i++) {
      events.push(this.createEvent(options));
    }
    return events;
  }

  /**
   * Create event for specific scenario
   */
  static createForScenario(
    scenario: 'weekend-playdate' | 'weekday-workshop' | 'recurring-meetup'
  ): any {
    switch (scenario) {
      case 'weekend-playdate':
        return this.createEvent({
          title: 'Weekend Park Playdate',
          category: 'Playdate',
          date: getFutureDate(7), // Next week
          startTime: '10:00',
          endTime: '12:00',
          isPublicPlace: true,
          ageRanges: ['3-5', '6-8'],
        });

      case 'weekday-workshop':
        return this.createEvent({
          title: 'Parenting Tips Workshop',
          category: 'Workshop',
          date: getFutureDate(3),
          startTime: '18:00',
          endTime: '20:00',
          isPublicPlace: true,
          maxAttendees: 25,
        });

      case 'recurring-meetup':
        return this.createEvent({
          title: 'Weekly Parent Coffee Meetup',
          category: 'Social',
          date: getFutureDate(2),
          startTime: '09:00',
          endTime: '10:30',
          isPublicPlace: true,
          tags: ['recurring', 'weekly'],
        });

      default:
        return this.createEvent();
    }
  }

  /**
   * Create event update data
   */
  static createEventUpdate(options: EventFactoryOptions = {}): any {
    return {
      title: options.title,
      description: options.description,
      location: options.location,
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      maxAttendees: options.maxAttendees,
      updatedAt: new Date().toISOString(),
    };
  }
}
