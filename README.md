# ZipParents.com - Connect, Share, Support

A Next.js-based social platform for parents to connect, share experiences, organize local events, and find support within their zip code communities.

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Prerequisites](#-prerequisites)
3. [Installation](#-installation)
4. [Firebase Configuration](#-firebase-configuration)
5. [Running Locally](#-running-locally)
6. [Seeding Test Data](#-seeding-test-data)
7. [Running Tests](#-running-tests)
8. [Development Workflow](#-development-workflow)
9. [Deploying to Dev Environment](#-deploying-to-dev-environment)
10. [Deploying to Production](#-deploying-to-production)
11. [Environment Variables Reference](#-environment-variables-reference)
12. [Project Structure](#-project-structure)
13. [Testing Strategy](#-testing-strategy)
14. [Security](#-security)
15. [Monitoring and Maintenance](#-monitoring-and-maintenance)
16. [Troubleshooting](#-troubleshooting)
17. [Contributing](#-contributing)
18. [License and Legal](#-license-and-legal)

---

## 🏠 Project Overview

### What is ZipParents.com

ZipParents is a hyper-local social platform designed exclusively for parents to connect with other parents in their area. The platform enables parents to:

- **Connect locally** - Find parents within your zip code
- **Share experiences** - Post updates, questions, and advice
- **Organize events** - Create and attend local meetups and playdates
- **Message safely** - Direct messaging with safety features
- **Build community** - Join a supportive network of local parents

### Features List

#### Core Features (Sprint 1-7 Complete)

✅ **Authentication & User Management**
- Email/password signup and login
- Age verification (18+ COPPA compliant)
- Email verification with resend capability
- Password reset flow
- Protected routes with auth guards
- Session persistence

✅ **User Profiles**
- Profile setup with bio and interests
- Children's age range selection
- Profile privacy controls
- Profile editing and updates
- Avatar/photo upload

✅ **Community Feed**
- Create, edit, and delete posts
- Like and comment on posts
- Filter by local zip code
- Real-time feed updates
- Image sharing in posts

✅ **Messaging System**
- 1-on-1 real-time messaging
- Image sharing in messages
- Read receipts and typing indicators
- Unread message counts
- Conversation muting
- Message deletion

✅ **Safety & Moderation**
- Report users and content
- Block users
- Content filtering and spam detection
- Admin dashboard for moderation
- User suspension and banning
- Moderation logs and audit trail

✅ **Events & Calendar**
- Interactive calendar (month/week/day views)
- Create and manage events
- RSVP and attendance tracking
- Event capacity limits
- Age range filtering
- Event comments and discussions
- Event cancellation with notifications

✅ **SEO & Marketing**
- Comprehensive meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data
- Sitemap.xml and robots.txt
- Public marketing pages
- FAQ section
- Google Analytics 4 integration

✅ **Admin Panel**
- User management (search, suspend, ban, verify)
- Content moderation queue
- Report review and actions
- Platform metrics dashboard
- Moderation logs
- Event moderation

### Tech Stack

**Frontend:**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **React Calendar** - Calendar component

**Backend:**
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Security Rules** - Database security

**Development & Testing:**
- **Playwright** - E2E testing
- **Firebase Emulators** - Local development
- **ESLint** - Code linting
- **TypeScript** - Static type checking

**Analytics & SEO:**
- **Google Analytics 4** - User analytics
- **Next.js Metadata API** - SEO optimization
- **JSON-LD** - Structured data

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** - Version 18.x or higher
  ```bash
  node --version  # Should show v18.x or higher
  ```

- **npm** - Version 9.x or higher (comes with Node.js)
  ```bash
  npm --version
  ```

- **Git** - For version control
  ```bash
  git --version
  ```

- **Firebase CLI** - Installed automatically with npm install, or install globally:
  ```bash
  npm install -g firebase-tools
  firebase --version
  ```

- **Playwright** - For E2E testing (installed with npm install)
  ```bash
  npx playwright --version
  ```

### Recommended Tools

- **VS Code** - Code editor with TypeScript support
- **Chrome/Firefox** - For testing and debugging
- **Firebase Console Access** - For dev and prod projects

### System Requirements

- **OS**: macOS, Windows, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Disk Space**: 2GB for dependencies and emulators

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/abhie1singh/zipparents-v1.git
cd zipparents-v1
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js and React
- Firebase SDK and Admin SDK
- Playwright for testing
- TypeScript and type definitions
- Tailwind CSS
- All development dependencies

### 3. Set Up Environment Variables

#### For Local Development (Already Configured)

The `.env.local` file is pre-configured for Firebase emulators:

```env
# .env.local (already exists)
NEXT_PUBLIC_FIREBASE_ENV=local
# No Firebase credentials needed for emulators
```

#### For Dev Environment

Create `.env.dev` from template:

```bash
cp .env.dev.example .env.dev
```

Edit `.env.dev` and add your Firebase dev project credentials (see Firebase Configuration section).

#### For Production

Create `.env.prod` from template:

```bash
cp .env.prod.example .env.prod
```

Edit `.env.prod` and add your Firebase production project credentials.

---

## 🔥 Firebase Configuration

### Local Development (Firebase Emulators)

**No Firebase project needed!** Local development uses Firebase emulators.

✅ **Advantages:**
- No internet connection required (after initial setup)
- Instant reset and data seeding
- No cloud costs
- Fast iteration

The emulators are configured in `firebase.json`:

```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4000 }
  }
}
```

### Creating Firebase Projects (Dev and Prod)

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name:
   - Dev: `zipparents-dev`
   - Prod: `zipparents-prod`
4. Enable/disable Google Analytics (optional for dev, recommended for prod)
5. Click **"Create project"**

#### Step 2: Enable Firebase Services

**Authentication:**
1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** provider
4. (Optional) Enable other providers if needed

**Firestore Database:**
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose location (us-central1 recommended)
4. Start in **Production mode** (we'll deploy rules later)
5. Click **"Enable"**

**Firebase Storage:**
1. Go to **Storage**
2. Click **"Get started"**
3. Start in **Production mode**
4. Use same location as Firestore
5. Click **"Done"**

#### Step 3: Set Up Firebase CLI

**Login to Firebase:**

```bash
firebase login
```

**Add projects to `.firebaserc`:**

```bash
# Add dev project
firebase use --add
# Select: zipparents-dev
# Alias: dev

# Add prod project
firebase use --add
# Select: zipparents-prod
# Alias: prod
```

Your `.firebaserc` should look like:

```json
{
  "projects": {
    "dev": "zipparents-dev",
    "prod": "zipparents-prod",
    "default": "zipparents-local"
  }
}
```

#### Step 4: Get Firebase Configuration

**For Web App:**

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **Web** icon (`</>`) to add a web app
4. Register app name: `zipparents-dev` (or `zipparents-prod`)
5. Copy the configuration object

**Update .env.dev (or .env.prod):**

```env
NEXT_PUBLIC_FIREBASE_ENV=dev
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zipparents-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zipparents-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zipparents-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Step 5: Downloading Service Account Keys

**For server-side operations (seeding, admin tasks):**

1. Go to **Project Settings** > **Service Accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads JSON file)
4. **IMPORTANT**: Keep this file secure, never commit to git

**Convert to single-line string:**

```bash
# On Mac/Linux:
cat path/to/serviceAccountKey.json | jq -c '.' | pbcopy

# On Windows (PowerShell):
Get-Content path/to/serviceAccountKey.json | ConvertTo-Json -Compress | Set-Clipboard
```

**Add to .env.dev (or .env.prod):**

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"zipparents-dev",...}
```

#### Step 6: Deploy Firestore Rules and Indexes

```bash
# Deploy to dev project
firebase use dev
firebase deploy --only firestore:rules,firestore:indexes

# Deploy to prod project
firebase use prod
firebase deploy --only firestore:rules,firestore:indexes
```

#### Step 7: Deploy Storage Rules

```bash
# Deploy to dev
firebase use dev
firebase deploy --only storage:rules

# Deploy to prod
firebase use prod
firebase deploy --only storage:rules
```

**Verify deployment:**

1. Check Firebase Console > Firestore Database > Rules
2. Check Firebase Console > Storage > Rules
3. Ensure rules are active

---

## 🚀 Running Locally

### Starting Firebase Emulators

**Terminal 1 - Start Emulators:**

```bash
npm run emulators:start
```

This starts:
- **Auth Emulator** - http://localhost:9099
- **Firestore Emulator** - http://localhost:8080
- **Storage Emulator** - http://localhost:9199
- **Emulator UI** - http://localhost:4000

**What you'll see:**

```
✔  All emulators ready! It is now safe to connect your app.
┌─────────────────────────────────────────────────────────────┐
│ ✔  All emulators ready!                                     │
│                                                             │
│ View Emulator UI at http://localhost:4000                  │
└─────────────────────────────────────────────────────────────┘
```

### Starting Next.js Dev Server

**Terminal 2 - Start Next.js:**

```bash
npm run dev:local
```

Or use the default (same as dev:local):

```bash
npm run dev
```

**What you'll see:**

```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

### Accessing the Application

**Main App:**
- http://localhost:3000 - ZipParents application

**Emulator UI:**
- http://localhost:4000 - Firebase Emulator UI
  - View Auth users
  - Browse Firestore collections
  - Check Storage files
  - Monitor logs

### Stopping Emulators

**To stop emulators:**

1. Press `Ctrl+C` in the emulator terminal
2. Data is automatically exported to `./firebase-emulator-data`

**Next time you start:**

```bash
npm run emulators:start
# Automatically imports previous data
```

### Exporting/Importing Emulator Data

**Manual export:**

```bash
npm run emulators:export
```

Saves current state to `./firebase-emulator-data/`

**Import on startup:**

```bash
npm run emulators:import
```

Starts emulators with previously exported data.

**Auto-export (built-in):**

The `emulators:start` script uses `--export-on-exit` flag to automatically save data when you stop emulators.

---

## 🌱 Seeding Test Data

### Seed All Data (Recommended)

**Local environment:**

```bash
# Seed comprehensive test data (all sprints)
npm run seed:local
```

**Dev environment:**

```bash
npm run seed:dev
```

### Seed Specific Sprint Data

**Sprint 1 - Users and Authentication:**

```bash
npm run seed:sprint1         # Local
npm run seed:sprint1:dev     # Dev
```

Creates 10 test users with different scenarios.

**Sprint 2 - Profiles:**

```bash
npm run seed:sprint2         # Local
npm run seed:sprint2:dev     # Dev
```

Adds profiles to existing users.

**Sprint 4 - Messages:**

```bash
npm run seed:sprint4         # Local
npm run seed:sprint4:dev     # Dev
```

Creates conversations, messages, reports, and blocks.

**Sprint 5 - Events:**

```bash
npm run seed:sprint5         # Local
npm run seed:sprint5:dev     # Dev
```

Creates 14 diverse events and event comments.

**Sprint 7 - Admin:**

```bash
npm run seed:sprint7         # Local
npm run seed:sprint7:dev     # Dev
```

Creates admin user, reports, and moderation logs.

### Seed Modular Data

**Users only:**

```bash
npm run seed:users           # Local
npm run seed:users:dev       # Dev
```

**Comprehensive test data:**

```bash
npm run seed:data            # Local (same as seed:local)
npm run seed:data:dev        # Dev (same as seed:dev)
```

### Clear All Data

**Local environment:**

```bash
npm run clear-data:local
```

**Dev environment (requires confirmation):**

```bash
npm run clear-data:dev
```

⚠️ **Warning**: This deletes all data. Use with caution in dev!

### Available Test Accounts

After seeding, use these credentials to login:

| Email | Password | Role | Status | Scenario |
|-------|----------|------|--------|----------|
| verified.parent@test.com | Test123! | User | Verified | Active parent |
| unverified.parent@test.com | Test123! | User | Unverified | Needs email verification |
| new.parent@test.com | Test123! | User | Verified | Recently joined |
| local.parent@test.com | Test123! | User | Verified | Local community member |
| young.parent@test.com | Test123! | User | Verified | Younger parent (25) |
| experienced.parent@test.com | Test123! | User | Verified | Experienced parent |
| single.parent@test.com | Test123! | User | Verified | Single parent |
| working.parent@test.com | Test123! | User | Verified | Working parent |
| stayathome.parent@test.com | Test123! | User | Verified | Stay-at-home parent |
| admin.test@test.com | Test123! | Admin | Verified | Full admin access |

**All users:**
- Password: `Test123!`
- Age verified (18+)
- Different zip codes (10001-10005)

---

## 🧪 Running Tests

### E2E Tests Locally

**Run all tests against local emulators:**

```bash
npm run test:e2e:local
```

**Run specific sprint tests:**

```bash
npm run test:e2e:local tests/e2e/sprint1
npm run test:e2e:local tests/e2e/sprint4
npm run test:e2e:local tests/e2e/sprint5
npm run test:e2e:local tests/e2e/sprint6
npm run test:e2e:local tests/e2e/sprint7
```

### E2E Tests on Dev/Prod

**Test against dev environment:**

```bash
npm run test:e2e:dev
```

**Test against production:**

```bash
npm run test:e2e:prod
```

### Run Specific Test Suite

**Single test file:**

```bash
npm run test:e2e:local tests/e2e/sprint1/signup.spec.ts
```

**Pattern matching:**

```bash
npm run test:e2e:local -- --grep "admin"
```

### Run in Headed Mode (See Browser)

**Watch tests run in browser:**

```bash
npm run test:e2e:local -- --headed
```

**Debug specific test:**

```bash
npm run test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Generate Test Report

**View HTML report:**

```bash
npm run test:e2e:report
```

Opens browser with detailed test results, screenshots, and traces.

**UI Mode (Interactive):**

```bash
npm run test:e2e:ui
```

Interactive test runner with time-travel debugging.

### Test by Browser

**Run in specific browser:**

```bash
npm run test:e2e:local -- --project=chromium
npm run test:e2e:local -- --project=firefox
npm run test:e2e:local -- --project=webkit
```

**Run in all browsers:**

```bash
npm run test:e2e:local -- --project=chromium --project=firefox --project=webkit
```

### Test Coverage Summary

| Sprint | Test File | Tests | Coverage |
|--------|-----------|-------|----------|
| Sprint 1 | signup.spec.ts | 6 | Signup flow, validation |
| Sprint 1 | login.spec.ts | 5 | Login, logout, verification |
| Sprint 1 | age-verification.spec.ts | 5 | COPPA compliance |
| Sprint 1 | protected-routes.spec.ts | 4 | Auth guards |
| Sprint 4 | messaging.spec.ts | 11 | Messages, safety |
| Sprint 5 | events.spec.ts | 12 | Calendar, events, RSVP |
| Sprint 6 | seo.spec.ts | 7 | SEO, meta tags |
| Sprint 7 | admin-access.spec.ts | 4 | Admin access |
| Sprint 7 | user-management.spec.ts | 9 | User actions |
| Sprint 7 | content-moderation.spec.ts | 9 | Reports, moderation |
| Sprint 7 | moderation-logs.spec.ts | 10 | Audit logs |
| Sprint 7 | platform-metrics.spec.ts | 8 | Dashboard metrics |
| **Total** | | **90+** | **All critical flows** |

---

## 💼 Development Workflow

### Feature Branch Strategy

**1. Create feature branch from main:**

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `test/` - Test additions
- `docs/` - Documentation

**2. Make your changes:**

```bash
# Create/modify files
# Write tests for new features
```

**3. Commit with descriptive messages:**

```bash
git add .
git commit -m "feat: add user profile editing

- Add edit profile page
- Implement form validation
- Add image upload
- Update Firestore security rules
- Add E2E tests for editing"
```

**Commit message format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `test:` - Test additions
- `docs:` - Documentation
- `style:` - Code style changes
- `chore:` - Maintenance tasks

### Testing Before Commit

**Run all checks:**

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build check
npm run build

# Run tests
npm run test:e2e:local
```

**Pre-commit checklist:**
- [ ] Code passes linting
- [ ] No TypeScript errors
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation updated
- [ ] No console.log() statements

### Code Review Process

**1. Push your branch:**

```bash
git push origin feature/your-feature-name
```

**2. Create Pull Request:**

- Go to GitHub repository
- Click "Pull requests" > "New pull request"
- Select your branch
- Fill in PR template:
  - Description of changes
  - Related issues
  - Testing done
  - Screenshots (if UI changes)

**3. Request review:**

- Assign reviewers
- Add labels (feature, bug, etc.)
- Link related issues

**4. Address feedback:**

```bash
# Make requested changes
git add .
git commit -m "refactor: address PR feedback"
git push origin feature/your-feature-name
```

**5. Approval and merge:**

- Wait for approvals (minimum 1)
- Ensure CI/CD passes
- Squash and merge to main

### Merging to Main

**After PR approval:**

1. **Squash commits** (on GitHub)
2. **Merge pull request**
3. **Delete branch** (on GitHub)

**Locally:**

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

**After merge:**
- Main branch auto-deploys to dev environment
- Run smoke tests on dev
- Monitor for errors

---

## 🚢 Deploying to Dev Environment

### Build for Dev

**1. Ensure you're on main branch:**

```bash
git checkout main
git pull origin main
```

**2. Run pre-deployment checks:**

```bash
# Linting
npm run lint

# Type check
npm run type-check

# Run tests
npm run test:e2e:local
```

**3. Build for dev environment:**

```bash
npm run build:dev
```

This builds Next.js with `NEXT_PUBLIC_FIREBASE_ENV=dev`.

### Deploy to Firebase

**Deploy Firestore rules and indexes:**

```bash
firebase use dev
firebase deploy --only firestore:rules,firestore:indexes
```

**Deploy Storage rules:**

```bash
firebase deploy --only storage:rules
```

**Deploy all Firebase resources:**

```bash
firebase deploy --project zipparents-dev
```

### Verify Deployment

**1. Check build output:**

```bash
ls -la .next
```

Should show `.next/` directory with compiled files.

**2. Test locally with dev config:**

```bash
npm run dev:dev
```

Visit http://localhost:3000 and verify connection to dev Firebase.

**3. Check Firebase Console:**

- Verify rules are deployed
- Check indexes are created
- Ensure no errors in Firebase logs

### Run Smoke Tests

**Run critical tests against dev:**

```bash
npm run test:e2e:dev
```

**Manual smoke test checklist:**
- [ ] User can sign up
- [ ] User can login
- [ ] User can create post
- [ ] User can create event
- [ ] User can send message
- [ ] Admin can access admin panel

**Monitor for errors:**
- Check Firebase Console > Firestore > Usage
- Check Firebase Console > Authentication > Users
- Check application logs

### Deploy to Vercel (if applicable)

**Install Vercel CLI:**

```bash
npm install -g vercel
```

**Deploy:**

```bash
vercel --prod --env NEXT_PUBLIC_FIREBASE_ENV=dev
```

**Set environment variables in Vercel:**

Go to Vercel Dashboard > Project > Settings > Environment Variables and add all `NEXT_PUBLIC_*` variables from `.env.dev`.

---

## 🚀 Deploying to Production

### Pre-Deployment Checklist

**Code Quality:**
- [ ] All tests passing (unit, E2E)
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code reviewed and approved
- [ ] No console.log statements
- [ ] No debug code

**Testing:**
- [ ] All E2E tests pass on dev
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested

**Infrastructure:**
- [ ] Database migrations completed
- [ ] Firestore indexes deployed
- [ ] Firebase rules deployed
- [ ] Environment variables set
- [ ] Backup created

**Documentation:**
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API docs updated (if applicable)
- [ ] Deployment notes written

**Team:**
- [ ] Team notified of deployment
- [ ] Stakeholders informed
- [ ] Support team briefed
- [ ] Rollback plan ready

### Build for Production

**1. Switch to production branch:**

```bash
git checkout main
git pull origin main
```

**2. Create release tag:**

```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release"
git push origin v1.0.0
```

**3. Build for production:**

```bash
npm run build:prod
```

This sets `NEXT_PUBLIC_FIREBASE_ENV=prod` and builds optimized bundle.

**4. Verify build:**

```bash
# Check bundle size
ls -lh .next/static

# Test production build locally
npm run start
```

### Deploy to Firebase

**1. Switch to prod project:**

```bash
firebase use prod
```

**2. Deploy Firebase resources:**

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy all
firebase deploy --project zipparents-prod
```

**3. Verify Firebase deployment:**

- Firebase Console > Firestore > Rules (check timestamp)
- Firebase Console > Firestore > Indexes (verify all indexes)
- Firebase Console > Storage > Rules

### Deploy to Vercel/Hosting

**Deploy to Vercel:**

```bash
vercel --prod
```

**Or deploy to Firebase Hosting:**

```bash
firebase deploy --only hosting --project zipparents-prod
```

### Post-Deployment Verification

**1. Health check:**

Visit https://zipparents.com/api/health (or your domain)

**2. Critical user journeys:**

- [ ] Homepage loads
- [ ] User can sign up
- [ ] User can login
- [ ] User can create post
- [ ] User can create event
- [ ] User can send message
- [ ] Search works
- [ ] Admin panel accessible

**3. Monitor logs:**

```bash
# Vercel logs
vercel logs

# Firebase logs
firebase functions:log --project zipparents-prod
```

**4. Check analytics:**

- Google Analytics dashboard
- Firebase Analytics console
- Error tracking (Sentry, etc.)

**5. Performance check:**

- Run Lighthouse audit
- Check Core Web Vitals
- Verify page load times < 3s

### Rollback Procedure

**If issues occur in production:**

**1. Quick rollback via Vercel:**

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback [deployment-url]
```

**2. Rollback via Git:**

```bash
# Find previous release tag
git tag -l

# Checkout previous version
git checkout v0.9.0

# Rebuild and redeploy
npm run build:prod
vercel --prod
```

**3. Rollback Firebase rules:**

```bash
# Checkout previous rules
git checkout v0.9.0 -- firestore.rules storage.rules

# Redeploy
firebase deploy --only firestore:rules,storage:rules --project zipparents-prod
```

**4. Notify team:**

- Post in Slack/Teams
- Email stakeholders
- Update status page
- Create incident report

**5. Post-mortem:**

- Document what went wrong
- Identify root cause
- Implement preventive measures
- Update deployment checklist

---

## 📊 Environment Variables Reference

### Local Environment (.env.local)

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_ENV` | `local` | Environment identifier |
| No Firebase credentials needed | - | Uses emulators with demo config |

### Dev Environment (.env.dev)

| Variable | Example | Where to Find | Required |
|----------|---------|---------------|----------|
| `NEXT_PUBLIC_FIREBASE_ENV` | `dev` | Hardcode | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `zipparents-dev.firebaseapp.com` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `zipparents-dev` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `zipparents-dev.appspot.com` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:123456789:web:abc` | Firebase Console > Project Settings > General | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Firebase Console > Project Settings > General | ⚪ Optional |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `{"type":"service_account"...}` | Firebase Console > Project Settings > Service Accounts | ✅ Yes (for seeding) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics | ⚪ Optional |
| `NEXT_PUBLIC_BASE_URL` | `https://zipparents-dev.vercel.app` | Your dev URL | ✅ Yes |

### Production Environment (.env.prod)

| Variable | Example | Where to Find | Required |
|----------|---------|---------------|----------|
| `NEXT_PUBLIC_FIREBASE_ENV` | `prod` | Hardcode | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIza...` | Firebase Console (prod project) | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `zipparents.com` | Custom domain or Firebase | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `zipparents-prod` | Firebase Console (prod project) | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `zipparents-prod.appspot.com` | Firebase Console (prod project) | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `987654321` | Firebase Console (prod project) | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:987654321:web:xyz` | Firebase Console (prod project) | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-YYYYYYYYYY` | Firebase Console (prod project) | ⚪ Optional |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | `{"type":"service_account"...}` | Firebase Console (prod) > Service Accounts | ✅ Yes |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-YYYYYYYYYY` | Google Analytics (prod) | ✅ Yes |
| `NEXT_PUBLIC_BASE_URL` | `https://zipparents.com` | Your production domain | ✅ Yes |

### Security Notes

⚠️ **Never commit `.env.*` files to git**

```bash
# Already in .gitignore:
.env.local
.env.dev
.env.prod
.env*.local
```

⚠️ **Service Account Keys are sensitive**
- Never share publicly
- Rotate regularly (every 90 days)
- Store securely (1Password, AWS Secrets Manager)

⚠️ **Use different keys for each environment**
- Never use prod keys in dev
- Never use dev keys locally

⚠️ **Vercel Environment Variables**
- Set via Vercel Dashboard, not in code
- Use different values for Preview vs Production
- Enable "Encrypt" for sensitive values

---

## 📁 Project Structure

```
zipparents-v1/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth route group
│   │   ├── login/
│   │   ├── signup/
│   │   ├── verify-age/
│   │   └── reset-password/
│   ├── (legal)/                 # Legal pages
│   │   ├── terms/
│   │   ├── privacy/
│   │   ├── community-guidelines/
│   │   └── safety-tips/
│   ├── (public)/                # Public marketing pages
│   │   ├── how-it-works/
│   │   ├── safety-trust/
│   │   ├── for-parents/
│   │   ├── faq/
│   │   └── blog/
│   ├── (protected)/             # Protected routes
│   │   ├── feed/                # Community feed
│   │   ├── profile/             # User profiles
│   │   ├── messages/            # Messaging
│   │   ├── calendar/            # Events & calendar
│   │   ├── events/              # Event details
│   │   └── search/              # Search parents
│   ├── admin/                   # Admin panel
│   │   ├── users/               # User management
│   │   ├── reports/             # Content moderation
│   │   ├── events/              # Event moderation
│   │   └── logs/                # Moderation logs
│   ├── api/                     # API routes
│   │   └── health/              # Health check
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   ├── sitemap.ts               # Dynamic sitemap
│   └── robots.ts                # Robots.txt
│
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   ├── auth/                    # Auth components
│   ├── feed/                    # Feed components
│   ├── messages/                # Message components
│   ├── events/                  # Event components
│   ├── admin/                   # Admin components
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
│
├── lib/                         # Shared libraries
│   ├── firebase/
│   │   ├── clientApp.ts         # Firebase client SDK
│   │   └── adminApp.ts          # Firebase Admin SDK
│   ├── seo/
│   │   └── metadata.ts          # SEO utilities
│   ├── analytics/
│   │   └── ga.ts                # Google Analytics
│   ├── admin/
│   │   ├── users.ts             # User management
│   │   ├── moderation.ts        # Moderation actions
│   │   └── logs.ts              # Logging utilities
│   └── utils/                   # Utility functions
│
├── contexts/                    # React contexts
│   └── AuthContext.tsx          # Authentication context
│
├── hooks/                       # Custom React hooks
│   └── useAuth.ts               # Auth hook
│
├── types/                       # TypeScript types
│   ├── user.ts                  # User types
│   ├── post.ts                  # Post types
│   ├── event.ts                 # Event types
│   ├── message.ts               # Message types
│   └── admin.ts                 # Admin types
│
├── config/                      # Configuration files
│   ├── firebase.local.ts        # Local config
│   ├── firebase.dev.ts          # Dev config
│   └── firebase.prod.ts         # Prod config
│
├── scripts/                     # Utility scripts
│   ├── seed/
│   │   ├── sprint1-users.ts     # Sprint 1 seed
│   │   ├── sprint2-profiles.ts  # Sprint 2 seed
│   │   ├── sprint4-messages.ts  # Sprint 4 seed
│   │   ├── sprint5-events.ts    # Sprint 5 seed
│   │   ├── sprint7-admin.ts     # Sprint 7 seed
│   │   ├── seed-users.ts        # User seeding
│   │   ├── seed-test-data.ts    # Full data seed
│   │   └── clear-data.ts        # Data cleanup
│   ├── deploy-dev.sh            # Dev deployment
│   ├── deploy-prod.sh           # Prod deployment
│   └── rollback-prod.sh         # Rollback script
│
├── tests/                       # Test files
│   ├── e2e/                     # E2E tests
│   │   ├── sprint1/             # Sprint 1 tests
│   │   │   ├── signup.spec.ts
│   │   │   ├── login.spec.ts
│   │   │   ├── age-verification.spec.ts
│   │   │   └── protected-routes.spec.ts
│   │   ├── sprint4/             # Sprint 4 tests
│   │   │   └── messaging.spec.ts
│   │   ├── sprint5/             # Sprint 5 tests
│   │   │   └── events.spec.ts
│   │   ├── sprint6/             # Sprint 6 tests
│   │   │   └── seo.spec.ts
│   │   ├── sprint7/             # Sprint 7 tests
│   │   │   ├── admin-access.spec.ts
│   │   │   ├── user-management.spec.ts
│   │   │   ├── content-moderation.spec.ts
│   │   │   ├── moderation-logs.spec.ts
│   │   │   ├── platform-metrics.spec.ts
│   │   │   └── suspended-user-login.spec.ts
│   │   └── critical-flows/      # Critical tests
│   │       ├── complete-user-journey.spec.ts
│   │       └── messaging-flow.spec.ts
│   ├── security/                # Security tests
│   │   ├── auth-security.spec.ts
│   │   └── firestore-rules.spec.ts
│   ├── accessibility/           # A11y tests
│   │   └── axe-core.spec.ts
│   ├── performance/             # Performance tests
│   │   └── lighthouse.spec.ts
│   ├── helpers/                 # Test helpers
│   │   └── auth-test-helpers.ts
│   └── utils/                   # Test utilities
│       └── seo-helpers.ts
│
├── docs/                        # Documentation
│   ├── DEPLOYMENT.md            # Deployment guide
│   ├── TESTING.md               # Testing guide
│   ├── USER-GUIDE.md            # User guide
│   ├── ADMIN-GUIDE.md           # Admin guide
│   └── SPRINT8-SUMMARY.md       # Sprint 8 summary
│
├── .env.local                   # Local env vars
├── .env.dev.example             # Dev env template
├── .env.prod.example            # Prod env template
├── .firebaserc                  # Firebase projects
├── firebase.json                # Firebase config
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Firestore indexes
├── storage.rules                # Storage security rules
├── playwright.config.ts         # Playwright config
├── next.config.ts               # Next.js config
├── tailwind.config.ts           # Tailwind config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # This file
```

### Key Files and Their Purposes

**Configuration:**
- `firebase.json` - Firebase emulators and deployment config
- `firestore.rules` - Database security rules
- `storage.rules` - File storage security rules
- `next.config.ts` - Next.js build and runtime config
- `playwright.config.ts` - E2E test configuration

**Firebase:**
- `lib/firebase/clientApp.ts` - Client-side Firebase initialization
- `lib/firebase/adminApp.ts` - Server-side Firebase Admin SDK

**Authentication:**
- `contexts/AuthContext.tsx` - Global auth state
- `hooks/useAuth.ts` - Auth hook for components
- `app/(auth)/` - Auth-related pages

**SEO:**
- `lib/seo/metadata.ts` - Meta tag utilities
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt generation

**Admin:**
- `app/admin/` - Admin panel pages
- `lib/admin/` - Admin utilities and actions
- `components/admin/` - Admin-specific components

---

## 🧪 Testing Strategy

### Test Types

**1. E2E Tests (Playwright)**
- Test complete user flows
- Run in real browser
- Cover critical paths
- Automated in CI/CD

**2. Integration Tests**
- Test component interactions
- Firebase integration
- API route testing
- Authentication flows

**3. Unit Tests**
- Test individual functions
- Utility functions
- Validation logic
- Edge cases

**4. Security Tests**
- Firestore rules testing
- Auth security
- XSS/CSRF prevention
- Input validation

**5. Accessibility Tests**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast

**6. Performance Tests**
- Lighthouse audits
- Core Web Vitals
- Load time testing
- Bundle size monitoring

### Coverage Requirements

**Minimum coverage:**
- Unit tests: 70%
- E2E critical paths: 100%
- Firestore rules: 100%

**Current coverage:**
- 170+ E2E tests
- 90+ test scenarios
- All critical flows covered

### Test Data Management

**Local (Emulators):**
- Use seeded test data
- Reset between test runs
- Isolated test environment

**Dev:**
- Persistent test data
- Can be reset
- Shared across team

**Production:**
- Never run tests against prod
- No test data in prod
- Read-only monitoring only

### Running Tests by Category

```bash
# E2E tests
npm run test:e2e:local

# Security tests
TEST_ENV=local playwright test tests/security

# Accessibility tests
TEST_ENV=local playwright test tests/accessibility

# Performance tests
TEST_ENV=local playwright test tests/performance

# Critical flows
TEST_ENV=local playwright test tests/e2e/critical-flows
```

### Writing New Tests

**Test file structure:**

```typescript
import { test, expect } from '@playwright/test';
import { login } from '../helpers/auth-test-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
    await login(page, 'user@test.com', 'password');
  });

  test('should perform action', async ({ page }) => {
    // Arrange
    await page.goto('/some-page');

    // Act
    await page.click('[data-testid="button"]');

    // Assert
    await expect(page.locator('h1')).toHaveText('Expected');
  });
});
```

**Best practices:**
- Use data-testid for selectors
- Test user flows, not implementation
- Use helpers for common actions
- Clean up test data
- Make tests independent

---

## 🔒 Security

### Firestore Security Rules

**Rules location:** `firestore.rules`

**Key security patterns:**

```javascript
// Users can only read/write their own data
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// Posts are public but only author can edit
match /posts/{postId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update, delete: if request.auth.uid == resource.data.authorId;
}

// Admin-only collections
match /moderationLogs/{logId} {
  allow read: if request.auth != null &&
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

**Testing rules:**

```bash
TEST_ENV=local playwright test tests/security/firestore-rules.spec.ts
```

### Storage Security Rules

**Rules location:** `storage.rules`

**Key patterns:**

```javascript
// User can only upload to their own folder
match /users/{userId}/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == userId;
}

// Validate file size and type
match /posts/{postId}/{fileName} {
  allow write: if request.resource.size < 5 * 1024 * 1024  // 5MB
              && request.resource.contentType.matches('image/.*');
}
```

### API Security

**Authentication:**
- All API routes verify auth token
- Firebase Admin SDK validates tokens
- Session cookies for SSR

**Rate Limiting:**
- Implement rate limiting on sensitive endpoints
- Use Firebase App Check for abuse prevention

**Input Validation:**
- Validate all user inputs
- Sanitize data before saving
- Use TypeScript for type safety

**XSS Prevention:**
- React auto-escapes output
- Use dangerouslySetInnerHTML carefully
- Sanitize user-generated HTML

**CSRF Protection:**
- SameSite cookies
- CSRF tokens for state-changing operations
- Verify origin headers

### Security Checklist

**Development:**
- [ ] Never commit .env files
- [ ] Never log sensitive data
- [ ] Use environment variables for secrets
- [ ] Rotate API keys regularly

**Deployment:**
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] HTTPS enforced
- [ ] Security headers configured

**Monitoring:**
- [ ] Error tracking enabled (Sentry)
- [ ] Audit logs for admin actions
- [ ] Monitor failed login attempts
- [ ] Track unusual activity patterns

---

## 📈 Monitoring and Maintenance

### Daily Tasks (Moderation Queue)

**Morning (9 AM):**
- [ ] Check pending reports queue (`/admin/reports`)
- [ ] Review flagged content
- [ ] Respond to urgent reports (< 2 hours)
- [ ] Check suspended users list

**Afternoon (2 PM):**
- [ ] Review new user signups
- [ ] Check for spam posts/events
- [ ] Monitor message reports
- [ ] Update moderation logs

**Evening (6 PM):**
- [ ] Final report queue check
- [ ] Escalate unresolved issues
- [ ] Prepare handoff notes
- [ ] Update team on actions taken

### Weekly Tasks (Review Reports)

**Monday:**
- [ ] Review weekly metrics dashboard
- [ ] Analyze user growth trends
- [ ] Check platform performance
- [ ] Review error logs

**Wednesday:**
- [ ] Audit moderation actions from past week
- [ ] Review banned/suspended users
- [ ] Update content guidelines if needed
- [ ] Team sync on moderation issues

**Friday:**
- [ ] Generate weekly report
  - New users count
  - Active users
  - Posts/events created
  - Reports resolved
  - Actions taken
- [ ] Review and close resolved reports
- [ ] Clean up old test data
- [ ] Backup database

### Monthly Tasks (Analytics Review)

**First Week:**
- [ ] Comprehensive analytics review
  - User growth month-over-month
  - Engagement metrics (DAU/MAU)
  - Retention rates
  - Top features used
- [ ] Performance audit
  - Lighthouse scores
  - Core Web Vitals
  - Load times
  - Bundle sizes

**Second Week:**
- [ ] Security audit
  - Review Firestore rules
  - Check for vulnerabilities
  - Update dependencies
  - Rotate API keys
- [ ] Database maintenance
  - Optimize indexes
  - Clean old data
  - Archive inactive users

**Third Week:**
- [ ] Feature usage analysis
  - Most used features
  - Least used features
  - User feedback review
  - A/B test results
- [ ] Content review
  - Popular posts
  - Successful events
  - Community trends

**Fourth Week:**
- [ ] Planning and improvements
  - Roadmap review
  - Sprint planning
  - Bug prioritization
  - Feature requests review
- [ ] Team retrospective
  - What went well
  - What to improve
  - Action items

### Error Monitoring

**Setup (Recommended: Sentry):**

```bash
npm install @sentry/nextjs
```

**Monitor:**
- JavaScript errors
- API errors
- Failed Firebase operations
- Performance issues

**Alert on:**
- Error rate > 1%
- Response time > 3s
- Failed logins > 100/hour
- 500 errors

### Performance Monitoring

**Metrics to track:**
- **Core Web Vitals:**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1

- **Custom Metrics:**
  - Time to First Byte (TTFB)
  - Time to Interactive (TTI)
  - Total Blocking Time (TBT)

**Tools:**
- Lighthouse CI
- WebPageTest
- Chrome DevTools
- Firebase Performance Monitoring

### Database Monitoring

**Firestore:**
- Document reads/writes per day
- Storage size
- Index usage
- Query performance

**Alerts:**
- Reads > 1M/day
- Writes > 500K/day
- Storage > 80% quota
- Failed queries > 1%

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Firebase Emulators Won't Start

**Problem:** Port already in use

```
Error: Port 8080 is already in use
```

**Solution:**

```bash
# Find process on port 8080
lsof -ti:8080

# Kill the process
lsof -ti:8080 | xargs kill -9

# Or use different ports in firebase.json
```

**Problem:** Emulator data corrupted

**Solution:**

```bash
# Delete emulator data
rm -rf firebase-emulator-data/

# Restart emulators
npm run emulators:start
```

#### 2. "Firebase Not Initialized" Error

**Problem:** Firebase app not initialized properly

**Solution:**

```bash
# Check environment variable
echo $NEXT_PUBLIC_FIREBASE_ENV

# Should be: local, dev, or prod
# If empty, set it:
export NEXT_PUBLIC_FIREBASE_ENV=local

# Restart dev server
npm run dev:local
```

**Problem:** Wrong environment config loaded

**Solution:**

```typescript
// Check lib/firebase/clientApp.ts
// Ensure getFirebaseConfig() returns correct config
console.log(process.env.NEXT_PUBLIC_FIREBASE_ENV);
```

#### 3. Seeding Fails with Authentication Error

**Problem:** Missing service account credentials

```
Error: Failed to initialize Firebase Admin SDK
```

**Solution for local:**

```bash
# Ensure emulators are running
npm run emulators:start

# In another terminal:
npm run seed:sprint1
```

**Solution for dev/prod:**

```bash
# Check .env.dev has FIREBASE_SERVICE_ACCOUNT_KEY
cat .env.dev | grep FIREBASE_SERVICE_ACCOUNT_KEY

# If missing, generate from Firebase Console:
# Settings > Service Accounts > Generate Private Key
```

#### 4. Tests Fail to Connect to Emulators

**Problem:** Emulators not running

```
Error: connect ECONNREFUSED 127.0.0.1:8080
```

**Solution:**

```bash
# Start emulators first
npm run emulators:start

# In another terminal:
npm run test:e2e:local
```

**Problem:** Wrong TEST_ENV

**Solution:**

```bash
# Ensure TEST_ENV is set
TEST_ENV=local npm run test:e2e

# Or update playwright.config.ts
```

#### 5. Build Fails with TypeScript Errors

**Problem:** Type errors

```
Error: Type 'string | undefined' is not assignable to type 'string'
```

**Solution:**

```bash
# Check types
npm run type-check

# Fix errors in code
# Common fixes:
// Add type guards
if (typeof value === 'string') { ... }

// Add default values
const name = user?.name ?? 'Unknown';

// Use type assertions carefully
const name = user!.name;
```

#### 6. Permission Denied When Running Scripts

**Problem:** Scripts not executable

```
bash: ./scripts/run-script.sh: Permission denied
```

**Solution:**

```bash
chmod +x scripts/run-script.sh
chmod +x scripts/*.sh

# Verify
ls -la scripts/
```

#### 7. Images Not Loading

**Problem:** Storage rules blocking access

**Solution:**

```bash
# Check storage.rules
cat storage.rules

# Deploy updated rules
firebase deploy --only storage:rules

# Or allow public read (dev only):
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 8. Slow Page Loads

**Problem:** Large bundle size

**Solution:**

```bash
# Analyze bundle
npm run build
npm run analyze  # If script exists

# Optimize:
# - Use dynamic imports
# - Remove unused dependencies
# - Optimize images
# - Enable compression
```

**Problem:** Too many Firestore reads

**Solution:**

```typescript
// Use pagination
const query = firestore()
  .collection('posts')
  .limit(20)
  .orderBy('createdAt', 'desc');

// Cache results
import { cache } from 'react';
const getCachedPosts = cache(async () => { ... });
```

#### 9. Admin Panel Not Accessible

**Problem:** User not admin

```
Error: Access denied
```

**Solution:**

```bash
# Seed admin user
npm run seed:sprint7

# Or manually set role in Firestore UI:
# users/{userId} -> role: 'admin'

# Login with:
# Email: admin.test@test.com
# Password: Test123!
```

#### 10. Deployment Fails

**Problem:** Firebase CLI not logged in

```
Error: Not authorized
```

**Solution:**

```bash
# Login to Firebase
firebase login

# Verify login
firebase projects:list

# Use correct project
firebase use dev  # or prod
```

**Problem:** Vercel deployment fails

**Solution:**

```bash
# Check environment variables
vercel env ls

# Pull env vars
vercel env pull

# Redeploy
vercel --prod
```

### Getting Help

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Playwright Docs](https://playwright.dev)

**Community:**
- GitHub Issues: [Report a bug](https://github.com/abhie1singh/zipparents-v1/issues)
- Team Slack: #zipparents-support
- Stack Overflow: Tag [zipparents]

**Support Channels:**
- Email: dev@zipparents.com
- Slack: #engineering
- Emergency: [On-call number]

---

## 🤝 Contributing

### Code Style Guide

**TypeScript:**
- Use strict TypeScript (`strict: true`)
- No `any` types (use `unknown` if needed)
- Define interfaces for all data structures
- Use enums for constants

**React:**
- Use functional components
- Use hooks over classes
- Keep components small and focused
- Extract reusable logic to hooks

**Naming Conventions:**
- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

**File Organization:**
- One component per file
- Co-locate tests with components
- Group related components in folders
- Keep files under 300 lines

### Commit Message Format

**Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Examples:**

```bash
# Feature
git commit -m "feat(auth): add password reset flow

- Add reset password page
- Implement email sending
- Add tests for reset flow"

# Bug fix
git commit -m "fix(feed): correct post timestamp display

The post timestamps were showing incorrect relative time.
Fixed by using date-fns format function."

# Documentation
git commit -m "docs: update deployment guide

Added section on environment variables"
```

### Pull Request Process

**1. Create PR from feature branch:**
- Title: Brief description
- Description: Detailed changes
- Link related issues
- Add screenshots for UI changes

**2. PR template:**

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.log statements
```

**3. Review process:**
- Request 1-2 reviewers
- Address all comments
- Update based on feedback
- Get approval before merging

**4. Merge requirements:**
- ✅ All tests passing
- ✅ No linting errors
- ✅ At least 1 approval
- ✅ Up to date with main

### Development Guidelines

**Before starting:**
- Check existing issues
- Create issue if doesn't exist
- Discuss approach in issue
- Get approval for large changes

**While developing:**
- Write tests for new features
- Update documentation
- Follow code style guide
- Make small, focused commits

**Before submitting:**
- Run all tests locally
- Check for linting errors
- Update CHANGELOG
- Self-review your code

---

## 📄 License and Legal

### License

**ISC License**

Copyright (c) 2024 ZipParents

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

### Legal Considerations

**Age Verification:**
- COPPA compliant (18+ requirement)
- Age verification enforced at signup
- Cannot create account if under 18

**Privacy:**
- Privacy Policy available at `/privacy`
- GDPR compliant data handling
- User data encryption at rest
- User can delete account and data

**Terms of Service:**
- Terms available at `/terms`
- Users must accept to create account
- Updates to terms notify users

**Content Moderation:**
- Community Guidelines at `/community-guidelines`
- Report and block functionality
- Admin moderation tools
- Content removal process

**Safety:**
- Safety tips at `/safety-tips`
- In-person meetup safety guidelines
- Required safety acknowledgment for events

**Data Security:**
- Firestore security rules enforced
- User data access restricted
- Admin actions logged
- Regular security audits

**Third-Party Services:**
- Firebase (Google) - Backend services
- Vercel - Hosting
- Google Analytics - Analytics

### Compliance Checklist

**COPPA (Children's Online Privacy Protection Act):**
- [x] 18+ age verification
- [x] Age gate at registration
- [x] No collection of children's data
- [x] Privacy policy includes COPPA statement

**GDPR (General Data Protection Regulation):**
- [x] Privacy policy available
- [x] Cookie consent banner
- [x] User data export capability
- [x] User data deletion capability
- [x] Data breach notification process

**Accessibility (WCAG 2.1 AA):**
- [x] Keyboard navigation
- [x] Screen reader support
- [x] Color contrast requirements
- [x] ARIA labels
- [x] Focus management

**Security:**
- [x] HTTPS enforced
- [x] Secure authentication
- [x] Input sanitization
- [x] XSS/CSRF protection
- [x] Rate limiting

---

## 🚀 Quick Start Commands

```bash
# Setup
git clone https://github.com/abhie1singh/zipparents-v1.git
cd zipparents-v1
npm install

# Development (Local)
npm run emulators:start    # Terminal 1
npm run seed:local         # Terminal 2 (once)
npm run dev                # Terminal 2

# Testing
npm run test:e2e:local     # All tests
npm run test:e2e:ui        # Interactive

# Deployment
npm run build:dev          # Dev build
npm run build:prod         # Prod build
```

---

## 📞 Support

**Development Team:**
- Email: dev@zipparents.com
- Slack: #zipparents-dev

**Issues:**
- GitHub: [Create Issue](https://github.com/abhie1singh/zipparents-v1/issues)

**Documentation:**
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Testing Guide](docs/TESTING.md)
- [User Guide](docs/USER-GUIDE.md)
- [Admin Guide](docs/ADMIN-GUIDE.md)

---

**Built with ❤️ by the ZipParents team**

🚀 **Happy coding!**
