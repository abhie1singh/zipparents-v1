/**
 * Message Test Fixtures
 *
 * Provides predefined message data for testing
 */

export interface MessageFixture {
  content: string;
  type?: 'text' | 'image';
  imageUrl?: string;
}

/**
 * Message fixtures for different scenarios
 */
export const MESSAGE_FIXTURES = {
  // Greeting messages
  greeting: {
    content: 'Hi! How are you doing?',
    type: 'text' as const,
  },

  introduction: {
    content: 'Hello! I saw we have similar interests. Would love to connect!',
    type: 'text' as const,
  },

  // Playdate requests
  playdateRequest: {
    content: 'Would you like to meet up for a playdate this weekend? My kids would love to play with yours!',
    type: 'text' as const,
  },

  playdateConfirmation: {
    content: 'That sounds great! Saturday at 10am works for us. See you at the park!',
    type: 'text' as const,
  },

  // Questions
  question: {
    content: 'Do you have any recommendations for preschools in the area?',
    type: 'text' as const,
  },

  advice: {
    content: 'I highly recommend Little Stars Preschool on Main Street. Our kids love it there!',
    type: 'text' as const,
  },

  // Event-related messages
  eventInvite: {
    content: 'Hey! I created an event for this Saturday. Would you be interested in joining?',
    type: 'text' as const,
  },

  eventResponse: {
    content: 'Yes, we\'d love to come! What should we bring?',
    type: 'text' as const,
  },

  // Short messages
  thanks: {
    content: 'Thanks!',
    type: 'text' as const,
  },

  agree: {
    content: 'Sounds good to me!',
    type: 'text' as const,
  },

  // Longer messages
  detailed: {
    content: 'We had such a great time at the playdate today! The kids really enjoyed the arts and crafts activities. We should definitely do this again soon. Maybe next time we could try the new playground that just opened downtown?',
    type: 'text' as const,
  },

  story: {
    content: 'You won\'t believe what happened today at the park! My son made a new friend and they spent the entire afternoon building a fort together. It was so sweet to watch them collaborate and use their imagination. Days like these remind me why these connections are so important.',
    type: 'text' as const,
  },

  // Support messages
  support: {
    content: 'I know parenting can be tough sometimes. If you ever need someone to talk to, I\'m here!',
    type: 'text' as const,
  },

  encouragement: {
    content: 'You\'re doing great! Remember, we\'re all learning as we go.',
    type: 'text' as const,
  },
};

/**
 * Invalid message fixtures for negative testing
 */
export const INVALID_MESSAGE_FIXTURES = {
  // Empty message
  empty: {
    content: '',
    type: 'text' as const,
  },

  // Only whitespace
  whitespace: {
    content: '   ',
    type: 'text' as const,
  },

  // Too long (over character limit if there is one)
  tooLong: {
    content: 'A'.repeat(5000),
    type: 'text' as const,
  },

  // Potentially spam
  spam: {
    content: 'BUY NOW!!! CLICK HERE FOR AMAZING DEALS!!! LIMITED TIME OFFER!!!',
    type: 'text' as const,
  },

  // Potentially inappropriate
  inappropriate: {
    content: 'This message contains inappropriate content that should be filtered',
    type: 'text' as const,
  },
};

/**
 * Message conversation fixtures
 */
export const CONVERSATION_FIXTURES = {
  // Initial connection
  initialConnection: [
    {
      content: 'Hi! I noticed we both have kids in the same age range. Would love to connect!',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Hello! Yes, I saw that too. Are you new to the area?',
      type: 'text' as const,
      fromUser: 'user2',
    },
    {
      content: 'Yes, we just moved here last month. Still trying to get to know the neighborhood.',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Welcome! There are some great parks and activities around here. I can share some recommendations if you\'d like!',
      type: 'text' as const,
      fromUser: 'user2',
    },
  ],

  // Planning a meetup
  planningMeetup: [
    {
      content: 'Would you be interested in meeting up for a playdate?',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Yes, that would be great! When works for you?',
      type: 'text' as const,
      fromUser: 'user2',
    },
    {
      content: 'How about Saturday morning at Central Park?',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Saturday works perfectly! 10am?',
      type: 'text' as const,
      fromUser: 'user2',
    },
    {
      content: 'Perfect! See you then!',
      type: 'text' as const,
      fromUser: 'user1',
    },
  ],

  // Sharing advice
  sharingAdvice: [
    {
      content: 'Do you have any tips for dealing with picky eaters? My daughter refuses to eat vegetables!',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Oh, I totally understand! We went through the same thing. What worked for us was getting creative with presentation.',
      type: 'text' as const,
      fromUser: 'user2',
    },
    {
      content: 'Like making fun shapes with the food?',
      type: 'text' as const,
      fromUser: 'user1',
    },
    {
      content: 'Exactly! And also involving them in cooking. When they help prepare the food, they\'re more likely to try it.',
      type: 'text' as const,
      fromUser: 'user2',
    },
    {
      content: 'That\'s a great idea! I\'ll definitely try that. Thanks!',
      type: 'text' as const,
      fromUser: 'user1',
    },
  ],
};

/**
 * Generate random message content
 */
export function generateRandomMessage(): string {
  const messages = [
    'How are you doing today?',
    'Would love to catch up sometime!',
    'Did you see the new playground that opened?',
    'Thanks for the recommendation!',
    'That sounds like fun!',
    'My kids would love that!',
    'When is good for you?',
    'Looking forward to it!',
    'Had a great time today!',
    'Thanks for organizing!',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate a conversation thread
 */
export function generateConversation(length: number = 5): MessageFixture[] {
  const conversation: MessageFixture[] = [];

  for (let i = 0; i < length; i++) {
    conversation.push({
      content: generateRandomMessage(),
      type: 'text',
    });
  }

  return conversation;
}
