

# Testing Infrastructure Complete

Comprehensive testing utilities created for ZipParents E2E testing with Playwright.

## ✅ Test Fixtures (`/tests/fixtures/`)

### 1. User Fixtures (`users.ts`)
- **TEST_USERS**: Predefined test users (verified, unverified, admin, suspended, banned)
- **USER_FIXTURES**: Signup scenarios (valid, invalid email, weak password, underage)
- **Helper Functions**:
  - `getRandomUser()` - Get random active user
  - `getUsersByRole()` - Filter by role
  - `getUsersByStatus()` - Filter by status

### 2. Profile Fixtures (`profiles.ts`)
- **PROFILE_FIXTURES**: Complete, minimal, many interests, all age ranges
- **INVALID_PROFILE_FIXTURES**: Empty bio, too long, too few interests
- **AVAILABLE_INTERESTS**: List of all interests
- **AVAILABLE_AGE_RANGES**: All age range options
- **Helper**: `generateRandomProfile()` - Create random profile

### 3. Event Fixtures (`events.ts`)
- **EVENT_FIXTURES**: Playdate, weekend activity, sports, workshop, all-ages
- **INVALID_EVENT_FIXTURES**: Past dates, invalid times, no age ranges
- **Helpers**:
  - `generateFutureDate()` - Create future date
  - `generateRandomEvent()` - Create random event

### 4. Message Fixtures (`messages.ts`)
- **MESSAGE_FIXTURES**: Greetings, questions, playdate requests, support
- **INVALID_MESSAGE_FIXTURES**: Empty, too long, spam, inappropriate
- **CONVERSATION_FIXTURES**: Multi-message threads
- **Helpers**:
  - `generateRandomMessage()` - Create random message
  - `generateConversation()` - Create message thread

### 5. Admin Fixtures (`admin.ts`)
- **REPORT_REASONS**: All report types and reasons
- **REPORT_FIXTURES**: User, post, event, message reports
- **MODERATION_ACTION_FIXTURES**: Warnings, suspensions, bans
- **ADMIN_SCENARIOS**: Different admin roles and permissions
- **MODERATION_LOG_FIXTURES**: Log entries for all actions
- **PLATFORM_METRICS_FIXTURES**: Healthy, needs attention, small, large platforms
- **Helpers**:
  - `generateModerationReason()` - Random reason
  - `generateRandomReport()` - Random report

## ✅ Test Helpers (`/tests/helpers/`)

### 1. Auth Helper (`auth.helper.ts`)
- **Login Functions**:
  - `login(page, email, password)` - Basic login
  - `loginAsVerifiedUser(page)` - Quick verified user login
  - `loginAsAdmin(page)` - Quick admin login

- **Signup Functions**:
  - `signup(page, email, password, dob, zip)` - Complete signup flow

- **Auth State**:
  - `logout(page)` - Logout user
  - `isLoggedIn(page)` - Check login status
  - `waitForAuth(page)` - Wait for auth completion
  - `clearAuth(page)` - Clear all auth data
  - `getCurrentUser(page)` - Get current user info

- **Utilities**:
  - `loginMultipleUsers()` - Login two users simultaneously
  - `verifyEmail(page)` - Simulate email verification
  - `requestPasswordReset()` - Password reset flow
  - `hasRole()` - Check user role
  - `waitForEmailVerification()` - Wait for verification status

### 2. Navigation Helper (`navigation.helper.ts`)
- **Page Navigation**:
  - `goToHome()`, `goToFeed()`, `goToProfile()`
  - `goToMessages()`, `goToCalendar()`, `goToEventDetails()`
  - `goToCreateEvent()`, `goToSearch()`

- **Admin Navigation**:
  - `goToAdminDashboard()`, `goToAdminUsers()`
  - `goToAdminReports()`, `goToAdminLogs()`

- **Legal Pages**:
  - `goToTerms()`, `goToPrivacy()`, `goToCommunityGuidelines()`

- **Marketing Pages**:
  - `goToHowItWorks()`, `goToSafetyTrust()`, `goToFAQ()`

- **Utilities**:
  - `navigateViaMenu()` - Click nav menu item
  - `goBack()`, `goForward()`, `reload()`
  - `isOnPage()` - Check current page
  - `waitForNavigation()` - Wait for page change
  - `openInNewTab()` - Open URL in new tab
  - `toggleMobileMenu()` - Mobile navigation

