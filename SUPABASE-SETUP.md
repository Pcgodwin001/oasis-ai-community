# Supabase Database Setup Guide

## Quick Start - 5 Minutes to Full Functionality!

Your Oasis app code is already perfect! You just need to set up the database tables in Supabase.

---

## Step 1: Open Supabase SQL Editor (1 minute)

1. Go to [Supabase Dashboard](https://app.supabase.com/project/hoxjhgeahgbhjhywhksh)
2. Click **SQL Editor** in the left sidebar
3. Click **New query** button

---

## Step 2: Run the Database Schema (2 minutes)

1. Open the file `supabase/schema.sql` in this project
2. **Copy the ENTIRE contents** of the file (Cmd+A, Cmd+C)
3. **Paste into the Supabase SQL Editor**
4. Click the **RUN** button (or press Cmd+Enter)

### What This Does:
✅ Creates 6 database tables:
  - `user_profiles` - User demographic data
  - `ebt_accounts` - EBT card information
  - `transactions` - Transaction history
  - `chat_messages` - AI chat conversations
  - `resources` - Food banks and pantries
  - `eligibility_results` - Benefit calculations

✅ Sets up Row Level Security (RLS) policies
✅ Creates automatic timestamp triggers
✅ Seeds 5 demo food banks/pantries

### Expected Result:
You should see:
```
Success. No rows returned
```

This is normal! It means the schema was created successfully.

---

## Step 3: Verify Tables Were Created (1 minute)

Run this verification query in the SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Expected Output:
You should see 6 tables:
- chat_messages
- ebt_accounts
- eligibility_results
- resources
- transactions
- user_profiles

---

## Step 4: Test User Signup (2 minutes)

Now your app is fully functional!

1. Go to your app: http://localhost:5173/signup (or your deployed URL)
2. Create a new account:
   - **Email:** your.email@example.com
   - **Password:** Test123!
   - **Name:** Your Full Name
   - **Household Size:** 3
   - **ZIP Code:** 10001

3. Complete signup and log in

4. **Verify it worked:**
   - Dashboard should show "Welcome back, [Your Name]!"
   - Your name should appear in the sidebar
   - No more "John Doe" anywhere!

---

## Step 5: Verify Data is Saving (1 minute)

Check that your account was saved to the database:

```sql
-- See all user profiles
SELECT full_name, location, zip_code, household_size
FROM user_profiles;
```

### Expected Output:
You should see YOUR profile data in the results!

---

## Optional: Create Demo Account (5 minutes)

Want a fully populated demo account for testing?

### Option A: Quick Demo (Automatic)

1. **Create the demo account in your app:**
   - Email: `demo@oasis.app`
   - Password: `Demo123!`
   - Name: Sarah Martinez

2. **Run the demo seed script:**
   - Open `supabase/seed-demo-user.sql`
   - Copy entire contents
   - Paste into Supabase SQL Editor
   - Click **RUN**

3. **Login as demo user:**
   - Email: demo@oasis.app
   - Password: Demo123!

### What the Demo Account Includes:
✅ Complete user profile (Sarah Martinez, NYC)
✅ EBT account with $245 balance
✅ 10 transaction history entries
✅ Eligibility results calculated
✅ Chat conversation history with NOVA

---

## Troubleshooting

### Problem: "table already exists" error

**Solution:** Tables were already created! Skip to Step 4.

### Problem: "relation does not exist" when signing up

**Solution:**
1. Make sure you ran `schema.sql` successfully
2. Check that all 6 tables exist (Step 3)
3. Try refreshing your app

### Problem: User signup succeeds but dashboard shows errors

**Solution:**
1. Check browser console for errors
2. Verify environment variables in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://hoxjhgeahgbhjhywhksh.supabase.co
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```
3. Restart dev server: `npm run dev`

### Problem: "permission denied for table" errors

**Solution:** RLS policies weren't created properly. Re-run `schema.sql`

### Problem: Can't see resources on the map

**Solution:**
```sql
-- Check if resources were seeded
SELECT COUNT(*) FROM resources;
```

If it returns 0, the insert failed. Run just this part:

```sql
INSERT INTO resources (name, type, address, lat, lng, phone, hours, services, rating, review_count) VALUES
('Community Food Bank', 'food_bank', '123 Main St, New York, NY 10001', 40.7128, -74.0060, '(555) 123-4567', 'Mon-Fri: 9AM-5PM, Sat: 10AM-2PM', ARRAY['Food pantry', 'Hot meals', 'SNAP assistance'], 4.5, 128),
('St. Mary''s Food Pantry', 'food_pantry', '456 Church Ave, New York, NY 10002', 40.7580, -73.9855, '(555) 234-5678', 'Tue, Thu: 1PM-6PM', ARRAY['Non-perishable food', 'Fresh produce'], 4.7, 89),
('Daily Bread Soup Kitchen', 'soup_kitchen', '789 Hope Street, Brooklyn, NY 11201', 40.7489, -73.9680, '(555) 345-6789', 'Daily: 11AM-1PM, 5PM-7PM', ARRAY['Hot meals', 'Groceries'], 4.3, 201),
('Helping Hands Community Center', 'food_bank', '321 Service Blvd, Queens, NY 11354', 40.7306, -73.9352, '(555) 456-7890', 'Mon-Sat: 8AM-6PM', ARRAY['Food pantry', 'Job assistance', 'Childcare'], 4.8, 156),
('Harvest Hope Food Bank', 'food_bank', '654 Charity Lane, Bronx, NY 10451', 40.7614, -73.9776, '(555) 567-8901', 'Mon-Fri: 10AM-4PM', ARRAY['Emergency food', 'WIC enrollment', 'SNAP application help'], 4.6, 92);
```

---

## What's Fixed Now?

After running the schema, these features now work:

✅ **User Account Creation** - Profiles save to database
✅ **User Login** - Loads real user data
✅ **Dashboard** - Shows personalized "Welcome back, [Your Name]!"
✅ **Sidebar** - Displays your actual name and location
✅ **EBT Balance** - Can add cards and view balance
✅ **Transactions** - Can add and view transaction history
✅ **Cash Flow Predictions** - Calculates based on real data
✅ **Resource Finder** - Shows 5 food banks on map
✅ **AI Chat** - Conversation history persists
✅ **Eligibility Calculator** - Results saved to database
✅ **Settings** - Profile updates save to database

---

## Database Maintenance

### View All Tables and Row Counts

```sql
SELECT
  schemaname,
  tablename,
  (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', schemaname, tablename), false, true, '')))[1]::text::int AS row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Clear Demo Data (Start Fresh)

```sql
-- WARNING: This deletes ALL user data!
TRUNCATE user_profiles, ebt_accounts, transactions, chat_messages, eligibility_results RESTART IDENTITY CASCADE;

-- Keep resources
-- Run this after to re-seed resources if needed:
-- (paste the INSERT INTO resources... statement from schema.sql)
```

### Backup Your Data

In Supabase Dashboard:
1. Go to Database → Backups
2. Click "Create backup"
3. Save backup before making major changes

---

## Need Help?

- Check browser console for errors (F12)
- Check Supabase logs: Dashboard → Logs
- Verify `.env.local` has correct Supabase URL and key
- Make sure you're logged into the correct Supabase project

---

## Success! 🎉

Your Oasis AI Community app is now fully functional with a proper database backend!

**Next Steps:**
1. Create your own account
2. Test all features
3. Deploy to production
4. Share with users!
