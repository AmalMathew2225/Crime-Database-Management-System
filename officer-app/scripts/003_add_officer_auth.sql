-- Add authentication fields to officers table

ALTER TABLE officers
  ADD COLUMN IF NOT EXISTS uid TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Officer';

-- Optional index on uid for quick lookups
CREATE INDEX IF NOT EXISTS idx_officers_uid ON officers(uid);
