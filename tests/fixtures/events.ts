/**
 * Event Test Fixtures
 *
 * Provides predefined event data for testing
 */

export interface EventFixture {
  title: string;
  description: string;
  location: string;
  zipCode: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ageRanges: string[];
  maxAttendees?: number;
  safetyNotes?: string;
  isPublicPlace: boolean;
}

/**
 * Event fixtures for different scenarios
 */
export const EVENT_FIXTURES = {
  // Upcoming playdate
  upcomingPlaydate: {
    title: 'Playground Meetup',
    description: 'Casual playdate at the local playground. Bring your kids and let them play!',
    location: 'Central Park Playground, 123 Park Ave',
    zipCode: '10001',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: ['0-2', '3-5'],
    maxAttendees: 10,
    safetyNotes: 'Please supervise your children at all times.',
    isPublicPlace: true,
  },

  // Weekend activity
  weekendActivity: {
    title: 'Saturday Arts & Crafts',
    description: 'Fun arts and crafts session for kids! We\'ll make DIY projects together.',
    location: 'Community Center, 456 Main St',
    zipCode: '10002',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '16:00',
    ageRanges: ['6-8', '9-12'],
    maxAttendees: 15,
    safetyNotes: 'Materials will be provided. Please inform of any allergies.',
    isPublicPlace: true,
  },

  // Small gathering
  smallGathering: {
    title: 'Coffee & Chat for Parents',
    description: 'Casual meet-up for parents to chat while kids play.',
    location: 'Starbucks Downtown, 789 Coffee Blvd',
    zipCode: '10003',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '11:00',
    ageRanges: ['0-2', '3-5'],
    maxAttendees: 5,
    isPublicPlace: true,
  },

  // All ages event
  allAgesEvent: {
    title: 'Family Fun Day at the Park',
    description: 'Big family gathering with games, activities, and picnic! All ages welcome.',
    location: 'Riverside Park, Picnic Area 3',
    zipCode: '10004',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '11:00',
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '15:00',
    ageRanges: ['0-2', '3-5', '6-8', '9-12', '13+'],
    maxAttendees: 30,
    safetyNotes: 'Bring sunscreen, water, and snacks. First aid kit will be available.',
    isPublicPlace: true,
  },

  // Sports event
  sportsEvent: {
    title: 'Kids Soccer Practice',
    description: 'Friendly soccer practice for kids aged 6-12. All skill levels welcome!',
    location: 'Washington Park Soccer Field',
    zipCode: '10005',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '16:00',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '17:30',
    ageRanges: ['6-8', '9-12'],
    maxAttendees: 20,
    safetyNotes: 'Please bring water and wear appropriate sports attire.',
    isPublicPlace: true,
  },

  // Educational workshop
  educationalWorkshop: {
    title: 'STEM Learning Workshop',
    description: 'Interactive STEM workshop for kids. Learn about science through fun experiments!',
    location: 'Public Library Meeting Room, 321 Library St',
    zipCode: '10001',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '13:00',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '15:00',
    ageRanges: ['9-12', '13+'],
    maxAttendees: 12,
    safetyNotes: 'Adult supervision required for children under 10.',
    isPublicPlace: true,
  },

  // No capacity limit
  noCapacityLimit: {
    title: 'Open Park Gathering',
    description: 'Informal gathering at the park. Come and go as you please!',
    location: 'Liberty Park',
    zipCode: '10002',
    startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '14:00',
    ageRanges: ['0-2', '3-5', '6-8'],
    isPublicPlace: true,
  },
};

/**
 * Invalid event fixtures for negative testing
 */
export const INVALID_EVENT_FIXTURES = {
  // Title too short
  titleTooShort: {
    title: 'Hi',
    description: 'Event description',
    location: 'Park',
    zipCode: '10001',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: ['3-5'],
    isPublicPlace: true,
  },

  // Description too short
  descriptionTooShort: {
    title: 'Event Title',
    description: 'Short',
    location: 'Park',
    zipCode: '10001',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: ['3-5'],
    isPublicPlace: true,
  },

  // Past date
  pastDate: {
    title: 'Past Event',
    description: 'This event is in the past',
    location: 'Park',
    zipCode: '10001',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: ['3-5'],
    isPublicPlace: true,
  },

  // End time before start time
  endBeforeStart: {
    title: 'Invalid Time Event',
    description: 'End time is before start time',
    location: 'Park',
    zipCode: '10001',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '10:00',
    ageRanges: ['3-5'],
    isPublicPlace: true,
  },

  // No age ranges
  noAgeRanges: {
    title: 'Event Without Age Ranges',
    description: 'No age ranges selected',
    location: 'Park',
    zipCode: '10001',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: [],
    isPublicPlace: true,
  },

  // Not public place unchecked
  notPublicPlace: {
    title: 'Private Event',
    description: 'Event not in public place',
    location: 'Private Residence',
    zipCode: '10001',
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endTime: '12:00',
    ageRanges: ['3-5'],
    isPublicPlace: false,
  },
};

/**
 * Generate a random future date
 */
export function generateFutureDate(daysFromNow: number = 7): string {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return date.toISOString().split('T')[0];
}

/**
 * Generate random event
 */
export function generateRandomEvent(): EventFixture {
  const titles = [
    'Playground Meetup',
    'Arts & Crafts Session',
    'Sports Day',
    'Picnic in the Park',
    'Story Time',
    'Music & Movement',
    'Science Exploration',
    'Nature Walk',
  ];

  const locations = [
    'Central Park',
    'Community Center',
    'Public Library',
    'Riverside Park',
    'Sports Complex',
    'Art Studio',
    'Science Museum',
  ];

  const zipCodes = ['10001', '10002', '10003', '10004', '10005'];

  const daysFromNow = 1 + Math.floor(Math.random() * 14);
  const startDate = generateFutureDate(daysFromNow);
  const startHour = 9 + Math.floor(Math.random() * 8);
  const duration = 1 + Math.floor(Math.random() * 3);

  const ageRangeOptions = [
    ['0-2', '3-5'],
    ['3-5', '6-8'],
    ['6-8', '9-12'],
    ['9-12', '13+'],
    ['0-2', '3-5', '6-8'],
  ];

  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    description: `Fun activity for kids and parents. Join us for a great time!`,
    location: locations[Math.floor(Math.random() * locations.length)],
    zipCode: zipCodes[Math.floor(Math.random() * zipCodes.length)],
    startDate,
    startTime: `${startHour.toString().padStart(2, '0')}:00`,
    endDate: startDate,
    endTime: `${(startHour + duration).toString().padStart(2, '0')}:00`,
    ageRanges: ageRangeOptions[Math.floor(Math.random() * ageRangeOptions.length)],
    maxAttendees: Math.random() > 0.3 ? 5 + Math.floor(Math.random() * 20) : undefined,
    isPublicPlace: true,
  };
}
