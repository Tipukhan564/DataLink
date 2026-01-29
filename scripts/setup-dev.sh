#!/bin/bash

# CDUP Development Environment Setup Script
# Usage: ./scripts/setup-dev.sh

set -e

echo "=========================================="
echo "  CDUP Development Environment Setup"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ $1 found${NC}"
}

echo ""
echo "Checking prerequisites..."
check_command java
check_command node
check_command npm

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}Error: Java 17+ is required (found: $JAVA_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java $JAVA_VERSION${NC}"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js 18+ is required (found: $NODE_VERSION)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

echo ""
echo "Setting up backend..."
cd backend

if [ ! -f "mvnw" ]; then
    echo -e "${YELLOW}Maven wrapper not found, using system Maven${NC}"
    mvn clean install -DskipTests
else
    chmod +x mvnw
    ./mvnw clean install -DskipTests
fi

echo ""
echo "Setting up frontend..."
cd ../frontend

echo "Installing npm dependencies..."
npm install

echo ""
echo "=========================================="
echo -e "${GREEN}  Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "To start the development servers:"
echo ""
echo "  Backend:  cd backend && ./mvnw spring-boot:run"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Default credentials:"
echo "  Admin:      admin / Admin@123"
echo "  Supervisor: supervisor1 / Super@123"
echo "  Agent:      agent1 / Agent@123"
echo ""
