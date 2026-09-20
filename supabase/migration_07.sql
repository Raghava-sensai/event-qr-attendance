-- ============================================================
-- QR ATTENDANCE - PHASE 7 MIGRATION (GAMIFIED UNLOCKS)
-- ============================================================

-- 1. Add unlock_xp column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS unlock_xp INTEGER NOT NULL DEFAULT 0;

-- 2. Force Supabase API cache refresh so it sees the new column
NOTIFY pgrst, 'reload schema';

-- 3. Insert a dummy secret event for testing
INSERT INTO events (title, description, category, event_date, status, xp_value, stage_label, tags, unlock_xp, created_by)
VALUES 
('The Secret VIP Lounge', 'You found the secret level! Grab some exclusive merch.', 'Main Event', NOW(), 'active', 20, 'Secret Boss', 'VIP, Merch', 10, (SELECT id FROM auth.users LIMIT 1));
