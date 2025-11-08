# Deploy Your Local App to Vercel

Since the GitHub repo is under different ownership, let's deploy directly from your local folder.

## Step 1: Deploy with Vercel CLI

Run this command in your terminal:

```bash
cd /Users/philipgodwin/Documents/Hackathon2025
vercel --prod
```

## Step 2: Answer the Prompts

When it asks questions, answer:

1. **"Set up and deploy...?"** → Type: `y` (yes)
2. **"Which scope do you want to deploy to?"** → Choose YOUR account (not Pcgodwin001's)
3. **"Link to existing project?"** → Type: `n` (no, create new)
4. **"What's your project's name?"** → Type: `oasis-community` (or any name you want)
5. **"In which directory is your code located?"** → Type: `./`
6. **"Want to modify these settings?"** → Type: `n` (no)

It will then:
- Build your app
- Deploy to production
- Give you a URL like: `https://oasis-community-abc123.vercel.app`

## Step 3: Add Environment Variables

After deployment:

1. Copy the project URL it gives you
2. Go to https://vercel.com
3. Find your new project (named "oasis-community" or whatever you chose)
4. Go to Settings → Environment Variables
5. Add these TWO variables:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://hoxjhgeahgbhjhywhksh.supabase.co`
- Check: Production, Preview, Development

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhveGpoZ2VhaGdiaGpoeXdoa3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzM3MDIsImV4cCI6MjA3ODA0OTcwMn0.nKDVO6quzjAxKp2UheOSQBR9hzCYzG0ETkLt2EvdpLg`
- Check: Production, Preview, Development

## Step 4: Redeploy

After adding variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for it to finish

Your app should now work at the new URL!

## Alternative: Give Yourself Push Access

If you want to use the GitHub repo instead:

1. Ask Pcgodwin001 to add you as a collaborator on the GitHub repo
2. Then you can push your changes
3. Vercel connected to that repo will auto-deploy

## Which Should You Use?

- **New Vercel project** (Option 1) = Easier, you control it, works immediately
- **GitHub repo** (Option 2) = Keeps everything together, but needs collaboration setup

For the hackathon, I recommend Option 1 (new Vercel project under your account) - it's faster and you have full control!
