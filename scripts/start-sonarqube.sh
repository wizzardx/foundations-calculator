#!/bin/bash

set -euo pipefail

# Get the current working directory basename
CWD_BASENAME=$(basename "$PWD")

# Create the sonarqube_data directory if it doesn't exist
mkdir -p "$PWD/sonarqube_data"

# Run the Docker container
docker run -d --name "sonarqube_$CWD_BASENAME" \
  -p 9000:9000 \
  -v "$PWD/sonarqube_data:/opt/sonarqube/data" \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:latest
