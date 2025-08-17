#!/bin/bash

# Setup script for Ollama in Docker container
echo "🤖 Setting up Ollama AI models..."

# Wait for Ollama service to be ready
echo "⏳ Waiting for Ollama service to start..."
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    echo "   Ollama not ready yet, waiting 5 seconds..."
    sleep 5
done

echo "✅ Ollama service is ready!"

# Pull required models
echo "📥 Pulling Llama 3.1 8B model (this may take several minutes)..."
docker exec verdict360-ollama ollama pull llama3.1:8b

# Verify model is available
echo "🔍 Verifying model installation..."
if docker exec verdict360-ollama ollama list | grep -q "llama3.1:8b"; then
    echo "✅ Llama 3.1 8B model installed successfully!"
else
    echo "❌ Failed to install Llama model"
    exit 1
fi

# Test model with a simple query
echo "🧪 Testing model with a simple legal question..."
docker exec verdict360-ollama ollama run llama3.1:8b "What is the legal age of majority in South Africa? Please provide a brief answer."

echo "🎉 Ollama setup complete!"