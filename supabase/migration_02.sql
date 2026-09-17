-- ============================================================
-- QR ATTENDANCE - PHASE 6 MIGRATION (MISSIONS & CATEGORIES)
-- ============================================================

-- 1. Update events table with category
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';

-- 2. Create Missions table
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  target_category TEXT NOT NULL DEFAULT 'All', -- 'All' means it counts any event
  required_count INTEGER NOT NULL DEFAULT 1,
  badge_name TEXT NOT NULL,
  badge_icon TEXT NOT NULL DEFAULT '🏆',
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on missions
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS Policies for missions
-- Anyone (authenticated) can view missions
CREATE POLICY "Anyone can view missions" 
ON public.missions FOR SELECT 
TO authenticated
USING (true);

-- Only admins can insert missions
CREATE POLICY "Admins can insert missions" 
ON public.missions FOR INSERT 
TO authenticated
WITH CHECK (
  public.is_admin()
  AND created_by = auth.uid()
);

-- Only admins can update missions
CREATE POLICY "Admins can update missions" 
ON public.missions FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only admins can delete missions
CREATE POLICY "Admins can delete missions" 
ON public.missions FOR DELETE 
TO authenticated
USING (public.is_admin());
