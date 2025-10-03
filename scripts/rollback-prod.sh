#!/bin/bash

###############################################################################
# Sprint 8: Production Rollback Script
#
# Rolls back production deployment to a previous version
###############################################################################

set -e  # Exit on error

echo "🔄 ZipParents Production Rollback"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get target version
TARGET_VERSION=$1

if [ -z "$TARGET_VERSION" ]; then
    echo "Available recent deployments:"
    git tag -l "v*" | tail -10
    echo ""
    read -p "Enter version to rollback to (e.g., v2024.01.15-1430): " TARGET_VERSION
fi

# Verify tag exists
if ! git rev-parse "$TARGET_VERSION" >/dev/null 2>&1; then
    echo -e "${RED}❌ Version $TARGET_VERSION not found${NC}"
    exit 1
fi

echo -e "${RED}⚠️  WARNING: Rolling back to $TARGET_VERSION${NC}"
echo ""
echo "This will:"
echo "  - Revert code to $TARGET_VERSION"
echo "  - Redeploy to production"
echo "  - Affect all live users immediately"
echo ""

read -p "Type 'ROLLBACK' to confirm: " confirmation
if [ "$confirmation" != "ROLLBACK" ]; then
    echo "Rollback cancelled."
    exit 1
fi

echo ""
echo "📋 Pre-rollback Checks"
echo "---------------------"

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Working directory not clean${NC}"
    git status
    exit 1
fi
echo "✓ Git working directory clean"

# Create backup tag of current state
BACKUP_TAG="backup-$(date +%Y%m%d-%H%M%S)"
git tag -a "$BACKUP_TAG" -m "Backup before rollback to $TARGET_VERSION"
echo "✓ Created backup tag: $BACKUP_TAG"

echo ""
echo "🔄 Rolling Back Code"
echo "-------------------"

# Checkout target version
git checkout "$TARGET_VERSION"
echo "✓ Checked out $TARGET_VERSION"

# Install dependencies for this version
echo "Installing dependencies for $TARGET_VERSION..."
npm ci

# Build
echo "Building application..."
npm run build || {
    echo -e "${RED}❌ Build failed for $TARGET_VERSION${NC}"
    echo "Returning to main branch..."
    git checkout main
    exit 1
}

echo ""
echo "☁️  Deploying Rollback to Production"
echo "------------------------------------"

# Deploy to Vercel
vercel --prod --yes || {
    echo -e "${RED}❌ Deployment failed${NC}"
    git checkout main
    exit 1
}

echo ""
echo "🔍 Verification"
echo "--------------"

echo "Waiting for deployment..."
sleep 15

# Health check
HEALTH_URL="https://zipparents.com/api/health"
if curl -f -s "$HEALTH_URL" > /dev/null; then
    echo "✓ Health check passed"
else
    echo -e "${RED}❌ Health check failed after rollback${NC}"
fi

echo ""
echo -e "${GREEN}✅ Rollback Complete${NC}"
echo "==================="
echo ""
echo "Rolled back to: $TARGET_VERSION"
echo "Backup tag created: $BACKUP_TAG"
echo ""
echo "📝 Next Steps:"
echo "   1. Verify critical functionality is working"
echo "   2. Identify root cause of issue that required rollback"
echo "   3. Fix the issue in a new branch"
echo "   4. Deploy fix after thorough testing"
echo ""
echo "To return to main branch:"
echo "   git checkout main"
echo ""
