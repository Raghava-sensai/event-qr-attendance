-- QR ATTENDANCE - PHASE 9 MIGRATION (REVIEWS & SETTINGS)

-- 1. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT PRIMARY KEY DEFAULT 1,
    review_email TEXT NOT NULL DEFAULT 'admin@example.com'
);

-- Insert default settings row
INSERT INTO admin_settings (id, review_email) VALUES (1, 'admin@example.com') ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for reviews
CREATE POLICY "Users can insert their own reviews" 
    ON reviews FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" 
    ON reviews FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 5. Create Policies for admin_settings
CREATE POLICY "Admins can read settings" 
    ON admin_settings FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update settings" 
    ON admin_settings FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
