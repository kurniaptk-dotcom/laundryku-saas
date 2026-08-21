-- ========================================================
-- LAUNDRYKU PRO - SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- Copy-paste this SQL into your Supabase Dashboard SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
-- ========================================================

-- 1. TENANTS TABLE (Mitra Laundry SaaS)
CREATE TABLE IF NOT EXISTS public.tenants (
  id VARCHAR(50) PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(50) NOT NULL,
  city VARCHAR(100) DEFAULT 'Indonesia',
  plan_id VARCHAR(50) DEFAULT 'pro_unlimited',
  plan_name VARCHAR(100) DEFAULT 'Pro Unlimited',
  monthly_fee NUMERIC DEFAULT 250000,
  status VARCHAR(20) DEFAULT 'active',
  join_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE DEFAULT (CURRENT_DATE + INTERVAL '14 days'),
  branches_count INT DEFAULT 1,
  total_orders_processed INT DEFAULT 0,
  total_revenue_processed NUMERIC DEFAULT 0,
  whatsapp_quota_used INT DEFAULT 0,
  branding JSONB DEFAULT '{
    "laundryName": "LaundryKu Pro",
    "tagline": "Bersih, Rapi & Wangi Tahan Lama",
    "address": "Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat",
    "phone": "0812-3456-7890",
    "receiptFooter": "Terima kasih atas kunjungan Anda!"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMERS CRM TABLE (Pelanggan Laundry)
CREATE TABLE IF NOT EXISTS public.customers (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES public.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  tier VARCHAR(50) DEFAULT 'Member Regular',
  balance NUMERIC DEFAULT 0,
  points INT DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_orders INT DEFAULT 0,
  last_order_date DATE,
  preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ORDERS TABLE (Transaksi Laundry POS & Realtime Tracking)
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id VARCHAR(50) REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  services JSONB NOT NULL,
  total_weight NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Cash',
  payment_status VARCHAR(50) DEFAULT 'Lunas',
  status VARCHAR(50) DEFAULT 'received',
  scent VARCHAR(100) DEFAULT 'Sakura Blossom',
  rack_location VARCHAR(50) DEFAULT 'RAK-A1',
  courier_name VARCHAR(100),
  photo_audit_before TEXT,
  photo_audit_after TEXT,
  notes TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SERVICES TABLE (Tarif Layanan Laundry)
CREATE TABLE IF NOT EXISTS public.services (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES public.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  unit VARCHAR(20) DEFAULT 'Kg',
  duration_hours INT DEFAULT 24,
  category VARCHAR(50) DEFAULT 'Kiloan',
  icon VARCHAR(10) DEFAULT '🧺',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MACHINES TABLE (Sensor IoT Mesin Cuci)
CREATE TABLE IF NOT EXISTS public.machines (
  id VARCHAR(50) PRIMARY KEY,
  tenant_id VARCHAR(50) REFERENCES public.tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'Washer',
  status VARCHAR(50) DEFAULT 'idle',
  rpm INT DEFAULT 1200,
  temperature INT DEFAULT 45,
  remaining_minutes INT DEFAULT 0,
  current_cycle VARCHAR(100),
  total_hours_used INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT ISOLATION
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;

-- CREATE PERMISSIVE POLICIES FOR INITIAL SETUP
CREATE POLICY "Allow public read-write for demo setup" ON public.tenants FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo setup" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo setup" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo setup" ON public.services FOR ALL USING (true);
CREATE POLICY "Allow public read-write for demo setup" ON public.machines FOR ALL USING (true);
