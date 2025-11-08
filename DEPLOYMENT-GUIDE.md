# 🚀 Deployment Guide - Oasis App

## Complete guide to deploy your app and connect your custom domain

---

## 🎯 Quick Overview

**What you'll do:**
1. Build your app for production
2. Deploy to Vercel (free, easiest option)
3. Connect your custom domain
4. Configure environment variables
5. Test everything works

**Time required:** 15-20 minutes

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ Your custom domain (e.g., oasisapp.com)
- ✅ Access to your domain's DNS settings
- ✅ GitHub account (or create one - it's free)
- ✅ All environment variables ready

---

## 🚀 Method 1: Deploy to Vercel (Recommended)

Vercel is perfect for React/Vite apps and offers:
- Free hosting
- Automatic HTTPS
- Custom domain support
- Automatic deployments from GitHub
- Edge network (fast worldwide)

### Step 1: Push Code to GitHub

```bash
cd /Users/philipgodwin/Documents/Hackathon2025

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Oasis app ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/oasis-app.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 3: Import Your Project

1. Click "Add New" → "Project"
2. Select your `oasis-app` repository
3. Vercel will auto-detect it's a Vite project

**Configure Build Settings:**
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Add Environment Variables

**IMPORTANT:** Add these in Vercel's project settings:

```
VITE_SUPABASE_URL=https://hoxjhgeahgbhjhywhksh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to add:**
1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase URL
   - Click "Add"
4. Repeat for `VITE_SUPABASE_ANON_KEY`

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://oasis-app.vercel.app`

**Test the deployment:**
- Visit your Vercel URL
- Try signing in
- Check that everything works

### Step 6: Connect Your Custom Domain

**In Vercel:**
1. Go to your project
2. Click "Settings" → "Domains"
3. Enter your domain (e.g., `oasisapp.com`)
4. Click "Add"

**Vercel will show you DNS records to add:**

**For root domain (oasisapp.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**In your domain provider (GoDaddy, Namecheap, etc.):**

1. Log in to your domain provider
2. Go to DNS settings
3. Add the records Vercel showed you
4. Save changes

**DNS propagation:** Takes 5 minutes to 48 hours (usually ~15 minutes)

### Step 7: Verify Domain

1. Wait 5-15 minutes for DNS to propagate
2. Go back to Vercel → Settings → Domains
3. You should see ✅ next to your domain
4. Visit https://yourdomain.com
5. Your app should be live! 🎉

---

## 🔧 Method 2: Deploy to Netlify (Alternative)

### Step 1: Push to GitHub (same as above)

### Step 2: Sign Up for Netlify

1. Go to https://app.netlify.com/signup
2. Sign up with GitHub

### Step 3: Deploy

1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository
4. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

### Step 4: Environment Variables

1. Go to Site settings → Environment variables
2. Add:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```

### Step 5: Custom Domain

1. Go to Domain settings
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS instructions
5. Add these records at your DNS provider:

**For Netlify:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: YOUR-SITE.netlify.app
```

---

## 📝 Common DNS Providers Setup

### GoDaddy

1. Log in to GoDaddy
2. My Products → Domain → Manage DNS
3. Click "Add" to add new record
4. Choose record type (A or CNAME)
5. Fill in Name and Value
6. Save

### Namecheap

1. Log in to Namecheap
2. Domain List → Manage
3. Advanced DNS tab
4. Add New Record
5. Choose Type, Host, Value
6. Save

### Google Domains

1. Log in to Google Domains
2. My domains → Manage
3. DNS tab
4. Custom records section
5. Create new record
6. Save

### Cloudflare

1. Log in to Cloudflare
2. Select your domain
3. DNS tab
4. Add record
5. Fill in Type, Name, Content
6. Save

---

## 🔐 Security Checklist

Before going live:

- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] Environment variables set (not committed to Git)
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] API keys using Supabase secrets
- [ ] CORS configured correctly

---

## ⚙️ Build Configuration

### Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
})
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

---

## 🧪 Test Production Build Locally

Before deploying, test the production build:

```bash
# Build for production
npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173
```

**Check:**
- ✅ App loads correctly
- ✅ Sign in/sign up works
- ✅ All features functional
- ✅ No console errors
- ✅ Environment variables loading

---

## 🌐 DNS Configuration Examples

