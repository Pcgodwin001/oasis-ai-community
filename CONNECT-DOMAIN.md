# Connect Your Custom Domain to Vercel

## Step 1: Go to Your Vercel Project

1. Visit https://vercel.com
2. Sign in
3. Click on your **oasis-ai-community** project

## Step 2: Add Your Domain

1. Click on the **Settings** tab
2. Click **Domains** in the left sidebar
3. In the "Domain" field, type your domain (e.g., `yourdomain.com`)
4. Click **Add**

## Step 3: Configure DNS

Vercel will show you one of these options:

### Option A: You Own the Domain (Recommended)

If you bought the domain from a registrar (GoDaddy, Namecheap, Google Domains, etc.):

**For Root Domain (yourdomain.com):**
- Type: `A Record`
- Name: `@`
- Value: `76.76.21.21`

**For www Subdomain (www.yourdomain.com):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### Option B: Using a Subdomain

If you want to use a subdomain like `app.yourdomain.com`:

- Type: `CNAME`
- Name: `app` (or whatever subdomain you want)
- Value: `cname.vercel-dns.com`

## Step 4: Update DNS at Your Domain Registrar

1. Go to your domain registrar's website (where you bought the domain)
2. Find the **DNS Settings** or **DNS Management** section
3. Add the records from Step 3 above
4. Save the changes

### Common Registrars:

**GoDaddy:**
1. Go to GoDaddy.com → My Products
2. Click DNS next to your domain
3. Click Add → Select record type
4. Add the records

**Namecheap:**
1. Go to Domain List
2. Click Manage next to your domain
3. Click Advanced DNS
4. Add the records

**Google Domains:**
1. Go to DNS settings
2. Click Manage Custom Records
3. Add the records

**Cloudflare:**
1. Go to DNS
2. Click Add Record
3. Add the records

## Step 5: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Usually it's done within 5-30 minutes
- You can check status at: https://www.whatsmydns.net/

## Step 6: Verify in Vercel

1. Go back to your Vercel project → Settings → Domains
2. You should see your domain with a checkmark when it's ready
3. Vercel will automatically issue an SSL certificate (HTTPS)

## Important Notes

### SSL Certificate
- Vercel automatically provides free SSL (HTTPS)
- Your site will be `https://yourdomain.com` (secure)

### www Redirect
If you add both `yourdomain.com` and `www.yourdomain.com`, Vercel will:
- Automatically redirect one to the other
- You can choose which is primary in Vercel settings

### Domain Status
In Vercel, your domain will show:
- ⏳ **Pending** - Waiting for DNS
- ✅ **Valid** - Domain connected successfully
- ❌ **Invalid** - DNS records not configured correctly

## Troubleshooting

### Domain shows "Invalid"
- Double-check DNS records are exactly correct
- Wait longer (DNS can take up to 48 hours)
- Make sure you're editing DNS at the RIGHT registrar

### "Domain is already in use"
- The domain is connected to another Vercel project
- Remove it from the other project first

### Can't find DNS settings
- Contact your domain registrar's support
- They can help you add the DNS records

## Quick Reference

**What you need:**
- Your domain name
- Access to your domain's DNS settings
- 5-30 minutes for DNS to propagate

**Vercel's DNS values:**
- A Record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com`

After setup, your app will be live at your custom domain!
