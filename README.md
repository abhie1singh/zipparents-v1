# ZipParents - Connect, Share, Support

A Next.js-based social platform for parents to connect, share experiences, and find local support within their zip code communities.

## 📋 Table of Contents

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
# Run tests against local environment
npm run test:e2e:local

# Run tests against dev environment
npm run test:e2e:dev

# Run tests against production environment
npm run test:e2e:prod

# Run tests in UI mode
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

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
# Seed users only
npm run seed:users

# Seed comprehensive test data (users, posts, groups, events, etc.)
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

### Test Accounts

After seeding, these accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@zipparents.com | Admin123! | Admin |
| test@example.com | Test123! | User |
| sarah@example.com | Test123! | User |
| mike@example.com | Test123! | User |
| emily@example.com | Test123! | User |

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
