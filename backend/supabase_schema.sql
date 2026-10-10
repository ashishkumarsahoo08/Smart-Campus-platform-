-- ==============================================================================
-- SMART CAMPUS PLATFORM - SUPABASE POSTGRESQL CLOUD SCHEMA
-- Target Project ID: cvpupibxsrqrvfsnutmz
-- Project URL: https://cvpupibxsrqrvfsnutmz.supabase.co
-- SQL Editor URL: https://supabase.com/dashboard/project/cvpupibxsrqrvfsnutmz/sql/new
-- Run this in your Supabase SQL Editor to initialize all tables & security policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    duration_days INTEGER NOT NULL DEFAULT 30,
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    period TEXT NOT NULL DEFAULT 'Monthly',
    badge TEXT DEFAULT 'Active Tier',
    description TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Institutions Table (Multi-Tenant Partitions)
CREATE TABLE IF NOT EXISTS public.institutions (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT,
    address TEXT,
    regd_no TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    admin_user_id TEXT DEFAULT 'admin',
    subscription JSONB DEFAULT '{}'::jsonb,
    payment_config JSONB DEFAULT '{}'::jsonb,
    receipt_template JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payment Orders Table (Automated Payment Gateway & Webhook Switch)
CREATE TABLE IF NOT EXISTS public.payment_orders (
    id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    institution_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'SUCCESS', 'EXPIRED'
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
    upi_uri TEXT,
    bank_rrn TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4b. Orders Table (Direct Webhook & Polling Support)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    transaction_id TEXT,
    plan_id TEXT,
    institution_name TEXT,
    contact_email TEXT,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'PENDING',
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'success', 'failed'
    bank_rrn TEXT,
    upi_uri TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Users Directory Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    institution_id TEXT REFERENCES public.institutions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'superadmin', 'admin', 'faculty', 'student', 'parent', 'warden', 'security'
    name TEXT NOT NULL,
    login_id TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    roll TEXT,
    staff_id TEXT,
    dept TEXT,
    sem TEXT,
    password TEXT NOT NULL DEFAULT 'campus123',
    attendance JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Gate Passes & Outpasses Table
CREATE TABLE IF NOT EXISTS public.gate_passes (
    id TEXT PRIMARY KEY,
    institution_id TEXT REFERENCES public.institutions(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    roll TEXT NOT NULL,
    type TEXT NOT NULL, -- 'OUTPASS', 'LEAVE'
    destination TEXT,
    reason TEXT,
    out_time TEXT,
    expected_in_time TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'INSIDE', 'OUTSIDE'
    qr_data TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Activity History & Audit Log Table
CREATE TABLE IF NOT EXISTS public.activity_history (
    id TEXT PRIMARY KEY,
    institution_id TEXT,
    action_type TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Seed Default Subscription Plans (Initial ₹1 Promotional Phase)
INSERT INTO public.subscription_plans (id, name, duration_days, price_inr, period, badge, description, features)
VALUES
    ('PLAN-TOKEN', 'Verification Token (₹1)', 1, 1.00, 'Instant Test', 'Micro-Pay Verification (₹1 Token)', 'One Rupee verification token for instant platform activation & live payment testing.', '["Live UPI ID Verification Check", "Instant Scanner & Deep-Link Test", "E-Receipt & Payment Demo", "Instant Verification Token (₹1 Test Token)"]'::jsonb),
    ('PLAN-WEEKLY', 'Weekly Starter License', 7, 1.00, 'Weekly', 'Evaluation / Trial (₹1 License)', 'Ideal for rapid campus evaluation and feature testing. Currently ₹1.', '["Full Campus Portals & All Role Access", "Unlimited Students, Faculty & Parents", "Universal QR Gate Passes & Security Scanner", "Customizable Institutional Payment Gateway", "Automated Payment Verification & E-Receipts"]'::jsonb),
    ('PLAN-MONTHLY', 'Monthly Flexible License', 30, 1.00, 'Monthly', 'Pay-As-You-Go (₹1 License)', 'Flexible monthly billing. Full access for all institution departments. Currently ₹1.', '["Full Campus Portals & All Role Access", "Unlimited Students & Faculty Accounts", "Universal QR Gate Passes & Security Scanner", "Customizable Institutional Payment Gateway", "Customizable Official E-Receipt Formatter", "RapidAPI Multi-Language Engine"]'::jsonb),
    ('PLAN-YEARLY', 'Annual Institutional License', 365, 1.00, 'Yearly', 'Most Popular (₹1 License)', 'Comprehensive annual coverage for universities and colleges. Currently ₹1.', '["All Features of Monthly Plan Included", "Priority RapidAPI Neural Translation Bridge", "Automated Daily Database Snapshots & Backups", "Custom Domain Binding & Dedicated SSL", "24/7 Priority SLA Institutional Support"]'::jsonb),
    ('PLAN-ENTERPRISE', 'Multi-Campus University License', 1095, 1.00, '3 Years', 'Enterprise Best Value (₹1 License)', 'Permanent multi-campus clustering with custom ERP integrations. Currently ₹1.', '["Multi-Campus Clustering (Unlimited Blocks)", "Dedicated Institutional Database Instance", "Full Biometric & Smart Turnstile API Sync", "Dedicated Technical Account Manager"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    price_inr = EXCLUDED.price_inr,
    badge = EXCLUDED.badge;

-- 9. Row Level Security Policies (Permits read/write for backend service)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read and service role full access
CREATE POLICY "Public Read Subscription Plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Public Read Institutions" ON public.institutions FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access Plans" ON public.subscription_plans FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Institutions" ON public.institutions FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Orders" ON public.payment_orders FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Users" ON public.users FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Gatepasses" ON public.gate_passes FOR ALL USING (true);
CREATE POLICY "Service Role Full Access Activity" ON public.activity_history FOR ALL USING (true);
