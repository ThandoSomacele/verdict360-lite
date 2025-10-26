# ✅ Verdict 360 Testing Checklist

## 🔧 Pre-Testing Setup

- [ ] Docker and Docker Compose installed
- [ ] Environment variables configured (.env file)
- [ ] Gmail API credentials obtained and configured
- [ ] Stripe test account created with API keys
- [ ] Google Calendar API enabled
- [ ] All containers started successfully
- [ ] Database migrations completed
- [ ] Ollama AI model downloaded (llama3.1:8b)

## 🏗️ Infrastructure Testing

### Database Layer
- [ ] PostgreSQL container running
- [ ] Database connection successful
- [ ] All migrations applied successfully
- [ ] Sample data seeded correctly
- [ ] Database constraints working (foreign keys, unique constraints)
- [ ] Multi-tenant isolation verified (tenants can't access each other's data)

### Redis Cache
- [ ] Redis container running
- [ ] Cache connections working
- [ ] Session storage functional
- [ ] Rate limiting working correctly

### AI Service (Ollama)
- [ ] Ollama container running on port 11434
- [ ] Model (llama3.1:8b) downloaded and available
- [ ] AI API responding to health checks
- [ ] Test AI generation working

## 🔐 Authentication & Authorization

### User Registration
- [ ] New tenant registration works
- [ ] Email validation working
- [ ] Password strength requirements enforced
- [ ] Unique subdomain validation
- [ ] Welcome email sent successfully

### User Login
- [ ] Email/password login successful
- [ ] JWT tokens generated correctly
- [ ] Refresh token flow working
- [ ] Invalid credentials properly rejected
- [ ] Rate limiting on login attempts

### Authorization
- [ ] Tenant-specific access control working
- [ ] Admin-only endpoints protected
- [ ] Cross-tenant access blocked
- [ ] Token expiration handling
- [ ] Role-based permissions enforced

## 💰 Billing System (Stripe)

### Pricing Plans
- [ ] All three ZAR pricing plans displayed correctly
  - [ ] Basic: R299.00/month
  - [ ] Pro: R599.00/month  
  - [ ] Enterprise: R1,299.00/month
- [ ] Plan features listed accurately
- [ ] Currency formatting (ZAR) working

### Subscription Flow
- [ ] Customer creation in Stripe successful
- [ ] Checkout session creation working
- [ ] Test card payments processing
  - [ ] Success: 4242 4242 4242 4242
  - [ ] Decline: 4000 0000 0000 0002
  - [ ] 3D Secure: 4000 0027 6000 3184
- [ ] 14-day trial setup correctly
- [ ] Subscription status updates in database

### Billing Portal
- [ ] Billing portal access working
- [ ] Plan upgrades/downgrades functional
- [ ] Subscription cancellation working
- [ ] Invoice history visible
- [ ] Payment method updates working

### Webhooks
- [ ] Webhook endpoint receiving events
- [ ] Signature verification working
- [ ] Payment succeeded events processed
- [ ] Payment failed events handled
- [ ] Subscription updates reflected in database
- [ ] Trial expiration handling

## 📧 Email System (Gmail)

### Email Configuration
- [ ] Gmail SMTP connection working
- [ ] OAuth2 authentication successful
- [ ] Email templates rendering correctly
- [ ] South African formatting (dates, etc.)

### Email Types
- [ ] Consultation confirmation emails sent
- [ ] Attorney notification emails sent
- [ ] Welcome emails for new tenants sent
- [ ] Email delivery status logged in database
- [ ] Failed email handling working

### Email Content
- [ ] Professional HTML templates
- [ ] Plain text alternatives included
- [ ] Firm branding applied correctly
- [ ] Contact information included
- [ ] Unsubscribe links working (if applicable)

## 📅 Calendar Integration (Google)

### OAuth Setup
- [ ] Google Calendar OAuth flow working
- [ ] Authorization URL generation
- [ ] Token exchange successful
- [ ] Refresh token handling
- [ ] Calendar connection status tracking