### 3. Form Helper (`form.helper.ts`)
- **Input Functions**:
  - `fillInput()`, `fillTextarea()`, `selectOption()`
  - `checkCheckbox()`, `uncheckCheckbox()`, `selectRadio()`

- **Form Actions**:
  - `fillForm(formData)` - Fill entire form from object
  - `submitForm()` - Click submit button
  - `resetForm()` - Reset form to defaults

- **Field Validation**:
  - `hasFieldError()` - Check for field error
  - `getFieldError()` - Get error message
  - `waitForFieldValidation()` - Wait for validation

- **File Upload**:
  - `uploadFile()`, `uploadFiles()`, `clearFileUpload()`

- **Utilities**:
  - `clearField()` - Clear field value
  - `getFieldValue()` - Get current value
  - `isFormValid()` - Check form validity
  - `getFormData()` - Extract all form data
  - `isSubmitDisabled()` - Check submit button state

### 4. Wait Helper (`wait.helper.ts`)
- **Element Waiting**:
  - `waitForElement()` - Wait for element visible
  - `waitForElementToHide()` - Wait for element hidden
  - `waitForText()` - Wait for text to appear

- **Loading States**:
  - `waitForLoadingToFinish()` - Wait for spinner to disappear
  - `waitForNavigation()` - Wait for page load

- **UI Components**:
  - `waitForToast()`, `waitForToastToHide()` - Toast notifications
  - `waitForModal()`, `waitForModalToClose()` - Modal dialogs

- **API Responses**:
  - `waitForApiResponse()` - Wait for any API response
  - `waitForSuccessfulApiResponse()` - Wait for successful response

- **Element Counts**:
  - `waitForElementCount()` - Wait for exact count
  - `waitForMinElementCount()` - Wait for minimum count

- **Conditions**:
  - `waitForCondition()` - Custom condition
  - `waitForUrl()` - URL match
  - `waitForElementToBeEnabled/Disabled()` - Button state
  - `waitForElementText()` - Element text
  - `waitForAttribute()`, `waitForClass()` - Element attributes

- **Utilities**:
  - `wait(ms)` - Simple delay
  - `waitForAnimation()` - Animation complete
  - `waitForDocumentReady()` - Document ready
  - `retryUntilSuccess()` - Retry with exponential backoff

### 5. Screenshot Helper (`screenshot.helper.ts`)
- **Basic Screenshots**:
  - `screenshotOnFailure()` - Auto-capture on test failure
  - `takeFullPageScreenshot()` - Full page capture
  - `takeElementScreenshot()` - Specific element
  - `takeAreaScreenshot()` - Specific area

- **Comparison**:
  - `compareScreenshot()` - Visual regression testing
  - `takeBeforeAfterScreenshots()` - Before/after action

- **Responsive**:
  - `takeMobileScreenshot()` - Mobile viewport
  - `takeDesktopScreenshot()` - Desktop viewport
  - `takeResponsiveScreenshots()` - All breakpoints

- **Advanced**:
  - `takeAnnotatedScreenshot()` - With text annotations
  - `takeHighlightedScreenshot()` - Highlight element
  - `attachVideo()` - Attach test video

- **Debugging**:
  - `screenshotError()` - Error state capture
  - `savePageHTML()` - Save HTML for debugging

### 6. Database Helper (`database.helper.ts`)
- **Document Operations**:
  - `documentExists()` - Check if document exists
  - `getDocument()` - Get document data
  - `queryCollection()` - Query with filters

- **Waiting**:
  - `waitForDocument()` - Wait for doc to exist
  - `waitForDocumentData()` - Wait for specific data
  - `waitForCollectionCount()` - Wait for count

- **User Data**:
  - `getUserDocument()` - Get user data
  - `getUserPosts()`, `getUserEvents()` - User content
  - `getUserConversations()` - User conversations
  - `getConversationMessages()` - Messages in conversation

- **Utilities**:
  - `isUserVerified()` - Check verification status
  - `areUsersConnected()` - Check connection
  - `getPendingReportsCount()` - Admin metrics
  - `verifyDataSaved()` - Verify save operation
  - `subscribeToCollection()` - Real-time updates

