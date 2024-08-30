#!/bin/bash

set -euo pipefail
set -x

HOST_IP=$(ip -4 addr show docker0 | grep -Po 'inet \K[\d.]+')

# Get the current working directory basename
CWD_BASENAME=$(basename "$PWD")

# Define the container name
CONTAINER_NAME="sonarqube_$CWD_BASENAME"

# Check if SonarQube container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "SonarQube container is not running. Starting it..."

    # Create the sonarqube_data directory if it doesn't exist
    mkdir -p "$PWD/sonarqube_data"

    # Remove the container if it exists but is not running
    docker rm -f "${CONTAINER_NAME}" 2>/dev/null || true

    # Start the SonarQube container
    docker run -d --name "${CONTAINER_NAME}" \
      -p 9000:9000 \
      -v "$PWD/sonarqube_data:/opt/sonarqube/data" \
      -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
      sonarqube:latest

    echo "Waiting for SonarQube to start..."
    sleep 30  # Adjust this value if needed
else
    echo "SonarQube container is already running."
fi

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
    sonarsource/sonar-scanner-cli
