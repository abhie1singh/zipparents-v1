/**
 * Admin Page Object Model
 *
 * Encapsulates admin dashboard elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class AdminPage {
  readonly page: Page;

  // Navigation
  readonly dashboardTab: Locator;
  readonly usersTab: Locator;
  readonly reportsTab: Locator;
  readonly logsTab: Locator;
  readonly settingsTab: Locator;

  // Dashboard
  readonly totalUsersMetric: Locator;
  readonly activeUsersMetric: Locator;
  readonly pendingReportsMetric: Locator;
  readonly resolvedReportsMetric: Locator;

  // Users Management
  readonly userList: Locator;
  readonly userItem: Locator;
  readonly searchUserInput: Locator;
  readonly filterByStatusDropdown: Locator;
  readonly filterByRoleDropdown: Locator;
  readonly suspendUserButton: Locator;
  readonly banUserButton: Locator;
  readonly activateUserButton: Locator;
  readonly viewUserProfileButton: Locator;

  // Reports
  readonly reportList: Locator;
  readonly reportItem: Locator;
  readonly pendingReportsTab: Locator;
  readonly resolvedReportsTab: Locator;
  readonly reportDetails: Locator;
  readonly resolveReportButton: Locator;
  readonly dismissReportButton: Locator;
  readonly takeActionButton: Locator;
  readonly reportReasonSelect: Locator;
  readonly actionNotesTextarea: Locator;

  // Moderation Actions
  readonly moderationActionModal: Locator;
  readonly actionTypeSelect: Locator;
  readonly actionReasonTextarea: Locator;
  readonly actionDurationInput: Locator;
  readonly submitActionButton: Locator;
  readonly cancelActionButton: Locator;

  // Logs
  readonly logsList: Locator;
  readonly logItem: Locator;
  readonly filterByActionType: Locator;
  readonly filterByAdminDropdown: Locator;
  readonly filterByDateRange: Locator;
  readonly exportLogsButton: Locator;

  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly confirmationModal: Locator;
  readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.dashboardTab = page.locator('a[href="/admin"], button:has-text("Dashboard")');
    this.usersTab = page.locator('a[href="/admin/users"], button:has-text("Users")');
    this.reportsTab = page.locator('a[href="/admin/reports"], button:has-text("Reports")');
    this.logsTab = page.locator('a[href="/admin/logs"], button:has-text("Logs")');
    this.settingsTab = page.locator('a[href="/admin/settings"], button:has-text("Settings")');

    // Dashboard
    this.totalUsersMetric = page.locator('[data-testid="metric-total-users"]');
    this.activeUsersMetric = page.locator('[data-testid="metric-active-users"]');
    this.pendingReportsMetric = page.locator('[data-testid="metric-pending-reports"]');
    this.resolvedReportsMetric = page.locator('[data-testid="metric-resolved-reports"]');

    // Users Management
    this.userList = page.locator('[data-testid="user-list"]');
    this.userItem = page.locator('[data-testid="user-item"]');
    this.searchUserInput = page.locator('input[placeholder*="Search users"]');
    this.filterByStatusDropdown = page.locator('select[name="status"]');
    this.filterByRoleDropdown = page.locator('select[name="role"]');
    this.suspendUserButton = page.locator('button:has-text("Suspend")');
    this.banUserButton = page.locator('button:has-text("Ban")');
    this.activateUserButton = page.locator('button:has-text("Activate")');
    this.viewUserProfileButton = page.locator('button:has-text("View Profile")');

    // Reports
    this.reportList = page.locator('[data-testid="report-list"]');
    this.reportItem = page.locator('[data-testid="report-item"]');
    this.pendingReportsTab = page.locator('button:has-text("Pending")');
    this.resolvedReportsTab = page.locator('button:has-text("Resolved")');
    this.reportDetails = page.locator('[data-testid="report-details"]');
    this.resolveReportButton = page.locator('button:has-text("Resolve")');
    this.dismissReportButton = page.locator('button:has-text("Dismiss")');
    this.takeActionButton = page.locator('button:has-text("Take Action")');
    this.reportReasonSelect = page.locator('select[name="reason"]');
    this.actionNotesTextarea = page.locator('textarea[name="actionNotes"]');

    // Moderation Actions
    this.moderationActionModal = page.locator('[data-testid="moderation-action-modal"]');
    this.actionTypeSelect = page.locator('select[name="actionType"]');
    this.actionReasonTextarea = page.locator('textarea[name="actionReason"]');
    this.actionDurationInput = page.locator('input[name="duration"]');
    this.submitActionButton = page.locator('button[type="submit"]');
    this.cancelActionButton = page.locator('button:has-text("Cancel")');

    // Logs
    this.logsList = page.locator('[data-testid="logs-list"]');
    this.logItem = page.locator('[data-testid="log-item"]');
    this.filterByActionType = page.locator('select[name="actionType"]');
    this.filterByAdminDropdown = page.locator('select[name="admin"]');
    this.filterByDateRange = page.locator('input[name="dateRange"]');
    this.exportLogsButton = page.locator('button:has-text("Export")');

    // Messages
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.confirmationModal = page.locator('[role="dialog"]');
    this.confirmButton = page.locator('button:has-text("Confirm")');
  }

  /**
   * Navigate to admin dashboard
   */
  async gotoDashboard(): Promise<void> {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to users management
   */
  async gotoUsers(): Promise<void> {
    await this.page.goto('/admin/users');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to reports
   */
  async gotoReports(): Promise<void> {
    await this.page.goto('/admin/reports');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to logs
   */
  async gotoLogs(): Promise<void> {
    await this.page.goto('/admin/logs');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get dashboard metrics
   */
  async getDashboardMetrics(): Promise<{
    totalUsers: number;
    activeUsers: number;
    pendingReports: number;
    resolvedReports: number;
  }> {
    const totalUsers = parseInt((await this.totalUsersMetric.textContent()) || '0', 10);
    const activeUsers = parseInt((await this.activeUsersMetric.textContent()) || '0', 10);
    const pendingReports = parseInt((await this.pendingReportsMetric.textContent()) || '0', 10);
    const resolvedReports = parseInt((await this.resolvedReportsMetric.textContent()) || '0', 10);

    return { totalUsers, activeUsers, pendingReports, resolvedReports };
  }

  /**
   * Search for user
   */
  async searchUser(query: string): Promise<void> {
    await this.searchUserInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  /**
   * Filter users by status
   */
  async filterUsersByStatus(status: 'active' | 'suspended' | 'banned'): Promise<void> {
    await this.filterByStatusDropdown.selectOption(status);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter users by role
   */
  async filterUsersByRole(role: 'user' | 'admin'): Promise<void> {
    await this.filterByRoleDropdown.selectOption(role);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get users count
   */
  async getUsersCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.userItem.count();
  }

  /**
   * Click on user
   */
  async clickUser(index: number): Promise<void> {
    const users = await this.userItem.all();
    if (users[index]) {
      await users[index].click();
    }
  }

  /**
   * Suspend user
   */
  async suspendUser(reason: string, duration: number): Promise<void> {
    await this.suspendUserButton.click();
    await this.moderationActionModal.waitFor({ state: 'visible' });
    await this.actionReasonTextarea.fill(reason);
    await this.actionDurationInput.fill(duration.toString());
    await this.submitActionButton.click();
    await this.waitForSuccess();
  }

  /**
   * Ban user
   */
  async banUser(reason: string): Promise<void> {
    await this.banUserButton.click();
    await this.moderationActionModal.waitFor({ state: 'visible' });
    await this.actionReasonTextarea.fill(reason);
    await this.submitActionButton.click();
    await this.waitForSuccess();
  }

  /**
   * Activate user
   */
  async activateUser(): Promise<void> {
    await this.activateUserButton.click();
    await this.confirmButton.click();
    await this.waitForSuccess();
  }

  /**
   * Get pending reports count
   */
  async getPendingReportsCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.reportItem.count();
  }

  /**
   * Switch to pending reports
   */
  async showPendingReports(): Promise<void> {
    await this.pendingReportsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switch to resolved reports
   */
  async showResolvedReports(): Promise<void> {
    await this.resolvedReportsTab.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click on report
   */
  async clickReport(index: number): Promise<void> {
    const reports = await this.reportItem.all();
    if (reports[index]) {
      await reports[index].click();
    }
  }

  /**
   * Resolve report
   */
  async resolveReport(notes?: string): Promise<void> {
    await this.resolveReportButton.click();

    if (notes) {
      await this.actionNotesTextarea.fill(notes);
    }

    await this.confirmButton.click();
    await this.waitForSuccess();
  }

  /**
   * Dismiss report
   */
  async dismissReport(notes?: string): Promise<void> {
    await this.dismissReportButton.click();

    if (notes) {
      await this.actionNotesTextarea.fill(notes);
    }

    await this.confirmButton.click();
    await this.waitForSuccess();
  }

  /**
   * Take action on report
   */
  async takeActionOnReport(action: {
    type: 'warn' | 'suspend' | 'ban';
    reason: string;
    duration?: number;
  }): Promise<void> {
    await this.takeActionButton.click();
    await this.moderationActionModal.waitFor({ state: 'visible' });

    await this.actionTypeSelect.selectOption(action.type);
    await this.actionReasonTextarea.fill(action.reason);

    if (action.duration) {
      await this.actionDurationInput.fill(action.duration.toString());
    }

    await this.submitActionButton.click();
    await this.waitForSuccess();
  }

  /**
   * Get logs count
   */
  async getLogsCount(): Promise<number> {
    await this.page.waitForTimeout(1000);
    return await this.logItem.count();
  }

  /**
   * Filter logs by action type
   */
  async filterLogsByActionType(actionType: string): Promise<void> {
    await this.filterByActionType.selectOption(actionType);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Export logs
   */
  async exportLogs(): Promise<void> {
    await this.exportLogsButton.click();
    await this.page.waitForTimeout(1000);
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
   * Check if on admin dashboard
   */
  async isOnAdminDashboard(): Promise<boolean> {
    return this.page.url().includes('/admin');
  }

  /**
   * Check if user has admin access
   */
  async hasAdminAccess(): Promise<boolean> {
    try {
      await this.dashboardTab.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('[data-testid="user-list"], [data-testid="report-list"], [data-testid="logs-list"], [data-testid="metric-total-users"]', {
      timeout: 10000,
    });
  }
}