## 📋 Usage Examples

### Example 1: Complete User Journey Test

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { login, logout } from '../helpers/auth.helper';
import { goToFeed, goToProfile } from '../helpers/navigation.helper';
import { fillForm, submitForm } from '../helpers/form.helper';
import { waitForToast } from '../helpers/wait.helper';
import { TEST_USERS } from '../fixtures/users';
import { PROFILE_FIXTURES } from '../fixtures/profiles';

test('user can complete profile setup', async ({ page }) => {
  // Login
  await login(page, TEST_USERS.verified.email, TEST_USERS.verified.password);

  // Navigate to profile setup
  await goToProfile(page);

  // Fill profile form
  await fillForm(page, PROFILE_FIXTURES.complete);
  await submitForm(page);

  // Verify success
  await waitForToast(page, 'Profile updated successfully');

  // Logout
  await logout(page);
});
\`\`\`

### Example 2: Event Creation Test

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { loginAsVerifiedUser } from '../helpers/auth.helper';
import { goToCreateEvent } from '../helpers/navigation.helper';
import { fillForm, submitForm } from '../helpers/form.helper';
import { waitForDocument } from '../helpers/database.helper';
import { EVENT_FIXTURES } from '../fixtures/events';

test('user can create event', async ({ page }) => {
  await loginAsVerifiedUser(page);
  await goToCreateEvent(page);

  // Fill event form
  await fillForm(page, EVENT_FIXTURES.upcomingPlaydate);
  await submitForm(page);

  // Verify event was created in database
  await waitForDocument(page, 'events', 'event-id');
});
\`\`\`

### Example 3: Admin Moderation Test

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth.helper';
import { goToAdminReports } from '../helpers/navigation.helper';
import { waitForElement } from '../helpers/wait.helper';
import { getPendingReportsCount } from '../helpers/database.helper';

test('admin can review reports', async ({ page }) => {
  await loginAsAdmin(page);
  await goToAdminReports(page);

  // Check pending reports
  const pendingCount = await getPendingReportsCount(page);
  expect(pendingCount).toBeGreaterThan(0);

  // Click on first report
  await waitForElement(page, '[data-testid="report-item"]');
  await page.click('[data-testid="report-item"]:first-child');
});
\`\`\`

### Example 4: Screenshot on Failure

\`\`\`typescript
import { test, expect } from '@playwright/test';
import { screenshotOnFailure } from '../helpers/screenshot.helper';

test('example with auto screenshot', async ({ page }, testInfo) => {
  test.afterEach(async () => {
    await screenshotOnFailure(page, testInfo);
  });

  // Test code here
  // If test fails, screenshot is automatically taken
});
\`\`\`

## 🎯 Best Practices

1. **Use Fixtures for Data**:
   - Always use fixtures instead of hardcoding test data
   - Makes tests more maintainable and reusable

2. **Use Helpers for Actions**:
   - Don't repeat common actions like login, navigation
   - Helpers provide consistent behavior across tests

3. **Wait Appropriately**:
   - Use specific wait helpers instead of arbitrary timeouts
   - Wait for actual conditions, not fixed delays

4. **Capture Debugging Info**:
   - Use screenshot helper on failures
   - Save HTML for complex issues
   - Attach videos for flaky tests

5. **Verify Database State**:
   - Use database helper to verify data was saved
   - Check side effects of user actions

6. **Generate Random Data**:
   - Use random generators for stress testing
   - Avoid test data conflicts

## 📦 Installation

All helpers and fixtures are ready to use. Import them as needed:

\`\`\`typescript
// Fixtures
import { TEST_USERS } from '../fixtures/users';
import { PROFILE_FIXTURES } from '../fixtures/profiles';
import { EVENT_FIXTURES } from '../fixtures/events';
import { MESSAGE_FIXTURES } from '../fixtures/messages';
import { REPORT_FIXTURES } from '../fixtures/admin';

// Helpers
import { login, logout } from '../helpers/auth.helper';
import { goToFeed, goToProfile } from '../helpers/navigation.helper';
import { fillForm, submitForm } from '../helpers/form.helper';
import { waitForElement, waitForToast } from '../helpers/wait.helper';
import { takeFullPageScreenshot } from '../helpers/screenshot.helper';
import { getDocument, waitForDocument } from '../helpers/database.helper';
\`\`\`

## ✅ Test Utilities (`/tests/utils/`)

### 1. Random Utility (`random.util.ts`)
- **String Generation**: `randomString()`, `randomEmail()`, `randomPassword()`, `randomUsername()`
- **Name Generation**: `randomFirstName()`, `randomLastName()`, `randomFullName()`, `randomDisplayName()`
- **Content Generation**: `randomBio()`, `randomInterests()`, `randomAgeRanges()`, `randomEventTitle()`, `randomEventDescription()`, `randomLocation()`, `randomMessageContent()`
- **General Utilities**: `randomNumber()`, `randomBoolean()`, `randomId()`, `randomItem()`, `randomItems()`

### 2. Date Utility (`date.util.ts`)
- **Date Generation**: `getCurrentDate()`, `getFutureDate()`, `getPastDate()`, `getDateOfBirthForAge()`, `getAdultDateOfBirth()`, `getMinorDateOfBirth()`
- **Time Generation**: `getCurrentTime()`, `getFutureTime()`, `getMorningTime()`, `getAfternoonTime()`, `getEveningTime()`, `addHoursToTime()`
- **Date Formatting**: `formatDateUS()`, `formatDateISO()`, `getRelativeTime()`
- **Date Validation**: `isPastDate()`, `isFutureDate()`, `isToday()`, `calculateAge()`, `isAdult()`
- **Date Helpers**: `getNextWeekday()`, `getNextWeekend()`, `getEventDateRange()`, `getFirstDayOfMonth()`, `getLastDayOfMonth()`

### 3. Zip Code Utility (`zipcode.util.ts`)
- **Test Zip Codes**: `TEST_ZIP_CODES` (by region), `ALL_TEST_ZIP_CODES`, `VALID_ZIP_CODES`, `INVALID_ZIP_CODES`
- **Generators**: `getRandomZipCode()`, `getRandomInvalidZipCode()`
- **Validation**: `isValidZipCodeFormat()`
- **Regional Data**: `getZipCodesForRegion()`, `getNearbyZipCodes()`, `getDistantZipCodes()`, `getZipCodesInRadius()`
- **Metadata**: `getCityForZipCode()`, `getStateForZipCode()`, `getRegionForZipCode()`, `ZIP_CODE_DATA`

### 4. Email Utility (`email.util.ts`)
- **Email Generation**: `generateTestEmail()`, `generateUniqueEmail()`, `generateEmailFromName()`, `generatePlusAddressedEmail()`, `generateBulkEmails()`
- **Test Data**: `VALID_EMAIL_FORMATS`, `INVALID_EMAIL_FORMATS`, `EMAIL_FIXTURES`
- **Validation**: `isValidEmailFormat()`, `isValidEmailStrict()`, `isTestEmail()`, `areEmailsEquivalent()`
- **Utilities**: `getEmailUsername()`, `getEmailDomain()`, `normalizeEmail()`, `obfuscateEmail()`

### 5. Image Utility (`image.util.ts`)
- **Image Generation**: `createTestImageBuffer()`, `createTestJpegBuffer()`, `generateTestImageFile()`, `generateLargeTestImage()`, `generateSmallTestImage()`, `generateMultipleTestImages()`
- **Test Data**: `VALID_IMAGE_TYPES`, `INVALID_FILE_TYPES`, `IMAGE_SIZE_LIMITS`, `IMAGE_FIXTURES`, `IMAGE_UPLOAD_SCENARIOS`
- **Validation**: `isValidImageType()`, `isValidImageSize()`, `isValidImageDimensions()`
- **File Utilities**: `getFileSize()`, `getMimeTypeFromExtension()`, `fileExists()`, `formatFileSize()`, `getFileExtension()`, `sanitizeFilename()`
- **Base64**: `createBase64Image()`, `isValidBase64Image()`, `extractBase64Data()`

## ✅ Page Object Models (`/tests/pages/`)

### 1. LoginPage (`LoginPage.ts`)
- **Elements**: Email/password inputs, submit button, error messages, remember me, show password
- **Actions**: `goto()`, `fillLoginForm()`, `submit()`, `login()`, `togglePasswordVisibility()`, `clickForgotPassword()`, `clickSignup()`
- **Validation**: `getErrorMessage()`, `hasError()`, `isSubmitDisabled()`, `isFormValid()`, `isOnLoginPage()`

### 2. SignupPage (`SignupPage.ts`)
- **Elements**: Email, password, confirm password, DOB, zip code, terms checkbox, submit button
- **Actions**: `goto()`, `fillSignupForm()`, `acceptTerms()`, `submit()`, `signup()`, `togglePasswordVisibility()`
- **Validation**: `getErrorMessage()`, `getFieldError()`, `hasAgeVerificationMessage()`, `doPasswordsMatch()`, `isFormValid()`, `isOnSignupPage()`

### 3. ProfilePage (`ProfilePage.ts`)
- **Elements**: Display name, bio, interests, age ranges, profile picture, posts, events
- **Actions**: `goto()`, `gotoUserProfile()`, `fillProfileForm()`, `selectInterests()`, `selectAgeRanges()`, `uploadProfilePicture()`, `save()`, `clickEdit()`, `clickConnect()`, `clickMessage()`
- **Validation**: `getSuccessMessage()`, `getSelectedInterests()`, `hasProfilePicture()`, `getPostsCount()`, `isOwnProfile()`, `isOtherUserProfile()`

### 4. SearchPage (`SearchPage.ts`)
- **Elements**: Search input, filters (interests, age ranges, zip code, radius), results list, sort dropdown
- **Actions**: `goto()`, `search()`, `openFilters()`, `applyFilters()`, `clearFilters()`, `clickResult()`, `loadMore()`, `sortBy()`
- **Validation**: `getResultsCount()`, `hasNoResults()`, `hasActiveFilters()`, `getSelectedInterests()`, `isOnSearchPage()`

### 5. MessagesPage (`MessagesPage.ts`)
- **Elements**: Conversation list, message input, send button, messages, attachment button, delete/report/block buttons
- **Actions**: `goto()`, `gotoConversation()`, `clickConversation()`, `sendMessage()`, `attachFile()`, `deleteMessage()`, `reportConversation()`, `blockUser()`
- **Validation**: `getMessagesCount()`, `getLastMessageText()`, `hasEmptyState()`, `isInConversation()`, `getUnreadCount()`

### 6. EventsPage (`EventsPage.ts`)
- **Elements**: Event list, create button, filters, event form (title, description, location, date/time, age ranges), RSVP button
- **Actions**: `goto()`, `gotoCreateEvent()`, `clickCreateEvent()`, `fillEventForm()`, `createEvent()`, `clickEvent()`, `rsvpToEvent()`, `cancelRsvp()`, `editEvent()`, `deleteEvent()`, `showUpcomingEvents()`, `showPastEvents()`
- **Validation**: `getEventsCount()`, `hasNoEvents()`, `getAttendeesCount()`, `hasRsvped()`, `canEditEvent()`, `isOnEventsPage()`

### 7. AdminPage (`AdminPage.ts`)
- **Elements**: Dashboard metrics, user list, reports list, logs, moderation actions
- **Actions**: `gotoDashboard()`, `gotoUsers()`, `gotoReports()`, `gotoLogs()`, `searchUser()`, `filterUsersByStatus()`, `suspendUser()`, `banUser()`, `activateUser()`, `clickReport()`, `resolveReport()`, `dismissReport()`, `takeActionOnReport()`, `exportLogs()`
- **Validation**: `getDashboardMetrics()`, `getUsersCount()`, `getPendingReportsCount()`, `hasAdminAccess()`, `isOnAdminDashboard()`

## ✅ Test Configuration (`/tests/config/`)

### 1. Local Config (`local.config.ts`)
- Runs against local Firebase emulators
- Base URL: `http://localhost:3000`
- Workers: 1 (serial execution)
- Retries: 0
- Includes web server startup
- Global setup for test data seeding

