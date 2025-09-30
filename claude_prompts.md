# ZipParents.com - Development Guide for Claude CLI

## SETUP INSTRUCTIONS FOR CLAUDE CLI

### Initial Setup:

1. Create a `.claude/` directory in your project root
2. Create a `system_directive.md` file with the content below
3. Claude CLI will automatically use this as context for all interactions

### File: `.claude/system_directive.md`

```markdown
# ZipParents.com Development Context

You are an expert full-stack developer building ZipParents.com, a platform for parents to connect locally based on zip codes and children's ages.

## Tech Stack:

- Next.js 14+ (App Router)
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- TypeScript
- Firebase Emulators (local development)
- Playwright (E2E testing)

## Environment Strategy:

- **Local**: Firebase Emulators for development
- **Dev**: Firebase project for testing (zipparents-dev)
- **Prod**: Firebase project for production (zipparents-prod)

## Testing Requirements:

- E2E tests using Playwright at end of each sprint
- Functional tests for critical user flows
- Browser-based tests (Chrome, Firefox, Safari)
- Test data seeding scripts for all environments
- Minimum 80% coverage for critical paths

## Legal & Safety First Priority:

1. Never store children's personal information directly
2. Require parental verification (18+ only)
3. Implement comprehensive Terms of Service and Privacy Policy
4. Add content moderation capabilities
5. Include reporting mechanisms
6. Age-gate all features
7. COPPA compliance (no direct child data collection)
8. Clear liability disclaimers
9. Photo upload guidelines and restrictions
10. Background check recommendations (not requirements)

## Development Principles:

- Write production-ready, clean, maintainable code
- Include comprehensive error handling
- Implement proper TypeScript types
- Follow Next.js and Firebase best practices
- Create responsive, mobile-first designs
- Include loading states and user feedback
- Write inline comments for complex logic
- Consider edge cases and security vulnerabilities
- Use environment variables for sensitive data
- Follow accessibility standards (WCAG 2.1)
- Optimize images and assets
- Implement proper caching strategies
- Write tests alongside features
- Create seed data scripts for testing

## Code Standards:

- TypeScript exclusively
- Proper form validation
- Rate limiting where needed
- Secure all API routes
- No external paid dependencies (use Firebase free tier)
- Complete implementations (no placeholders)
- Mobile-first responsive design
- Test coverage for all critical flows
- Environment-specific configurations

## File Structure:

- `/scripts/seed-*.ts` - Data seeding scripts
- `/tests/e2e/` - Playwright E2E tests
- `/.env.local` - Local environment variables
- `/.env.dev` - Dev environment variables
- `/.env.prod` - Production environment variables
- `/firebase.json` - Firebase configuration
- `/firestore.rules` - Firestore security rules
- `/storage.rules` - Storage security rules
```

---

## PROJECT INITIALIZATION

### What to Ask Claude CLI First:

```
Project Initialization

Please set up the complete project structure with:

1. Initialize Next.js 14 project with TypeScript and Tailwind CSS
   - Configure for App Router
   - Set up path aliases (@/ for src)
   - Configure Tailwind with parent-friendly theme

2. Set up Firebase projects and emulators:
   - Create three Firebase config files (local, dev, prod)
   - Install Firebase tools and emulators
   - Configure firebase.json for emulators
   - Set up Auth, Firestore, and Storage emulators
   - Create initial Firestore security rules
   - Create initial Storage security rules

3. Set up environment configuration:
   - Create .env.local (for Firebase emulators)
   - Create .env.dev.example (template for dev)
   - Create .env.prod.example (template for prod)
   - Create environment switching utility
   - Add .env files to .gitignore

4. Install and configure Playwright:
   - Install Playwright with all browsers
   - Configure playwright.config.ts for three environments
   - Create test helpers and utilities
   - Set up test data factories
   - Create base test fixtures

5. Create seed data infrastructure:
   - Create seed data scripts structure
   - Implement seed-users.ts
   - Implement seed-test-data.ts
   - Create clear-data.ts script
   - Add npm scripts for seeding

6. Set up project scripts in package.json:
   - dev:local (with emulators)
   - dev:dev (pointing to dev Firebase)
   - dev:prod (pointing to prod Firebase)
   - build:dev
   - build:prod
   - test:e2e:local
   - test:e2e:dev
   - seed:local
   - seed:dev
   - emulators:start
   - emulators:export (save data)
   - emulators:import (load data)

7. Create comprehensive README.md with:
   - Prerequisites and installation
   - Firebase setup instructions
   - Running locally with emulators
   - Deploying to dev environment
   - Deploying to prod environment
   - Running tests
   - Seeding test data
   - Troubleshooting guide

Please provide complete setup with all configuration files.
```

---

## SPRINT 1: Project Setup & Legal Foundation

### Sprint Goal:

Set up the Next.js project with Firebase, create legal pages, and establish basic authentication with age verification.

### What to Ask Claude CLI:

```
Sprint 1: Project Setup & Legal Foundation

Please help me complete the following tasks:

1. Create authentication infrastructure:
   - Sign-up flow with age verification (18+ check)
   - Login/logout functionality
   - Password reset flow
   - Protected routes middleware
   - User context/provider
   - Email verification requirement
   - Auth utilities and helpers

2. Create legal pages (all COPPA compliant):
   - Terms of Service page (/terms)
   - Privacy Policy page (/privacy)
   - Community Guidelines page (/guidelines)
   - Safety Tips page (/safety)
   - Cookie Consent banner component
   - About page (/about)
   - Contact page (/contact)

3. Create basic layout:
   - Responsive navigation header with auth state
   - Footer with legal links
   - Homepage with value proposition
   - Loading states and error boundaries
   - Toast notification system

4. Update Firestore security rules for auth

5. Create seed data for Sprint 1:
   - Script to create 10 test users with verified emails
   - Different age verification statuses
   - Update scripts/seed-users.ts

6. Create E2E tests for Sprint 1:
   - Test: User can sign up with age verification
   - Test: User under 18 cannot sign up
   - Test: User can login and logout
   - Test: User can reset password
   - Test: Protected routes redirect to login
   - Test: Email verification flow
   - Place tests in /tests/e2e/sprint1/

7. Update README.md:
   - Add Sprint 1 features documentation
   - Add test running instructions for Sprint 1

Please provide complete code for all components, tests, and documentation.
```

