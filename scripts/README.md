# Seed Scripts Documentation

Comprehensive seed data scripts for ZipParents application.

## Overview

These scripts populate your Firebase database with realistic test data including users, profiles, connections, messages, events, and reports.

## Quick Start

### Seed Everything (Recommended)

```bash
# Local environment (emulators)
npm run seed:all

# Dev environment
npm run seed:all:dev
```

This runs all seed scripts in the correct order and creates:
- 50 test users with various statuses
- 50 complete profiles
- 1 admin user
- ~125 connections between users
- ~75 conversations with messages
- 150 events (past, current, and future)
- 25 sample reports for moderation

**Total time:** ~30-60 seconds

## Individual Seed Scripts

Run scripts individually if you only need specific data:

### 1. Seed Users
Creates 50 test users with realistic data.

```bash
# Local
npm run seed:users:new

# Dev
npm run seed:users:new:dev
```

**Creates:**
- 50 users with names from common US names
- Emails: `firstname.lastname{number}@test.com`
- Password: `Test123!` (all users)
- Ages: 25-50 years old
- Zip codes: Distributed across major US cities
- Status: ~90% active, ~5% suspended, ~5% banned
- Verification: ~80% verified, ~20% unverified

**Credentials saved to:** `seed-credentials.json`

### 2. Seed Profiles
Creates complete profiles for all existing users.

```bash
# Local
npm run seed:profiles

# Dev
npm run seed:profiles:dev
```

**Creates:**
- Bio: Random from realistic parent bios
- Interests: 3-7 random interests per user
- Age ranges: 1-3 children age ranges per user
- Profile pictures: ~70% with placeholder avatars
- Phone numbers: ~50% provided

### 3. Seed Admin
Creates admin user with proper permissions.

```bash
# Local
npm run seed:admin

# Dev
npm run seed:admin:dev
```

**Creates:**
- Email: `admin@zipparents.com`
- Password: `Admin123!`
- Role: admin
- Custom claims: `{ admin: true, role: 'admin' }`
- Full profile with admin designation

### 4. Seed Connections
Creates connections between users.

```bash
# Local
npm run seed:connections

# Dev
npm run seed:connections:dev
```

**Creates:**
- ~125 connections (avg 2.5 per user)
- Status: ~70% accepted, ~20% pending, ~10% declined
- Connection dates: Within last 60 days

### 5. Seed Messages
Creates conversations and messages between connected users.

```bash
# Local
npm run seed:messages

# Dev
npm run seed:messages:dev
```

**Creates:**
- ~75 conversations (~60% of accepted connections)
- 1-10 messages per conversation
- Message dates: Within last 30 days
- Read status: Most read, some unread
- Unread count: 0-2 per user

### 6. Seed Events
Creates events with various dates and RSVPs.

```bash
# Local
npm run seed:events

# Dev
npm run seed:events:dev
```

**Creates:**
- 150 events total
- Distribution: ~30% past, ~10% today, ~60% future
- Locations: Based on user zip codes
- Categories: Playdate, Workshop, Sports, Educational, Social, Arts
- Age ranges: 1-3 per event
- Attendees: 0 to max capacity
- Public/Private: ~80% public, ~20% private

### 7. Seed Reports
Creates sample reports for testing moderation.

```bash
# Local
npm run seed:reports

# Dev
npm run seed:reports:dev
```

**Creates:**
- 25 sample reports
- Types: user, post, event, message
- Status: ~60% pending, ~30% resolved, ~10% dismissed
- Severity: ~50% low, ~30% medium, ~20% high
- Moderation logs for resolved reports

## Clear All Data

**⚠️ WARNING:** This deletes ALL data from your database!

```bash
# Local
npm run clear:all

# Dev
npm run clear:all:dev
```

**Deletes:**
- All Firestore collections
- All Auth users
- Credentials file (`seed-credentials.json`)

**Safety:**
- Requires confirmation prompt
- Disabled for production environment
- Shows collection counts before deletion

## Environment Variables

All scripts accept environment argument:

- `local` - Uses Firebase emulators (default)
- `dev` - Uses dev Firebase project
- `prod` - Not supported for safety

**Set via npm scripts:**
```bash
npm run seed:all        # local
npm run seed:all:dev    # dev
```

**Or set directly:**
```bash
FIREBASE_ENV=local tsx scripts/seed-all.ts
FIREBASE_ENV=dev tsx scripts/seed-all.ts
```

## Credentials

After running seed scripts, credentials are saved to `seed-credentials.json`:

