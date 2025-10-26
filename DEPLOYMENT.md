# Deployment Guide for Verdict 360 on VPS with Coolify

This application is configured for deployment on a VPS using Coolify with full WebSocket support.

## Prerequisites

- VPS with Coolify installed
- Node.js 18+
- PostgreSQL database
- Redis (optional, for caching)
- Domain name configured

## Architecture

The application uses:
- **SvelteKit** with `@sveltejs/adapter-node`
- **Socket.io** for real-time WebSocket communication
- **Express.js** custom server for WebSocket integration
- **PostgreSQL** for data persistence

## Environment Variables

Create a `.env` file with the following variables:

```bash
# App Configuration
NODE_ENV=production
PORT=3000
CLIENT_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/verdict360
DB_HOST=localhost
DB_PORT=5432
DB_NAME=verdict360
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Redis (Optional)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Service
AI_MODEL=llama3.1
AI_ENDPOINT=http://localhost:11434
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=30d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@verdict360.com
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=Verdict 360 <noreply@verdict360.com>

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Calendar (Optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

## Coolify Configuration

### 1. Create New Resource

1. In Coolify, go to **Resources** → **New Resource**
2. Select **Node.js**
3. Connect your Git repository

### 2. Build Configuration

Set the following in Coolify:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

**Port:** `3000`

### 3. Health Check

Configure health check endpoint:
- **Path:** `/`
- **Port:** `3000`
- **Expected Status:** `200`

### 4. Environment Variables

Add all environment variables from above in Coolify's **Environment Variables** section.

### 5. Database Setup

If using Coolify's PostgreSQL:

1. Create a PostgreSQL database resource
2. Note the connection details
3. Update `DATABASE_URL` in environment variables

Run migrations after deployment:
```bash
npm run db:migrate
npm run db:seed
```

### 6. Reverse Proxy

Coolify automatically configures Traefik reverse proxy with:
- Automatic SSL/TLS with Let's Encrypt
- WebSocket support (already enabled)
- Load balancing

### 7. Domain Configuration

1. Add your domain in Coolify's **Domains** section
2. Point your DNS A record to your VPS IP
3. Coolify will automatically provision SSL certificate

## Build Process

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server with WebSocket support
npm run start
```

The build creates:
- `build/` - SvelteKit compiled output
- `server.js` - Custom Node.js server with Socket.io

## WebSocket Configuration

The application automatically configures Socket.io with:

- **Transports:** WebSocket primary, polling fallback
- **CORS:** Configured based on `CLIENT_URL`
- **Reconnection:** Automatic with exponential backoff
- **Namespacing:** Tenant-based rooms for multi-tenancy

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure PostgreSQL database
- [ ] Run database migrations
- [ ] Configure domain and SSL
- [ ] Test WebSocket connection
- [ ] Verify AI service connectivity
- [ ] Test multi-tenant routing
- [ ] Monitor logs for errors

## Monitoring

Access logs in Coolify:
- Application logs: Real-time via Coolify UI
- Socket.io connections: Check console logs
- Database queries: PostgreSQL logs

## Troubleshooting

### WebSocket Connection Issues

If WebSockets fail to connect:

1. Check Coolify reverse proxy settings
2. Verify CORS configuration in `server.js`
3. Check browser console for connection errors
4. Ensure port 3000 is accessible

### Database Connection

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

### AI Service

Ensure Ollama or your AI service is running:
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.1",
  "prompt": "Test"
}'
```

## Scaling

For horizontal scaling:
- Use Redis for session storage
- Configure Socket.io adapter for Redis
- Enable sticky sessions in load balancer

## Backup

Regular backups should include:
- PostgreSQL database
- Environment variables
- Uploaded files (if any)

## Updates

To deploy updates:

1. Push changes to Git
2. Coolify auto-deploys on push
3. Or manually trigger deployment in Coolify UI

## Support

For deployment issues:
- Check Coolify logs
- Review application logs
- Verify environment configuration
