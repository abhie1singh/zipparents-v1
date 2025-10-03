/**
 * Search Page Object Model
 *
 * Encapsulates search page elements and interactions
 */

import { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterButton: Locator;
  readonly interestFilters: Locator;
  readonly ageRangeFilters: Locator;
  readonly zipCodeFilter: Locator;
  readonly radiusFilter: Locator;
  readonly searchResults: Locator;
  readonly noResultsMessage: Locator;
  readonly loadMoreButton: Locator;
  readonly sortDropdown: Locator;
  readonly clearFiltersButton: Locator;
  readonly resultCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[name="search"]');
    this.searchButton = page.locator('button[type="submit"], button:has-text("Search")');
    this.filterButton = page.locator('button:has-text("Filters")');
    this.interestFilters = page.locator('input[name="interests"]');
    this.ageRangeFilters = page.locator('input[name="ageRanges"]');
    this.zipCodeFilter = page.locator('input[name="zipCode"]');
    this.radiusFilter = page.locator('select[name="radius"]');
    this.searchResults = page.locator('[data-testid="search-result"]');
    this.noResultsMessage = page.locator('[data-testid="no-results"]');
    this.loadMoreButton = page.locator('button:has-text("Load More")');
    this.sortDropdown = page.locator('select[name="sort"]');
    this.clearFiltersButton = page.locator('button:has-text("Clear Filters")');
    this.resultCount = page.locator('[data-testid="result-count"]');
  }

  /**
   * Navigate to search page
   */
  async goto(): Promise<void> {
    await this.page.goto('/search');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform search
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open filters
   */
  async openFilters(): Promise<void> {
    await this.filterButton.click();
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
   * Select age ranges
   */
  async selectAgeRanges(ageRanges: string[]): Promise<void> {
    for (const range of ageRanges) {
      await this.page.check(`input[name="ageRanges"][value="${range}"]`);
    }
  }

  /**
   * Set zip code filter
   */
  async setZipCode(zipCode: string): Promise<void> {
    await this.zipCodeFilter.fill(zipCode);
  }

  /**
   * Set radius filter
   */
  async setRadius(radiusMiles: number): Promise<void> {
    await this.radiusFilter.selectOption(radiusMiles.toString());
  }

  /**
   * Apply filters
   */
  async applyFilters(filters: {
    interests?: string[];
    ageRanges?: string[];
    zipCode?: string;
    radius?: number;
  }): Promise<void> {
    await this.openFilters();

    if (filters.interests) {
      await this.selectInterests(filters.interests);
    }

    if (filters.ageRanges) {
      await this.selectAgeRanges(filters.ageRanges);
    }

    if (filters.zipCode) {
      await this.setZipCode(filters.zipCode);
    }

    if (filters.radius) {
      await this.setRadius(filters.radius);
    }

    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all filters
   */
  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get search results count
   */
  async getResultsCount(): Promise<number> {
    await this.page.waitForTimeout(1000); // Wait for results to load
    return await this.searchResults.count();
  }

  /**
   * Get result count text
   */
  async getResultCountText(): Promise<string | null> {
    try {
      return await this.resultCount.textContent();
    } catch {
      return null;
    }
  }

  /**
   * Check if no results message is displayed
   */
  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }

  /**
   * Click on search result
   */
  async clickResult(index: number): Promise<void> {
    const results = await this.searchResults.all();
    if (results[index]) {
      await results[index].click();
    }
  }

  /**
   * Click on first result
   */
  async clickFirstResult(): Promise<void> {
    await this.clickResult(0);
  }

  /**
   * Load more results
   */
  async loadMore(): Promise<void> {
    await this.loadMoreButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if load more button is visible
   */
  async hasLoadMore(): Promise<boolean> {
    return await this.loadMoreButton.isVisible();
  }

  /**
   * Sort results
   */
  async sortBy(option: 'relevance' | 'distance' | 'recent'): Promise<void> {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all result titles
   */
  async getResultTitles(): Promise<string[]> {
    const results = await this.searchResults.all();
    const titles: string[] = [];

    for (const result of results) {
      const title = await result.locator('[data-testid="result-title"]').textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  /**
   * Search and wait for results
   */
  async searchAndWait(query: string): Promise<void> {
    await this.search(query);
    await this.page.waitForSelector('[data-testid="search-result"], [data-testid="no-results"]', {
      timeout: 10000,
    });
  }

  /**
   * Check if search input is focused
   */
  async isSearchInputFocused(): Promise<boolean> {
    return await this.searchInput.evaluate((el) => el === document.activeElement);
  }

  /**
   * Get current search query
   */
  async getCurrentQuery(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  /**
   * Clear search input
   */
  async clearSearchInput(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Check if filters are applied
   */
  async hasActiveFilters(): Promise<boolean> {
    const interests = await this.interestFilters.elementHandles();
    const ageRanges = await this.ageRangeFilters.elementHandles();

    for (const interest of interests) {
      if (await interest.isChecked()) return true;
    }

    for (const range of ageRanges) {
      if (await range.isChecked()) return true;
    }

    const zipCode = await this.zipCodeFilter.inputValue();
    return zipCode.length > 0;
  }

  /**
   * Get selected interests
   */
  async getSelectedInterests(): Promise<string[]> {
    const checkboxes = await this.interestFilters.elementHandles();
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
    const checkboxes = await this.ageRangeFilters.elementHandles();
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
   * Wait for page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.searchInput.waitFor({ state: 'visible' });
  }

  /**
   * Check if on search page
   */
  async isOnSearchPage(): Promise<boolean> {
    return this.page.url().includes('/search');
  }
}
