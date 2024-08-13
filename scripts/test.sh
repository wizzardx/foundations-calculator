#!/bin/bash

set -euo pipefail

if [ ! -f node_modules/.bin/ncu ]; then
    npm install --save-dev npm-check-updates
fi

# Update packages to latest versions:
npm run update-deps

# Install Playwright browsers
npx playwright install

# Lints, checks and tests.
npm run type-check
npm run lint:fix
npm run lint
npm run format
npm run build
npm run security-check
npm run check-deps
npm run test:unit
npm run test:e2e
scripts/sonar-scanner.sh
echo "Lints, checks and tests completed successfully."
