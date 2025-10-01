-- =====================================================
-- Seed Universities and Hostels Data
-- =====================================================
-- This script populates universities and hostels tables
-- Run this in the Supabase SQL Editor

-- Delete existing data (optional, uncomment if you want to reset)
-- TRUNCATE TABLE hostels CASCADE;
-- TRUNCATE TABLE universities CASCADE;

-- =====================================================
-- 1. Insert Universities
-- =====================================================

-- Indian Institute of Technology (IIT) Universities
INSERT INTO universities (name, location, domain) VALUES
  ('Indian Institute of Technology Delhi', 'New Delhi, Delhi', 'iitd.ac.in'),
  ('Indian Institute of Technology Bombay', 'Powai, Mumbai, Maharashtra', 'iitb.ac.in'),
  ('Indian Institute of Technology Madras', 'Chennai, Tamil Nadu', 'iitm.ac.in'),
  ('Indian Institute of Technology Kanpur', 'Kanpur, Uttar Pradesh', 'iitk.ac.in'),
  ('Indian Institute of Technology Kharagpur', 'Kharagpur, West Bengal', 'iitkgp.ac.in'),
  ('Indian Institute of Technology Roorkee', 'Roorkee, Uttarakhand', 'iitr.ac.in'),
  ('Indian Institute of Technology Guwahati', 'Guwahati, Assam', 'iitg.ac.in'),
  ('Indian Institute of Technology Hyderabad', 'Hyderabad, Telangana', 'iith.ac.in')
ON CONFLICT (name) DO UPDATE SET location = EXCLUDED.location, domain = EXCLUDED.domain;

-- National Institute of Technology (NIT) Universities
INSERT INTO universities (name, location, domain) VALUES
  ('National Institute of Technology Trichy', 'Tiruchirappalli, Tamil Nadu', 'nitt.edu'),
  ('National Institute of Technology Warangal', 'Warangal, Telangana', 'nitw.ac.in'),
  ('National Institute of Technology Karnataka', 'Surathkal, Karnataka', 'nitk.ac.in'),
  ('National Institute of Technology Calicut', 'Calicut, Kerala', 'nitc.ac.in'),
  ('National Institute of Technology Rourkela', 'Rourkela, Odisha', 'nitrkl.ac.in')
ON CONFLICT (name) DO UPDATE SET location = EXCLUDED.location, domain = EXCLUDED.domain;

-- Other Top Engineering Colleges
INSERT INTO universities (name, location, domain) VALUES
  ('Delhi Technological University', 'New Delhi, Delhi', 'dtu.ac.in'),
  ('Birla Institute of Technology and Science Pilani', 'Pilani, Rajasthan', 'bits-pilani.ac.in'),
  ('Vellore Institute of Technology', 'Vellore, Tamil Nadu', 'vit.ac.in'),
  ('Manipal Institute of Technology', 'Manipal, Karnataka', 'manipal.edu'),
  ('Anna University', 'Chennai, Tamil Nadu', 'annauniv.edu'),
  ('Jadavpur University', 'Kolkata, West Bengal', 'jadavpuruniversity.in'),
  ('SRM Institute of Science and Technology', 'Chennai, Tamil Nadu', 'srmist.edu.in'),
  ('Amity University', 'Noida, Uttar Pradesh', 'amity.edu')
ON CONFLICT (name) DO UPDATE SET location = EXCLUDED.location, domain = EXCLUDED.domain;

-- =====================================================
-- 2. Insert Hostels for IIT Delhi (Example)
-- =====================================================

-- Get IIT Delhi ID
DO $$
DECLARE
  iit_delhi_id UUID;
  iit_bombay_id UUID;
  iit_madras_id UUID;
  nit_trichy_id UUID;
