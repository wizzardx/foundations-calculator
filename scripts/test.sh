#!/bin/bash

set -euo pipefail

npm run build
npm test
