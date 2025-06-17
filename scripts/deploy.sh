#!/bin/bash

# Config
BRANCH=${1:-"dev"}
REPO_URL="https://github.com/computacenter-ro/case-ai-pump-monitor"
PROJECT_DIR="/Users/ccro-macstudio-one/Documents/case-ai-predictive-maintenance/pump-monitor-flow"

echo "Starting deployment for Predictive Maintenance on branch: $BRANCH"

# 1. Stop already running container
echo "Stopping containers for Predictive Maintenance"
docker compose down

# 2. Update from git
echo "Updating code from git..."
cd $PROJECT_DIR
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# 3. Build and start the container
echo "Building and starting containers..."
docker compose up -d --build

# 4. Verify status
echo "Checking container status..."
docker compose ps

echo "Deployment complete!"