### 2. Dev Config (`dev.config.ts`)
- Runs against development Firebase project
- Base URL: Environment variable or Vercel dev URL
- Workers: 2 (parallel execution)
- Retries: 1
- No web server (testing deployed app)
- No global setup (persistent dev data)

### 3. Prod Config (`prod.config.ts`)
- Runs READ-ONLY smoke tests against production
- Base URL: Production URL
- Workers: 1 (serial, minimal impact)
- Retries: 2 (network resilience)
- Only runs `@smoke` tagged tests
- Test match: `**/*.smoke.spec.ts`

### 4. Config Index (`index.ts`)
- `getConfig(env)` - Get config for environment
- `getCurrentEnvironment()` - Get current TEST_ENV
- Exports all configs

## ✅ Test Data Factories (`/tests/factories/`)

### 1. UserFactory (`UserFactory.ts`)
- **Create Methods**: `createUser()`, `createVerifiedUser()`, `createUnverifiedUser()`, `createAdmin()`, `createSuspendedUser()`, `createBannedUser()`, `createUserWithProfile()`, `createMinor()`
- **Batch Creation**: `createBatch()`, `createVerifiedBatch()`
- **Data Generators**: `createSignupData()`, `createLoginCredentials()`
- **Scenarios**: `createForScenario()` (new-user, active-user, power-user, inactive-user)