---

## SPRINT 2: User Profile & Parent Verification

### Sprint Goal:

Create user profiles with parent-specific information and implement profile verification.

### What to Ask Claude CLI:

```
Sprint 2: User Profile & Parent Verification

Building on Sprint 1, please implement:

1. Profile data model and pages:
   - Firestore schema for user profiles
   - Multi-step onboarding form
   - Profile view page (/profile/[userId])
   - Profile edit page (/profile/edit)
   - Verification request form
   - Photo upload with Firebase Storage

2. Profile features:
   - Zip code validation (US only)
   - Age range selection (no exact birthdates)
   - Interests/hobbies multi-select
   - Privacy settings
   - Verification badge component
   - Profile completion indicator

3. Update Firestore and Storage security rules

4. Create seed data for Sprint 2:
   - Script to create complete profiles for test users
   - Various zip codes across US
   - Different verification statuses
   - Profile photos (placeholder images)
   - Update scripts/seed-profiles.ts

5. Create E2E tests for Sprint 2:
   - Test: User can complete onboarding
   - Test: User can edit profile
   - Test: Zip code validation works
   - Test: Photo upload works
   - Test: Privacy settings apply correctly
   - Test: Verification request submits
   - Test: Profile displays correctly for others
   - Place tests in /tests/e2e/sprint2/

6. Update README.md with Sprint 2 features

Provide complete implementation with tests and seed scripts.
```

---

## SPRINT 3: Zip Code Matching & Parent Discovery

### Sprint Goal:

Implement core feature of finding nearby parents based on zip code and age ranges.

### What to Ask Claude CLI:

```
Sprint 3: Zip Code Matching & Parent Discovery

Please implement:

1. Zip code and search functionality:
   - Zip code proximity calculation utility
   - Search service with filters
   - Search page (/search)
   - Advanced filters component
   - Parent card component
   - Search results with pagination

2. Connection system:
   - Connection request data model
   - Send connection request
   - Accept/decline connections
   - Connections list page (/connections)
   - Connection status badges
   - In-app notifications for connections

3. Firestore indexes and security rules for search and connections

4. Create seed data for Sprint 3:
   - Script to create connections between users
   - Various connection statuses
   - Users in multiple zip code clusters
   - Update scripts/seed-connections.ts

5. Create E2E tests for Sprint 3:
   - Test: User can search by zip code radius
   - Test: User can filter by age range
   - Test: User can filter by interests
   - Test: Search results show correct distance
   - Test: User can send connection request
   - Test: User can accept connection request
   - Test: User can decline connection request
   - Test: Connected users appear in connections list
   - Test: Search pagination works
   - Place tests in /tests/e2e/sprint3/

6. Update README.md with Sprint 3 features

Provide complete implementation with all tests.
```

---

## SPRINT 4: Messaging & Safety Features

### Sprint Goal:

Implement secure messaging with comprehensive safety and reporting features.

### What to Ask Claude CLI:

```
Sprint 4: Messaging & Safety Features

Please implement:

1. Messaging system:
   - Conversations and messages data model
   - Conversations list page (/messages)
   - Message thread page (/messages/[conversationId])
   - Real-time message updates
   - Message input with validation
   - Image sharing in messages
   - Read receipts and typing indicators
   - Message notifications

2. Safety and moderation features:
   - Report user/message form
   - Block user functionality
   - Blocked users list
   - Content filtering utility (profanity)
   - Report data model and storage
   - Report submission confirmation

3. Privacy controls:
   - Message settings page
   - Notification preferences
   - Conversation muting
   - Message deletion

4. Update Firestore security rules for messaging and safety

5. Create seed data for Sprint 4:
   - Script to create conversations between connected users
   - Various message types (text, images)
   - Sample blocked relationships
   - Sample reports
   - Update scripts/seed-messages.ts

6. Create E2E tests for Sprint 4:
   - Test: Connected users can message each other
   - Test: Non-connected users cannot message
   - Test: Messages appear in real-time
   - Test: User can send image in message
   - Test: User can block another user
   - Test: Blocked users cannot message
   - Test: User can report message
   - Test: User can report user profile
   - Test: Reported content is recorded
   - Test: User can mute conversation
   - Test: Message notifications work
   - Place tests in /tests/e2e/sprint4/

7. Update README.md with Sprint 4 features

Provide complete implementation with tests and security rules.
```

---

## SPRINT 5: Community Calendar & Events

### Sprint Goal:

Build shared community calendar for organizing playdates and events with safety guidelines.

### What to Ask Claude CLI:

```
Sprint 5: Community Calendar & Events

Please implement:

1. Event system:
   - Events data model
   - Event creation form (/events/create)
   - Event details page (/events/[eventId])
   - Event edit page (/events/[eventId]/edit)
   - RSVP functionality
   - Attendee list display
   - Event cancellation

2. Calendar interface:
   - Calendar page (/calendar)
   - Month/week/day views using react-calendar
   - Event display on calendar
   - My events filter
   - Nearby events filter
   - List view alternative

3. Safety features:
   - Safety tips component for events
   - Public place recommendations
   - Liability disclaimer on event creation
   - Event reporting
   - Comments on events
   - Event notifications

4. Update Firestore security rules for events

5. Create seed data for Sprint 5:
   - Script to create various events
   - Past, present, and future events
   - Different age ranges and locations
   - Events with different RSVP statuses
   - Update scripts/seed-events.ts

6. Create E2E tests for Sprint 5:
   - Test: User can create event
   - Test: Event appears on calendar
   - Test: User can RSVP to event
   - Test: User can cancel RSVP
   - Test: Attendee list updates correctly
   - Test: Event creator can edit event
   - Test: Event creator can cancel event
   - Test: Attendees notified of cancellation
   - Test: User can filter events by proximity
   - Test: User can report event
   - Test: Safety disclaimer is shown
   - Test: Calendar views (month/week/day) work
   - Place tests in /tests/e2e/sprint5/

7. Update README.md with Sprint 5 features

Provide complete implementation with tests.
```

---

## SPRINT 6: SEO Optimization & Public Pages

