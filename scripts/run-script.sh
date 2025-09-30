#!/bin/bash

# Helper script to run TypeScript scripts with proper environment setup
# Usage: ./scripts/run-script.sh <script-path> [args...]

set -e

SCRIPT_PATH=$1
shift  # Remove first argument

# Load environment variables based on FIREBASE_ENV
if [ "$FIREBASE_ENV" = "prod" ]; then
  if [ -f .env.prod ]; then
    export $(cat .env.prod | grep -v '^#' | xargs)
  fi
elif [ "$FIREBASE_ENV" = "dev" ]; then
  if [ -f .env.dev ]; then
    export $(cat .env.dev | grep -v '^#' | xargs)
  fi
else
  if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
  fi
fi

# Run the TypeScript script
npx tsx "$SCRIPT_PATH" "$@"
