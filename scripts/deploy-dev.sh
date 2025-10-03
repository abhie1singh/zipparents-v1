#!/bin/bash

###############################################################################
# Sprint 8: Development Deployment Script
#
# Deploys the application to development environment
###############################################################################

set -e  # Exit on error

echo "🚀 ZipParents Development Deployment"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Confirmation
echo -e "${YELLOW}⚠️  This will deploy to the DEVELOPMENT environment.${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "📋 Pre-deployment Checklist"
echo "------------------------"

# Check Node version
NODE_VERSION=$(node --version)
echo "✓ Node version: $NODE_VERSION"

# Check if .env.development exists
if [ ! -f ".env.development" ]; then
    echo -e "${RED}❌ .env.development file not found${NC}"
    exit 1
fi
echo "✓ Environment file found"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found. Install with: npm install -g firebase-tools${NC}"
    exit 1
fi
echo "✓ Firebase CLI installed"

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase. Logging in...${NC}"
    firebase login
fi
echo "✓ Firebase authenticated"

echo ""
echo "🧪 Running Tests"
echo "---------------"

# Run linter
echo "Running ESLint..."
npm run lint || {
    echo -e "${YELLOW}⚠️  Linting warnings found. Continue anyway? (y/n)${NC}"
    read -p "" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

# Run TypeScript check
echo "Running TypeScript check..."
npm run type-check || {
    echo -e "${RED}❌ TypeScript errors found. Please fix before deploying.${NC}"
    exit 1
}

# Run tests
echo "Running unit tests..."
npm test -- --run || {
    echo -e "${YELLOW}⚠️  Some tests failed. Continue anyway? (y/n)${NC}"
    read -p "" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

echo ""
echo "🏗️  Building Application"
echo "----------------------"

# Set environment to development
export NEXT_PUBLIC_ENV=development

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building Next.js application..."
npm run build || {
    echo -e "${RED}❌ Build failed. Check the errors above.${NC}"
    exit 1
}

echo ""
echo "🔧 Deploying Firebase Resources"
echo "-------------------------------"

# Deploy Firestore rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules --project zipparents-dev

# Deploy Firestore indexes
echo "Deploying Firestore indexes..."
firebase deploy --only firestore:indexes --project zipparents-dev

# Deploy Storage rules
echo "Deploying Storage security rules..."
firebase deploy --only storage --project zipparents-dev

echo ""
echo "☁️  Deploying to Vercel (Development)"
echo "------------------------------------"

# Deploy to Vercel
if command -v vercel &> /dev/null; then
    vercel --prod --yes || {
        echo -e "${RED}❌ Vercel deployment failed${NC}"
        exit 1
    }
else
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Install with: npm i -g vercel${NC}"
    echo "Skipping Vercel deployment. Deploy manually via Vercel dashboard."
fi

echo ""
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "====================="
echo ""
echo "🌐 Development URLs:"
echo "   Frontend: https://zipparents-dev.vercel.app"
echo "   Firebase Console: https://console.firebase.google.com/project/zipparents-dev"
echo ""
echo "📝 Next Steps:"
echo "   1. Verify the deployment at the URL above"
echo "   2. Run smoke tests to ensure critical functionality works"
echo "   3. Check error monitoring dashboard"
echo ""
echo "🔍 Monitoring:"
echo "   - Vercel Analytics: https://vercel.com/dashboard"
echo "   - Firebase Console: https://console.firebase.google.com"
echo ""
