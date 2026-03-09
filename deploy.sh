#!/bin/bash

# Crime Portal - Quick Deployment Guide
# This script helps you set up both apps for deployment

set -e

echo "🚀 Crime Portal Deployment Setup"
echo "=================================="
echo ""

# Step 1: Check prerequisites
echo "✓ Step 1: Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+."
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found."
    exit 1
fi
echo "  Node.js $(node -v) and npm $(npm -v) found."

# Step 2: Install dependencies
echo ""
echo "✓ Step 2: Installing dependencies..."
npm ci

# Step 3: Build both apps
echo ""
echo "✓ Step 3: Building apps..."
npm run build:officer
npm run build:public

echo ""
echo "✅ Build successful!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Create a Supabase project at https://supabase.io"
echo ""
echo "2. Run the SQL migrations:"
echo "   cd officer-app"
echo "   supabase db push < scripts/001_create_crime_tables.sql"
echo "   # ... repeat for other scripts"
echo ""
echo "3. Deploy to Vercel (recommended):"
echo "   npm i -g vercel"
echo "   vercel"
echo ""
echo "   OR use Docker:"
echo "   docker build -t crime-portal ."
echo "   docker run -p 3000:3000 crime-portal"
echo ""
echo "4. Set environment variables in your hosting platform"
echo "   Refer to .env.example files in each app"
echo ""
echo "5. After officer-app is live, use its URL in"
echo "   NEXT_PUBLIC_OFFICER_URL for the public-app"