### Sprint Goal:

Optimize for search engines, create public landing pages, and implement structured data.

### What to Ask Claude CLI:

```
Sprint 6: SEO Optimization & Public Pages

Please implement:

1. Homepage optimization:
   - Compelling hero section
   - Features showcase
   - Benefits section
   - Testimonials component (structure for future)
   - FAQ section
   - CTA sections
   - Image optimization

2. SEO implementation:
   - Meta tags utility
   - Open Graph tags for all pages
   - Twitter Card tags
   - JSON-LD structured data
   - Generate sitemap.xml
   - Create robots.txt
   - Canonical URLs
   - Dynamic meta tags based on content

3. Public content pages:
   - How It Works page (/how-it-works)
   - Safety & Trust page (/safety-trust)
   - For Parents page (/for-parents)
   - FAQ page (/faq)
   - Blog listing page (/blog) - structure only
   - Local landing page template (/[city])

4. Performance optimization:
   - Implement next/image for all images
   - Lazy loading for below-fold content
   - Font optimization
   - Code splitting where appropriate
   - Service worker for offline functionality

5. Analytics setup:
   - Google Analytics 4 integration
   - Event tracking utilities
   - Conversion tracking
   - Page view tracking
   - Custom events for key actions

6. Create E2E tests for Sprint 6:
   - Test: All pages have proper meta tags
   - Test: Structured data validates
   - Test: Images load with next/image
   - Test: Sitemap.xml is accessible
   - Test: Robots.txt is accessible
   - Test: Analytics events fire correctly
   - Test: All public pages are accessible
   - Test: FAQ accordion works
   - Test: Page load performance (Lighthouse)
   - Place tests in /tests/e2e/sprint6/

7. Add SEO testing utilities:
   - Meta tag validator
   - Structured data validator
   - Performance testing helpers

8. Update README.md with Sprint 6 features and SEO testing

Provide complete implementation with SEO tests.
```

---

## SPRINT 7: Admin Panel & Content Moderation

### Sprint Goal:

Create admin panel for content moderation, user management, and platform monitoring.

### What to Ask Claude CLI:

```
Sprint 7: Admin Panel & Content Moderation

Please implement:

1. Admin authentication and layout:
   - Admin role in Firestore
   - Admin middleware for route protection
   - Admin dashboard layout (/admin)
   - Admin navigation
   - Admin-only security rules

2. User management:
   - User list page (/admin/users)
   - User search and filters
   - User detail page (/admin/users/[userId])
   - Suspend/unsuspend user
   - Ban/unban user
   - Verify user manually
   - User activity logs

3. Content moderation:
   - Reports queue (/admin/reports)
   - Report detail page (/admin/reports/[reportId])
   - Review reported messages
   - Review reported events
   - Review reported profiles
   - Action buttons (dismiss, warn, remove)
   - Moderation action logging

4. Event moderation:
   - Flagged events list (/admin/events)
   - Event details with moderation options
   - Cancel event with notification
   - Contact event creator

5. Platform monitoring:
   - Dashboard with metrics (/admin/dashboard)
   - Active users chart
   - Events created/attended
   - Messages sent
   - Reports received
   - Data export functionality

6. Update Firestore security rules for admin

7. Create seed data for Sprint 7:
   - Script to create admin user
   - Sample reports across all types
   - Moderation action logs
   - Update scripts/seed-admin.ts

8. Create E2E tests for Sprint 7:
   - Test: Non-admin cannot access admin panel
   - Test: Admin can view user list
   - Test: Admin can suspend user
   - Test: Suspended user cannot login
   - Test: Admin can verify user manually
   - Test: Admin can view reports queue
   - Test: Admin can dismiss report
   - Test: Admin can remove reported content
   - Test: Admin can ban user
   - Test: Admin can view platform metrics
   - Test: Moderation actions are logged
   - Place tests in /tests/e2e/sprint7/

9. Update README.md with admin panel documentation

Provide complete admin implementation with tests.
```

---

## SPRINT 8: Testing, Polish & Launch Prep

### Sprint Goal:

Comprehensive testing, bug fixes, UX improvements, and production deployment preparation.

### What to Ask Claude CLI:

```
Sprint 8: Final Polish, Testing & Launch Preparation

Please implement:

1. Comprehensive E2E test suite:
   - Critical user journey tests (signup -> profile -> search -> message -> event)
   - Cross-browser tests (Chrome, Firefox, Safari)
   - Mobile responsive tests
   - Accessibility tests with axe
   - Performance tests with Lighthouse
   - Load time tests
   - Create /tests/e2e/critical-flows/

2. Security audit implementation:
   - Security rules testing suite
   - Test unauthorized access attempts
   - Test rate limiting
   - Test XSS prevention
   - Test CSRF protection
   - API route security tests
   - Create /tests/security/

3. UX improvements:
   - Loading skeletons for all pages
   - Empty state components
   - Improved error messages with recovery actions
   - Success confirmations
   - Tooltips for complex features
   - Keyboard navigation
   - Focus management

4. Accessibility audit:
   - ARIA labels on all interactive elements
   - Keyboard navigation testing
   - Screen reader testing checklist
   - Color contrast verification
   - Focus indicators
   - Alt text for all images

5. Performance optimization:
   - Bundle analysis and optimization
   - Remove unused dependencies
   - Optimize Firestore queries
   - Implement proper caching
   - CDN configuration
   - Image optimization audit

6. Documentation completion:
   - User guide (/help)
   - Admin guide in README
   - API documentation (internal)
   - Deployment runbook
   - Incident response guide
   - Backup and recovery procedures

7. Deployment preparation:
   - Production environment variables checklist
   - Firebase production configuration
   - Domain setup instructions
   - SSL certificate setup
   - Email configuration (SendGrid/similar)
   - Monitoring setup (error tracking)
   - Analytics verification

8. Create deployment scripts:
   - deploy-dev.sh
   - deploy-prod.sh
   - rollback-prod.sh
   - Pre-deployment checklist script

9. Update README.md with:
   - Complete testing guide
   - Deployment procedures
   - Monitoring and maintenance
   - Troubleshooting guide
   - Post-launch checklist

Provide all tests, scripts, and documentation.
```

