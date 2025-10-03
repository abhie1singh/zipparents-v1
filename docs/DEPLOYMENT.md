# ZipParents Deployment Guide

## Overview

This guide covers deploying ZipParents to development and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Development Deployment](#development-deployment)
4. [Production Deployment](#production-deployment)
5. [Rollback Procedures](#rollback-procedures)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

- Node.js 18.x or higher
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Vercel CLI (`npm install -g vercel`)
- Git

### Required Access

- Firebase project access (zipparents-dev and zipparents-prod)
- Vercel team access
- GitHub repository access
- Domain management access (production only)

## Environment Configuration

### Development Environment

Create `.env.development`:

```bash
# Firebase Development
NEXT_PUBLIC_FIREBASE_API_KEY=your-dev-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zipparents-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zipparents-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zipparents-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-dev-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-dev-app-id

# App Configuration
NEXT_PUBLIC_APP_URL=https://zipparents-dev.vercel.app
NEXT_PUBLIC_ENV=development
```

### Production Environment

Create `.env.production`:

```bash
# Firebase Production
NEXT_PUBLIC_FIREBASE_API_KEY=your-prod-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=zipparents.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=zipparents-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=zipparents-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-prod-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-prod-app-id

# App Configuration
NEXT_PUBLIC_APP_URL=https://zipparents.com
NEXT_PUBLIC_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Development Deployment

### Quick Deploy

```bash
./scripts/deploy-dev.sh
```

### Manual Deployment

1. **Install Dependencies**
   ```bash
   npm ci
   ```

2. **Run Tests**
   ```bash
   npm run lint
   npm run type-check
   npm test
   ```

3. **Build Application**
   ```bash
   npm run build
   ```

4. **Deploy Firebase Resources**
   ```bash
   firebase deploy --only firestore:rules --project zipparents-dev
   firebase deploy --only firestore:indexes --project zipparents-dev
   firebase deploy --only storage --project zipparents-dev
   ```

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] Code reviewed and approved
- [ ] Tested in development environment
- [ ] Database migrations completed (if any)
- [ ] Backup created
- [ ] Team notified
- [ ] On `main` branch with clean working directory

### Deployment Process

```bash
./scripts/deploy-prod.sh
```

This script will:
1. ✓ Verify prerequisites
2. ✓ Run full test suite
3. ✓ Build production bundle
4. ✓ Create database backup
5. ✓ Deploy Firebase resources
6. ✓ Deploy to Vercel
7. ✓ Run health checks
8. ✓ Create release tag

### Manual Production Deployment

If you need to deploy manually:

1. **Verify Git Status**
   ```bash
   git status
   git checkout main
   git pull origin main
   ```

2. **Run Full Test Suite**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run test:e2e
   ```

3. **Build and Deploy**
   ```bash
   export NODE_ENV=production
   npm ci
   npm run build
   ```

4. **Deploy Firebase**
   ```bash
   firebase deploy --project zipparents-prod
   ```

5. **Deploy Vercel**
   ```bash
   vercel --prod --yes
   ```

6. **Tag Release**
   ```bash
   git tag -a v$(date +%Y.%m.%d-%H%M) -m "Production deployment"
   git push origin --tags
   ```

## Rollback Procedures

### Quick Rollback

```bash
./scripts/rollback-prod.sh v2024.01.15-1430
```

### Manual Rollback

1. **Find Previous Version**
   ```bash
   git tag -l "v*" | tail -10
   ```

2. **Checkout Version**
   ```bash
   git checkout v2024.01.15-1430
   ```

3. **Deploy**
   ```bash
   npm ci
   npm run build
   vercel --prod --yes
   ```

4. **Verify**
   ```bash
   curl https://zipparents.com/api/health
   ```

## Post-Deployment

### Verification Steps

1. **Health Check**
   ```bash
   curl https://zipparents.com/api/health
   ```

2. **Critical User Journeys**
   - [ ] User signup
   - [ ] User login
   - [ ] Create post
   - [ ] Create event
   - [ ] Send message
   - [ ] Search for parents

3. **Monitor Logs**
   - Check Vercel logs for errors
   - Check Firebase Console for errors
   - Monitor error tracking service

4. **Performance Check**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify page load times

### Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Error Tracking**: [Your service]
- **Analytics**: Google Analytics

## Troubleshooting

### Build Failures

**Issue**: TypeScript errors during build

```bash
npm run type-check
# Fix errors, then rebuild
npm run build
```

**Issue**: Missing environment variables

```bash
# Verify .env files exist
ls -la .env*

# Check Vercel environment variables
vercel env ls
```

### Deployment Failures

**Issue**: Firebase deployment fails

```bash
# Check Firebase login
firebase login --reauth

# Verify project
firebase projects:list

# Check rules syntax
firebase deploy --only firestore:rules --dry-run
```

**Issue**: Vercel deployment fails

```bash
# Check Vercel login
vercel whoami

# Re-link project
vercel link
```

### Runtime Errors

**Issue**: 500 errors after deployment

1. Check Vercel function logs
2. Verify environment variables
3. Check Firebase connection
4. Review recent code changes

**Issue**: Database connection issues

1. Verify Firebase credentials
2. Check Firestore rules
3. Verify indexes are deployed
4. Check quota limits

### Performance Issues

**Issue**: Slow page loads

1. Check bundle size: `npm run analyze`
2. Review Lighthouse report
3. Check Firebase query performance
4. Verify CDN is working

## Emergency Contacts

- **On-Call Engineer**: [Contact info]
- **DevOps**: [Contact info]
- **Firebase Support**: https://firebase.google.com/support

## Deployment Frequency

- **Development**: On every merged PR (auto-deploy)
- **Production**: Weekly releases or as needed for hotfixes

## Database Migrations

For database schema changes:

1. Create migration script in `scripts/migrations/`
2. Test in development
3. Run on production before deploying code
4. Document in `docs/MIGRATIONS.md`

## Feature Flags

Use feature flags for gradual rollouts:

```typescript
// Example
if (process.env.NEXT_PUBLIC_NEW_FEATURE_ENABLED === 'true') {
  // New feature code
}
```

## Security Considerations

- Never commit `.env` files
- Rotate API keys regularly
- Use secrets management for sensitive data
- Enable 2FA on all service accounts
- Review security rules before deployment

## Backup and Recovery

### Database Backups

- **Automatic**: Daily Firestore export (configured in Firebase Console)
- **Manual**: Run before major deployments
  ```bash
  gcloud firestore export gs://zipparents-backups/$(date +%Y%m%d)
  ```

### Restore from Backup

```bash
gcloud firestore import gs://zipparents-backups/2024-01-15
```

## Compliance

- Ensure GDPR compliance
- Verify data retention policies
- Check accessibility standards
- Review security headers
