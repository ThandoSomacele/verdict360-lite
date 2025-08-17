# 🚀 Verdict 360 - Quick Start Guide

## 🎯 What You've Built

A complete **AI-powered legal chatbot SaaS platform** with:

✅ **Multi-tenant backend** (Express.js + PostgreSQL + Redis)  
✅ **AI chatbot service** (Ollama + Llama 3.1/3.2 integration)  
✅ **Real-time chat** (Socket.IO)  
✅ **React frontend** with professional chat widget  
✅ **South African legal knowledge base**  
✅ **Database with realistic seed data**  

## 🔧 Prerequisites

Before you start, install:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL 12+** - [Download here](https://postgresql.org/download/)
3. **Redis 6+** - [Download here](https://redis.io/download)
4. **Ollama** - [Download here](https://ollama.ai/download)

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Database
```bash
# Make sure PostgreSQL is running
createdb verdict360_dev
npm run db:setup
```

### 3. Start Redis
```bash
# On macOS with Homebrew:
brew services start redis

# On Linux:
sudo systemctl start redis

# Or run manually:
redis-server
```

### 4. Install & Start Ollama AI Model
```bash
# Install Ollama (if not done yet)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull Llama model
ollama pull llama3.1:8b

# Start Ollama service
ollama serve
```

### 5. Start the Application
```bash
npm run dev
```

**That's it!** 🎉

- **Frontend**: http://localhost:3001 (law firm website with chat widget)
- **Backend**: http://localhost:3000 (API server)
- **Chat Widget**: Click the blue chat button on the demo website

## 🧪 Test the Complete Flow

1. **Visit** http://localhost:3001
2. **Click** the chat widget button (bottom-right)
3. **Try these messages:**
   - "I was arrested for theft, what should I do?"
   - "I want to get divorced, how does this work?"
   - "Can you help me with a property transfer?"
   - "I need a consultation"

The AI will:
- Answer with South African legal information
- Offer consultations for complex matters
- Collect contact information
- Create leads in the database

## 📊 Check What's Working

Run the test script to verify everything is connected:

```bash
npm run test:setup
```

This checks:
- ✅ Database connection & seed data
- ✅ Redis connection
- ✅ Environment variables
- ✅ Application health

## 🎪 Demo Tenants Available

The system comes with realistic demo data:

### 1. Smith & Associates (default)
- **Access**: http://localhost:3001 
- **Specialties**: Criminal Law, Family Law, Property Law
- **Sample Data**: 3 leads, conversation history

### 2. Cape Town Legal Solutions  
- **Access**: Use tenant ID in API calls
- **Specialties**: Corporate Law, Commercial Law, Maritime Law
- **Status**: Trial account

### 3. Pretoria Family Law Center
- **Access**: Use tenant ID in API calls  
- **Specialties**: Divorce, Child Custody, Maintenance
- **Status**: Trial account

## 🔧 Development Commands

```bash
# Start full development environment
npm run dev

# Start only backend
npm run server:dev

# Start only frontend  
npm run client:dev

# Database operations
npm run db:migrate    # Run migrations
npm run db:seed      # Seed sample data
npm run db:rollback  # Rollback migrations
npm run db:setup     # Fresh setup (migrate + seed)

# Code quality
npm run lint         # Check code style
npm run typecheck    # Check TypeScript types
npm test            # Run tests
```

## 🌐 API Endpoints

### Core APIs:
- `GET /api/health` - System health
- `POST /api/ai/chat` - Send message to AI
- `POST /api/chat/conversations` - Start conversation
- `GET /api/tenants/current` - Get tenant info
- `POST /api/leads` - Create new lead

### Test the AI:
```bash
curl -X POST http://localhost:3000/api/ai/test \
  -H "Content-Type: application/json" \
  -d '{"message": "I need help with a divorce"}'
```

## 🏗️ Architecture Overview

```
src/
├── server/                 # Express.js Backend
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic (AI, Chat, etc.)
│   ├── middleware/        # Auth, tenant resolution, rate limiting
│   ├── models/           # Database models
│   └── config/           # Database, Redis, prompts
└── client/               # React Frontend
    ├── components/       # Chat widget, messages, etc.
    ├── services/         # API calls, Socket.IO
    └── types/           # TypeScript definitions
```

## 🚨 Troubleshooting

### Chat widget not appearing?
- Check browser console for errors
- Verify backend is running on port 3000
- Check CORS settings in `.env`

### AI not responding?
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check if model is available
ollama list
```

### Database connection issues?
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Try: `createdb verdict360_dev`

### Real-time chat not working?
- Check if Redis is running: `redis-cli ping`
- Verify Socket.IO connection in browser dev tools

## 🎯 Next Steps

Your MVP is ready! Consider adding:

1. **Calendar Integration** - Google Calendar API for booking
2. **Email Notifications** - Send consultation confirmations  
3. **Stripe Billing** - Subscription management
4. **Admin Dashboard** - Manage tenants and analytics
5. **WhatsApp Integration** - Expand chat channels
6. **Advanced AI** - Fine-tune for specific legal areas

## 📈 Production Deployment

When ready to deploy:

1. **Environment**: Update `.env` for production
2. **Database**: Set up production PostgreSQL
3. **AI Service**: Deploy Ollama or use cloud AI API
4. **Hosting**: AWS/Azure/Digital Ocean
5. **Domain**: Configure custom domains for tenants

---

**🎉 Congratulations!** You now have a fully functional AI legal chatbot SaaS platform. 

**Questions?** Check the logs or run `npm run test:setup` to diagnose issues.