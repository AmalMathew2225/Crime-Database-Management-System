-- Crime Transparency Portal Database Schema

-- Police Stations Table
CREATE TABLE IF NOT EXISTS police_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ml TEXT, -- Malayalam name
  address TEXT,
  district TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Officers Table
CREATE TABLE IF NOT EXISTS officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rank TEXT NOT NULL,
  badge_number TEXT,
  station_id UUID REFERENCES police_stations(id) ON DELETE SET NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crime Types Table
CREATE TABLE IF NOT EXISTS crime_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ml TEXT, -- Malayalam name
  ipc_section TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FIRs Table
CREATE TABLE IF NOT EXISTS firs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_number TEXT NOT NULL UNIQUE,
  date_filed DATE NOT NULL,
  time_filed TIME,
  station_id UUID NOT NULL REFERENCES police_stations(id) ON DELETE CASCADE,
  crime_type_id UUID NOT NULL REFERENCES crime_types(id) ON DELETE CASCADE,
  investigating_officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
  location TEXT NOT NULL,
  location_ml TEXT, -- Malayalam location
  description TEXT,
  complainant_name TEXT,
  status TEXT NOT NULL DEFAULT 'Under Investigation' CHECK (status IN ('Under Investigation', 'Charge Sheet Filed', 'Closed', 'Court Proceedings', 'Disposed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Follow-ups Table (Timeline)
CREATE TABLE IF NOT EXISTS case_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  officer_id UUID REFERENCES officers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verified News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  publication_date DATE NOT NULL,
  url TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (public read-only access)
ALTER TABLE police_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crime_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE firs ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required)
CREATE POLICY "Allow public read access on police_stations" ON police_stations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on officers" ON officers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on crime_types" ON crime_types FOR SELECT USING (true);
CREATE POLICY "Allow public read access on firs" ON firs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on case_followups" ON case_followups FOR SELECT USING (true);
CREATE POLICY "Allow public read access on verified news_articles" ON news_articles FOR SELECT USING (is_verified = true);

-- Create indexes for better query performance
CREATE INDEX idx_firs_station ON firs(station_id);
CREATE INDEX idx_firs_crime_type ON firs(crime_type_id);
CREATE INDEX idx_firs_status ON firs(status);
CREATE INDEX idx_firs_date_filed ON firs(date_filed);
CREATE INDEX idx_case_followups_fir ON case_followups(fir_id);
CREATE INDEX idx_news_articles_fir ON news_articles(fir_id);
CREATE INDEX idx_officers_station ON officers(station_id);

