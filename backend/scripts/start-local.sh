#!/bin/bash

# Script to start local development environment
# Starts DynamoDB Local and SAM Local API

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 Starting local development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "❌ SAM CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Detect Docker Compose command (v2 uses 'docker compose', v1 uses 'docker-compose')
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Desktop or docker-compose."
    exit 1
fi

# Start DynamoDB Local using docker-compose
echo "📦 Starting DynamoDB Local..."
cd "$BACKEND_DIR"
if docker ps | grep -q dynamodb-local; then
    echo "✅ DynamoDB Local is already running"
else
    $DOCKER_COMPOSE_CMD up -d
    echo "⏳ Waiting for DynamoDB Local to be ready..."
    sleep 3
fi

# Create the Notes table if it doesn't exist
echo "📋 Setting up Notes table..."
if aws dynamodb describe-table \
    --endpoint-url http://localhost:8000 \
    --region local \
    --table-name Notes \
    --no-cli-pager \
    > /dev/null 2>&1; then
    echo "✅ Notes table already exists"
else
    echo "📋 Creating Notes table..."
    aws dynamodb create-table \
        --endpoint-url http://localhost:8000 \
        --region local \
        --table-name Notes \
        --attribute-definitions \
            AttributeName=id,AttributeType=S \
            AttributeName=createdAt,AttributeType=S \
        --key-schema AttributeName=id,KeyType=HASH \
        --global-secondary-indexes \
            "IndexName=CreatedAtIndex,KeySchema=[{AttributeName=createdAt,KeyType=HASH},{AttributeName=id,KeyType=RANGE}],Projection={ProjectionType=ALL}" \
        --billing-mode PAY_PER_REQUEST \
        --no-cli-pager \
        > /dev/null 2>&1
    
    echo "⏳ Waiting for table to be active..."
    aws dynamodb wait table-exists \
        --endpoint-url http://localhost:8000 \
        --region local \
        --table-name Notes \
        --no-cli-pager
    echo "✅ Notes table created successfully"
fi

# Build SAM application
echo ""
echo "🔨 Building SAM application..."
cd "$BACKEND_DIR"
sam build

# Start SAM Local API
echo ""
echo "🌐 Starting SAM Local API Gateway..."
echo "   API will be available at: http://localhost:3000"
echo "   DynamoDB Local is running at: http://localhost:8000"
echo "   Note: Lambda functions use host.docker.internal to access DynamoDB Local"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Start SAM local API (use env.json if it exists, otherwise use defaults)
# env.json contains DYNAMODB_ENDPOINT set to host.docker.internal:8000
# This allows Lambda containers to access DynamoDB Local on the host machine
if [ -f "$BACKEND_DIR/env.json" ]; then
    sam local start-api --port 3000 --env-vars env.json
else
    sam local start-api --port 3000
fi

