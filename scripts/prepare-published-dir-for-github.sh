#!/bin/bash

# Error checking:
set -euo pipefail

# Display every line as it runs in this shell script:
set -x

# Build the javascript bundle.js file.
pnpm run build

# Remove our published dir so we can rebuild it from scratch:
rm -rvf published

# Build published dir from scratch:
mkdir -p published/dist
cp dist/bundle.js published/dist/
cp calculator.html published/
cp styles.css published/