---

## COMPREHENSIVE README TEMPLATE

### What to Ask Claude CLI:

```
README Generation

Please create a comprehensive README.md with the following sections:

1. Project Overview
   - What is ZipParents.com
   - Features list
   - Tech stack

2. Prerequisites
   - Node.js version
   - Firebase CLI
   - Git
   - Playwright

3. Installation
   - Clone repository
   - Install dependencies
   - Firebase setup (creating projects)
   - Environment variables setup

4. Firebase Configuration
   - Creating firebase projects (dev and prod)
   - Enabling services (Auth, Firestore, Storage)
   - Setting up Firebase CLI
   - Downloading service account keys

5. Running Locally
   - Starting Firebase emulators
   - Starting Next.js dev server
   - Accessing the application
   - Stopping emulators
   - Exporting/importing emulator data

6. Seeding Test Data
   - Seed all data: npm run seed:local
   - Seed specific data: npm run seed:users:local
   - Clear all data: npm run clear:local
   - Seed data for dev: npm run seed:dev
   - Available test accounts (credentials)

7. Running Tests
   - E2E tests locally: npm run test:e2e:local
   - E2E tests on dev: npm run test:e2e:dev
   - Run specific test suite
   - Run in headed mode (see browser)
   - Generate test report
   - Debug tests

8. Development Workflow
   - Feature branch strategy
   - Testing before commit
   - Code review process
   - Merging to main

9. Deploying to Dev Environment
   - Build for dev: npm run build:dev
   - Deploy to Firebase: npm run deploy:dev
   - Verify deployment
   - Run smoke tests

10. Deploying to Production
    - Pre-deployment checklist
    - Build for production: npm run build:prod
    - Deploy to Firebase: npm run deploy:prod
    - Post-deployment verification
    - Rollback procedure

11. Environment Variables Reference
    - Table of all environment variables
    - Where to find values
    - Security notes

12. Project Structure
    - Directory tree with descriptions
    - Key files and their purposes

13. Testing Strategy
    - Test types (E2E, integration, unit)
    - Coverage requirements
    - Test data management

14. Security
    - Firestore security rules
    - Storage security rules
    - API security
    - Rate limiting

15. Monitoring and Maintenance
    - Daily tasks (moderation queue)
    - Weekly tasks (review reports)
    - Monthly tasks (analytics review)
    - Error monitoring
    - Performance monitoring

16. Troubleshooting
    - Common issues and solutions
    - Firebase emulator issues
    - Build issues
    - Deployment issues
    - Test failures

17. Contributing
    - Code style guide
    - Commit message format
    - Pull request process

18. License and Legal
    - MIT License
    - Legal considerations

Provide complete README.md file.
```

---

## TESTING UTILITIES AND HELPERS

### What to Ask Claude CLI:

```
Testing Infrastructure

Please create comprehensive testing utilities:

1. Test fixtures (/tests/fixtures/):
   - User fixtures (various user types)
   - Profile fixtures
   - Event fixtures
   - Message fixtures
   - Admin fixtures

2. Test helpers (/tests/helpers/):
   - Authentication helper (login, signup, logout)
   - Navigation helper (common navigation flows)
   - Form helper (fill forms, submit)
   - Wait helper (wait for elements, conditions)
   - Screenshot helper (on failure)
   - Database helper (check Firestore state)

3. Test utilities (/tests/utils/):
   - Random data generators
   - Date utilities
   - Zip code test data
   - Email generators
   - Image upload helpers

4. Page object models (/tests/pages/):
   - LoginPage
   - SignupPage
   - ProfilePage
   - SearchPage
   - MessagesPage
   - EventsPage
   - AdminPage

5. Test configuration:
   - Base playwright config
   - Local environment config
   - Dev environment config
   - Prod environment config (read-only tests)

6. Test data factories:
   - User factory
   - Profile factory
   - Event factory
   - Message factory

Provide all testing infrastructure files.
```

---

## SEED DATA SCRIPTS

### What to Ask Claude CLI:

```
Seed Data Scripts

Please create comprehensive seed data scripts in /scripts/:

1. scripts/seed-all.ts
   - Master script that runs all seed scripts
   - Command line arguments for environment
   - Progress logging

2. scripts/seed-users.ts
   - Create 50 test users
   - Various ages, locations
   - Different verification statuses
   - Realistic names and emails
   - Save credentials to seed-credentials.json

3. scripts/seed-profiles.ts
   - Complete profiles for all seeded users
   - Various zip codes across US (clusters)
   - Different interests
   - Age ranges
   - Profile photos (placeholder URLs)

4. scripts/seed-connections.ts
   - Create connections between users
   - Accepted, pending, declined statuses
   - Realistic connection patterns

5. scripts/seed-messages.ts
   - Create conversations between connected users
   - Various message types
   - Recent and old messages
   - Realistic conversation patterns

6. scripts/seed-events.ts
   - Create 100+ events
   - Past, current, and future events
   - Various locations (based on user zip codes)
   - Different age ranges
   - Some with RSVPs

7. scripts/seed-reports.ts
   - Sample reports for testing moderation
   - Different report types
   - Various statuses

8. scripts/seed-admin.ts
   - Create admin user
   - Set admin role in Firestore
   - Save admin credentials

9. scripts/clear-all.ts
   - Clear all collections
   - Reset emulator data
   - Confirmation prompt

10. scripts/utils/firebase-admin.ts
    - Initialize Firebase Admin SDK
    - Environment-specific initialization
    - Helper functions for seeding

Each script should:
- Accept environment argument (local, dev, prod)
- Have progress logging
- Be idempotent (can run multiple times)
- Handle errors gracefully
- Be runnable individually

Also create npm scripts in package.json for all seed operations.

Provide all seed scripts with utilities.
```

---

## DEPLOYMENT SCRIPTS AND CONFIGURATION

### What to Ask Claude CLI:

```
Deployment Scripts

Please create deployment scripts and configurations:

1. scripts/deploy-dev.sh
   - Run pre-deployment checks
   - Run tests
   - Build for dev environment
   - Deploy to Firebase dev project
   - Run smoke tests
   - Notify on completion

2. scripts/deploy-prod.sh
   - Run comprehensive pre-deployment checks
   - Require confirmation
   - Run full test suite
   - Build for production
   - Deploy to Firebase prod project
   - Run smoke tests
   - Tag release in git
   - Notify on completion

3. scripts/pre-deploy-check.sh
   - Check all environment variables
   - Verify Firebase project
   - Check git status (no uncommitted changes)
   - Verify tests pass
   - Check build succeeds

4. scripts/smoke-tests.sh
   - Run critical path tests after deployment
   - Test login
   - Test search
   - Test event creation
   - Test messaging
   - Environment-specific URLs

5. scripts/rollback-prod.sh
   - Rollback to previous deployment
   - Restore Firestore rules if needed
   - Notify on rollback

6. .github/workflows/ (if using GitHub Actions):
   - CI pipeline for pull requests
   - Auto-deploy to dev on merge to main
   - Manual deploy to prod with approval

7. Firebase configuration files:
   - firebase.json (complete configuration)
   - .firebaserc (projects configuration)
   - firestore.rules (complete security rules)
   - storage.rules (complete security rules)
   - firestore.indexes.json (all required indexes)

All scripts should:
- Have error handling
- Provide clear output
- Exit with proper codes
- Be documented with comments

Provide all deployment scripts and configurations.
```

---

## ENVIRONMENT-SPECIFIC CONFIGURATIONS

### What to Ask Claude CLI:

```
Environment Configuration

Please create environment-specific configuration files:

1. .env.local (for Firebase Emulators):
   - All Firebase emulator URLs
   - Local API endpoints
   - Feature flags for development

2. .env.dev.example:
   - Template for dev Firebase project
   - Dev-specific feature flags
   - Analytics disabled
   - Comments for each variable

3. .env.prod.example:
   - Template for production Firebase project
   - Prod-specific settings
   - Analytics enabled
   - Comments for each variable

4. lib/config/environment.ts:
   - Utility to load correct environment
   - Type-safe environment variables
   - Validation for required variables
   - Export environment name

5. lib/firebase/config.ts:
   - Three Firebase configurations (local, dev, prod)
   - Environment-based initialization
   - Emulator connection logic
   - Type definitions

6. playwright.config.ts:
   - Base configuration
   - Environment-specific overrides
   - Local emulator URLs
   - Dev environment URLs
   - Prod environment URLs (read-only)

7. next.config.js:
   - Environment-specific settings
   - Image domains for each environment
   - Security headers
   - Redirects and rewrites

Also create documentation in README for:
- How to get Firebase configuration values
- How to switch between environments
- How to add new environment variables

Provide all configuration files.
```

---

## CONTINUOUS INTEGRATION SETUP

### What to Ask Claude CLI:

```
CI/CD Configuration

Please create GitHub Actions workflows (or provide templates):

1. .github/workflows/ci.yml:
   - Run on pull requests
   - Install dependencies
   - Run linting
   - Run type checking
   - Build project
   - Run E2E tests against emulators
   - Generate coverage report
   - Comment results on PR

2. .github/workflows/deploy-dev.yml:
   - Run on push to main branch
   - Run all tests
   - Build for dev
   - Deploy to Firebase dev project
   - Run smoke tests
   - Notify on Slack/email

3. .github/workflows/deploy-prod.yml:
   - Manual trigger only
   - Require approval
   - Run full test suite
   - Build for production
   - Deploy to Firebase prod project
   - Run smoke tests
   - Create GitHub release
   - Notify on Slack/email

4. .github/workflows/test-schedule.yml:
   - Run nightly
   - Test against dev environment
   - Report failures
   - Check for dependency updates

Also provide alternative for other CI platforms (GitLab CI, CircleCI) if requested.

Provide all CI/CD configurations with comments.
```

---

## POST-LAUNCH MONITORING SETUP

### What to Ask Claude CLI:

```
Monitoring and Observability

Please set up monitoring infrastructure:

1. Error tracking setup:
   - Sentry configuration (or alternative)
   - Error boundary with reporting
   - API error logging
   - Client-side error reporting

2. Performance monitoring:
   - Web Vitals tracking
   - Custom performance marks
   - API response time tracking
   - Firebase performance monitoring

3. Analytics setup:
   - Google Analytics 4 complete setup
   - Custom events for key actions
   - Conversion tracking
   - User journey tracking
   - Dashboard queries

4. Logging infrastructure:
   - Structured logging utility
   - Log levels (debug, info, warn, error)
   - Context logging
   - Environment-specific logging

5. Alerting setup:
   - Firebase budget alerts
   - Error rate alerts
   - Performance degradation alerts
   - Security rule alerts

6. Admin monitoring dashboard:
   - Real-time metrics
   - Error rate display
   - Active users
   - System health indicators

Provide all monitoring setup code and configurations.
```

---

## MAINTENANCE SCRIPTS

### What to Ask Claude CLI:

```
Maintenance Automation

Please create maintenance and automation scripts:

1. scripts/maintenance/backup-firestore.ts:
   - Export Firestore data
   - Upload to Cloud Storage
   - Scheduled backup capability
   - Retention policy

2. scripts/maintenance/cleanup-old-data.ts:
   - Remove old unverified users
   - Archive old events
   - Clean up orphaned data
   - Log cleanup actions

3. scripts/maintenance/generate-reports.ts:
   - Weekly activity report
   - Monthly platform metrics
   - User growth statistics
   - Event participation rates
   - Export to CSV/PDF

4. scripts/maintenance/verify-integrity.ts:
   - Check data consistency
   - Find orphaned records
   - Verify relationships (user -> profile -> connections)
   - Report issues

5. scripts/maintenance/migrate-data.ts:
   - Data migration utility template
   - Version tracking
   - Rollback capability
   - Dry-run mode

6. scripts/maintenance/optimize-indexes.ts:
   - Analyze query patterns
   - Suggest index improvements
   - Generate firestore.indexes.json

7. scripts/analytics/user-retention.ts:
   - Calculate retention rates
   - Cohort analysis
   - Export results

8. scripts/analytics/engagement-metrics.ts:
   - Messages per user
   - Events per user
   - Connection rate
   - Active users trend

All maintenance scripts should:
- Be runnable via npm scripts
- Have dry-run mode
- Log all actions
- Send notifications on completion/errors
- Be scheduled with cron or Cloud Scheduler

Provide all maintenance scripts.
```

