-- Seed a test officer account for login
-- Default credentials: uid = 'officer1', password = 'Password123!'

-- bcrypt hash of 'Password123!' with 10 rounds
-- Generated via: require('bcryptjs').hashSync('Password123!', 10)
INSERT INTO officers (name, rank, badge_number, station_id, uid, password_hash, role, created_at)
VALUES (
  'Test Officer',
  'Sub Inspector',
  'B1234',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Kakkanad Police Station
  'officer1',
  '$2a$10$XURH4YBMIiywzNJPOyyoZ.FhXGczWnASKPglB/jHGPYjXJfFJ2iHi',
  'Duty Officer',
  NOW()
)
ON CONFLICT (uid) DO UPDATE SET
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash
RETURNING id, uid, name, role;
