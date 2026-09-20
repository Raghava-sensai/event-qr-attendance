-- QR ATTENDANCE - PHASE 10 MIGRATION (CUSTOM EVENT XP)

ALTER TABLE events ADD COLUMN IF NOT EXISTS xp_value INTEGER NOT NULL DEFAULT 1;

-- Dummy Data Injection (Optional: Run this to instantly populate your dashboard for testing)
-- This creates 3 events worth 5 XP each.
INSERT INTO events (title, description, category, event_date, status, xp_value, stage_label, tags)
VALUES 
('Opening Ceremony', 'Welcome to Aurelia Fest! Start your journey here.', 'General', NOW(), 'active', 5, 'Stage 1', 'Main Event, Music'),
('Art Workshop', 'Get creative at the painting station.', 'Workshop', NOW(), 'active', 5, 'Stage 2', 'Creative, Hands-on'),
('Whisker Wall', 'Say hi to the mascot!', 'Networking', NOW(), 'active', 5, 'Stage 3', 'Fun, Photo');

-- This creates a badge rule that unlocks at 10 XP (since target_category is 'All')
INSERT INTO missions (title, description, target_category, required_count, badge_name, badge_icon)
VALUES 
('Aura Master', 'You collected 10 Aura XP!', 'All', 10, 'Aura Master', '🌟')
ON CONFLICT DO NOTHING;