---

## ADDITIONAL DOCUMENTATION

### What to Ask Claude CLI:

```
Complete Documentation Package

Please create these additional documentation files:

1. CONTRIBUTING.md:
   - Code of conduct
   - How to contribute
   - Development setup
   - Testing requirements
   - Commit message conventions
   - Pull request process
   - Code review guidelines

2. SECURITY.md:
   - Reporting security vulnerabilities
   - Security practices
   - Data protection measures
   - Compliance information

3. ARCHITECTURE.md:
   - System architecture overview
   - Data models and relationships
   - Authentication flow
   - Authorization model
   - Firebase architecture
   - Caching strategy
   - Security model

4. API.md:
   - Internal API documentation
   - Firebase callable functions (if any)
   - API rate limits
   - Error codes
   - Example requests/responses

5. DEPLOYMENT.md:
   - Detailed deployment guide
   - Environment setup
   - Secrets management
   - Database migration process
   - Rollback procedures
   - Post-deployment checklist
   - Troubleshooting deployments

6. TESTING.md:
   - Testing philosophy
   - Test types and coverage
   - Writing new tests
   - Running test suites
   - Test data management
   - CI/CD integration
   - Debugging failing tests

7. ADMIN_GUIDE.md:
   - Admin panel usage
   - Moderation workflows
   - User management
   - Content policy enforcement
   - Handling reports
   - Emergency procedures
   - Legal requests handling

8. USER_GUIDE.md:
   - Getting started
   - Creating profile
   - Finding parents
   - Messaging safety
   - Event creation
   - Privacy settings
   - Reporting abuse
   - FAQ

9. LEGAL_REVIEW_CHECKLIST.md:
   - Items for legal review
   - COPPA compliance checklist
   - GDPR considerations
   - Data retention policies
   - Terms of Service review points
   - Privacy Policy review points

10. LAUNCH_CHECKLIST.md:
    - Pre-launch tasks
    - Day of launch tasks
    - Post-launch monitoring
    - First week tasks
    - First month tasks

Provide all documentation files.
```

---

## TROUBLESHOOTING GUIDE

### What to Ask Claude CLI:

```
Comprehensive Troubleshooting Guide

Please create a detailed TROUBLESHOOTING.md with solutions for:

## Local Development Issues:

1. Firebase Emulator Issues:
   - Emulators won't start
   - Port conflicts
   - Data persistence issues
   - Emulator UI not accessible
   - Auth emulator issues
   - Firestore emulator slow

2. Next.js Development Issues:
   - Build failures
   - Hot reload not working
   - Environment variables not loading
   - Port already in use
   - Module not found errors
   - TypeScript errors

3. Dependency Issues:
   - Installation failures
   - Version conflicts
   - Peer dependency warnings
   - Firebase SDK issues

## Testing Issues:

4. Playwright Test Issues:
   - Tests timing out
   - Element not found
   - Browser not launching
   - Screenshots not saving
   - Test data not seeding
   - Flaky tests
   - Emulator connection issues

5. Test Data Issues:
   - Seed scripts failing
   - Data not appearing in tests
   - Authentication issues in tests
   - Stale test data

## Deployment Issues:

6. Firebase Deployment Issues:
   - Deployment hangs
   - Security rules deployment fails
   - Indexes not deploying
   - Functions deployment errors (if any)
   - Rollback issues

7. Production Issues:
   - Environment variables missing
   - Build errors in production
   - Firebase quota exceeded
   - Performance degradation
   - Security rule blocking legitimate requests

## Runtime Issues:

8. Authentication Issues:
   - Users can't sign up
   - Email verification not sending
   - Login failures
   - Session expiring too quickly
   - Social auth issues

9. Database Issues:
   - Slow queries
   - Permission denied errors
   - Data not syncing
   - Firestore quota exceeded
   - Missing indexes

10. Storage Issues:
    - Image upload failures
    - Storage quota exceeded
    - Permission denied on uploads
    - Images not displaying

11. Performance Issues:
    - Slow page loads
    - Memory leaks
    - Large bundle size
    - Slow Firestore queries
    - Image loading issues

Each issue should include:
- Symptoms
- Root cause
- Step-by-step solution
- Prevention tips
- Related documentation links

Provide complete troubleshooting guide.
```

---

## PERFORMANCE OPTIMIZATION GUIDE

### What to Ask Claude CLI:

```
Performance Optimization Documentation

Please create PERFORMANCE.md with:

1. Performance Monitoring:
   - Setting up Lighthouse CI
   - Core Web Vitals tracking
   - Firebase Performance Monitoring
   - Custom performance metrics

2. Next.js Optimizations:
   - Image optimization best practices
   - Code splitting strategies
   - Dynamic imports usage
   - Font optimization
   - CSS optimization
   - Bundle analysis

3. Firebase Optimizations:
   - Query optimization techniques
   - Pagination best practices
   - Denormalization strategies
   - Caching strategies
   - Offline persistence
   - Security rule optimization

4. Network Optimizations:
   - CDN configuration
   - Compression
   - HTTP/2 usage
   - Caching headers
   - Service worker strategies

5. Runtime Optimizations:
   - React performance patterns
   - Memoization strategies
   - Virtual scrolling for lists
   - Debouncing and throttling
   - Lazy loading

6. Database Optimizations:
   - Index strategy
   - Composite indexes
   - Query batching
   - Real-time listener management
   - Data structure optimization

7. Performance Budget:
   - Initial load time target
   - Time to interactive target
   - Bundle size limits
   - Image size limits
   - Monitoring and alerts

Provide complete performance guide with code examples.
```

---

## SECURITY HARDENING GUIDE

### What to Ask Claude CLI:

