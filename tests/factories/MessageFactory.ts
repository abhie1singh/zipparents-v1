/**
 * Message Factory
 *
 * Factory for generating message and conversation test data dynamically
 */

import { randomMessageContent, randomId } from '../utils/random.util';

export interface MessageFactoryOptions {
  content?: string;
  type?: 'text' | 'image' | 'file';
  senderId?: string;
  recipientId?: string;
  conversationId?: string;
  read?: boolean;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface ConversationFactoryOptions {
  participant1Id?: string;
  participant2Id?: string;
  lastMessage?: string;
  unreadCount?: number;
  messages?: any[];
}

/**
 * Message Factory Class
 */
export class MessageFactory {
  /**
   * Create a basic message
   */
  static createMessage(options: MessageFactoryOptions = {}): any {
    return {
      content: options.content || randomMessageContent(),
      type: options.type || 'text',
      senderId: options.senderId || 'test-sender-id',
      recipientId: options.recipientId || 'test-recipient-id',
      conversationId: options.conversationId || 'test-conversation-id',
      read: options.read ?? false,
      imageUrl: options.imageUrl || null,
      fileUrl: options.fileUrl || null,
      fileName: options.fileName || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create text message
   */
  static createTextMessage(content: string, options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content,
      type: 'text',
    });
  }

  /**
   * Create image message
   */
  static createImageMessage(imageUrl: string, options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content: 'Sent an image',
      type: 'image',
      imageUrl,
    });
  }

  /**
   * Create file message
   */
  static createFileMessage(fileUrl: string, fileName: string, options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content: `Sent a file: ${fileName}`,
      type: 'file',
      fileUrl,
      fileName,
    });
  }

  /**
   * Create read message
   */
  static createReadMessage(options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      read: true,
      readAt: new Date().toISOString(),
    });
  }

  /**
   * Create unread message
   */
  static createUnreadMessage(options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      read: false,
    });
  }

  /**
   * Create batch of messages
   */
  static createBatch(count: number, options: MessageFactoryOptions = {}): any[] {
    const messages: any[] = [];
    for (let i = 0; i < count; i++) {
      messages.push(this.createMessage(options));
    }
    return messages;
  }

  /**
   * Create conversation thread (multiple messages)
   */
  static createConversationThread(
    senderId: string,
    recipientId: string,
    messageCount: number = 5
  ): any[] {
    const messages: any[] = [];
    const conversationId = randomId();

    for (let i = 0; i < messageCount; i++) {
      // Alternate between sender and recipient
      const currentSenderId = i % 2 === 0 ? senderId : recipientId;
      const currentRecipientId = i % 2 === 0 ? recipientId : senderId;

      messages.push(
        this.createMessage({
          senderId: currentSenderId,
          recipientId: currentRecipientId,
          conversationId,
          read: i < messageCount - 1, // Last message is unread
        })
      );
    }

    return messages;
  }

  /**
   * Create playdate request message
   */
  static createPlaydateRequest(options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content: 'Would you like to meet up for a playdate this weekend?',
    });
  }

  /**
   * Create greeting message
   */
  static createGreeting(options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content: 'Hi! I saw your profile and thought we might have similar interests.',
    });
  }

  /**
   * Create question message
   */
  static createQuestion(options: MessageFactoryOptions = {}): any {
    return this.createMessage({
      ...options,
      content: 'Do you know any good playgrounds in the area?',
    });
  }

  /**
   * Create invalid message (for negative testing)
   */
  static createInvalidMessage(invalidField: 'emptyContent' | 'tooLong'): any {
    const baseMessage = this.createMessage();

    switch (invalidField) {
      case 'emptyContent':
        return { ...baseMessage, content: '' };

      case 'tooLong':
        return { ...baseMessage, content: 'a'.repeat(5001) }; // Over 5000 chars

      default:
        return baseMessage;
    }
  }
}

/**
 * Conversation Factory Class
 */
export class ConversationFactory {
  /**
   * Create a basic conversation
   */
  static createConversation(options: ConversationFactoryOptions = {}): any {
    const participant1Id = options.participant1Id || 'user-1';
    const participant2Id = options.participant2Id || 'user-2';

    return {
      id: randomId(),
      participants: [participant1Id, participant2Id],
      lastMessage: options.lastMessage || randomMessageContent(),
      lastMessageAt: new Date().toISOString(),
      unreadCount: options.unreadCount || 0,
      messages: options.messages || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Create conversation with messages
   */
  static createConversationWithMessages(
    participant1Id: string,
    participant2Id: string,
    messageCount: number = 5
  ): any {
    const messages = MessageFactory.createConversationThread(
      participant1Id,
      participant2Id,
      messageCount
    );

    return this.createConversation({
      participant1Id,
      participant2Id,
      lastMessage: messages[messages.length - 1].content,
      messages,
      unreadCount: 1, // Last message is unread
    });
  }

  /**
   * Create conversation with unread messages
   */
  static createConversationWithUnread(unreadCount: number, options: ConversationFactoryOptions = {}): any {
    return this.createConversation({
      ...options,
      unreadCount,
    });
  }

  /**
   * Create batch of conversations
   */
  static createBatch(count: number, userId: string): any[] {
    const conversations: any[] = [];

    for (let i = 0; i < count; i++) {
      conversations.push(
        this.createConversation({
          participant1Id: userId,
          participant2Id: `other-user-${i}`,
          unreadCount: i % 3 === 0 ? 1 : 0, // Some with unread
        })
      );
    }

    return conversations;
  }

  /**
   * Create conversation for scenario
   */
  static createForScenario(scenario: 'new-conversation' | 'active-chat' | 'inactive-chat'): any {
    switch (scenario) {
      case 'new-conversation':
        return this.createConversation({
          messages: [MessageFactory.createGreeting()],
          unreadCount: 1,
        });

      case 'active-chat':
        return this.createConversationWithMessages('user-1', 'user-2', 20);

      case 'inactive-chat':
        const inactiveConvo = this.createConversation();
        const oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 30);
        return {
          ...inactiveConvo,
          lastMessageAt: oldDate.toISOString(),
          unreadCount: 0,
        };

      default:
        return this.createConversation();
    }
  }
}