### 2. ProfileFactory (`ProfileFactory.ts`)
- **Create Methods**: `createProfile()`, `createMinimalProfile()`, `createCompleteProfile()`, `createProfileWithManyInterests()`, `createProfileWithAllAgeRanges()`
- **Specific Data**: `createProfileInZipCode()`, `createProfileWithInterests()`, `createProfileWithAgeRanges()`
- **Updates**: `createProfileUpdate()`
- **Invalid**: `createInvalidProfile()` (empty bio, no interests, no age ranges, no display name)
- **Scenarios**: `createForScenario()` (new-parent, experienced-parent, multi-age-parent)
- **Batch**: `createBatch()`

### 3. EventFactory (`EventFactory.ts`)
- **Create Methods**: `createEvent()`, `createUpcomingEvent()`, `createPastEvent()`, `createMorningEvent()`, `createAfternoonEvent()`, `createEveningEvent()`
- **Event Types**: `createPlaydate()`, `createWorkshop()`, `createSportsEvent()`, `createAllAgesEvent()`, `createFullEvent()`, `createPrivateEvent()`
- **Specific Data**: `createEventForOrganizer()`, `createEventInZipCode()`, `createEventForAgeRange()`
- **Invalid**: `createInvalidEvent()` (past date, invalid time, no age ranges, empty title)
- **Scenarios**: `createForScenario()` (weekend-playdate, weekday-workshop, recurring-meetup)
- **Updates**: `createEventUpdate()`
- **Batch**: `createBatch()`