### Appointment Management
- [ ] Available slot checking working
- [ ] Time zone handling (Africa/Johannesburg)
- [ ] Appointment creation successful
- [ ] Google Meet links generated
- [ ] Calendar invitations sent
- [ ] Appointment updates/cancellations working

### Integration Status
- [ ] Calendar connected status displayed
- [ ] Disconnection process working
- [ ] Error handling for calendar failures
- [ ] Graceful degradation when calendar unavailable

## 🤖 AI Chatbot System

### Core AI Functionality
- [ ] Ollama service responding
- [ ] AI model generating responses
- [ ] South African legal context working
- [ ] Response quality appropriate for legal guidance
- [ ] Token limits and performance acceptable

### Conversation Flow
- [ ] Welcome message generation
- [ ] Legal question handling
- [ ] Consultation offer triggers
- [ ] Contact information collection
- [ ] Appointment booking integration
- [ ] Conversation state management

### Chatbot Integration
- [ ] Real-time chat via Socket.IO
- [ ] Message persistence in database
- [ ] Visitor session tracking
- [ ] Conversation analytics working
- [ ] Lead generation from conversations

## 🎛️ Admin Dashboard

### Platform Metrics
- [ ] Total tenant count accurate
- [ ] Revenue calculations correct (ZAR)
- [ ] Monthly activity stats working
- [ ] Conversion metrics calculated correctly
- [ ] System health monitoring functional

### Tenant Management
- [ ] Tenant listing with pagination
- [ ] Search and filter functionality
- [ ] Tenant details view working
- [ ] Subscription status updates
- [ ] Tenant suspension/activation
- [ ] Admin user creation

### System Monitoring
- [ ] Database health checks
- [ ] 24-hour activity monitoring
- [ ] Email delivery tracking
- [ ] Error count monitoring
- [ ] Real-time status updates

## 🏢 Tenant Dashboard

### Business Metrics
- [ ] Monthly conversation counts
- [ ] Lead generation statistics
- [ ] Appointment booking numbers
- [ ] Conversion rate calculations
- [ ] Total statistics accurate

### Recent Activity
- [ ] Recent conversations displayed
- [ ] Recent leads listed correctly
- [ ] Upcoming appointments shown
- [ ] Activity timestamps correct
- [ ] Status badges working

### Integration Status
- [ ] Calendar connection status
- [ ] Email service status
- [ ] Billing system status
- [ ] Integration setup links working

## 🔗 API Endpoints Testing

### Authentication Endpoints
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/auth/logout

### Billing Endpoints
- [ ] GET /api/billing/plans
- [ ] POST /api/billing/customer
- [ ] POST /api/billing/checkout
- [ ] POST /api/billing/portal
- [ ] GET /api/billing/subscription
- [ ] POST /api/billing/webhook

### Calendar Endpoints
- [ ] GET /api/calendar/status
- [ ] GET /api/calendar/connect
- [ ] POST /api/calendar/callback
- [ ] GET /api/calendar/availability/:date
- [ ] POST /api/calendar/appointments
- [ ] GET /api/calendar/appointments

### Admin Endpoints
- [ ] GET /api/admin/dashboard
- [ ] GET /api/admin/tenants
- [ ] GET /api/admin/system/health
- [ ] PATCH /api/admin/tenants/:id/status

### Dashboard Endpoints
- [ ] GET /api/dashboard/overview
- [ ] GET /api/dashboard/conversations/recent
- [ ] GET /api/dashboard/leads/recent
- [ ] GET /api/dashboard/appointments/upcoming

## 🚦 Error Handling & Edge Cases

### Network Issues
- [ ] Database connection failures handled
- [ ] Redis connection failures handled
- [ ] AI service unavailable handled gracefully
- [ ] Email service failures logged
- [ ] Stripe API failures handled

### Data Validation
- [ ] Invalid email formats rejected
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Rate limiting enforced
- [ ] File upload restrictions (if applicable)

