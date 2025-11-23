-- Run this in Supabase SQL Editor to fix the subscription error
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_plan_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_plan_interval TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_subscription_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS dropshipper_subscription_end TIMESTAMP WITH TIME ZONE;
