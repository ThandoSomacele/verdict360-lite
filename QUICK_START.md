# 🚀 Verdict 360 - Quick Start Guide

## 30-Second Setup

```bash
# Clone the repository
git clone https://github.com/ThandoSomacele/verdict360-lite.git
cd verdict360-lite

# Quick Docker setup (choose option 1 for development)
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh

# Access the platform
open http://localhost:3000
```

## 🎯 What You'll See

### 1. **Health Check** (2 minutes)
```bash
curl http://localhost:3000/health
```
**Expected:** `{"status":"healthy","timestamp":"...","environment":"development"}`

### 2. **AI Chatbot Demo** (3 minutes)
```bash
# Visit the demo chatbot
open http://localhost:3000/widget?tenant=demo
```

**Test conversation:**
1. Type: "I was injured at work, what are my rights?"
2. AI responds with South African legal guidance
3. Type: "I'd like to speak with a lawyer"
4. Provide your contact details when asked
5. Watch automatic appointment booking (if calendar connected)

### 3. **Admin Dashboard** (2 minutes)
```bash
# Access admin panel
open http://localhost:3000/admin
```

**Create admin user via API:**
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@verdict360.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 4. **Law Firm Registration** (3 minutes)
```bash
# Register a test law firm
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firmName": "Cape Town Legal Associates",
    "subdomain": "ctla",
    "adminEmail": "admin@ctla.co.za",
    "adminPassword": "secure123",
    "firstName": "Sarah",
    "lastName": "van der Merwe"
  }'
```

### 5. **Billing Demo** (2 minutes)
Access: `http://localhost:3000/dashboard/billing`

**Test with Stripe test card:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/34`
- CVC: `123`

## 🔧 Configuration

### Minimal .env Setup
```env
# Database (Docker handles these)
DB_HOST=localhost
DB_NAME=verdict360_dev
DB_USER=verdict360_user
DB_PASSWORD=password123

# AI Service
OLLAMA_BASE_URL=http://localhost:11434
AI_MODEL=llama3.1:8b

# Test Stripe (replace with your keys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Gmail (optional for full demo)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_USER=your_email@gmail.com
```

## 🏗️ Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │    │  Express.js │    │ PostgreSQL  │
│  Frontend   │◄──►│   Backend   │◄──►│  Database   │
│             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   ▼                   │
       │            ┌─────────────┐            │
       │            │    Redis    │            │
       │            │   Session   │            │
       │            └─────────────┘            │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  AI Chat    │    │   Stripe    │    │   Google    │
│  (Ollama)   │    │  Billing    │    │  Calendar   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📊 Key Features Demo

### 1. **Multi-Tenant Architecture**
- Each law firm gets isolated data
- Custom subdomains (firm.verdict360.com)
- Tenant-specific branding and settings

### 2. **AI-Powered Conversations**
- South African legal knowledge base
- Automatic lead qualification
- Real-time appointment booking

### 3. **Complete Business System**
- ZAR billing with Stripe
- Google Calendar integration
- Professional email automation
- Comprehensive analytics

### 4. **Enterprise Management**
- Platform admin dashboard
- Tenant management tools
- System health monitoring
- Revenue tracking

## 🔍 API Endpoints Overview

```bash
# Authentication
POST /api/auth/register          # Register law firm
POST /api/auth/login            # Login
POST /api/auth/refresh          # Refresh token

# Billing (Stripe)
GET  /api/billing/plans         # Get ZAR pricing
POST /api/billing/checkout      # Create payment
POST /api/billing/portal        # Billing portal

# Calendar (Google)
GET  /api/calendar/status       # Connection status
POST /api/calendar/appointments # Book consultation
GET  /api/calendar/availability # Available slots

# Admin
GET  /api/admin/dashboard       # Platform metrics
GET  /api/admin/tenants         # Manage law firms
GET  /api/admin/system/health   # System status

# Chat & AI
POST /api/chat/message          # Send chat message
POST /api/ai/generate          # AI response
GET  /api/conversations        # Chat history
```

## 🚦 Troubleshooting

### Common Issues

**1. "Database connection failed"**
```bash
docker-compose restart postgres
sleep 5
npm run db:migrate
```

**2. "AI model not found"**
```bash
docker exec ollama ollama pull llama3.1:8b
```

**3. "Email service not working"**
- Check Gmail credentials in .env
- Ensure 2FA and app passwords configured

**4. "Stripe payments failing"**
- Verify test API keys in .env
- Check webhook endpoint configuration

### Health Checks
```bash
# Application
curl http://localhost:3000/health

# Database
docker exec verdict360_postgres pg_isready

# AI Service
curl http://localhost:11434/api/tags

# Redis
docker exec verdict360_redis redis-cli ping
```

## 📈 Sample Data

The system includes realistic South African legal data:

- **Law Firms:** Johannesburg Legal Associates, Cape Town Attorneys
- **Practice Areas:** Labour Law, Corporate Law, Personal Injury
- **Sample Conversations:** Work injuries, contract disputes, employment issues
- **Test Users:** Multiple tenant admins and platform administrators

## 🎯 Demo Script (5 Minutes)

1. **Show Platform Admin** (1 min)
   - Open admin dashboard
   - Show tenant metrics and revenue

2. **Register Law Firm** (1 min)
   - Quick registration demo
   - Show tenant dashboard

3. **AI Chatbot Demo** (2 min)
   - Visitor asks legal question
   - AI provides SA legal guidance
   - Automatic appointment booking

4. **Business Management** (1 min)
   - Show lead management
   - Display calendar integration
   - Demonstrate email automation

## 🌟 Next Steps

After successful demo:

1. **Custom Configuration**
   - Add real Gmail credentials
   - Configure Stripe live keys
   - Set up custom domain

2. **Production Deployment**
   - Deploy to AWS/GCP/Azure
   - Configure SSL certificates
   - Set up monitoring

3. **Law Firm Onboarding**
   - Create onboarding flow
   - Provide training materials
   - Set up support system

---

**🇿🇦 Ready to revolutionize South African legal services with AI!**

Your comprehensive SaaS platform is now running locally and ready for demonstration.