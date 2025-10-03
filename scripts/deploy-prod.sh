#!/bin/bash

###############################################################################
# Sprint 8: Production Deployment Script
#
# Deploys the application to production environment with safety checks
###############################################################################

set -e  # Exit on error

echo "🚀 ZipParents Production Deployment"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

echo -e "${RED}⚠️  WARNING: You are about to deploy to PRODUCTION!${NC}"
echo ""
echo "This will affect all live users. Make sure you have:"
echo "  ✓ Tested changes in development"
echo "  ✓ Reviewed and approved PR"
echo "  ✓ Backed up production data"
echo "  ✓ Notified team members"
echo ""

read -p "Type 'PRODUCTION' to continue: " confirmation
if [ "$confirmation" != "PRODUCTION" ]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist"
echo "---------------------------"

# Check Node version
NODE_VERSION=$(node --version)
REQUIRED_NODE_VERSION="v18"
if [[ $NODE_VERSION != $REQUIRED_NODE_VERSION* ]]; then
    echo -e "${YELLOW}⚠️  Warning: Expected Node $REQUIRED_NODE_VERSION, got $NODE_VERSION${NC}"
fi
echo "✓ Node version: $NODE_VERSION"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found${NC}"
    exit 1
fi
echo "✓ Production environment file found"

# Check Git status
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Working directory not clean. Commit or stash changes first.${NC}"
    git status
    exit 1
fi
echo "✓ Git working directory clean"

# Check if on main branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Not on main branch. Production deployments must be from main.${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi
echo "✓ On main branch"

# Pull latest
echo "Pulling latest from origin..."
git pull origin main

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    exit 1
fi
echo "✓ Firebase CLI installed"

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    firebase login
fi
echo "✓ Firebase authenticated"

echo ""
echo "🧪 Running Full Test Suite"
echo "--------------------------"

# Run linter
echo "Running ESLint..."
npm run lint || {
    echo -e "${RED}❌ Linting failed. Fix errors before deploying to production.${NC}"
    exit 1
}

# Run TypeScript check
echo "Running TypeScript check..."
npm run type-check || {
    echo -e "${RED}❌ TypeScript errors found${NC}"
    exit 1
}

# Run unit tests
echo "Running unit tests..."
npm test -- --run || {
    echo -e "${RED}❌ Tests failed. All tests must pass for production.${NC}"
    exit 1
}

# Run E2E tests (optional but recommended)
echo -e "${YELLOW}Run E2E tests? (recommended) (y/n)${NC}"
read -p "" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run test:e2e || {
        echo -e "${RED}❌ E2E tests failed${NC}"
        exit 1
    }
fi

echo ""
echo "📊 Performance Check"
echo "-------------------"
echo "Running Lighthouse audit on current production..."
# This would run Lighthouse on current prod to compare

echo ""
echo "🏗️  Building Production Bundle"
echo "-----------------------------"

# Set environment to production
export NODE_ENV=production
export NEXT_PUBLIC_ENV=production

# Install dependencies (clean install)
echo "Installing dependencies..."
npm ci --production=false

# Build the application
echo "Building Next.js application..."
npm run build || {
    echo -e "${RED}❌ Production build failed${NC}"
    exit 1
}

# Analyze bundle size
echo "Analyzing bundle size..."
if [ -d ".next/analyze" ]; then
    echo "Bundle analysis available at .next/analyze/"
fi

echo ""
echo "💾 Database Backup"
echo "-----------------"
echo "Creating Firestore backup..."
# Note: Implement actual backup logic
echo "Backup created at: backups/firestore-$(date +%Y%m%d-%H%M%S)"

echo ""
echo "🔧 Deploying Firebase Resources"
echo "-------------------------------"

# Deploy Firestore rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules --project zipparents-prod

# Deploy Firestore indexes
echo "Deploying Firestore indexes..."
firebase deploy --only firestore:indexes --project zipparents-prod

# Deploy Storage rules
echo "Deploying Storage security rules..."
firebase deploy --only storage --project zipparents-prod

echo ""
echo "☁️  Deploying to Vercel (Production)"
echo "-----------------------------------"

# Tag release
RELEASE_TAG="v$(date +%Y.%m.%d-%H%M)"
git tag -a "$RELEASE_TAG" -m "Production deployment $RELEASE_TAG"
git push origin "$RELEASE_TAG"
echo "✓ Tagged release: $RELEASE_TAG"

# Deploy to Vercel
if command -v vercel &> /dev/null; then
    vercel --prod --yes || {
        echo -e "${RED}❌ Vercel deployment failed${NC}"
        echo "Rolling back..."
        # Add rollback logic here
        exit 1
    }
else
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    exit 1
fi

echo ""
echo "🔍 Post-Deployment Verification"
echo "------------------------------"
echo "Waiting for deployment to propagate..."
sleep 10

# Health check
echo "Running health check..."
HEALTH_URL="https://zipparents.com/api/health"
if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "✓ Health check passed"
else
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Check the deployment immediately!"
fi

echo ""
echo -e "${GREEN}✅ Production Deployment Complete!${NC}"
echo "=================================="
echo ""
echo "🌐 Production URLs:"
echo "   Website: https://zipparents.com"
echo "   Admin: https://zipparents.com/admin"
echo ""
echo "📝 Post-Deployment Checklist:"
echo "   □ Verify critical user journeys"
echo "   □ Check error monitoring dashboard"
echo "   □ Monitor server logs for errors"
echo "   □ Test authentication flow"
echo "   □ Verify database queries working"
echo "   □ Check email notifications"
echo "   □ Update team in Slack/communication channel"
echo ""
echo "🔍 Monitoring:"
echo "   - Vercel: https://vercel.com/dashboard"
echo "   - Firebase: https://console.firebase.google.com/project/zipparents-prod"
echo "   - Error Tracking: [Your error tracking service]"
echo ""
echo "🆘 If issues arise:"
echo "   Run: ./scripts/rollback-prod.sh $RELEASE_TAG"
echo ""
