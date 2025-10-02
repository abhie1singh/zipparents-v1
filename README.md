# ZipParents - Connect, Share, Support

A Next.js-based social platform for parents to connect, share experiences, and find local support within their zip code communities.

## 📋 Table of Contents

- [Sprint 1: Completed Features](#sprint-1-completed-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Firebase Setup](#firebase-setup)
- [Development](#development)
- [Testing](#testing)
- [Seeding Data](#seeding-data)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## ✅ Sprint 1: Completed Features

Sprint 1 establishes the foundation of ZipParents with complete authentication, legal compliance, and UI infrastructure.

### Authentication & User Management
- ✅ **Sign Up Flow** - Complete registration with email/password
- ✅ **Age Verification** - COPPA compliant 18+ requirement with date of birth validation
- ✅ **Email Verification** - Firebase email verification with resend capability
- ✅ **Login/Logout** - Secure authentication flow
- ✅ **Password Reset** - Email-based password recovery
- ✅ **Protected Routes** - Route guards for authenticated-only pages
- ✅ **Auth Context** - Global authentication state management

### UI Components & Design System
- ✅ **Button Component** - Multiple variants (primary, secondary, outline, ghost, danger)
- ✅ **Input Component** - Form inputs with validation and error states
- ✅ **Loading Spinner** - Multiple sizes and colors
- ✅ **Error Boundary** - Graceful error handling
- ✅ **Toast System** - Success, error, warning, info notifications
- ✅ **Layout Components** - Header, Footer, Navigation
- ✅ **Cookie Consent** - GDPR-compliant cookie banner

### Legal Pages (COPPA Compliant)
- ✅ **Terms of Service** - Comprehensive terms with 18+ requirement
- ✅ **Privacy Policy** - COPPA compliant privacy policy
- ✅ **Community Guidelines** - Clear rules and expectations
- ✅ **Safety Tips** - Detailed safety information for parents
- ✅ **About Page** - Mission, values, and how it works
- ✅ **Contact Page** - Contact form with multiple subjects

### Pages
- ✅ **Homepage** - Marketing page with features, how it works, CTA
- ✅ **Sign Up Page** - Complete registration flow
- ✅ **Login Page** - Authentication page
- ✅ **Reset Password Page** - Password recovery flow
- ✅ **Email Verification Page** - Verification reminder with resend
- ✅ **Feed Page** - Protected placeholder for Sprint 2

### Security & Infrastructure
- ✅ **Firestore Security Rules** - Comprehensive auth-based rules
- ✅ **Age Verification Logic** - 18+ validation with helper functions
- ✅ **Email Verification Banner** - Prominent reminder for unverified users
- ✅ **Form Validation** - Client-side validation for all forms
- ✅ **Error Handling** - User-friendly error messages

### Testing & Data
- ✅ **E2E Test Suite** - Comprehensive Playwright tests
  - Signup flow tests
  - Login/logout tests
  - Age verification tests (18+ enforcement)
  - Protected routes tests
- ✅ **Test Helpers** - Reusable test utilities
- ✅ **Seed Data Script** - 10 test users with different scenarios
- ✅ **Test User Accounts** - Verified and unverified test accounts

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **Testing**: Playwright
- **Development**: Firebase Emulators

### Test Credentials (Sprint 1 Seed Data)

After running `npm run seed:sprint1`, use these accounts:

| Email | Password | Status | Scenario |
|-------|----------|--------|----------|
| verified.parent@test.com | Test123! | Verified | Active parent |
| unverified.parent@test.com | Test123! | Unverified | Needs verification |
| new.parent@test.com | Test123! | Verified | Recently joined |
| local.parent@test.com | Test123! | Verified | Local community |
| admin.test@test.com | Test123! | Verified | Admin account |

All users are 18+ with age verification and in different zip codes (10001-10003).

### Running Sprint 1

```bash
# Start Firebase emulators
npm run emulators:start

# In another terminal, seed Sprint 1 data
npm run seed:sprint1

# Start the development server
npm run dev:local

# Run Sprint 1 E2E tests
npm run test:e2e:local tests/e2e/sprint1
```

### What's Coming in Sprint 2
- Feed and Posts functionality
- Comments and Reactions
- User profiles
- Post creation and editing
- Local feed filtering by zip code

## ✅ Sprint 4: Completed Features

Sprint 4 introduces real-time messaging and comprehensive safety features to enable secure parent-to-parent communication.

### Messaging System
- ✅ **Conversations List** - View all conversations with unread counts and timestamps
- ✅ **Message Thread** - Real-time 1-on-1 messaging with auto-scroll
- ✅ **Text Messages** - Send and receive text messages instantly
- ✅ **Image Sharing** - Upload and share images in conversations
- ✅ **Read Receipts** - Track which messages have been read
- ✅ **Unread Counts** - Badge indicators for unread messages per conversation
- ✅ **Mute Conversations** - Silence notifications from specific conversations
- ✅ **Message Timestamps** - Smart timestamp formatting (time, yesterday, day of week, date)
- ✅ **Real-time Updates** - Live message delivery and conversation updates
- ✅ **Connection Verification** - Only connected parents can message each other

### Safety & Moderation
- ✅ **Report User** - Report inappropriate behavior with detailed reasons
- ✅ **Report Reasons** - Spam, harassment, inappropriate content, fake profile, safety concern, other
- ✅ **Block User** - Prevent unwanted users from messaging you
- ✅ **Bidirectional Blocking** - Blocks work in both directions
- ✅ **Content Filtering** - Automatic profanity detection and filtering
- ✅ **Spam Detection** - Identify and prevent spam messages
- ✅ **Report Management** - Admin dashboard for reviewing reports (pending/reviewed/resolved)
- ✅ **Blocked Users List** - View and manage blocked users
- ✅ **Message Validation** - Content length and format validation

### Privacy Controls
- ✅ **Message Deletion** - Soft delete messages (marked as deleted, not removed)
- ✅ **Conversation Muting** - Mute notifications without blocking
- ✅ **Participant Verification** - Security rules ensure only participants can access messages
- ✅ **Connection-based Messaging** - Requires accepted connection to message

### Security & Infrastructure
- ✅ **Firestore Security Rules** - Comprehensive rules for conversations, messages, reports, blocks
- ✅ **Participant-based Access** - Only conversation participants can read/write messages
- ✅ **Image Upload Security** - Validated image uploads to Firebase Storage
- ✅ **Real-time Subscriptions** - Secure real-time listeners with proper auth checks
- ✅ **Age & Email Verification** - Messaging requires verified email and 18+ age

### Testing & Data
- ✅ **E2E Test Suite** - 11 comprehensive Playwright tests
  - Navigate to messages page
  - Empty state handling
  - Start conversation
  - Send/receive text messages
  - Real-time message display
  - Connection verification (non-connected cannot message)
  - Report user functionality
  - Block user functionality
  - Blocked users cannot message
  - Mute conversation
  - Unread count display
- ✅ **Seed Data Script** - Sprint 4 test data
  - 3 sample conversations
  - 10 messages across conversations
  - 2 sample reports
  - 1 blocked user relationship

### Running Sprint 4

```bash
# Start Firebase emulators
npm run emulators:start

# In another terminal, seed Sprint 4 data
npm run seed:sprint4

# Start the development server
npm run dev:local

# Run Sprint 4 E2E tests
npm run test:e2e:local tests/e2e/sprint4
```

### Sprint 4 Features in Action

**Messaging Flow:**
1. Navigate to `/messages` to view conversations
2. Click a conversation to open the message thread
3. Send text messages or upload images
4. Messages appear in real-time for both users
5. Unread counts update automatically
6. Timestamps show relative time (5 min ago, Yesterday, etc.)

**Safety Features:**
1. Click the menu (⋮) in a conversation
2. Options: Mute conversation, Report user, Block user
3. Report modal with reason selection and description
4. Block confirmation prevents all future messaging
5. Blocked users see error when attempting to message

**Privacy Controls:**
1. Mute conversations to stop notifications
2. Delete messages (soft delete - shows "Message deleted")
3. Only connected users can start conversations
4. Blocked users cannot message in either direction

## ✅ Sprint 5: Completed Features

Sprint 5 introduces a community calendar system with event creation, RSVP functionality, and comprehensive safety features for in-person meetups.

### Calendar System
- ✅ **Interactive Calendar** - Month, week, and day views using react-calendar
- ✅ **Event Markers** - Visual indicators on dates with scheduled events
- ✅ **Multiple View Modes** - Toggle between calendar view and list view
- ✅ **Date Navigation** - Click dates to see events for that day
- ✅ **Real-time Updates** - Live event updates via Firebase subscriptions
- ✅ **Event Filtering** - Filter by My Events, My RSVPs, Nearby (zip code), Age Range
- ✅ **Create Event Button** - Quick access to event creation
- ✅ **Event Cards** - Display title, date, time, location, organizer, attendee count

### Event Management
- ✅ **Event Creation** - Comprehensive form with validation
- ✅ **Event Details Page** - Full event information display
- ✅ **Event Editing** - Organizers can edit upcoming events
- ✅ **Event Cancellation** - Organizers can cancel events with reason
- ✅ **RSVP System** - Users can RSVP to events
- ✅ **Cancel RSVP** - Users can cancel their attendance
- ✅ **Attendee List** - View all confirmed attendees
- ✅ **Capacity Management** - Optional max attendees with full event indicators
- ✅ **Age Range Selection** - Multiple age range options (0-2, 3-5, 6-8, 9-12, 13+, all-ages)
- ✅ **Event Status** - Upcoming, Ongoing, Completed, Cancelled states
- ✅ **Image Upload** - Optional event images
- ✅ **Location Details** - Address with Google Maps integration
- ✅ **Event Comments** - Discussion on event pages

### Safety Features
- ✅ **Safety Tips Component** - Displayed on event creation and details
- ✅ **Public Place Requirement** - Checkbox required for event creation
- ✅ **Safety Notes** - Optional field for organizer safety instructions
- ✅ **Liability Disclaimer** - Required checkbox before creating events
- ✅ **Safety Recommendations** - Meet in public places, daylight hours, inform others
- ✅ **Emergency Contacts Reminder** - What to bring and safety checklist
- ✅ **Report Event** - Users can report inappropriate events
- ✅ **Content Validation** - Title, description, location validation

### Event Features
- ✅ **Date & Time Pickers** - User-friendly date and time selection
- ✅ **Past Event Prevention** - Cannot create events in the past
- ✅ **Time Validation** - End time must be after start time
- ✅ **Max Attendees** - Optional capacity limits
- ✅ **Full Event Indicators** - Clear display when event is at capacity
- ✅ **Zip Code Integration** - Events tied to organizer's location
- ✅ **Nearby Events Filter** - Find events in your area
- ✅ **My Events** - View events you've created
- ✅ **My RSVPs** - View events you're attending

### Security & Infrastructure
- ✅ **Firestore Security Rules** - Events and eventComments collections
- ✅ **Organizer Verification** - Only event creator can edit/cancel
- ✅ **Email & Age Verification** - Required for event creation
- ✅ **Field Validation** - Title (min 3), description (min 10), location (min 3), zip code (5 digits)
- ✅ **RSVP Permissions** - Email verified users only
- ✅ **Comment Permissions** - Authenticated users can comment
- ✅ **Image Upload Security** - Validated uploads to Firebase Storage

### Testing & Data
- ✅ **E2E Test Suite** - 12 comprehensive Playwright tests
  - Navigate to calendar page
  - Navigate to create event page
  - Create event
  - Display event on calendar
  - RSVP to event
  - Cancel RSVP
  - Show attendee count correctly
  - Event creator can edit
  - Event creator can cancel
  - Prevent RSVP to cancelled events
  - Filter events by age range
  - Add comment to event
- ✅ **Seed Data Script** - Sprint 5 test data
  - 14 diverse events (past, ongoing, upcoming, cancelled)
  - Events across different zip codes
  - Various age ranges and capacities
  - Events at max capacity
  - Events with no RSVPs
  - 10 event comments

### Running Sprint 5

```bash
# Start Firebase emulators
npm run emulators:start

# In another terminal, seed Sprint 5 data
npm run seed:sprint5

# Start the development server
npm run dev:local

# Run Sprint 5 E2E tests
npm run test:e2e:local tests/e2e/sprint5
```

### Sprint 5 Features in Action

**Creating an Event:**
1. Navigate to `/calendar` and click "Create Event"
2. Fill in event details: title, description, location, zip code
3. Select start and end date/time
4. Choose age ranges for attendees
5. Add optional max attendees and safety notes
6. Check required public place checkbox
7. Read safety tips and accept liability disclaimer
8. Upload optional event image
9. Submit to create event

**RSVP Flow:**
1. Browse calendar or list view for events
2. Click event card to view details
3. Review event information, safety notes, attendee count
4. Click "RSVP" button
5. Confirmation toast and attendee count updates
6. "Cancel RSVP" button appears
7. Event appears in "My RSVPs" filter

**Event Management:**
1. View your created events with "My Events" filter
2. Click event to view details
3. Edit button available for upcoming events
4. Update event details and save
5. Cancel event with reason if needed
6. All attendees see cancellation notice

**Calendar Features:**
1. Toggle between Month, Week, Day views
2. Events marked with blue dots on calendar
3. Click date to see all events that day
4. Toggle to List view for detailed event cards
5. Apply filters: My Events, My RSVPs, Nearby, Age Ranges
6. Real-time updates when events are created/modified

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**
- **Firebase CLI** (installed automatically with npm install)

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/abhie1singh/zipparents-v1.git
cd zipparents-v1
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# For local development (already created)
# The .env.local file is already configured for Firebase emulators

# For dev environment (create from template)
cp .env.dev.example .env.dev
# Edit .env.dev and add your Firebase dev project credentials

# For production (create from template)
cp .env.prod.example .env.prod
# Edit .env.prod and add your Firebase production project credentials
```

## 🔥 Firebase Setup

### Local Development (Firebase Emulators)

For local development, we use Firebase emulators. No Firebase project setup is required!

1. **Start Firebase emulators**

```bash
npm run emulators:start
```

This will start:
- Auth Emulator on http://localhost:9099
- Firestore Emulator on http://localhost:8080
- Storage Emulator on http://localhost:9199
- Emulator UI on http://localhost:4000

2. **In a separate terminal, start the Next.js dev server**

```bash
npm run dev:local
```

Visit http://localhost:3000 to see your application.

### Development Environment Setup

1. **Create a Firebase project**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Add project"
- Name it `zipparents-dev`
- Enable Google Analytics (optional)

2. **Enable Firebase services**

- **Authentication**: Enable Email/Password provider
- **Firestore**: Create database in production mode
- **Storage**: Set up Firebase Storage

3. **Get Firebase configuration**

- Go to Project Settings > General
- Scroll down to "Your apps"
- Click on the Web app icon (</>) or "Add app"
- Copy the configuration object

4. **Update .env.dev file**

```env
NEXT_PUBLIC_FIREBASE_ENV=dev
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-dev-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-dev-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-dev-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_dev_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_dev_app_id
```

5. **Set up Service Account (for server-side operations)**

- Go to Project Settings > Service Accounts
- Click "Generate new private key"
- Download the JSON file
- Convert to single-line string and add to .env.dev:

```bash
# On Mac/Linux:
cat path/to/serviceAccountKey.json | jq -c '.' | pbcopy

# Then paste in .env.dev:
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

6. **Deploy Firestore rules and indexes**

```bash
firebase deploy --only firestore:rules,firestore:indexes --project your-dev-project-id
```

7. **Deploy Storage rules**

```bash
firebase deploy --only storage:rules --project your-dev-project-id
```

### Production Environment Setup

Follow the same steps as Development Environment, but:
- Name the project `zipparents-prod`
- Use .env.prod file
- Be extra careful with production credentials

## 🚀 Development

### Running the application

```bash
# Local development (with Firebase emulators)
npm run dev:local

# Development environment (uses Firebase dev project)
npm run dev:dev

# Production environment (uses Firebase production project)
npm run dev:prod

# Default (same as dev:local)
npm run dev
```

### Building for production

```bash
# Build for dev environment
npm run build:dev

# Build for production environment
npm run build:prod

# Start production server
npm run start
```

### Code quality

```bash
# Run ESLint
npm run lint

# Type checking
npm run type-check
```

## 🧪 Testing

### End-to-End Tests (Playwright)

```bash
# Run all tests against local environment
npm run test:e2e:local

# Run Sprint 1 tests only
npm run test:e2e:local tests/e2e/sprint1

# Run specific test file
npm run test:e2e:local tests/e2e/sprint1/signup.spec.ts

# Run tests against dev environment
npm run test:e2e:dev

# Run tests against production environment
npm run test:e2e:prod

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Test Coverage by Sprint

**Sprint 1 Tests** (`tests/e2e/sprint1/`)
- **Signup Flow** (`signup.spec.ts`)
  - Form validation
  - Email format validation
  - Password requirements
  - Terms acceptance requirement
  - Successful signup flow
  - Duplicate email handling

- **Login Flow** (`login.spec.ts`)
  - Form validation
  - Invalid credentials handling
  - Successful login with verified user
  - Unverified user redirect to verification
  - Logout functionality

- **Age Verification** (`age-verification.spec.ts`)
  - Under 18 rejection (COPPA compliance)
  - Exactly 18 years old acceptance
  - Over 18 acceptance
  - Age verification display
  - Max date validation

- **Protected Routes** (`protected-routes.spec.ts`)
  - Redirect to login when unauthenticated
  - Access granted when authenticated
  - Unverified users redirect to verification
  - Auth persistence across navigation

**Sprint 4 Tests** (`tests/e2e/sprint4/`)
- **Messaging** (`messaging.spec.ts`)
  - Navigate to messages page
  - Empty state display
  - Start conversation between connected users
  - Send and receive text messages
  - Real-time message display
  - Non-connected users cannot message
  - Report user functionality
  - Block user functionality
  - Blocked users cannot message each other
  - Mute conversation
  - Unread message count display

**Sprint 5 Tests** (`tests/e2e/sprint5/`)
- **Events & Calendar** (`events.spec.ts`)
  - Navigate to calendar page
  - Navigate to create event page
  - Create event with full form
  - Display event on calendar with marker
  - RSVP to event
  - Cancel RSVP
  - Show attendee count correctly
  - Event creator can edit event
  - Event creator can cancel event
  - Prevent RSVP to cancelled event
  - Filter events by age range
  - Add comment to event

### Writing Tests

Tests are located in the `tests/` directory:

- `tests/e2e/` - End-to-end tests
- `tests/fixtures/` - Test fixtures (auth, etc.)
- `tests/helpers/` - Helper functions for tests
- `tests/data/` - Test data factories

Example test:

```typescript
import { test, expect } from '@playwright/test';

test('user can create a post', async ({ page }) => {
  await page.goto('/');
  // ... test code
});
```

## 🌱 Seeding Data

### Local Environment

```bash
# Seed Sprint 1 test users (10 users with different scenarios)
npm run seed:sprint1

# Seed Sprint 2 test data (profiles for existing users)
npm run seed:sprint2

# Seed Sprint 4 test data (conversations, messages, reports, blocks)
npm run seed:sprint4

# Seed Sprint 5 test data (events, event comments)
npm run seed:sprint5

# Seed users only (general seeding - future sprints)
npm run seed:users

# Seed comprehensive test data (users, posts, groups, events, etc. - future sprints)
npm run seed:data

# Alternative (same as seed:data)
npm run seed:local

# Clear all data from local emulators
npm run clear-data:local
```

### Development Environment

```bash
# Seed users to dev Firebase project
npm run seed:users:dev

# Seed comprehensive test data to dev Firebase project
npm run seed:data:dev

# Alternative (same as seed:data:dev)
npm run seed:dev

# Clear data from dev Firebase project (requires --force flag)
npm run clear-data:dev -- --force
```

### Sprint 1 Test Accounts

```bash
# Seed Sprint 1 test users
npm run seed:sprint1
```

After seeding, these accounts are available:

| Email | Password | Role | Email Verified | Scenario |
|-------|----------|------|----------------|----------|
| verified.parent@test.com | Test123! | User | Yes | Active parent |
| unverified.parent@test.com | Test123! | User | No | Needs verification |
| new.parent@test.com | Test123! | User | Yes | Recently joined |
| local.parent@test.com | Test123! | User | Yes | Local community |
| young.parent@test.com | Test123! | User | Yes | Younger parent (25) |
| experienced.parent@test.com | Test123! | User | Yes | Experienced parent |
| single.parent@test.com | Test123! | User | Yes | Single parent |
| working.parent@test.com | Test123! | User | Yes | Working parent |
| stayathome.parent@test.com | Test123! | User | Yes | Stay-at-home parent |
| admin.test@test.com | Test123! | Admin | Yes | Admin account |

## 📁 Project Structure

```
zipparents-v1/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── config/                   # Configuration files
│   ├── firebase.local.ts    # Local (emulator) config
│   ├── firebase.dev.ts      # Development config
│   └── firebase.prod.ts     # Production config
├── lib/                      # Shared libraries
│   ├── firebase/
│   │   ├── clientApp.ts     # Firebase client SDK setup
│   │   └── adminApp.ts      # Firebase Admin SDK setup
│   └── env.ts               # Environment utilities
├── scripts/                  # Utility scripts
│   ├── seed/
│   │   ├── seed-users.ts    # User seeding script
│   │   ├── seed-test-data.ts # Full data seeding
│   │   └── clear-data.ts    # Data cleanup script
│   └── run-script.sh        # Script runner
├── tests/                    # Test files
│   ├── e2e/                 # End-to-end tests
│   ├── fixtures/            # Test fixtures
│   ├── helpers/             # Test helpers
│   └── data/                # Test data factories
├── .env.local               # Local environment variables
├── .env.dev.example         # Dev environment template
├── .env.prod.example        # Prod environment template
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── storage.rules            # Storage security rules
├── playwright.config.ts     # Playwright configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🔐 Environment Configuration

The project supports three environments:

### Local (Emulators)
- Uses Firebase emulators
- No Firebase project required
- Perfect for development and testing
- Data persists between restarts (if exported)

### Development (Dev Firebase Project)
- Uses real Firebase project
- For testing in cloud environment
- Share with team members
- Can seed with test data

### Production (Prod Firebase Project)
- Uses production Firebase project
- Real user data
- Should NOT seed test data
- Extra safety checks in scripts

## 🔄 Firebase Emulator Data Management

### Export emulator data

```bash
npm run emulators:export
```

This saves the current emulator data to `./firebase-emulator-data`

### Import emulator data

```bash
npm run emulators:import
```

This starts emulators with previously exported data.

### Auto-export on exit

The `emulators:start` script automatically exports data when you stop the emulators (Ctrl+C).

## 🐛 Troubleshooting

### Firebase Emulators won't start

**Problem**: Port already in use

**Solution**:
```bash
# Find and kill process on port 8080 (Firestore)
lsof -ti:8080 | xargs kill -9

# Or use different ports in firebase.json
```

### "Firebase not initialized" error

**Problem**: Firebase not properly initialized

**Solution**:
1. Check that environment variables are set correctly
2. Verify NEXT_PUBLIC_FIREBASE_ENV matches your environment
3. Restart the dev server

### Seeding fails with authentication error

**Problem**: Missing or invalid service account credentials

**Solution**:
1. For local: Ensure emulators are running first
2. For dev/prod: Check FIREBASE_SERVICE_ACCOUNT_KEY in .env file
3. Verify the service account has proper permissions

### Tests fail to connect to emulators

**Problem**: Emulators not running or wrong ports

**Solution**:
```bash
# Start emulators first
npm run emulators:start

# In another terminal, run tests
npm run test:e2e:local
```

### Build fails with TypeScript errors

**Problem**: Type errors in code

**Solution**:
```bash
# Check types
npm run type-check

# Fix errors and rebuild
npm run build
```

### Permission denied when running scripts

**Problem**: Script files not executable

**Solution**:
```bash
chmod +x scripts/run-script.sh
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Create a pull request

## 📄 License

ISC

## 👥 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Happy coding! 🚀**
