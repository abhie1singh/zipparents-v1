/**
 * Content filtering and moderation utilities
 */

// Common profanity list (basic version - in production, use a comprehensive library)
const PROFANITY_LIST = [
  'fuck',
  'shit',
  'damn',
  'bitch',
  'ass',
  'hell',
  'bastard',
  'crap',
  // Add more as needed
];

// Spam patterns
const SPAM_PATTERNS = [
  /\b(buy now|click here|limited time|act now)\b/i,
  /\b(viagra|cialis|pharmacy)\b/i,
  /(http|https):\/\/[^\s]+/g, // Multiple URLs
];

/**
 * Check if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_LIST.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Filter profanity from text by replacing with asterisks
 */
export function filterProfanity(text: string): string {
  let filtered = text;

  PROFANITY_LIST.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, match => '*'.repeat(match.length));
  });

  return filtered;
}

/**
 * Check if text appears to be spam
 */
export function isSpam(text: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Validate message content
 */
export function validateMessageContent(content: string): {
  valid: boolean;
  reason?: string;
} {
  if (!content || content.trim().length === 0) {
    return { valid: false, reason: 'Message cannot be empty' };
  }

  if (content.length > 5000) {
    return { valid: false, reason: 'Message too long (max 5000 characters)' };
  }

  if (isSpam(content)) {
    return { valid: false, reason: 'Message appears to be spam' };
  }

  return { valid: true };
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
}