```
Security Best Practices Documentation

Please create SECURITY_HARDENING.md with:

1. Authentication Security:
   - Password requirements
   - Session management
   - Email verification enforcement
   - Account lockout policy
   - Password reset security
   - Social auth security

2. Authorization Security:
   - Firestore security rules best practices
   - Role-based access control
   - Field-level security
   - Document-level security
   - Storage security rules

3. Input Validation:
   - Client-side validation
   - Server-side validation
   - Sanitization techniques
   - XSS prevention
   - SQL injection prevention (N/A for Firebase)
   - File upload validation

4. API Security:
   - Rate limiting implementation
   - CORS configuration
   - API key protection
   - Request validation
   - Error handling without info leakage

5. Data Protection:
   - Encryption at rest (Firebase default)
   - Encryption in transit (HTTPS)
   - Sensitive data handling
   - PII protection
   - GDPR compliance
   - COPPA compliance

6. Content Security:
   - Content Security Policy headers
   - XSS protection headers
   - Clickjacking protection
   - MIME type sniffing prevention

7. Monitoring and Incident Response:
   - Security logging
   - Anomaly detection
   - Incident response plan
   - Security audit schedule
   - Vulnerability disclosure policy

8. Third-party Security:
   - Dependency scanning
   - Regular updates
   - Package audit
   - Supply chain security

9. Security Testing:
   - Penetration testing checklist
   - Security test automation
   - OWASP Top 10 coverage

Provide complete security hardening guide.
```

---

## DATA MIGRATION GUIDE

### What to Ask Claude CLI:

```
Data Migration Framework

Please create scripts/migrations/ folder with:

1. migrations/template.ts:
   - Migration template with best practices
   - Rollback capability
   - Dry-run mode
   - Progress tracking
   - Error handling

2. migrations/run-migration.ts:
   - Migration runner utility
   - Version tracking
   - Migration history in Firestore
   - Rollback support

3. migrations/001-example-migration.ts:
   - Example migration
   - Data transformation
   - Validation
   - Rollback implementation

4. Documentation: MIGRATIONS.md:
   - How to create migrations
   - Running migrations
   - Testing migrations
   - Rolling back migrations
   - Migration best practices
   - Common patterns

Include examples for:
- Adding new fields
- Restructuring data
- Moving data between collections
- Data validation and cleanup
- Bulk updates

Provide complete migration framework.
```

---

## SPRINT TESTING STRATEGY

For every sprint, tests should include:

### Unit Tests (if applicable):

- Utility functions
- Helper functions
- Data validation
- Business logic

### Integration Tests:

- Firebase interactions
- API routes
- Authentication flows
- Database operations

### E2E Tests (Required for each sprint):

- Happy path flows
- Error scenarios
- Edge cases
- Cross-browser tests
- Mobile responsive tests
- Accessibility tests

### Test Coverage Requirements:

- Critical paths: 100%
- Authentication: 100%
- Payment flows (if any): 100%
- Admin functions: 90%
- Other features: 80%

---

## COMPLETE PROJECT STRUCTURE

```
zipparents/
├── .claude/
│   └── system_directive.md
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-dev.yml
│       ├── deploy-prod.yml
│       └── test-schedule.yml
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/
│   │   │   ├── profile/
│   │   │   ├── search/
│   │   │   ├── messages/
│   │   │   ├── events/
│   │   │   ├── calendar/
│   │   │   └── connections/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── users/
│   │   │       ├── reports/
│   │   │       └── events/
│   │   ├── (public)/
│   │   │   ├── about/
│   │   │   ├── terms/
│   │   │   ├── privacy/
│   │   │   ├── safety/
│   │   │   ├── guidelines/
│   │   │   ├── contact/
│   │   │   ├── how-it-works/
│   │   │   ├── safety-trust/
│   │   │   └── faq/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── search/
│   │   ├── messaging/
│   │   ├── events/
│   │   ├── calendar/
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   ├── utils/
│   │   │   ├── zipcode.ts
│   │   │   ├── validation.ts
│   │   │   ├── date.ts
│   │   │   ├── string.ts
│   │   │   └── format.ts
│   │   ├── hooks/
│   │   ├── services/
│   │   └── config/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── UserContext.tsx
│   ├── types/
│   │   └── index.ts
│   └── styles/
├── tests/
│   ├── e2e/
│   │   ├── sprint1/
│   │   ├── sprint2/
│   │   ├── sprint3/
│   │   ├── sprint4/
│   │   ├── sprint5/
│   │   ├── sprint6/
│   │   ├── sprint7/
│   │   └── critical-flows/
│   ├── integration/
│   ├── security/
│   ├── fixtures/
│   ├── helpers/
│   ├── utils/
│   └── pages/
├── scripts/
│   ├── seed-all.ts
│   ├── seed-users.ts
│   ├── seed-profiles.ts
│   ├── seed-connections.ts
│   ├── seed-messages.ts
│   ├── seed-events.ts
│   ├── seed-reports.ts
│   ├── seed-admin.ts
│   ├── clear-all.ts
│   ├── deploy-dev.sh
│   ├── deploy-prod.sh
│   ├── rollback-prod.sh
│   ├── pre-deploy-check.sh
│   ├── smoke-tests.sh
│   ├── maintenance/
│   │   ├── backup-firestore.ts
│   │   ├── cleanup-old-data.ts
│   │   ├── generate-reports.ts
│   │   ├── verify-integrity.ts
│   │   ├── migrate-data.ts
│   │   └── optimize-indexes.ts
│   ├── analytics/
│   │   ├── user-retention.ts
│   │   └── engagement-metrics.ts
│   ├── migrations/
│   │   ├── template.ts
│   │   ├── run-migration.ts
│   │   └── 001-example-migration.ts
│   └── utils/
│       └── firebase-admin.ts
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── TESTING.md
│   ├── ADMIN_GUIDE.md
│   ├── USER_GUIDE.md
│   ├── LEGAL_REVIEW_CHECKLIST.md
│   ├── LAUNCH_CHECKLIST.md
│   ├── TROUBLESHOOTING.md
│   ├── PERFORMANCE.md
│   ├── SECURITY_HARDENING.md
│   └── MIGRATIONS.md
├── .env.local
├── .env.dev.example
├── .env.prod.example
├── .gitignore
├── firebase.json
├── .firebaserc
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── playwright.config.ts
├── package.json
├── README.md
└── LICENSE
```

---

## PACKAGE.JSON SCRIPTS REFERENCE

