-- ============================================
-- OASIS AI COMMUNITY - DATABASE SCHEMA
-- ============================================
-- Run this SQL in Supabase SQL Editor to set up the database
-- ============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER PROFILES TABLE
-- ============================================
-- Stores demographic and profile information for users
-- Links to Supabase Auth via user ID

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  location TEXT,
  zip_code TEXT,
  household_size INTEGER,
  monthly_income NUMERIC(10,2),
  children_count INTEGER,
  has_elderly BOOLEAN DEFAULT FALSE,
  has_disabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. EBT ACCOUNTS TABLE
-- ============================================
-- Stores EBT (Electronic Benefits Transfer) card information
-- Each user can have one EBT account

CREATE TABLE ebt_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  card_last_four TEXT,
  state TEXT,
  current_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  refill_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- Enforce one EBT account per user
);

-- Enable Row Level Security
ALTER TABLE ebt_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ebt_accounts
CREATE POLICY "Users can view own EBT account"
  ON ebt_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own EBT account"
  ON ebt_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own EBT account"
  ON ebt_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own EBT account"
  ON ebt_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp trigger
CREATE TRIGGER update_ebt_accounts_updated_at
  BEFORE UPDATE ON ebt_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. TRANSACTIONS TABLE
-- ============================================
-- Stores all financial transactions (EBT and general)

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  ebt_account_id UUID REFERENCES ebt_accounts(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  merchant TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  balance_after NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date DESC);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. CHAT MESSAGES TABLE
-- ============================================
-- Stores AI chat conversation history

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_messages
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 5. RESOURCES TABLE
-- ============================================
-- Stores food banks, pantries, and community resources

CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC(10,8) NOT NULL,
  lng NUMERIC(11,8) NOT NULL,
  phone TEXT,
  hours TEXT,
  services TEXT[],
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for geospatial queries
CREATE INDEX idx_resources_location ON resources(lat, lng);

-- Enable Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources (public read)
CREATE POLICY "Anyone can view resources"
  ON resources FOR SELECT
  USING (true);

-- Allow authenticated users to add resources
CREATE POLICY "Authenticated users can insert resources"
  ON resources FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 6. ELIGIBILITY RESULTS TABLE
-- ============================================
-- Stores benefit eligibility calculation results

CREATE TABLE eligibility_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  snap_eligible BOOLEAN NOT NULL,
  snap_amount NUMERIC(10,2),
  wic_eligible BOOLEAN NOT NULL,
  wic_amount NUMERIC(10,2),
  tanf_eligible BOOLEAN NOT NULL,
  tanf_amount NUMERIC(10,2),
  eitc_eligible BOOLEAN NOT NULL,
  eitc_amount NUMERIC(10,2),
  liheap_eligible BOOLEAN NOT NULL,
  liheap_amount NUMERIC(10,2),
  total_monthly NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_eligibility_user_id ON eligibility_results(user_id);
CREATE INDEX idx_eligibility_created_at ON eligibility_results(created_at DESC);

-- Enable Row Level Security
ALTER TABLE eligibility_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for eligibility_results
CREATE POLICY "Users can view own eligibility results"
  ON eligibility_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own eligibility results"
  ON eligibility_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. SEED DEMO RESOURCES
-- ============================================
-- Insert demo food banks and pantries for the resource map

INSERT INTO resources (name, type, address, lat, lng, phone, hours, services, rating, review_count) VALUES
('Community Food Bank', 'food_bank', '123 Main St, New York, NY 10001', 40.7128, -74.0060, '(555) 123-4567', 'Mon-Fri: 9AM-5PM, Sat: 10AM-2PM', ARRAY['Food pantry', 'Hot meals', 'SNAP assistance'], 4.5, 128),
('St. Mary''s Food Pantry', 'food_pantry', '456 Church Ave, New York, NY 10002', 40.7580, -73.9855, '(555) 234-5678', 'Tue, Thu: 1PM-6PM', ARRAY['Non-perishable food', 'Fresh produce'], 4.7, 89),
('Daily Bread Soup Kitchen', 'soup_kitchen', '789 Hope Street, Brooklyn, NY 11201', 40.7489, -73.9680, '(555) 345-6789', 'Daily: 11AM-1PM, 5PM-7PM', ARRAY['Hot meals', 'Groceries'], 4.3, 201),
('Helping Hands Community Center', 'food_bank', '321 Service Blvd, Queens, NY 11354', 40.7306, -73.9352, '(555) 456-7890', 'Mon-Sat: 8AM-6PM', ARRAY['Food pantry', 'Job assistance', 'Childcare'], 4.8, 156),
('Harvest Hope Food Bank', 'food_bank', '654 Charity Lane, Bronx, NY 10451', 40.7614, -73.9776, '(555) 567-8901', 'Mon-Fri: 10AM-4PM', ARRAY['Emergency food', 'WIC enrollment', 'SNAP application help'], 4.6, 92);

-- ============================================
-- SCHEMA SETUP COMPLETE
-- ============================================
-- Your Oasis app database is now ready!
--
-- Next steps:
-- 1. Create a test account in your app
-- 2. Verify data is being saved to the database
-- 3. (Optional) Run seed-demo-user.sql to create a demo account
-- ============================================
