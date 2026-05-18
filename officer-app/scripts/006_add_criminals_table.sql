-- Migration 006: Add criminals table and coordinates to FIRs
-- Run this in Supabase SQL Editor

-- 1. Add lat/lng coordinates to FIRs for heatmap
ALTER TABLE firs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE firs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- 2. Add lat/lng coordinates to FIRs via occurrence location
-- (Update existing mock-data seeded records with Thiruvananthapuram coordinates)

-- 3. New criminals table (Aadhar as unique identifier)
CREATE TABLE IF NOT EXISTS criminals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aadhar_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  alias TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT,
  phone TEXT,
  photo_url TEXT,
  threat_level TEXT CHECK (threat_level IN ('Low', 'Medium', 'High', 'Extreme')) DEFAULT 'Medium',
  is_absconding BOOLEAN DEFAULT false,
  is_convicted BOOLEAN DEFAULT false,
  known_associates TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Junction table: criminals <-> FIRs
CREATE TABLE IF NOT EXISTS criminal_fir_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criminal_aadhar TEXT NOT NULL REFERENCES criminals(aadhar_number) ON DELETE CASCADE,
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  involvement_type TEXT NOT NULL DEFAULT 'Accused' CHECK (involvement_type IN ('Accused', 'Suspect', 'Witness', 'Convicted')),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(criminal_aadhar, fir_id)
);

-- 5. RLS
ALTER TABLE criminals ENABLE ROW LEVEL SECURITY;
ALTER TABLE criminal_fir_links ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API routes)
CREATE POLICY "Allow full access on criminals" ON criminals USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access on criminal_fir_links" ON criminal_fir_links USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_criminals_aadhar ON criminals(aadhar_number);
CREATE INDEX IF NOT EXISTS idx_criminal_fir_links_aadhar ON criminal_fir_links(criminal_aadhar);
CREATE INDEX IF NOT EXISTS idx_criminal_fir_links_fir ON criminal_fir_links(fir_id);
CREATE INDEX IF NOT EXISTS idx_firs_coords ON firs(latitude, longitude);