```json
[
  {
    "email": "sarah.smith0@test.com",
    "password": "Test123!",
    "displayName": "Sarah Smith",
    "role": "user"
  },
  {
    "email": "admin@zipparents.com",
    "password": "Admin123!",
    "displayName": "Admin User",
    "role": "admin"
  }
]
```

## Common Workflows

### 1. Fresh Database Setup

```bash
# Clear old data (optional)
npm run clear:all

# Seed everything
npm run seed:all
```

### 2. Add More Users

```bash
# Just run seed:users again (idempotent)
npm run seed:users:new

# Then create their profiles
npm run seed:profiles
```

### 3. Reset for Testing

```bash
# Clear and re-seed
npm run clear:all && npm run seed:all
```

### 4. Dev Environment Setup

```bash
# One-time setup for dev environment
npm run seed:all:dev
```

## Script Features

All scripts include:

✅ **Progress logging** - Real-time progress with percentages
✅ **Idempotent** - Safe to run multiple times
✅ **Error handling** - Graceful failures with error messages
✅ **Environment-aware** - Works with local/dev/prod
✅ **Batch operations** - Efficient Firestore batch writes
✅ **Realistic data** - Names, locations, dates, content

## File Structure

```
scripts/
├── README.md                    # This file
├── utils/
│   └── firebase-admin.ts        # Firebase Admin SDK utilities
├── seed-all.ts                  # Master script (runs all)
├── seed-users.ts                # Create 50 users
├── seed-profiles.ts             # Create profiles
├── seed-connections.ts          # Create connections
├── seed-messages.ts             # Create conversations/messages
├── seed-events.ts               # Create 150 events
├── seed-reports.ts              # Create 25 reports
├── seed-admin.ts                # Create admin user
└── clear-all.ts                 # Delete all data
```

## Firebase Admin Utilities

The `utils/firebase-admin.ts` module provides:

- `initializeAdmin(env)` - Initialize Firebase Admin SDK
- `getFirestore()` - Get Firestore instance
- `getAuth()` - Get Auth instance
- `createUser(data)` - Create user in Auth + Firestore
- `batchWrite(operations)` - Batch write helper
- `deleteCollection(path)` - Delete entire collection
- `deleteAllAuthUsers()` - Delete all Auth users
- `setUserClaims(uid, claims)` - Set custom claims
- `ProgressLogger` - Progress tracking utility
- `saveCredentials()` - Save credentials to JSON
- `confirmAction()` - Confirmation prompt

## Troubleshooting

### Error: Cannot find module 'firebase-admin'

```bash
npm install firebase-admin
```

### Error: Firestore emulator not running

Start emulators first:
```bash
npm run emulators:start
```

### Error: Service account key not found

For dev/prod environments:
1. Download service account key from Firebase Console
2. Save as `firebase-service-account-dev.json` (or `-prod.json`)
3. Place in project root

### Slow performance

- Reduce counts in script files
- Run individual scripts instead of `seed:all`
- Check network connection for dev/prod

### Credentials not saved

- Check write permissions in project directory
- Look for `seed-credentials.json` in project root
- Re-run the script

## Best Practices

1. **Always use emulators for local development**
   ```bash
   npm run emulators:start
   ```

2. **Clear before re-seeding for clean state**
   ```bash
   npm run clear:all && npm run seed:all
   ```

3. **Backup production before seeding dev**
   - Never seed production directly
   - Test scripts in local first

4. **Keep credentials file secure**
   - Add to `.gitignore`
   - Don't commit to version control

5. **Monitor progress**
   - Scripts show progress and counts
   - Check for errors in output

## NPM Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run seed:all` | Seed all data (local) |
| `npm run seed:all:dev` | Seed all data (dev) |
| `npm run seed:users:new` | Create 50 users |
| `npm run seed:profiles` | Create profiles |
| `npm run seed:connections` | Create connections |
| `npm run seed:messages` | Create messages |
| `npm run seed:events` | Create events |
| `npm run seed:reports` | Create reports |
| `npm run seed:admin` | Create admin user |
| `npm run clear:all` | Delete all data |
| `npm run clear:all:dev` | Delete all data (dev) |

All commands have `:dev` variants for dev environment.

## Support

For issues or questions:
1. Check this README
2. Review script output for errors
3. Check Firebase Console for data
4. Verify emulators are running (local)
5. Check service account keys (dev/prod)

---

**Last Updated:** January 2025
**Version:** 1.0.0