```json
{
  "scripts": {
    "dev": "npm run dev:local",
    "dev:local": "concurrently \"npm run emulators:start\" \"next dev\"",
    "dev:dev": "NEXT_PUBLIC_ENV=dev next dev",
    "dev:prod": "NEXT_PUBLIC_ENV=prod next dev",

    "build": "next build",
    "build:dev": "NEXT_PUBLIC_ENV=dev next build",
    "build:prod": "NEXT_PUBLIC_ENV=prod next build",

    "start": "next start",

    "lint": "next lint",
    "type-check": "tsc --noEmit",

    "emulators:start": "firebase emulators:start --import=./emulator-data --export-on-exit",
    "emulators:export": "firebase emulators:export ./emulator-data",
    "emulators:import": "firebase emulators:start --import=./emulator-data",

    "seed": "npm run seed:local",
    "seed:local": "tsx scripts/seed-all.ts local",
    "seed:dev": "tsx scripts/seed-all.ts dev",
    "seed:users:local": "tsx scripts/seed-users.ts local",
    "seed:users:dev": "tsx scripts/seed-users.ts dev",
    "clear:local": "tsx scripts/clear-all.ts local",

    "test": "npm run test:e2e:local",
    "test:e2e": "playwright test",
    "test:e2e:local": "ENV=local playwright test",
    "test:e2e:dev": "ENV=dev playwright test",
    "test:e2e:headed": "ENV=local playwright test --headed",
    "test:e2e:ui": "ENV=local playwright test --ui",
    "test:e2e:debug": "ENV=local playwright test --debug",
    "test:e2e:sprint1": "ENV=local playwright test tests/e2e/sprint1",
    "test:security": "ENV=local playwright test tests/security",
    "test:report": "playwright show-report",

    "deploy:dev": "./scripts/deploy-dev.sh",
    "deploy:prod": "./scripts/deploy-prod.sh",
    "rollback:prod": "./scripts/rollback-prod.sh",

    "maintenance:backup": "tsx scripts/maintenance/backup-firestore.ts",
    "maintenance:cleanup": "tsx scripts/maintenance/cleanup-old-data.ts",
    "maintenance:reports": "tsx scripts/maintenance/generate-reports.ts",
    "maintenance:verify": "tsx scripts/maintenance/verify-integrity.ts",

    "analytics:retention": "tsx scripts/analytics/user-retention.ts",
    "analytics:engagement": "tsx scripts/analytics/engagement-metrics.ts",

    "migrate": "tsx scripts/migrations/run-migration.ts",
    "migrate:dry": "tsx scripts/migrations/run-migration.ts --dry-run"
  }
}
```

---

## FINAL CHECKLIST BEFORE EACH SPRINT

### Before Starting Sprint:

- [ ] Previous sprint tests all passing
- [ ] Previous sprint features deployed to dev
- [ ] Previous sprint documented in README
- [ ] Git branch created for new sprint
- [ ] Sprint goals understood

### During Sprint:

- [ ] Write tests alongside features
- [ ] Test locally with emulators
- [ ] Commit frequently with clear messages
- [ ] Update security rules as needed
- [ ] Document new features in code comments

### After Sprint:

- [ ] All E2E tests passing locally
- [ ] All E2E tests passing on dev
- [ ] Security rules tested
- [ ] Performance acceptable
- [ ] Accessibility checked
- [ ] README updated
- [ ] Seed data scripts updated
- [ ] Deploy to dev environment
- [ ] Run smoke tests on dev
- [ ] Demo/review sprint deliverables

---

## SUCCESS METRICS

Track these metrics after each sprint:

### Technical Metrics:

- Test coverage percentage
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Build time
- Bundle size
- Page load time
- API response times

### Sprint Velocity:

- Story points completed
- Tests written
- Documentation updated
- Bugs found and fixed

### Quality Metrics:

- Test pass rate
- Bug count
- Code review feedback
- Technical debt items

---

## SUPPORT AND RESOURCES

### Firebase Resources:

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Firebase CLI Reference: https://firebase.google.com/docs/cli

### Next.js Resources:

- Next.js Documentation: https://nextjs.org/docs
- Next.js Examples: https://github.com/vercel/next.js/tree/canary/examples
- App Router Guide: https://nextjs.org/docs/app

### Testing Resources:

- Playwright Documentation: https://playwright.dev
- Testing Best Practices: https://playwright.dev/docs/best-practices
- Visual Testing: https://playwright.dev/docs/test-snapshots

### Legal Resources:

- COPPA Compliance: https://www.ftc.gov/business-guidance/resources/childrens-online-privacy-protection-rule-six-step-compliance-plan-your-business
- GDPR Guide: https://gdpr.eu
- Terms of Service Template: (consult with lawyer)

---

## GETTING HELP

If you encounter issues:

1. Check TROUBLESHOOTING.md
2. Check Firebase Console for errors
3. Check browser console for errors
4. Check Playwright test reports
5. Check GitHub Issues (if public)
6. Ask Claude CLI for specific help
7. Consult Firebase/Next.js documentation

---

## CONCLUSION

This comprehensive guide provides everything needed to build, test, deploy, and maintain ZipParents.com. Each sprint builds on the previous one, with clear deliverables, tests, and documentation requirements.

Remember:

- Safety and legal compliance are top priorities
- Test thoroughly before deploying
- Document as you build
- Monitor production closely
- Iterate based on user feedback

Good luck with your ZipParents.com development! 🚀

---

## QUICK START COMMANDS

```bash
# Initial Setup
git clone
cd zipparents
npm install
firebase login
firebase projects:create zipparents-dev
firebase projects:create zipparents-prod

# Create environment files
cp .env.dev.example .env.dev
cp .env.prod.example .env.prod
# Edit .env.dev and .env.prod with your Firebase configs

# Start local development
npm run emulators:start  # In terminal 1
npm run dev:local        # In terminal 2

# Seed test data
npm run seed:local

# Run tests
npm run test:e2e:local

# Deploy to dev
npm run deploy:dev

# Deploy to production (after thorough testing)
npm run deploy:prod
```

---

**This guide is now complete and ready to use with Claude CLI!**

Copy each sprint section into Claude CLI along with the system directive in `.claude/system_directive.md`, and you'll have a fully functioning, legally-safe, well-tested ZipParents.com platform.
