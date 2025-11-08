-- ============================================
-- OASIS AI COMMUNITY - DEMO USER SEED DATA
-- ============================================
-- IMPORTANT: Only run this AFTER you've:
-- 1. Run schema.sql successfully
-- 2. Created a user account in the app with email: demo@oasis.app
-- 3. Retrieved the user ID from the auth.users table
-- ============================================

-- Step 1: Create the demo user account in the app first!
-- Email: demo@oasis.app
-- Password: Demo123! (or your choice)

-- Step 2: Get the user ID
-- Run this query and copy the ID:
-- SELECT id FROM auth.users WHERE email = 'demo@oasis.app';

-- Step 3: Replace 'YOUR_USER_ID_HERE' below with the actual UUID

-- ============================================
-- DEMO USER: Sarah Martinez
-- ============================================

DO $$
DECLARE
  demo_user_id UUID;
  demo_ebt_id UUID;
BEGIN
  -- Get the user ID for demo@oasis.app
  SELECT id INTO demo_user_id
  FROM auth.users
  WHERE email = 'demo@oasis.app';

  -- Check if user exists
  IF demo_user_id IS NULL THEN
    RAISE EXCEPTION 'User demo@oasis.app not found! Please create the account first.';
  END IF;

  -- Update user profile
  UPDATE user_profiles
  SET
    full_name = 'Sarah Martinez',
    location = 'New York, NY',
    zip_code = '10001',
    household_size = 3,
    monthly_income = 2100.00,
    children_count = 2,
    has_elderly = FALSE,
    has_disabled = FALSE
  WHERE id = demo_user_id;

  -- Create EBT account
  INSERT INTO ebt_accounts (user_id, card_last_four, state, current_balance, refill_date)
  VALUES (demo_user_id, '5678', 'NY', 245.00, '2025-11-15')
  ON CONFLICT (user_id) DO UPDATE
  SET
    card_last_four = '5678',
    state = 'NY',
    current_balance = 245.00,
    refill_date = '2025-11-15';

  -- Get the EBT account ID
  SELECT id INTO demo_ebt_id
  FROM ebt_accounts
  WHERE user_id = demo_user_id;

  -- Delete existing demo transactions if any
  DELETE FROM transactions WHERE user_id = demo_user_id;

  -- Add demo transactions
  INSERT INTO transactions (user_id, ebt_account_id, date, merchant, category, amount, balance_after) VALUES
  (demo_user_id, demo_ebt_id, '2025-11-07', 'Walmart Supercenter', 'Groceries', -45.32, 245.00),
  (demo_user_id, demo_ebt_id, '2025-11-05', 'Target', 'Household', -23.15, 290.32),
  (demo_user_id, demo_ebt_id, '2025-11-03', 'Kroger', 'Groceries', -67.88, 313.47),
  (demo_user_id, demo_ebt_id, '2025-10-31', 'CVS Pharmacy', 'Personal Care', -12.45, 381.35),
  (demo_user_id, demo_ebt_id, '2025-10-29', 'Aldi', 'Groceries', -34.20, 393.80),
  (demo_user_id, demo_ebt_id, '2025-10-27', 'Whole Foods', 'Groceries', -52.10, 428.00),
  (demo_user_id, demo_ebt_id, '2025-10-25', 'Dollar General', 'Household', -18.75, 480.10),
  (demo_user_id, demo_ebt_id, '2025-10-22', 'Safeway', 'Groceries', -41.50, 498.85),
  (demo_user_id, demo_ebt_id, '2025-10-20', 'Walgreens', 'Personal Care', -15.90, 540.35),
  (demo_user_id, demo_ebt_id, '2025-10-18', 'Food Lion', 'Groceries', -38.60, 556.25);

  -- Add demo eligibility results
  INSERT INTO eligibility_results (
    user_id,
    snap_eligible, snap_amount,
    wic_eligible, wic_amount,
    tanf_eligible, tanf_amount,
    eitc_eligible, eitc_amount,
    liheap_eligible, liheap_amount,
    total_monthly
  ) VALUES (
    demo_user_id,
    TRUE, 450.00,
    TRUE, 47.00,
    TRUE, 350.00,
    TRUE, 237.00,
    TRUE, 33.33,
    1117.33
  );

  -- Add demo chat messages
  INSERT INTO chat_messages (user_id, conversation_id, role, content) VALUES
  (demo_user_id, 'demo-conv-1', 'user', 'Hi NOVA, can you help me find food banks near me?'),
  (demo_user_id, 'demo-conv-1', 'assistant', 'Of course! Based on your ZIP code 10001 in New York, I found 5 food banks and pantries near you. The closest one is Community Food Bank at 123 Main St, which is open Mon-Fri 9AM-5PM. Would you like directions or more information about any of these resources?'),
  (demo_user_id, 'demo-conv-1', 'user', 'Yes, what services does Community Food Bank offer?'),
  (demo_user_id, 'demo-conv-1', 'assistant', 'Community Food Bank offers several services including: a food pantry with groceries, hot meal programs, and SNAP (food stamps) application assistance. They have a 4.5-star rating from 128 reviews. They''re open Monday through Friday 9AM-5PM and Saturday 10AM-2PM. Would you like me to save this as a favorite resource?');

  RAISE NOTICE 'Demo user data created successfully for Sarah Martinez!';
END $$;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these queries to verify the demo data was created:

-- Check profile
SELECT * FROM user_profiles WHERE email IN (
  SELECT email FROM auth.users WHERE email = 'demo@oasis.app'
);

-- Check EBT account
SELECT ea.* FROM ebt_accounts ea
JOIN user_profiles up ON ea.user_id = up.id
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'demo@oasis.app';

-- Check transactions (should show 10)
SELECT COUNT(*) as transaction_count FROM transactions t
JOIN user_profiles up ON t.user_id = up.id
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'demo@oasis.app';

-- Check eligibility results
SELECT * FROM eligibility_results er
JOIN user_profiles up ON er.user_id = up.id
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'demo@oasis.app';

-- Check chat messages (should show 4)
SELECT COUNT(*) as message_count FROM chat_messages cm
JOIN user_profiles up ON cm.user_id = up.id
JOIN auth.users au ON up.id = au.id
WHERE au.email = 'demo@oasis.app';

-- ============================================
-- Demo user setup complete!
-- Login with: demo@oasis.app / Demo123!
-- ============================================
