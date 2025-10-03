/**
 * Messages Page Object Model
 *
 * Encapsulates messages/conversations page elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class MessagesPage {
  readonly page: Page;
  readonly conversationList: Locator;
  readonly conversationItem: Locator;
  readonly messageInput: Locator;
  readonly sendButton: Locator;
  readonly messageItems: Locator;
  readonly conversationHeader: Locator;
  readonly backButton: Locator;
  readonly searchConversations: Locator;
  readonly newMessageButton: Locator;
  readonly emptyStateMessage: Locator;
  readonly loadingSpinner: Locator;
  readonly attachmentButton: Locator;
  readonly deleteMessageButton: Locator;
  readonly reportButton: Locator;
  readonly blockUserButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.conversationList = page.locator('[data-testid="conversation-list"]');
    this.conversationItem = page.locator('[data-testid="conversation-item"]');
    this.messageInput = page.locator('textarea[name="message"], input[name="message"]');
    this.sendButton = page.locator('button[type="submit"], button:has-text("Send")');
    this.messageItems = page.locator('[data-testid="message-item"]');
    this.conversationHeader = page.locator('[data-testid="conversation-header"]');
    this.backButton = page.locator('button:has-text("Back")');
    this.searchConversations = page.locator('input[placeholder*="Search"]');
    this.newMessageButton = page.locator('button:has-text("New Message")');
    this.emptyStateMessage = page.locator('[data-testid="empty-state"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.attachmentButton = page.locator('button[aria-label="Attach file"]');
    this.deleteMessageButton = page.locator('button[aria-label="Delete message"]');
    this.reportButton = page.locator('button:has-text("Report")');
    this.blockUserButton = page.locator('button:has-text("Block")');
  }

  /**
   * Navigate to messages page
   */
  async goto(): Promise<void> {
    await this.page.goto('/messages');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to specific conversation
   */
  async gotoConversation(conversationId: string): Promise<void> {
    await this.page.goto(`/messages/${conversationId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on conversation
   */
  async clickConversation(index: number): Promise<void> {
    const conversations = await this.conversationItem.all();
    if (conversations[index]) {
      await conversations[index].click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Click on first conversation
   */
  async clickFirstConversation(): Promise<void> {
    await this.clickConversation(0);
  }

  /**
   * Send message
   */
  async sendMessage(message: string): Promise<void> {
    await this.messageInput.fill(message);
    await this.sendButton.click();
    await this.page.waitForTimeout(500); // Wait for message to appear
  }

  /**
   * Get messages count
   */
  async getMessagesCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for messages to load
    return await this.messageItems.count();
  }

  /**
   * Get conversations count
   */
  async getConversationsCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for conversations to load
    return await this.conversationItem.count();
  }

  /**
   * Get last message text
   */
  async getLastMessageText(): Promise<string | null> {
    const messages = await this.messageItems.all();
    if (messages.length === 0) return null;

    const lastMessage = messages[messages.length - 1];
    const messageText = await lastMessage.locator('[data-testid="message-text"]').textContent();
    return messageText;
  }

  /**
   * Get all message texts
   */
  async getAllMessageTexts(): Promise<string[]> {
    const messages = await this.messageItems.all();
    const texts: string[] = [];

    for (const message of messages) {
      const text = await message.locator('[data-testid="message-text"]').textContent();
      if (text) texts.push(text);
    }

    return texts;
  }

  /**
   * Search conversations
   */
  async searchConversation(query: string): Promise<void> {
    await this.searchConversations.fill(query);
    await this.page.waitForTimeout(500); // Wait for search results
  }

  /**
   * Start new conversation
   */
  async startNewConversation(): Promise<void> {
    await this.newMessageButton.click();
  }

  /**
   * Check if empty state is displayed
   */
  async hasEmptyState(): Promise<boolean> {
    return await this.emptyStateMessage.isVisible();
  }

  /**
   * Check if loading
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingSpinner.isVisible();
  }

  /**
   * Wait for messages to load
   */
  async waitForMessagesToLoad(): Promise<void> {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
      // If no spinner, just wait for network idle
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Go back to conversation list
   */
  async goBack(): Promise<void> {
    await this.backButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if send button is disabled
   */
  async isSendDisabled(): Promise<boolean> {
    return await this.sendButton.isDisabled();
  }

  /**
   * Check if message input is empty
   */
  async isMessageInputEmpty(): Promise<boolean> {
    const value = await this.messageInput.inputValue();
    return value.length === 0;
  }

  /**
   * Clear message input
   */
  async clearMessageInput(): Promise<void> {
    await this.messageInput.clear();
  }

  /**
   * Attach file
   */
  async attachFile(filePath: string): Promise<void> {
    await this.attachmentButton.click();
    await this.page.setInputFiles('input[type="file"]', filePath);
  }

  /**
   * Delete message
   */
  async deleteMessage(index: number): Promise<void> {
    const messages = await this.messageItems.all();
    if (messages[index]) {
      await messages[index].hover();
      await this.deleteMessageButton.click();

      // Confirm deletion if modal appears
      const confirmButton = this.page.locator('button:has-text("Delete"), button:has-text("Confirm")');
      try {
        await confirmButton.waitFor({ state: 'visible', timeout: 2000 });
        await confirmButton.click();
      } catch {
        // No confirmation modal
      }
    }
  }

  /**
   * Report conversation
   */
  async reportConversation(): Promise<void> {
    await this.reportButton.click();
  }

  /**
   * Block user
   */
  async blockUser(): Promise<void> {
    await this.blockUserButton.click();

    // Confirm blocking if modal appears
    const confirmButton = this.page.locator('button:has-text("Block"), button:has-text("Confirm")');
    try {
      await confirmButton.waitFor({ state: 'visible', timeout: 2000 });
      await confirmButton.click();
    } catch {
      // No confirmation modal
    }
  }

  /**
   * Get conversation partner name
   */
  async getConversationPartnerName(): Promise<string | null> {
    try {
      const name = await this.conversationHeader.locator('[data-testid="partner-name"]').textContent();
      return name;
    } catch {
      return null;
    }
  }

  /**
   * Check if in a conversation
   */
  async isInConversation(): Promise<boolean> {
    return await this.conversationHeader.isVisible();
  }

  /**
   * Check if viewing conversation list
   */
  async isViewingConversationList(): Promise<boolean> {
    return await this.conversationList.isVisible();
  }

  /**
   * Get unread messages count for conversation
   */
  async getUnreadCount(conversationIndex: number): Promise<number> {
    const conversations = await this.conversationItem.all();
    if (!conversations[conversationIndex]) return 0;

    const unreadBadge = conversations[conversationIndex].locator('[data-testid="unread-count"]');
    try {
      const text = await unreadBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Wait for new message to appear
   */
  async waitForNewMessage(expectedText?: string): Promise<void> {
    if (expectedText) {
      await this.page.waitForSelector(`[data-testid="message-text"]:has-text("${expectedText}")`, {
        timeout: 10000,
      });
    } else {
      await this.page.waitForTimeout(1000); // Wait for message to appear
    }
  }

  /**
   * Scroll to top of messages
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => {
      const messagesContainer = document.querySelector('[data-testid="messages-container"]');
      if (messagesContainer) {
        messagesContainer.scrollTop = 0;
      }
    });
  }

  /**
   * Scroll to bottom of messages
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      const messagesContainer = document.querySelector('[data-testid="messages-container"]');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="conversation-list"], [data-testid="conversation-header"], [data-testid="empty-state"]', {
      timeout: 10000,
    });
  }

  /**
   * Check if on messages page
   */
  async isOnMessagesPage(): Promise<boolean> {
    return this.page.url().includes('/messages');
  }
}
