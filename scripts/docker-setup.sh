#!/bin/bash

# Docker setup script for Verdict 360
set -e

echo "🐳 Setting up Verdict 360 with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your actual API keys before continuing"
    echo "   - Gmail credentials"
    echo "   - Stripe API keys"
    echo "   - Other configuration values"
    read -p "Press Enter when you've updated the .env file..."
fi

# Choose environment
echo "🔧 Which environment do you want to run?"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
read -p "Choose (1 or 2): " env_choice

if [ "$env_choice" = "1" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    echo "🛠️  Starting development environment..."
else
    COMPOSE_FILE="docker-compose.yml"
    echo "🏭 Starting production environment..."
fi

# Stop any existing containers
echo "🛑 Stopping any existing containers..."
docker-compose -f $COMPOSE_FILE down

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f $COMPOSE_FILE up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations and seeds
echo "📊 Setting up database..."
if [ "$env_choice" = "1" ]; then
    docker-compose -f $COMPOSE_FILE exec app-dev npm run db:setup
else
    docker-compose -f $COMPOSE_FILE exec app npm run db:setup
fi

# Setup Ollama models
echo "🤖 Setting up AI models..."
./scripts/setup-ollama.sh

# Show status
echo "📋 Container status:"
docker-compose -f $COMPOSE_FILE ps

# Show logs
echo "📜 Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo ""
echo "🎉 Verdict 360 is now running!"
echo ""
echo "📍 Access points:"
echo "   - Application: http://localhost:3000"
if [ "$env_choice" = "1" ]; then
    echo "   - Frontend Dev Server: http://localhost:3001"
fi
echo "   - Database: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Ollama API: http://localhost:11434"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   - Stop services: docker-compose -f $COMPOSE_FILE down"
echo "   - Restart services: docker-compose -f $COMPOSE_FILE restart"
echo "   - Access app container: docker-compose -f $COMPOSE_FILE exec app-dev bash"
echo ""
echo "🧪 Test the setup:"
echo "   curl http://localhost:3000/health"