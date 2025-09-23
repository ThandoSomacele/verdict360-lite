# Vercel Deployment Steps for Verdict 360

## Prerequisites Completed ✅
- Vercel CLI installed (v48.1.0)
- Vercel adapter configured in `svelte.config.js`
- `vercel.json` configuration ready
- Environment variables template created

## Step 1: Login to Vercel
Run this command and follow the prompts:
```bash
vercel login
```
Choose your preferred authentication method:
- GitHub (recommended)
- GitLab
- Bitbucket
- Email

## Step 2: Deploy to Vercel
Once logged in, run:
```bash
vercel
```

When prompted:
1. **Setup and deploy**: Yes
2. **Scope**: Choose your account
3. **Link to existing project?**: No (create new)
4. **Project name**: `verdict360-lite` (or press enter for default)
5. **Directory**: `./` (current directory)
6. **Auto-detect framework**: Yes (should detect SvelteKit)

## Step 3: Set Environment Variables

### Option A: Via Vercel Dashboard (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add these minimum required variables:

```env
# Database (Use Supabase, Neon, or Vercel Postgres)
DATABASE_URL=postgresql://user:password@host:5432/verdict360?sslmode=require

# Security (Generate secure values)
JWT_SECRET=<generate-32-char-secure-string>
ENCRYPTION_KEY=<generate-64-char-hex-string>

# Application
NODE_ENV=production
PUBLIC_DOMAIN_SUFFIX=verdict360.com
```

### Option B: Via CLI
```bash
# Add each variable
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add ENCRYPTION_KEY production
```

## Step 4: Set Up Free Database Services

### PostgreSQL Options (Choose one):

#### Supabase (Recommended)
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel env as `DATABASE_URL`

#### Neon
1. Sign up at [neon.tech](https://neon.tech)
2. Create database
3. Copy connection string
4. Add to Vercel env as `DATABASE_URL`

### Redis (Optional for initial deployment):
#### Upstash
1. Sign up at [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy REST URL
4. Add to Vercel env as `REDIS_URL`

## Step 5: Run Database Migrations
After setting DATABASE_URL:
```bash
# Run migrations on production database
DATABASE_URL="your-production-db-url" npm run db:migrate
```

## Step 6: Deploy to Production
```bash
vercel --prod
```

## Step 7: Configure Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your domain: `verdict360.com`
3. Add wildcard for multi-tenant: `*.verdict360.com`
4. Update DNS records at your registrar

## Your Deployment URLs
After deployment, you'll get:
- **Preview**: `verdict360-lite-xxx.vercel.app`
- **Production**: `verdict360-lite.vercel.app`
- **Custom**: `verdict360.com` (after DNS setup)

## Quick Deploy Commands Summary
```bash
# First time setup
vercel login
vercel

# Subsequent deploys
vercel          # Deploy to preview
vercel --prod   # Deploy to production
```

## Troubleshooting

### Build Errors
- Check `npm run build` works locally first
- Review build logs in Vercel dashboard

### Database Connection
- Ensure DATABASE_URL has `?sslmode=require`
- Check if database allows connections from Vercel IPs

### Environment Variables
- Variables must be set before deployment
- Redeploy after adding new variables

## Free Tier Limits
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ 100GB-hours compute time

## Next Steps After Deployment
1. Test the live site
2. Set up monitoring (Vercel Analytics)
3. Configure error tracking (optional)
4. Add team members (optional)

---

## Quick Start (Copy & Paste)
```bash
# Login
vercel login

# Deploy
vercel

# Set minimal env vars (you'll be prompted for values)
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add ENCRYPTION_KEY production

# Deploy to production
vercel --prod
```

Your app will be live in ~2 minutes! 🚀