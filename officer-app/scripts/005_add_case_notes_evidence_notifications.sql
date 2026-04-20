-- Add tables for case notes, evidence uploads, notifications, and audit logging

-- Case Notes
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE SET NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fir_id UUID NOT NULL REFERENCES firs(id) ON DELETE CASCADE,
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- image, video, document, etc
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID NOT NULL REFERENCES officers(id) ON DELETE CASCADE,
  fir_id UUID,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simple audit log for major actions
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

-- Policies: officers can read/write notes/evidence/notifications for cases they are assigned to, plus admins have full access

-- helper to check role (assuming officers table has role column)
-- we'll add a simple function so we can refer in policies

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM officers WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Case notes policies
CREATE POLICY "Case notes select" ON case_notes
  FOR SELECT USING (
    is_admin() OR officer_id = auth.uid() OR
    EXISTS(SELECT 1 FROM firs WHERE id = case_notes.fir_id AND investigating_officer_id = auth.uid())
  );
CREATE POLICY "Case notes insert" ON case_notes
  FOR INSERT WITH CHECK (
    auth.uid() = officer_id
  );
CREATE POLICY "Case notes update" ON case_notes
  FOR UPDATE USING (
    auth.uid() = officer_id OR is_admin()
  ) WITH CHECK (
    auth.uid() = officer_id OR is_admin()
  );

-- Evidence policies
CREATE POLICY "Evidence select" ON evidence
  FOR SELECT USING (
    is_admin() OR officer_id = auth.uid() OR
    EXISTS(SELECT 1 FROM firs WHERE id = evidence.fir_id AND investigating_officer_id = auth.uid())
  );
CREATE POLICY "Evidence insert" ON evidence
  FOR INSERT WITH CHECK (
    auth.uid() = officer_id
  );
CREATE POLICY "Evidence update" ON evidence
  FOR UPDATE USING (
    auth.uid() = officer_id OR is_admin()
  ) WITH CHECK (
    auth.uid() = officer_id OR is_admin()
  );

-- Notifications policies
CREATE POLICY "Notifications select" ON notifications
  FOR SELECT USING (
    is_admin() OR officer_id = auth.uid()
  );
CREATE POLICY "Notifications insert" ON notifications
  FOR INSERT WITH CHECK (
    is_admin() OR officer_id = auth.uid()
  );
CREATE POLICY "Notifications update" ON notifications
  FOR UPDATE USING (
    is_admin() OR officer_id = auth.uid()
  ) WITH CHECK (
    is_admin() OR officer_id = auth.uid()
  );

-- Audit logs: only admins can read
CREATE POLICY "Audit read" ON audit_logs
  FOR SELECT USING (
    is_admin()
  );
CREATE POLICY "Audit insert" ON audit_logs
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Indexes for new tables
CREATE INDEX idx_case_notes_fir ON case_notes(fir_id);
CREATE INDEX idx_case_notes_officer ON case_notes(officer_id);
CREATE INDEX idx_evidence_fir ON evidence(fir_id);
CREATE INDEX idx_evidence_officer ON evidence(officer_id);
CREATE INDEX idx_notifications_officer ON notifications(officer_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);

-- simple audit trigger to log inserts/updates/deletes
CREATE OR REPLACE FUNCTION audit_log_trigger() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs(table_name, record_id, action, performed_by, change_details)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', auth.uid(), row_to_json(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs(table_name, record_id, action, performed_by, change_details)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', auth.uid(), json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs(table_name, record_id, action, performed_by, change_details)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', auth.uid(), row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- attach trigger to important tables
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT relname FROM pg_class WHERE relkind='r' AND relname IN (
    'firs','case_followups','case_notes','evidence','notifications'
  ) LOOP
    EXECUTE format('CREATE TRIGGER trg_audit_%s AFTER INSERT OR UPDATE OR DELETE ON %s FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();', tbl, tbl);
  END LOOP;
END;
$$;
