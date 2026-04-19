-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  kyc_status TEXT DEFAULT 'not_started', -- not_started, pending, verified, rejected
  kyc_verification_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  usdt_balance DECIMAL(18, 8) DEFAULT 0,
  inr_balance DECIMAL(18, 2) DEFAULT 0,
  trc20_address TEXT,
  private_key TEXT, -- Store encrypted in production
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  order_type TEXT NOT NULL CHECK (order_type IN ('limit', 'market')),
  price DECIMAL(18, 2) NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  total_cost DECIMAL(18, 2) NOT NULL,
  filled_pct DECIMAL(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'partially_filled', 'filled', 'cancelled')),
  tx_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create p2p_ads table
CREATE TABLE IF NOT EXISTS p2p_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  rate DECIMAL(18, 2) NOT NULL,
  min_limit DECIMAL(18, 2) NOT NULL,
  max_limit DECIMAL(18, 2) NOT NULL,
  payment_methods TEXT[] DEFAULT ARRAY['UPI', 'IMPS'],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create escrow table
CREATE TABLE IF NOT EXISTS escrow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id TEXT UNIQUE NOT NULL,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usdt_amount DECIMAL(18, 8) NOT NULL,
  inr_amount DECIMAL(18, 2) NOT NULL,
  status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'released', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'transfer', 'exchange')),
  amount DECIMAL(18, 8) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  txhash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_p2p_ads_user_id ON p2p_ads(user_id);
CREATE INDEX idx_p2p_ads_status ON p2p_ads(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);

-- Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE p2p_ads;

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE p2p_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users can only view their own data
CREATE POLICY "Users can view own record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Wallets RLS
CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallet" ON wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Orders RLS
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- P2P Ads RLS
CREATE POLICY "Users can view all P2P ads" ON p2p_ads
  FOR SELECT USING (true);

CREATE POLICY "Users can create P2P ads" ON p2p_ads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own P2P ads" ON p2p_ads
  FOR UPDATE USING (auth.uid() = user_id);

-- Transactions RLS
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);
