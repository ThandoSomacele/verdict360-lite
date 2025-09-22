# Vercel Deployment Guide for Verdict 360

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) - Free tier available
2. **PostgreSQL Database**: Use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
3. **Redis Instance**: Use [Upstash Redis](https://upstash.com) (serverless-compatible)

## Deployment Steps

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Database Setup

#### Option A: Vercel Postgres (Recommended for Vercel)
```bash
vercel env pull
vercel postgres create verdict360-db
```

#### Option B: External PostgreSQL (Neon/Supabase)
- Create a new PostgreSQL database
- Get your connection string
- Run migrations:
```bash
DATABASE_URL="your-connection-string" npm run db:migrate
DATABASE_URL="your-connection-string" npm run db:seed
```

### 3. Redis Setup (Upstash)

1. Create account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Get your Redis URL and token

### 4. Environment Variables

Set these in Vercel dashboard or via CLI:

```bash
# Database
vercel env add DATABASE_URL production
vercel env add REDIS_URL production

# Security
vercel env add JWT_SECRET production
vercel env add ENCRYPTION_KEY production

# Stripe (Optional for testing)
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PUBLISHABLE_KEY production

# Email (Optional for testing)
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add EMAIL_FROM production

# Google Calendar (Optional)
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add GOOGLE_REDIRECT_URI production

# AI Service
vercel env add OLLAMA_BASE_URL production

# Domain
vercel env add PUBLIC_DOMAIN_SUFFIX production
```

### 5. Deploy to Vercel

```bash
# Deploy to production
vercel --prod

# Or link to GitHub for automatic deployments
vercel link
```

### 6. Configure Wildcard Subdomains

For multi-tenant support with subdomains:

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your domain: `verdict360.com`
4. Add wildcard: `*.verdict360.com`
5. Update DNS records at your domain registrar

## Free Tier Limits (Hobby Plan)

- **Bandwidth**: 100GB/month
- **Serverless Functions**: 100GB-hours compute time
- **Build Minutes**: 6000 minutes/month
- **Projects**: Unlimited
- **Deployments**: Unlimited
- **Custom Domains**: Unlimited
- **SSL**: Automatic HTTPS included

## Production Considerations

### 1. Replace Socket.IO

Socket.IO doesn't work well with serverless. Consider:
- **Pusher**: Real-time messaging service
- **Ably**: Real-time data delivery platform
- **Vercel's Edge Functions** with Server-Sent Events

Update `src/lib/services/realtimeService.ts`:

```typescript
// Example with Pusher
import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: 'us2'
});
```

### 2. File Storage

Vercel doesn't persist uploaded files. Use:
- **Vercel Blob Storage**: Native Vercel solution
- **AWS S3**: Industry standard
- **Cloudinary**: Image/video management

### 3. Background Jobs

Replace Bull queue with:
- **Vercel Cron Jobs**: For scheduled tasks
- **Inngest**: Event-driven background jobs
- **QStash** by Upstash: Message queue for serverless

### 4. Monitoring

- Enable Vercel Analytics
- Set up error tracking with Sentry
- Configure uptime monitoring

## Testing Deployment

1. **Basic Test**:
```bash
curl https://your-app.vercel.app/api/health
```

2. **Tenant Test**:
```bash
curl https://demo.your-app.vercel.app
```

3. **Database Connection**:
- Check Vercel Functions logs
- Verify migrations ran successfully

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node version (20.x required)
   - Verify all dependencies installed
   - Review build logs

2. **Database Connection**:
   - Ensure DATABASE_URL is set correctly
   - Check if database is accessible from Vercel's network
   - Verify SSL mode settings

3. **Function Timeouts**:
   - Default is 10s on Hobby plan
   - Optimize database queries
   - Use caching strategically

4. **CORS Issues**:
   - Check vercel.json headers configuration
   - Verify API routes handle OPTIONS requests

## Cost Optimization

1. **Use Edge Functions** where possible (faster, cheaper)
2. **Enable ISR** (Incremental Static Regeneration) for pages
3. **Implement proper caching** headers
4. **Optimize images** with Vercel Image Optimization
5. **Use Vercel KV** for session storage instead of Redis

## Upgrade Path

When ready for production:

### Pro Plan ($20/month per member)
- 1TB bandwidth
- 1000GB-hours compute
- Analytics included
- Support included

### Enterprise
- Custom limits
- SLA guarantees
- Advanced security
- Dedicated support

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [SvelteKit on Vercel](https://vercel.com/docs/frameworks/sveltekit)
- [Vercel Support](https://vercel.com/support)