-- ============================================================
-- QR ATTENDANCE - PHASE 7 MIGRATION (AVATARS)
-- ============================================================

-- Add avatar column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '🦊';
