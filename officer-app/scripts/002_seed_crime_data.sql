-- Seed data for Crime Transparency Portal

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

