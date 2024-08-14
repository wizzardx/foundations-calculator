#!/bin/bash

set -euo pipefail

if [ ! -f node_modules/.bin/ncu ]; then
    pnpm install --save-dev npm-check-updates
fi

# Update packages to latest versions:
pnpm run update-deps

# Install Playwright browsers
pnpm dlx playwright install

# Lints, checks and tests.
pnpm run type-check
pnpm run lint:fix
pnpm run lint
pnpm run format
pnpm run build
pnpm run security-check
pnpm run check-deps
pnpm run test:unit
pnpm run test:e2e
scripts/sonar-scanner.sh
echo "Lints, checks and tests completed successfully."
