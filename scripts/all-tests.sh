#!/bin/bash

# Error checking:
set -euo pipefail

# Display every line as it runs in this shell script:
set -x

# Tidy up auto-generated files.
rm -rf node_modules
rm -rf dist
rm -rf e2e/dist
rm -f pnpm-lock.yaml

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
pnpm run test:unit:coverage
pnpm run test:e2e
scripts/sonar-scanner.sh
echo "Lints, checks and tests completed successfully."
