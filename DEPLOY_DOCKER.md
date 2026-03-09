# Docker Deployment Guide

Use Docker to run both apps in containers, ideal for self-hosted or cloud platforms like AWS, DigitalOcean, Fly.io, etc.

## Quick Start (Local)

```bash
# Build the image
docker build -t crime-portal .

# Run with environment variables
docker run -p 3000:3000 -p 3001:3001 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e SUPABASE_SERVICE_ROLE_KEY=... \
  -e JWT_SECRET=... \
  crime-portal
```

Officer app runs on `http://localhost:3000`  
Public app runs on `http://localhost:3001`

## Build for production

```bash
docker build -t crime-portal:latest .
docker tag crime-portal:latest myregistry/crime-portal:latest
docker push myregistry/crime-portal:latest
```

## Environment Variables

Pass via `docker run -e` or create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=mysecretkey1234567890abcdef
NEXT_PUBLIC_OFFICER_URL=http://localhost:3000  # or production URL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
```

## Deploy to Fly.io (free tier available)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Create app
fly launch --name crime-portal --image-label latest

# Deploy
fly deploy

# View logs
fly logs
```

## Deploy to DigitalOcean App Platform

1. Connect your GitHub repo
2. Choose **Dockerfile**
3. Set environment variables in the dashboard
4. Deploy

## Deploy to AWS

Using ECS or EC2:
1. Push image to ECR
2. Create ECS task definition with the image
3. Launch service with load balancer
4. Map ports 3000 (officer) and 3001 (public)

---

## Networking

If running multiple containers:
- Officer app (`localhost:3000`) must be reachable by public app
- Set `NEXT_PUBLIC_OFFICER_URL` to the officer app's external URL

Example: public app on different server → set `NEXT_PUBLIC_OFFICER_URL=https://officer.example.com`

## Health Checks

Both apps serve `/` which you can use for health checks:

```bash
curl http://localhost:3000  # officer-app
curl http://localhost:3001  # public-app
```