BEGIN
  -- Get university IDs
  SELECT id INTO iit_delhi_id FROM universities WHERE name = 'Indian Institute of Technology Delhi';
  SELECT id INTO iit_bombay_id FROM universities WHERE name = 'Indian Institute of Technology Bombay';
  SELECT id INTO iit_madras_id FROM universities WHERE name = 'Indian Institute of Technology Madras';
  SELECT id INTO nit_trichy_id FROM universities WHERE name = 'National Institute of Technology Trichy';

  -- IIT Delhi Hostels
  IF iit_delhi_id IS NOT NULL THEN
    INSERT INTO hostels (name, address, university_id, total_rooms) VALUES
      ('Aravali Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 250),
      ('Himadri Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 200),
      ('Jwalamukhi Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 180),
      ('Karakoram Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 220),
      ('Kumaon Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 190),
      ('Nilgiri Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 210),
      ('Satpura Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 200),
      ('Shivalik Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 240),
      ('Vindhyachal Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 180),
      ('Zanskar Hostel', 'Hauz Khas, New Delhi', iit_delhi_id, 160),
      ('Kailash Hostel (Girls)', 'Hauz Khas, New Delhi', iit_delhi_id, 220),
      ('Girnar Hostel (Girls)', 'Hauz Khas, New Delhi', iit_delhi_id, 200)
    ON CONFLICT (name, university_id) DO UPDATE 
    SET address = EXCLUDED.address, total_rooms = EXCLUDED.total_rooms;
  END IF;

  -- IIT Bombay Hostels
  IF iit_bombay_id IS NOT NULL THEN
    INSERT INTO hostels (name, address, university_id, total_rooms) VALUES
      ('Hostel 1', 'Powai, Mumbai', iit_bombay_id, 300),
      ('Hostel 2', 'Powai, Mumbai', iit_bombay_id, 280),
      ('Hostel 3', 'Powai, Mumbai', iit_bombay_id, 320),
      ('Hostel 4', 'Powai, Mumbai', iit_bombay_id, 290),
      ('Hostel 5', 'Powai, Mumbai', iit_bombay_id, 310),
      ('Hostel 6', 'Powai, Mumbai', iit_bombay_id, 250),
      ('Hostel 7', 'Powai, Mumbai', iit_bombay_id, 270),
      ('Hostel 10', 'Powai, Mumbai', iit_bombay_id, 240),
      ('Hostel 11', 'Powai, Mumbai', iit_bombay_id, 260),
      ('Hostel 12', 'Powai, Mumbai', iit_bombay_id, 280),
      ('Hostel 15', 'Powai, Mumbai', iit_bombay_id, 350),
      ('Hostel 16', 'Powai, Mumbai', iit_bombay_id, 340)
    ON CONFLICT (name, university_id) DO UPDATE 
    SET address = EXCLUDED.address, total_rooms = EXCLUDED.total_rooms;
  END IF;

  -- IIT Madras Hostels
  IF iit_madras_id IS NOT NULL THEN
    INSERT INTO hostels (name, address, university_id, total_rooms) VALUES
      ('Narmada Hostel', 'Chennai', iit_madras_id, 280),
      ('Godavari Hostel', 'Chennai', iit_madras_id, 260),
      ('Krishna Hostel', 'Chennai', iit_madras_id, 290),
      ('Cauvery Hostel', 'Chennai', iit_madras_id, 270),
      ('Tapti Hostel', 'Chennai', iit_madras_id, 250),
      ('Brahmaputra Hostel', 'Chennai', iit_madras_id, 300),
      ('Ganga Hostel', 'Chennai', iit_madras_id, 320),
      ('Jamuna Hostel', 'Chennai', iit_madras_id, 240),
      ('Sabarmati Hostel (Girls)', 'Chennai', iit_madras_id, 280),
      ('Sharavati Hostel (Girls)', 'Chennai', iit_madras_id, 260)
    ON CONFLICT (name, university_id) DO UPDATE 
    SET address = EXCLUDED.address, total_rooms = EXCLUDED.total_rooms;
  END IF;

  -- NIT Trichy Hostels
  IF nit_trichy_id IS NOT NULL THEN
    INSERT INTO hostels (name, address, university_id, total_rooms) VALUES
      ('Agate Hostel', 'Tiruchirappalli', nit_trichy_id, 200),
      ('Diamond Hostel', 'Tiruchirappalli', nit_trichy_id, 220),
      ('Emerald Hostel', 'Tiruchirappalli', nit_trichy_id, 210),
      ('Jade Hostel', 'Tiruchirappalli', nit_trichy_id, 190),
      ('Opal Hostel', 'Tiruchirappalli', nit_trichy_id, 180),
      ('Ruby Hostel', 'Tiruchirappalli', nit_trichy_id, 200),
      ('Sapphire Hostel', 'Tiruchirappalli', nit_trichy_id, 210),
      ('Topaz Hostel', 'Tiruchirappalli', nit_trichy_id, 190),
      ('Coral Hostel (Girls)', 'Tiruchirappalli', nit_trichy_id, 220),
      ('Pearl Hostel (Girls)', 'Tiruchirappalli', nit_trichy_id, 200)
    ON CONFLICT (name, university_id) DO UPDATE 
    SET address = EXCLUDED.address, total_rooms = EXCLUDED.total_rooms;
  END IF;

END $$;

-- =====================================================
-- Verification and Testing
-- =====================================================

-- Count universities
SELECT COUNT(*) as total_universities FROM universities;

-- List all universities
SELECT id, name, location, domain, created_at 
FROM universities 
ORDER BY name;

-- Count hostels per university
SELECT 
  u.name as university_name,
  COUNT(h.id) as hostel_count,
  SUM(h.total_rooms) as total_rooms
FROM universities u
LEFT JOIN hostels h ON h.university_id = u.id
GROUP BY u.id, u.name
ORDER BY hostel_count DESC;

-- List all hostels with university names
SELECT 
  h.name as hostel_name,
  u.name as university_name,
  h.total_rooms,
  h.address
FROM hostels h
JOIN universities u ON h.university_id = u.id
ORDER BY u.name, h.name;
