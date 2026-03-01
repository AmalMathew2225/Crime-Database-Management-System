-- Create accused and property tables for FIRs

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
