-- ============================================================
-- QR ATTENDANCE - SECURITY / RLS MIGRATION
-- ============================================================

-- 1. Safely check whether the currently authenticated user is an admin.
-- SECURITY DEFINER allows this function to read profiles without
-- triggering the recursive profiles RLS policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role
  INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(user_role = 'admin', false);
END;
$$;


-- 2. Only allow the function to be used as intended.
-- The function only returns true/false and exposes no profile data.
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- 3. Remove the old recursive/admin policies.
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

DROP POLICY IF EXISTS "Admins can view all attendances" ON public.attendances;


-- ============================================================
-- PROFILES
-- ============================================================

CREATE POLICY "Admin can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin());


-- ============================================================
-- EVENTS
-- ============================================================

CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin()
  AND created_by = auth.uid()
);


CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (public.is_admin());


-- ============================================================
-- ATTENDANCES
-- ============================================================

CREATE POLICY "Admins can view all attendances"
ON public.attendances
FOR SELECT
TO authenticated
USING (public.is_admin());


-- ============================================================
-- NEW USER PROFILE
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  requested_username text;
BEGIN
  requested_username := NULLIF(
    TRIM(new.raw_user_meta_data->>'username'),
    ''
  );

  INSERT INTO public.profiles (
    id,
    username,
    role
  )
  VALUES (
    new.id,
    COALESCE(
      requested_username,
      NULLIF(split_part(COALESCE(new.email, ''), '@', 1), ''),
      'user'
    ),
    'user'
  );

  RETURN new;
END;
$$;
