#!/bin/bash

# Start CDUP Backend Server
# Usage: ./scripts/start-backend.sh [profile]

PROFILE=${1:-dev}

echo "Starting CDUP Backend (profile: $PROFILE)..."

cd "$(dirname "$0")/../backend"

if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw spring-boot:run -Dspring-boot.run.profiles=$PROFILE
else
    mvn spring-boot:run -Dspring-boot.run.profiles=$PROFILE
fi
