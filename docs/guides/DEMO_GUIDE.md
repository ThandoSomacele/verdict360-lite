# 🚀 Verdict 360 Local Demo & Testing Guide

## Prerequisites

Before starting, ensure you have:
- **Docker & Docker Compose** installed
- **Node.js 18+** and **npm** installed
- **Git** for cloning the repository
- **PostgreSQL** (via Docker)
- **Redis** (via Docker)

## 🔧 Quick Setup (5 Minutes)

### 1. Clone & Navigate
```bash
git clone https://github.com/ThandoSomacele/verdict360-lite.git
cd verdict360-lite
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your credentials
nano .env
```

**Required Environment Variables:**
```env
# Database (Docker will handle these)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=verdict360_dev
DB_USER=verdict360_user
DB_PASSWORD=password123

# Gmail Integration (Use your actual credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
SMTP_USER=your_email@gmail.com

# Stripe Test Keys (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Service (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
AI_MODEL=llama3.1:8b
```

### 3. Launch with Docker
```bash
# Make setup script executable
chmod +x scripts/docker-setup.sh

# Run the setup script
./scripts/docker-setup.sh
```

**Choose option 1 for Development mode**

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

### 1. Start Core Services
```bash
# Start database and Redis
docker-compose up -d postgres redis

# Wait for services to be ready
sleep 10
```

### 2. Install Dependencies
```bash
# Backend dependencies
npm install

# Frontend dependencies (if running separately)
cd src/client
npm install
cd ../..
```

### 3. Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 4. Start Ollama (AI Service)
```bash
# Pull and start Ollama
docker run -d -p 11434:11434 --name ollama ollama/ollama

# Pull the model (this takes a few minutes)
docker exec ollama ollama pull llama3.1:8b
```

### 5. Start Application
```bash
# Development mode with hot reload
npm run dev
```

## 🧪 Testing Scenarios

### Test 1: Platform Admin Access
```bash
# Access admin dashboard
http://localhost:3001/admin

# Default admin credentials (create manually):
# Email: admin@verdict360.com
# Password: admin123
```

**What to test:**
- Platform overview metrics
- Tenant management
- System health monitoring
- Revenue tracking

### Test 2: Law Firm Registration
```bash
# Register new law firm
POST http://localhost:3000/api/auth/register
```

**Test data:**
```json
{
  "firmName": "Johannesburg Legal Associates",
  "subdomain": "jla",
  "adminEmail": "admin@jla.co.za",
  "adminPassword": "secure123",
  "firstName": "Sarah",
  "lastName": "Mbeki"
}
```

### Test 3: AI Chatbot Conversation

**Access chatbot:**
```
http://localhost:3000/widget?tenant=jla
```

**Test conversation flow:**
1. **Greeting:** "Hello, I need legal help"
2. **Legal Question:** "I was injured at work, what are my rights?"
3. **Follow-up:** "I'd like to speak with a lawyer"
4. **Contact Info:** Provide name, email, phone
5. **Appointment:** "Can I book a consultation?"

**Expected flow:**
- AI provides South African legal guidance
- Offers consultation when appropriate
- Collects contact details
- Shows available appointment slots
- Books consultation automatically

### Test 4: Stripe Billing Integration

**Test subscription flow:**
```bash
# Access billing dashboard
http://localhost:3000/dashboard/billing
```

**Test cards (Stripe test mode):**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0027 6000 3184`

**Test scenarios:**
1. Subscribe to Basic Plan (R299/month)
2. Upgrade to Pro Plan (R599/month)
3. Access billing portal
4. Cancel subscription
5. Handle failed payments

### Test 5: Google Calendar Integration

**Setup calendar:**
1. Go to `http://localhost:3000/dashboard/integrations`
2. Click "Connect Google Calendar"
3. Authorize with your Google account
4. Test appointment booking

**Test appointment flow:**
1. Complete chatbot conversation with contact details
2. AI should show available time slots
3. Select a time slot
4. Verify Google Calendar event created
5. Check email confirmation sent

### Test 6: Email Notifications

