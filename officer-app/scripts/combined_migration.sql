-- =============================================================================
-- THUNA Crime Database - Combined Migration Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/lfjskjztxxoejxtcvyay/sql/new
-- =============================================================================

-- ===== 001: Create Crime Tables =====

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
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on police_stations') THEN
    CREATE POLICY "Allow public read access on police_stations" ON police_stations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on officers') THEN
    CREATE POLICY "Allow public read access on officers" ON officers FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on crime_types') THEN
    CREATE POLICY "Allow public read access on crime_types" ON crime_types FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on firs') THEN
    CREATE POLICY "Allow public read access on firs" ON firs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on case_followups') THEN
    CREATE POLICY "Allow public read access on case_followups" ON case_followups FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on verified news_articles') THEN
    CREATE POLICY "Allow public read access on verified news_articles" ON news_articles FOR SELECT USING (is_verified = true);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_firs_station ON firs(station_id);
CREATE INDEX IF NOT EXISTS idx_firs_crime_type ON firs(crime_type_id);
CREATE INDEX IF NOT EXISTS idx_firs_status ON firs(status);
CREATE INDEX IF NOT EXISTS idx_firs_date_filed ON firs(date_filed);
CREATE INDEX IF NOT EXISTS idx_case_followups_fir ON case_followups(fir_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_fir ON news_articles(fir_id);
CREATE INDEX IF NOT EXISTS idx_officers_station ON officers(station_id);


-- ===== 002: Seed Crime Data =====

-- Insert Police Stations
INSERT INTO police_stations (id, name, name_ml, address, district, phone, email) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kakkanad Police Station', 'കാക്കനാട് പോലീസ് സ്റ്റേഷൻ', 'Kakkanad, Ernakulam', 'Ernakulam', '0484-2422100', 'kakkanad.police@kerala.gov.in'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Kalamassery Police Station', 'കളമശ്ശേരി പോലീസ് സ്റ്റേഷൻ', 'Kalamassery, Ernakulam', 'Ernakulam', '0484-2532200', 'kalamassery.police@kerala.gov.in'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Aluva Police Station', 'ആലുവ പോലീസ് സ്റ്റേഷൻ', 'Aluva, Ernakulam', 'Ernakulam', '0484-2623300', 'aluva.police@kerala.gov.in')
ON CONFLICT DO NOTHING;

-- Insert Crime Types
INSERT INTO crime_types (id, name, name_ml, ipc_section, description) VALUES
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Theft', 'മോഷണം', 'IPC 379', 'Theft of property'),
  ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Assault', 'ആക്രമണം', 'IPC 323', 'Voluntarily causing hurt'),
  ('f6a7b8c9-d0e1-2345-fabc-456789012345', 'Fraud', 'തട്ടിപ്പ്', 'IPC 420', 'Cheating and dishonestly inducing delivery of property'),
  ('a7b8c9d0-e1f2-3456-abcd-567890123456', 'Robbery', 'കവർച്ച', 'IPC 392', 'Robbery'),
  ('b8c9d0e1-f2a3-4567-bcde-678901234567', 'Burglary', 'വീട്ടിൽ കയറി മോഷണം', 'IPC 457', 'Lurking house-trespass or house-breaking by night'),
  ('c9d0e1f2-a3b4-5678-cdef-789012345678', 'Cybercrime', 'സൈബർ കുറ്റകൃത്യം', 'IT Act 66', 'Computer related offences')
ON CONFLICT DO NOTHING;

-- Insert Officers
INSERT INTO officers (id, name, rank, badge_number, station_id, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Suresh Kumar P', 'Sub Inspector', 'KP-2341', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '9876543210'),
  ('22222222-2222-2222-2222-222222222222', 'Priya Menon', 'Circle Inspector', 'KP-1122', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '9876543211'),
  ('33333333-3333-3333-3333-333333333333', 'Rajesh Nair', 'Sub Inspector', 'KP-3456', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '9876543212'),
  ('44444444-4444-4444-4444-444444444444', 'Anitha Thomas', 'Circle Inspector', 'KP-2233', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', '9876543213'),
  ('55555555-5555-5555-5555-555555555555', 'Mohammed Ashraf', 'Sub Inspector', 'KP-4567', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '9876543214'),
  ('66666666-6666-6666-6666-666666666666', 'Lakshmi Devi', 'Circle Inspector', 'KP-3344', 'c3d4e5f6-a7b8-9012-cdef-123456789012', '9876543215')
ON CONFLICT DO NOTHING;

-- Insert FIRs
INSERT INTO firs (id, fir_number, date_filed, time_filed, station_id, crime_type_id, investigating_officer_id, location, location_ml, description, complainant_name, status) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'KKD/2025/0001', '2025-01-10', '09:30:00', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd4e5f6a7-b8c9-0123-defa-234567890123', '11111111-1111-1111-1111-111111111111', 'Infopark Phase 1, Kakkanad', 'ഇൻഫോപാർക്ക് ഫേസ് 1, കാക്കനാട്', 'Laptop and mobile phone stolen from parked car in Infopark parking lot. CCTV footage being analyzed.', 'John Mathew', 'Under Investigation'),
  ('bbbb2222-2222-2222-2222-222222222222', 'KKD/2025/0002', '2025-01-12', '14:15:00', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c9d0e1f2-a3b4-5678-cdef-789012345678', '22222222-2222-2222-2222-222222222222', 'Seaport-Airport Road, Kakkanad', 'സീപോർട്ട്-എയർപോർട്ട് റോഡ്, കാക്കനാട്', 'Online banking fraud reported. Victim received phishing link and lost Rs. 2.5 lakhs.', 'Sreekumar R', 'Charge Sheet Filed'),
  ('cccc3333-3333-3333-3333-333333333333', 'KLM/2025/0001', '2025-01-08', '11:00:00', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'e5f6a7b8-c9d0-1234-efab-345678901234', '33333333-3333-3333-3333-333333333333', 'CUSAT Campus, Kalamassery', 'കുസാറ്റ് ക്യാമ്പസ്, കളമശ്ശേരി', 'Assault case reported near university campus. Victim sustained minor injuries.', 'Arun Kumar', 'Under Investigation'),
  ('dddd4444-4444-4444-4444-444444444444', 'KLM/2025/0002', '2025-01-15', '16:45:00', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'f6a7b8c9-d0e1-2345-fabc-456789012345', '44444444-4444-4444-4444-444444444444', 'Kalamassery Metro Station', 'കളമശ്ശേരി മെട്രോ സ്റ്റേഷൻ', 'Investment fraud case. Multiple victims cheated by fake investment scheme promising high returns.', 'Meera Krishnan', 'Court Proceedings'),
  ('eeee5555-5555-5555-5555-555555555555', 'ALV/2025/0001', '2025-01-05', '08:00:00', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'b8c9d0e1-f2a3-4567-bcde-678901234567', '55555555-5555-5555-5555-555555555555', 'HMT Colony, Aluva', 'എച്ച്എംടി കോളനി, ആലുവ', 'House burglary reported. Gold ornaments and cash stolen while family was away.', 'Thomas Varghese', 'Under Investigation'),
  ('ffff6666-6666-6666-6666-666666666666', 'ALV/2025/0002', '2025-01-18', '20:30:00', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'a7b8c9d0-e1f2-3456-abcd-567890123456', '66666666-6666-6666-6666-666666666666', 'Aluva Junction', 'ആലുവ ജംഗ്ഷൻ', 'Armed robbery near Aluva junction. Two suspects fled on motorcycle after snatching gold chain.', 'Fathima Begum', 'Charge Sheet Filed'),
  ('a0a07777-7777-7777-7777-777777777777', 'KKD/2025/0003', '2025-01-20', '10:00:00', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd4e5f6a7-b8c9-0123-defa-234567890123', '11111111-1111-1111-1111-111111111111', 'Smart City, Kakkanad', 'സ്മാർട്ട് സിറ്റി, കാക്കനാട്', 'Two-wheeler theft from office parking. Vehicle registration KL-07-AB-1234.', 'Ravi Shankar', 'Closed'),
  ('b0b08888-8888-8888-8888-888888888888', 'ALV/2025/0003', '2025-01-22', '13:30:00', 'c3d4e5f6-a7b8-9012-cdef-123456789012', 'c9d0e1f2-a3b4-5678-cdef-789012345678', '55555555-5555-5555-5555-555555555555', 'Aluva Town', 'ആലുവ ടൌൺ', 'OTP fraud case. Victim shared OTP with caller posing as bank official. Rs. 75,000 lost.', 'Gopalan Nair', 'Under Investigation')
ON CONFLICT DO NOTHING;

-- Insert Case Follow-ups
INSERT INTO case_followups (fir_id, date, title, description, officer_id) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', '2025-01-10 10:00:00', 'FIR Registered', 'First Information Report registered based on complainant statement.', '11111111-1111-1111-1111-111111111111'),
  ('aaaa1111-1111-1111-1111-111111111111', '2025-01-11 14:00:00', 'CCTV Footage Collected', 'CCTV footage from Infopark security collected for analysis.', '11111111-1111-1111-1111-111111111111'),
  ('aaaa1111-1111-1111-1111-111111111111', '2025-01-14 11:30:00', 'Suspect Identified', 'One suspect identified from CCTV footage. Verification in progress.', '11111111-1111-1111-1111-111111111111'),
  ('bbbb2222-2222-2222-2222-222222222222', '2025-01-12 15:00:00', 'FIR Registered', 'Cybercrime case registered. Bank account details collected.', '22222222-2222-2222-2222-222222222222'),
  ('bbbb2222-2222-2222-2222-222222222222', '2025-01-15 10:00:00', 'Bank Statement Analysis', 'Analysis of transaction trail completed. Funds traced to multiple accounts.', '22222222-2222-2222-2222-222222222222'),
  ('bbbb2222-2222-2222-2222-222222222222', '2025-01-18 16:00:00', 'Accused Arrested', 'Main accused arrested from Bangalore. Charge sheet preparation initiated.', '22222222-2222-2222-2222-222222222222'),
  ('bbbb2222-2222-2222-2222-222222222222', '2025-01-20 12:00:00', 'Charge Sheet Filed', 'Charge sheet filed before Judicial First Class Magistrate Court.', '22222222-2222-2222-2222-222222222222'),
  ('cccc3333-3333-3333-3333-333333333333', '2025-01-08 12:00:00', 'FIR Registered', 'Assault case registered. Medical examination of victim completed.', '33333333-3333-3333-3333-333333333333'),
  ('cccc3333-3333-3333-3333-333333333333', '2025-01-10 09:00:00', 'Witness Statements', 'Statements of three witnesses recorded.', '33333333-3333-3333-3333-333333333333'),
  ('dddd4444-4444-4444-4444-444444444444', '2025-01-15 17:00:00', 'FIR Registered', 'Investment fraud case registered based on multiple complaints.', '44444444-4444-4444-4444-444444444444'),
  ('dddd4444-4444-4444-4444-444444444444', '2025-01-17 11:00:00', 'Documents Seized', 'Fake company documents and promotional materials seized.', '44444444-4444-4444-4444-444444444444'),
  ('dddd4444-4444-4444-4444-444444444444', '2025-01-19 15:00:00', 'Accused Arrested', 'Two accused arrested. Rs. 15 lakhs recovered.', '44444444-4444-4444-4444-444444444444'),
  ('dddd4444-4444-4444-4444-444444444444', '2025-01-21 10:00:00', 'Case Referred to Court', 'Case referred to Economic Offences Court for trial.', '44444444-4444-4444-4444-444444444444'),
  ('eeee5555-5555-5555-5555-555555555555', '2025-01-05 09:00:00', 'FIR Registered', 'Burglary case registered. Scene of crime examined.', '55555555-5555-5555-5555-555555555555'),
  ('eeee5555-5555-5555-5555-555555555555', '2025-01-06 14:00:00', 'Fingerprints Collected', 'Fingerprints lifted from crime scene sent for analysis.', '55555555-5555-5555-5555-555555555555'),
  ('ffff6666-6666-6666-6666-666666666666', '2025-01-18 21:00:00', 'FIR Registered', 'Robbery case registered. Victim statement recorded at hospital.', '66666666-6666-6666-6666-666666666666'),
  ('ffff6666-6666-6666-6666-666666666666', '2025-01-19 10:00:00', 'CCTV Analysis', 'CCTV footage from nearby shops collected and analyzed.', '66666666-6666-6666-6666-666666666666'),
  ('ffff6666-6666-6666-6666-666666666666', '2025-01-20 16:00:00', 'Suspects Arrested', 'Both suspects arrested. Stolen gold chain recovered.', '66666666-6666-6666-6666-666666666666'),
  ('ffff6666-6666-6666-6666-666666666666', '2025-01-22 11:00:00', 'Charge Sheet Filed', 'Charge sheet filed with recovered evidence.', '66666666-6666-6666-6666-666666666666')
ON CONFLICT DO NOTHING;

-- Insert News Articles
INSERT INTO news_articles (fir_id, title, source, publication_date, url, is_verified) VALUES
  ('bbbb2222-2222-2222-2222-222222222222', 'Cyber fraudster arrested in Bangalore connection to Kerala case', 'Manorama Online', '2025-01-19', 'https://www.manoramaonline.com/news/kerala', true),
  ('bbbb2222-2222-2222-2222-222222222222', 'Rs 2.5 lakh cyber fraud: Police trace money trail', 'The Hindu', '2025-01-16', 'https://www.thehindu.com/news/cities/Kochi', true),
  ('dddd4444-4444-4444-4444-444444444444', 'Investment fraud racket busted, two held', 'Mathrubhumi', '2025-01-20', 'https://www.mathrubhumi.com/news/kerala', true),
  ('dddd4444-4444-4444-4444-444444444444', 'Multiple victims of fake investment scheme come forward', 'Asianet News', '2025-01-18', 'https://www.asianetnews.com/kerala-news', true),
  ('ffff6666-6666-6666-6666-666666666666', 'Chain snatchers nabbed within 48 hours', 'News18 Kerala', '2025-01-21', 'https://www.news18.com/kerala', true),
  ('aaaa1111-1111-1111-1111-111111111111', 'Car break-ins at Infopark: Police investigate', 'Times of India', '2025-01-12', 'https://timesofindia.indiatimes.com/kochi', true)
ON CONFLICT DO NOTHING;


-- ===== 003: Add Officer Auth Columns =====

ALTER TABLE officers
  ADD COLUMN IF NOT EXISTS uid TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Officer';

CREATE INDEX IF NOT EXISTS idx_officers_uid ON officers(uid);


-- ===== 004: Add Accused & Property Tables =====

CREATE TABLE IF NOT EXISTS accused (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  name TEXT,
  address TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  estimated_value NUMERIC(12,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accused_fir ON accused(fir_id);
CREATE INDEX IF NOT EXISTS idx_property_fir ON property_items(fir_id);


-- ===== 005: Add Case Notes, Evidence, Notifications, Audit =====

CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
  fir_id UUID,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES officers(id) ON DELETE SET NULL,
  change_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the new tables
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_case_notes_fir ON case_notes(fir_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_officer ON case_notes(officer_id);
CREATE INDEX IF NOT EXISTS idx_evidence_fir ON evidence(fir_id);
CREATE INDEX IF NOT EXISTS idx_evidence_officer ON evidence(officer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_officer ON notifications(officer_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);

-- ===== DONE =====
SELECT 'All migrations completed successfully!' AS result;
