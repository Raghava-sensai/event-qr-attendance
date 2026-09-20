-- ============================================================
-- QR ATTENDANCE - PHASE 8 MIGRATION (DYNAMIC STAGES)
-- ============================================================

-- Add stage details to events
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS stage_label TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';
