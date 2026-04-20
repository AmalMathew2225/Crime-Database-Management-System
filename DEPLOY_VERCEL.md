# Vercel Deployment Guide

Vercel is the easiest option—it's built for Next.js and free for small projects.

## Prerequisites

- GitHub/GitLab account with your repo pushed
- Supabase project created with migrations run (see README.md)

## Deploy Home Page (Master Portal)

1. Click **"New Project"** → select your repository.

2. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `home-page`
   
3. Click **"Deploy"**. (The `vercel.json` inside the directory will handle serving the static files).

4. Go to your Vercel Dashboard for this new project, and assign your master domain if you have one.

5. Once deployed, open `home-page/index.html` in your repository and replace `YOUR_OFFICER_APP_URL` and `YOUR_PUBLIC_APP_URL` with the actual Vercel URLs for your apps, then commit and push to update the links on the Home Page.

## Deploy Officer App

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.

2. Click **"New Project"** → select your repository.

3. Configure the project:
   - **Framework Preset**: Next.js ✓
   - **Root Directory**: `officer-app`
   - **Build Command**: `npm run build:officer`

4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
   SUPABASE_SERVICE_ROLE_KEY=<your service role key>
   JWT_SECRET=<generate a 32+ char random string>
   ```

5. Click **"Deploy"**.

6. Copy the assigned URL (e.g., `https://officer-app-abc123.vercel.app`).

## Deploy Public App

1. Click **"New Project"** → same repository.

2. Configure:
   - **Root Directory**: `public-app`
   - **Build Command**: `npm run build:public`

3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<same as officer app>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as officer app>
   NEXT_PUBLIC_OFFICER_URL=<the URL from step 6 above>
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<optional>
   ```

4. Click **"Deploy"**.

## Update Public App (if needed)

If you change `NEXT_PUBLIC_OFFICER_URL` after initial deploy:
1. Go to project settings
2. Environment Variables
3. Update `NEXT_PUBLIC_OFFICER_URL`
4. Redeploy

## Monitoring

Both apps now have CI/CD enabled. Every push to your repo will trigger a new build and deploy automatically.

---

### Troubleshooting

**"Build failed"**: Check the build logs in Vercel dashboard. Usually a missing env var.

**"CORs error"**: Ensure Supabase RLS policies allow public reads for the public-app.

**"404 on routes"**: Make sure the file structure matches; Next.js is strict about page routes.
