-- 1. Create SECURITY DEFINER function to check if a user is an admin safely
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  -- We query the profile table for the current user's role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN coalesce(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing recursive policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all attendances" ON public.attendances;

-- 3. Re-create policies using the safe is_admin() function
CREATE POLICY "Admin can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can insert events" 
ON public.events FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events" 
ON public.events FOR UPDATE
USING (public.is_admin());

CREATE POLICY "Admins can delete events" 
ON public.events FOR DELETE 
USING (public.is_admin());

CREATE POLICY "Admins can view all attendances" 
ON public.attendances FOR SELECT 
USING (public.is_admin());

-- 4. Update the handle_new_user trigger to use metadata username if provided, else fallback to email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    new.id, 
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