**Test email scenarios:**
1. **Consultation confirmation** (after booking)
2. **Attorney notification** (new lead alert)
3. **Welcome email** (new tenant registration)

**Verify in logs:**
```bash
# Check email logs
docker-compose logs app-dev | grep "Email"
```

## 🔍 API Testing with cURL

### Authentication
```bash
# Register new tenant
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firmName": "Test Law Firm",
    "subdomain": "test",
    "adminEmail": "test@lawfirm.co.za",
    "adminPassword": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lawfirm.co.za",
    "password": "password123"
  }'
```

### Billing API
```bash
# Get pricing plans
curl http://localhost:3000/api/billing/plans

# Create checkout session (use token from login)
curl -X POST http://localhost:3000/api/billing/checkout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"planId": "basic"}'
```

### Calendar API
```bash
# Check calendar status
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/calendar/status

# Get availability
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  http://localhost:3000/api/calendar/availability/2024-12-02
```

## 📊 Monitoring & Logs

### Application Logs
```bash
# Real-time logs
docker-compose logs -f app-dev

# Specific service logs
docker-compose logs postgres
docker-compose logs redis
docker-compose logs ollama
```

### Database Access
```bash
# Connect to PostgreSQL
docker exec -it verdict360_postgres psql -U verdict360_user -d verdict360_dev

# Common queries
SELECT * FROM tenants;
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 5;
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

### Health Checks
```bash
# Application health
curl http://localhost:3000/health

# Database health
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  http://localhost:3000/api/admin/system/health

# AI service health
curl http://localhost:11434/api/tags
```

## 🐛 Troubleshooting

### Common Issues

**1. Ollama Model Not Found**
```bash
# Pull the model manually
docker exec ollama ollama pull llama3.1:8b

# Check available models
docker exec ollama ollama list
```

**2. Database Connection Issues**
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

**3. Email Service Issues**
```bash
# Test email configuration
curl -X POST http://localhost:3000/api/email/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Calendar Integration Issues**
- Ensure Google OAuth credentials are correct
- Check redirect URI matches: `http://localhost:3000/auth/google/callback`
- Verify calendar permissions granted

**5. Stripe Webhooks (Local Testing)**
```bash
# Install Stripe CLI
npm install -g stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/billing/webhook
```

## 🎯 Demo Script (15 Minutes)

### Part 1: Admin Overview (3 min)
1. Show admin dashboard with platform metrics
2. Demonstrate tenant management
3. Display system health monitoring

### Part 2: Law Firm Setup (3 min)
1. Register new law firm
2. Configure branding and settings
3. Connect Google Calendar
4. Set up billing subscription

### Part 3: AI Chatbot Demo (5 min)
1. Simulate visitor asking legal question
2. Show AI providing South African legal guidance
3. Demonstrate lead capture process
4. Show automatic appointment booking

### Part 4: Business Management (4 min)
1. Review tenant dashboard analytics
2. Show lead management system
3. Demonstrate email notifications
4. Display calendar integration

## 📈 Performance Testing

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test
artillery quick --count 50 --num 10 http://localhost:3000/health

# Test chatbot endpoint
artillery quick --count 20 --num 5 http://localhost:3000/api/chat/message
```

### Database Performance
```bash
# Check active connections
docker exec verdict360_postgres psql -U verdict360_user -d verdict360_dev -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor query performance
docker exec verdict360_postgres psql -U verdict360_user -d verdict360_dev -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

## 🚀 Next Steps

After successful demo:

1. **Production Deployment**
   - Deploy to cloud provider (AWS, GCP, Azure)
   - Configure production environment variables
   - Set up SSL certificates
   - Configure domain and DNS

2. **Monitoring Setup**
   - Set up application monitoring (Sentry, NewRelic)
   - Configure log aggregation
   - Set up alerts and notifications

3. **Scale Preparation**
   - Configure auto-scaling
   - Set up load balancing
   - Optimize database performance
   - Configure CDN for static assets

Your Verdict 360 platform is now ready for comprehensive testing and demonstration! 🎉
