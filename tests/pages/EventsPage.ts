/**
 * Events Page Object Model
 *
 * Encapsulates events/calendar page elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class EventsPage {
  readonly page: Page;
  readonly createEventButton: Locator;
  readonly eventList: Locator;
  readonly eventItem: Locator;
  readonly calendarView: Locator;
  readonly listView: Locator;
  readonly filterButton: Locator;
  readonly ageRangeFilters: Locator;
  readonly dateFilter: Locator;
  readonly searchInput: Locator;
  readonly noEventsMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly upcomingTab: Locator;
  readonly pastTab: Locator;
  readonly myEventsTab: Locator;

  // Event form fields
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly locationInput: Locator;
  readonly zipCodeInput: Locator;
  readonly dateInput: Locator;
  readonly startTimeInput: Locator;
  readonly endTimeInput: Locator;
  readonly ageRangeCheckboxes: Locator;
  readonly maxAttendeesInput: Locator;
  readonly isPublicPlaceCheckbox: Locator;
  readonly submitEventButton: Locator;
  readonly cancelButton: Locator;

  // Event details
  readonly eventTitle: Locator;
  readonly eventDescription: Locator;
  readonly eventLocation: Locator;
  readonly eventDate: Locator;
  readonly eventTime: Locator;
  readonly eventOrganizer: Locator;
  readonly rsvpButton: Locator;
  readonly cancelRsvpButton: Locator;
  readonly editEventButton: Locator;
  readonly deleteEventButton: Locator;
  readonly attendeesList: Locator;
  readonly attendeeCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createEventButton = page.locator('button:has-text("Create Event")');
    this.eventList = page.locator('[data-testid="event-list"]');
    this.eventItem = page.locator('[data-testid="event-item"]');
    this.calendarView = page.locator('[data-testid="calendar-view"]');
    this.listView = page.locator('[data-testid="list-view"]');
    this.filterButton = page.locator('button:has-text("Filters")');
    this.ageRangeFilters = page.locator('input[name="ageRanges"]');
    this.dateFilter = page.locator('input[name="date"]');
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.noEventsMessage = page.locator('[data-testid="no-events"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.upcomingTab = page.locator('button:has-text("Upcoming")');
    this.pastTab = page.locator('button:has-text("Past")');
    this.myEventsTab = page.locator('button:has-text("My Events")');

    // Form fields
    this.titleInput = page.locator('input[name="title"]');
    this.descriptionTextarea = page.locator('textarea[name="description"]');
    this.locationInput = page.locator('input[name="location"]');
    this.zipCodeInput = page.locator('input[name="zipCode"]');
    this.dateInput = page.locator('input[name="date"]');
    this.startTimeInput = page.locator('input[name="startTime"]');
    this.endTimeInput = page.locator('input[name="endTime"]');
    this.ageRangeCheckboxes = page.locator('input[name="ageRanges"]');
    this.maxAttendeesInput = page.locator('input[name="maxAttendees"]');
    this.isPublicPlaceCheckbox = page.locator('input[name="isPublicPlace"]');
    this.submitEventButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');

    // Event details
    this.eventTitle = page.locator('[data-testid="event-title"]');
    this.eventDescription = page.locator('[data-testid="event-description"]');
    this.eventLocation = page.locator('[data-testid="event-location"]');
    this.eventDate = page.locator('[data-testid="event-date"]');
    this.eventTime = page.locator('[data-testid="event-time"]');
    this.eventOrganizer = page.locator('[data-testid="event-organizer"]');
    this.rsvpButton = page.locator('button:has-text("RSVP")');
    this.cancelRsvpButton = page.locator('button:has-text("Cancel RSVP")');
    this.editEventButton = page.locator('button:has-text("Edit Event")');
    this.deleteEventButton = page.locator('button:has-text("Delete Event")');
    this.attendeesList = page.locator('[data-testid="attendees-list"]');
    this.attendeeCount = page.locator('[data-testid="attendee-count"]');
  }

  /**
   * Navigate to events page
   */
  async goto(): Promise<void> {
    await this.page.goto('/events');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to create event page
   */
  async gotoCreateEvent(): Promise<void> {
    await this.page.goto('/events/create');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to specific event
   */
  async gotoEvent(eventId: string): Promise<void> {
    await this.page.goto(`/events/${eventId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click create event button
   */
  async clickCreateEvent(): Promise<void> {
    await this.createEventButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill event form
   */
  async fillEventForm(data: {
    title: string;
    description: string;
    location: string;
    zipCode: string;
    date: string;
    startTime: string;
    endTime: string;
    ageRanges: string[];
    maxAttendees?: number;
    isPublicPlace?: boolean;
  }): Promise<void> {
    await this.titleInput.fill(data.title);
    await this.descriptionTextarea.fill(data.description);
    await this.locationInput.fill(data.location);
    await this.zipCodeInput.fill(data.zipCode);
    await this.dateInput.fill(data.date);
    await this.startTimeInput.fill(data.startTime);
    await this.endTimeInput.fill(data.endTime);

    // Select age ranges
    for (const range of data.ageRanges) {
      await this.page.check(`input[name="ageRanges"][value="${range}"]`);
    }

    if (data.maxAttendees) {
      await this.maxAttendeesInput.fill(data.maxAttendees.toString());
    }

    if (data.isPublicPlace !== undefined) {
      if (data.isPublicPlace) {
        await this.isPublicPlaceCheckbox.check();
      } else {
        await this.isPublicPlaceCheckbox.uncheck();
      }
    }
  }

  /**
   * Submit event form
   */
  async submitEvent(): Promise<void> {
    await this.submitEventButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create event
   */
  async createEvent(data: {
    title: string;
    description: string;
    location: string;
    zipCode: string;
    date: string;
    startTime: string;
    endTime: string;
    ageRanges: string[];
    maxAttendees?: number;
    isPublicPlace?: boolean;
  }): Promise<void> {
    await this.fillEventForm(data);
    await this.submitEvent();
  }

  /**
   * Cancel event creation
   */
  async cancelEventCreation(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Get events count
   */
  async getEventsCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for events to load
    return await this.eventItem.count();
  }

  /**
   * Click on event
   */
  async clickEvent(index: number): Promise<void> {
    const events = await this.eventItem.all();
    if (events[index]) {
      await events[index].click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click on first event
   */
  async clickFirstEvent(): Promise<void> {
    await this.clickEvent(0);
  }

  /**
   * RSVP to event
   */
  async rsvpToEvent(): Promise<void> {
    await this.rsvpButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Cancel RSVP
   */
  async cancelRsvp(): Promise<void> {
    await this.cancelRsvpButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Edit event
   */
  async editEvent(data: Partial<{
    title: string;
    description: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
  }>): Promise<void> {
    await this.editEventButton.click();
    await this.page.waitForLoadState('networkidle');

    if (data.title) await this.titleInput.fill(data.title);
    if (data.description) await this.descriptionTextarea.fill(data.description);
    if (data.location) await this.locationInput.fill(data.location);
    if (data.date) await this.dateInput.fill(data.date);
    if (data.startTime) await this.startTimeInput.fill(data.startTime);
    if (data.endTime) await this.endTimeInput.fill(data.endTime);

    await this.submitEvent();
  }

  /**
   * Delete event
   */
  async deleteEvent(): Promise<void> {
    await this.deleteEventButton.click();

    // Confirm deletion
    const confirmButton = this.page.locator('button:has-text("Delete"), button:has-text("Confirm")');
    await confirmButton.waitFor({ state: 'visible', timeout: 2000 });
    await confirmButton.click();
  }

  /**
   * Switch to upcoming events
   */
  async showUpcomingEvents(): Promise<void> {
    await this.upcomingTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to past events
   */
  async showPastEvents(): Promise<void> {
    await this.pastTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to my events
   */
  async showMyEvents(): Promise<void> {
    await this.myEventsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Search events
   */
  async searchEvents(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  /**
   * Apply age range filters
   */
  async filterByAgeRanges(ageRanges: string[]): Promise<void> {
    await this.filterButton.click();

    for (const range of ageRanges) {
      await this.page.check(`input[name="ageRanges"][value="${range}"]`);
    }

    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by date
   */
  async filterByDate(date: string): Promise<void> {
    await this.filterButton.click();
    await this.dateFilter.fill(date);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if no events message is displayed
   */
  async hasNoEvents(): Promise<boolean> {
    return await this.noEventsMessage.isVisible();
  }

  /**
   * Get attendees count
   */
  async getAttendeesCount(): Promise<number> {
    try {
      const text = await this.attendeeCount.textContent();
      return text ? parseInt(text, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get event title
   */
  async getEventTitle(): Promise<string | null> {
    return await this.eventTitle.textContent();
  }

  /**
   * Check if user has RSVPed
   */
  async hasRsvped(): Promise<boolean> {
    return await this.cancelRsvpButton.isVisible();
  }

  /**
   * Check if user can edit event
   */
  async canEditEvent(): Promise<boolean> {
    return await this.editEventButton.isVisible();
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitEventButton.isDisabled();
  }

  /**
   * Wait for events to load
   */
  async waitForEventsToLoad(): Promise<void> {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="event-list"], [data-testid="no-events"], [data-testid="event-title"]', {
      timeout: 10000,
    });
  }

  /**
   * Check if on events page
   */
  async isOnEventsPage(): Promise<boolean> {
    return this.page.url().includes('/events');
  }
}
