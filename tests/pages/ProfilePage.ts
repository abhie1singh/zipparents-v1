/**
 * Profile Page Object Model
 *
 * Encapsulates profile page elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly displayNameInput: Locator;
  readonly bioTextarea: Locator;
  readonly zipCodeInput: Locator;
  readonly profilePictureUpload: Locator;
  readonly profilePicturePreview: Locator;
  readonly interestsCheckboxes: Locator;
  readonly childrenAgeRangesCheckboxes: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly editButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly profileHeader: Locator;
  readonly userPosts: Locator;
  readonly userEvents: Locator;
  readonly connectButton: Locator;
  readonly messageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.displayNameInput = page.locator('input[name="displayName"]');
    this.bioTextarea = page.locator('textarea[name="bio"]');
    this.zipCodeInput = page.locator('input[name="zipCode"]');
    this.profilePictureUpload = page.locator('input[type="file"][name="profilePicture"]');
    this.profilePicturePreview = page.locator('[data-testid="profile-picture-preview"]');
    this.interestsCheckboxes = page.locator('input[name="interests"]');
    this.childrenAgeRangesCheckboxes = page.locator('input[name="childrenAgeRanges"]');
    this.saveButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.editButton = page.locator('button:has-text("Edit Profile")');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.profileHeader = page.locator('[data-testid="profile-header"]');
    this.userPosts = page.locator('[data-testid="user-posts"]');
    this.userEvents = page.locator('[data-testid="user-events"]');
    this.connectButton = page.locator('button:has-text("Connect")');
    this.messageButton = page.locator('button:has-text("Message")');
  }

  /**
   * Navigate to own profile
   */
  async goto(): Promise<void> {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to specific user's profile
   */
  async gotoUserProfile(userId: string): Promise<void> {
    await this.page.goto(`/profile/${userId}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill profile form
   */
  async fillProfileForm(data: {
    displayName?: string;
    bio?: string;
    zipCode?: string;
    interests?: string[];
    childrenAgeRanges?: string[];
  }): Promise<void> {
    if (data.displayName) {
      await this.displayNameInput.fill(data.displayName);
    }

    if (data.bio) {
      await this.bioTextarea.fill(data.bio);
    }

    if (data.zipCode) {
      await this.zipCodeInput.fill(data.zipCode);
    }

    if (data.interests) {
      await this.selectInterests(data.interests);
    }

    if (data.childrenAgeRanges) {
      await this.selectAgeRanges(data.childrenAgeRanges);
    }
  }

  /**
   * Select interests
   */
  async selectInterests(interests: string[]): Promise<void> {
    for (const interest of interests) {
      await this.page.check(`input[name="interests"][value="${interest}"]`);
    }
  }

  /**
   * Select children age ranges
   */
  async selectAgeRanges(ageRanges: string[]): Promise<void> {
    for (const range of ageRanges) {
      await this.page.check(`input[name="childrenAgeRanges"][value="${range}"]`);
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(filePath: string): Promise<void> {
    await this.profilePictureUpload.setInputFiles(filePath);
  }

  /**
   * Save profile
   */
  async save(): Promise<void> {
    await this.saveButton.click();
  }

  /**
   * Cancel editing
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Click edit profile button
   */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Complete profile update flow
   */
  async updateProfile(data: {
    displayName?: string;
    bio?: string;
    zipCode?: string;
    interests?: string[];
    childrenAgeRanges?: string[];
  }): Promise<void> {
    await this.fillProfileForm(data);
    await this.save();
    await this.waitForSuccess();
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string | null> {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.successMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return await this.errorMessage.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Wait for success message
   */
  async waitForSuccess(): Promise<void> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Get display name
   */
  async getDisplayName(): Promise<string> {
    return await this.displayNameInput.inputValue();
  }

  /**
   * Get bio
   */
  async getBio(): Promise<string> {
    return await this.bioTextarea.inputValue();
  }

  /**
   * Get selected interests
   */
  async getSelectedInterests(): Promise<string[]> {
    const checkboxes = await this.interestsCheckboxes.elementHandles();
    const selected: string[] = [];

    for (const checkbox of checkboxes) {
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        const value = await checkbox.getAttribute('value');
        if (value) selected.push(value);
      }
    }

    return selected;
  }

  /**
   * Get selected age ranges
   */
  async getSelectedAgeRanges(): Promise<string[]> {
    const checkboxes = await this.childrenAgeRangesCheckboxes.elementHandles();
    const selected: string[] = [];

    for (const checkbox of checkboxes) {
      const isChecked = await checkbox.isChecked();
      if (isChecked) {
        const value = await checkbox.getAttribute('value');
        if (value) selected.push(value);
      }
    }

    return selected;
  }

  /**
   * Check if profile picture is displayed
   */
  async hasProfilePicture(): Promise<boolean> {
    return await this.profilePicturePreview.isVisible();
  }

  /**
   * Get user posts count
   */
  async getPostsCount(): Promise<number> {
    const posts = this.page.locator('[data-testid="user-post"]');
    return await posts.count();
  }

  /**
   * Get user events count
   */
  async getEventsCount(): Promise<number> {
    const events = this.page.locator('[data-testid="user-event"]');
    return await events.count();
  }

  /**
   * Click connect button (on another user's profile)
   */
  async clickConnect(): Promise<void> {
    await this.connectButton.click();
  }

  /**
   * Click message button (on another user's profile)
   */
  async clickMessage(): Promise<void> {
    await this.messageButton.click();
  }

  /**
   * Check if save button is disabled
   */
  async isSaveDisabled(): Promise<boolean> {
    return await this.saveButton.isDisabled();
  }

  /**
   * Check if form is valid
   */
  async isFormValid(): Promise<boolean> {
    const displayName = await this.displayNameInput.inputValue();
    const bio = await this.bioTextarea.inputValue();
    const isDisabled = await this.isSaveDisabled();

    return displayName.length > 0 && bio.length > 0 && !isDisabled;
  }

  /**
   * Clear profile form
   */
  async clearForm(): Promise<void> {
    await this.displayNameInput.clear();
    await this.bioTextarea.clear();

    // Uncheck all interests
    const interests = await this.interestsCheckboxes.elementHandles();
    for (const interest of interests) {
      const isChecked = await interest.isChecked();
      if (isChecked) {
        await interest.uncheck();
      }
    }

    // Uncheck all age ranges
    const ageRanges = await this.childrenAgeRangesCheckboxes.elementHandles();
    for (const range of ageRanges) {
      const isChecked = await range.isChecked();
      if (isChecked) {
        await range.uncheck();
      }
    }
  }

  /**
   * Check if viewing own profile
   */
  async isOwnProfile(): Promise<boolean> {
    return await this.editButton.isVisible();
  }

  /**
   * Check if viewing another user's profile
   */
  async isOtherUserProfile(): Promise<boolean> {
    const hasConnectButton = await this.connectButton.isVisible().catch(() => false);
    const hasMessageButton = await this.messageButton.isVisible().catch(() => false);
    return hasConnectButton || hasMessageButton;
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.profileHeader.waitFor({ state: 'visible' });
  }

  /**
   * Check if on profile page
   */
  async isOnProfilePage(): Promise<boolean> {
    return this.page.url().includes('/profile');
  }
}
