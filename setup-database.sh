#!/bin/bash

echo "==================================="
echo "Verdict 360 Database Setup Script"
echo "==================================="
echo ""
echo "This script will help you set up your database for Verdict 360"
echo ""

# Check if DATABASE_URL is provided
if [ -z "$1" ]; then
    echo "Please provide your database URL as an argument:"
    echo "Usage: ./setup-database.sh 'postgresql://...'"
    echo ""
    echo "Get your free database from:"
    echo "- Supabase: https://supabase.com (Recommended)"
    echo "- Neon: https://neon.tech"
    echo ""
    exit 1
fi

DATABASE_URL=$1

echo "Step 1: Adding DATABASE_URL to Vercel..."
echo "$DATABASE_URL" | vercel env rm DATABASE_URL production --yes 2>/dev/null
echo "$DATABASE_URL" | vercel env add DATABASE_URL production

echo ""
echo "Step 2: Running database migrations..."
DATABASE_URL="$DATABASE_URL" npm run db:migrate

echo ""
echo "Step 3: Seeding database with demo data..."
DATABASE_URL="$DATABASE_URL" npm run db:seed

echo ""
echo "Step 4: Redeploying to Vercel..."
vercel --prod

echo ""
echo "==================================="
echo "✅ Database setup complete!"
echo "==================================="
echo ""
echo "You can now login with:"
echo "Email: admin@verdict360.com"
echo "Password: Admin123!"
echo ""
echo "Your app is live at: https://verdict360-lite.vercel.app"
echo ""