### Business Logic
- [ ] Subscription limit enforcement
- [ ] Trial expiration handling
- [ ] Payment failure scenarios
- [ ] Calendar booking conflicts
- [ ] Duplicate appointment prevention

## 📱 Frontend Testing (React Components)

### Admin Dashboard Component
- [ ] Platform metrics display correctly
- [ ] Tenant management interface functional
- [ ] Search and filtering working
- [ ] Responsive design on mobile
- [ ] Loading states implemented

### Tenant Dashboard Component
- [ ] Business metrics accurate
- [ ] Recent activity feeds working
- [ ] Integration status correct
- [ ] Quick action buttons functional
- [ ] Real-time updates working

### Widget Components
- [ ] Chat widget embeddable
- [ ] Responsive design
- [ ] Cross-browser compatibility
- [ ] Accessibility compliance
- [ ] Performance optimization

## 🔒 Security Testing

### Authentication Security
- [ ] Password hashing secure (bcrypt)
- [ ] JWT token security
- [ ] Session management secure
- [ ] CORS configuration correct
- [ ] HTTPS redirects (in production)

### Authorization Security
- [ ] Multi-tenant isolation enforced
- [ ] Admin privilege escalation prevented
- [ ] API endpoint authorization
- [ ] Database query injection prevented
- [ ] File access restrictions

### Data Protection
- [ ] Personal data encryption
- [ ] POPIA compliance considerations
- [ ] Audit trail implementation
- [ ] Data retention policies
- [ ] Secure credential storage

## 📊 Performance Testing

### Load Testing
- [ ] Concurrent user handling
- [ ] Database query optimization
- [ ] API response times acceptable
- [ ] Memory usage within limits
- [ ] CPU usage monitoring

### Scalability Testing
- [ ] Multiple tenant handling
- [ ] Large conversation volumes
- [ ] Bulk email processing
- [ ] Calendar integration limits
- [ ] Payment processing volumes

## 📋 Integration Testing

### End-to-End Scenarios
- [ ] **Complete Customer Journey:**
  1. Visitor lands on law firm website
  2. Engages with AI chatbot
  3. Receives legal guidance
  4. Provides contact information
  5. Books consultation appointment
  6. Receives email confirmation
  7. Attorney gets notification
  8. Meeting appears in Google Calendar

- [ ] **Subscription Lifecycle:**
  1. Law firm registers
  2. Starts 14-day trial
  3. Configures chatbot and branding
  4. Connects Google Calendar
  5. Receives leads via chatbot
  6. Trial expires warning
  7. Subscribes to paid plan
  8. Continues receiving leads

- [ ] **Admin Management:**
  1. Platform admin monitors health
  2. Reviews tenant activity
  3. Handles payment issues
  4. Manages tenant subscriptions
  5. Monitors system performance

## ✅ Final Verification

### Production Readiness
- [ ] All environment variables configured
- [ ] SSL certificates configured (production)
- [ ] Domain configuration complete
- [ ] Database backups configured
- [ ] Monitoring and alerting setup
- [ ] Error tracking implemented
- [ ] Log aggregation configured

### Documentation
- [ ] API documentation complete
- [ ] Deployment guide available
- [ ] User manuals created
- [ ] Admin guides prepared
- [ ] Troubleshooting guides ready

### Launch Checklist
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Data migration tested
- [ ] Rollback plan prepared
- [ ] Support team trained

## 🎯 Test Results Summary

**Date:** ___________  
**Tester:** ___________  
**Version:** ___________  

**Overall Score:** ___/100 tests passed

**Critical Issues:** ___________
**Minor Issues:** ___________
**Performance Notes:** ___________

**Ready for Production:** ☐ Yes ☐ No

**Notes:**
_________________________________
_________________________________
_________________________________

---

**Testing completed by:** ___________  
**Date:** ___________  
**Approved for deployment:** ☐ Yes ☐ No