### Example 1: Root domain only (oasisapp.com)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto
```

### Example 2: Root + www (oasisapp.com and www.oasisapp.com)

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Example 3: Subdomain (app.oasisapp.com)

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment variables not working

**Solution:**
1. Make sure they're prefixed with `VITE_`
2. Rebuild after adding variables
3. Check they're set in deployment platform

### Issue: Domain not connecting

**Solutions:**
1. Wait 15-30 minutes for DNS propagation
2. Check DNS records are correct
3. Try `dig yourdomain.com` to verify
4. Clear browser cache

### Issue: "Failed to fetch" errors

**Solution:**
1. Check Supabase URL in environment variables
2. Verify CORS settings in Supabase
3. Check browser console for specific errors

### Issue: Build fails on Vercel/Netlify

**Solutions:**
1. Check build command is `npm run build`
2. Verify output directory is `dist`
3. Check for TypeScript errors locally
4. Review deployment logs for specific errors

---

## 📊 Deployment Platforms Comparison

| Feature | Vercel | Netlify | Railway | Render |
|---------|--------|---------|---------|--------|
| Free tier | ✅ Yes | ✅ Yes | ⚠️ Limited | ⚠️ Limited |
| Custom domain | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Auto HTTPS | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| GitHub integration | ✅ Excellent | ✅ Excellent | ✅ Good | ✅ Good |
| Build time | ⚡ Fast | ⚡ Fast | 🐌 Slower | 🐌 Slower |
| Best for | React/Next.js | React/Vue | Full-stack | Full-stack |

**Recommendation: Use Vercel for your React + Vite app**

---

## 🎯 Quick Deployment Checklist

**Pre-deployment:**
- [ ] Code is on GitHub
- [ ] Environment variables documented
- [ ] Production build tested locally
- [ ] All features working

**Deployment:**
- [ ] Signed up for Vercel/Netlify
- [ ] Connected GitHub repository
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Added environment variables
- [ ] Deployed successfully

**Domain Connection:**
- [ ] Added domain in Vercel/Netlify
- [ ] Got DNS records
- [ ] Updated DNS at domain provider
- [ ] Waited for propagation (15+ min)
- [ ] Verified domain works
- [ ] HTTPS enabled automatically

**Post-deployment:**
- [ ] Tested sign in/sign up
- [ ] Verified all features work
- [ ] Checked mobile responsiveness
- [ ] Monitored for errors
- [ ] Set up analytics (optional)

---

## 🚀 Automated Deployments

**After initial setup, deployments are automatic!**

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Vercel/Netlify automatically:
# 1. Detects the push
# 2. Runs npm install
# 3. Runs npm run build
# 4. Deploys to production
# 5. Your site updates in 2-3 minutes!
```

---

## 📈 Performance Optimization

### 1. Enable Caching

**In Vercel:**
Automatic - static assets cached on edge network

### 2. Optimize Images

```bash
# Install image optimization tools
npm install vite-plugin-imagemin --save-dev
```

### 3. Code Splitting

Already configured in vite.config.ts:
```typescript
manualChunks: {
  vendor: ['react', 'react-dom'],
  supabase: ['@supabase/supabase-js'],
}
```

### 4. Enable Compression

Automatic on Vercel/Netlify (gzip + brotli)

---

## 🎨 Custom Domain Examples

**Professional domains:**
- oasisapp.com
- tryoasis.com
- getoasis.app
- oasis.ai
- oasis.io

**Subdomains:**
- app.oasisapp.com
- beta.oasisapp.com
- demo.oasisapp.com

**Free testing domains:**
- your-app.vercel.app (before custom domain)
- your-app.netlify.app

---

## 💡 Pro Tips

1. **Use Vercel for React apps** - Best performance and developer experience

2. **Always test locally first**
   ```bash
   npm run build && npm run preview
   ```

3. **Monitor deployments**
   - Vercel: Real-time deployment logs
   - Set up Slack/Discord notifications

4. **Use environment variables for everything**
   - Never hardcode API keys
   - Different values for dev/prod

5. **Enable preview deployments**
   - Every PR gets its own URL
   - Test before merging

6. **Set up custom error pages**
   - Create `/public/404.html`
   - Better user experience

---

## 📞 Need Help?

**Vercel Support:**
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs

**Netlify Support:**
- Forum: https://answers.netlify.com/
- Docs: https://docs.netlify.com/

**DNS Help:**
- DNSChecker: https://dnschecker.org/
- Check propagation status

---

## ✅ Final Checklist

Before announcing your app is live:

- [ ] Domain loads without errors
- [ ] HTTPS (lock icon) shows in browser
- [ ] Sign up flow works
- [ ] Sign in flow works
- [ ] All features functional
- [ ] Mobile responsive
- [ ] Fast load times (< 3 seconds)
- [ ] No console errors
- [ ] Analytics set up (optional)
- [ ] Error monitoring (optional)

---

## 🎉 You're Live!

Once deployed, share your app:
- ✅ https://yourdomain.com
- ✅ Automatic HTTPS
- ✅ Fast global CDN
- ✅ Automatic deployments
- ✅ Custom domain connected

**Congratulations! Your Oasis app is live! 🚀**

---

## 📚 Additional Resources

**Deployment:**
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

**DNS:**
- [DNS Basics](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [DNS Checker Tool](https://dnschecker.org/)

**Performance:**
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Tool](https://developers.google.com/web/tools/lighthouse)

---

**Need help? Let me know!** 🚀
