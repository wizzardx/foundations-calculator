#!/bin/bash

set -euo pipefail
set -x

HOST_IP=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')

# Get the token to use with sonar
SONAR_TOKEN_FILE=.secrets/.sonar_token

if [ ! -f $SONAR_TOKEN_FILE ]; then
    echo "File $SONAR_TOKEN_FILE not found."
    echo "Please generate a token and then put it in that file."
    echo "See docs/generating_a_sonar_token.txt for details on how to generate a token."
    exit 1
fi
SONAR_TOKEN=$(cat .secrets/.sonar_token)

# Run tests and generate coverage report
pnpm run test:unit:coverage

# Run SonarQube scanner
docker run \
    --rm \
    -e SONAR_HOST_URL="http://$HOST_IP:9000" \
    -e SONAR_TOKEN="$SONAR_TOKEN" \
    -v "${PWD}:/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey=my:project
