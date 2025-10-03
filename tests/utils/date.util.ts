/**
 * Date Utility Functions
 *
 * Provides date manipulation utilities for tests
 */

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days from now in YYYY-MM-DD format
 */
export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Get date N days ago in YYYY-MM-DD format
 */
export function getPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Get date of birth for a specific age (for testing age verification)
 */
export function getDateOfBirthForAge(age: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  return date.toISOString().split('T')[0];
}

/**
 * Get date of birth for someone who is 18+ (COPPA compliant)
 */
export function getAdultDateOfBirth(): string {
  return getDateOfBirthForAge(18 + Math.floor(Math.random() * 50)); // 18-68 years old
}

/**
 * Get date of birth for someone under 18 (for negative testing)
 */
export function getMinorDateOfBirth(): string {
  return getDateOfBirthForAge(Math.floor(Math.random() * 18)); // 0-17 years old
}

/**
 * Format date as MM/DD/YYYY
 */
export function formatDateUS(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get time N hours from now in HH:MM format
 */
export function getFutureTime(hoursFromNow: number): string {
  const date = new Date();
  date.setHours(date.getHours() + hoursFromNow);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Add hours to a time string (HH:MM)
 */
export function addHoursToTime(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h + hours, m);
  const newHours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${newHours}:${minutes}`;
}

/**
 * Get morning time (8-11 AM)
 */
export function getMorningTime(): string {
  const hour = 8 + Math.floor(Math.random() * 3);
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Get afternoon time (12-5 PM)
 */
export function getAfternoonTime(): string {
  const hour = 12 + Math.floor(Math.random() * 5);
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Get evening time (6-9 PM)
 */
export function getEveningTime(): string {
  const hour = 18 + Math.floor(Math.random() * 3);
  const minute = Math.floor(Math.random() * 60);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
}

/**
 * Check if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date > now;
}

/**
 * Check if date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Get next weekday (Monday-Friday)
 */
export function getNextWeekday(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  // Skip to next weekday if weekend
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }

  return date.toISOString().split('T')[0];
}

/**
 * Get next weekend day (Saturday or Sunday)
 */
export function getNextWeekend(): string {
  const date = new Date();

  // Find next Saturday
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + (daysUntilSaturday || 7));

  return date.toISOString().split('T')[0];
}

/**
 * Get random date within range
 */
export function getRandomDateInRange(startDaysFromNow: number, endDaysFromNow: number): string {
  const randomDays = Math.floor(Math.random() * (endDaysFromNow - startDaysFromNow + 1)) + startDaysFromNow;
  return getFutureDate(randomDays);
}

/**
 * Parse date string to Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get timestamp (milliseconds since epoch)
 */
export function getTimestamp(date?: Date): number {
  return (date || new Date()).getTime();
}

/**
 * Get ISO timestamp string
 */
export function getISOTimestamp(date?: Date): string {
  return (date || new Date()).toISOString();
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if person is adult (18+)
 */
export function isAdult(dateOfBirth: string): boolean {
  return calculateAge(dateOfBirth) >= 18;
}

/**
 * Get date range for events (start and end)
 */
export function getEventDateRange(startDaysFromNow: number = 7, durationHours: number = 2): {
  date: string;
  startTime: string;
  endTime: string;
} {
  const date = getFutureDate(startDaysFromNow);
  const startTime = getMorningTime();
  const endTime = addHoursToTime(startTime, durationHours);

  return { date, startTime, endTime };
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (Math.abs(diffMins) < 60) {
    return diffMins > 0 ? `in ${diffMins} minutes` : `${Math.abs(diffMins)} minutes ago`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `in ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
  } else {
    return diffDays > 0 ? `in ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  }
}

/**
 * Get first day of current month
 */
export function getFirstDayOfMonth(): string {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().split('T')[0];
}

/**
 * Get last day of current month
 */
export function getLastDayOfMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date.toISOString().split('T')[0];
}