### 4. MessageFactory & ConversationFactory (`MessageFactory.ts`)
- **MessageFactory**:
  - **Create Methods**: `createMessage()`, `createTextMessage()`, `createImageMessage()`, `createFileMessage()`, `createReadMessage()`, `createUnreadMessage()`
  - **Message Types**: `createPlaydateRequest()`, `createGreeting()`, `createQuestion()`
  - **Threads**: `createConversationThread()`
  - **Invalid**: `createInvalidMessage()` (empty content, too long)
  - **Batch**: `createBatch()`

- **ConversationFactory**:
  - **Create Methods**: `createConversation()`, `createConversationWithMessages()`, `createConversationWithUnread()`
  - **Scenarios**: `createForScenario()` (new-conversation, active-chat, inactive-chat)
  - **Batch**: `createBatch()`

### 5. Factory Index (`index.ts`)
- Exports all factories: `UserFactory`, `ProfileFactory`, `EventFactory`, `MessageFactory`, `ConversationFactory`
- Exports all factory option types

---

## 🎉 Testing Infrastructure Complete!

All testing utilities, helpers, fixtures, page objects, configurations, and factories are production-ready and fully documented.

### What We Built:
✅ **5 Test Fixture Files** - Predefined test data for all domains
✅ **6 Test Helper Files** - Reusable test actions and utilities
✅ **5 Test Utility Files** - Random data generators and validation
✅ **7 Page Object Models** - Encapsulated page interactions
✅ **4 Test Config Files** - Environment-specific configurations
✅ **5 Test Factory Files** - Dynamic test data generation

### Total Files Created: **32 production-ready test infrastructure files**

All utilities are well-organized, documented with JSDoc comments, and ready to use in E2E tests.
