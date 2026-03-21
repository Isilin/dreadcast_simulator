-- Table des builds utilisateur (snapshot du simulateur)
CREATE TABLE IF NOT EXISTS build (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot_index INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, slot_index),
  CONSTRAINT valid_build_slot_index CHECK (slot_index > 0)
);

CREATE INDEX IF NOT EXISTS idx_build_saved_at ON build(saved_at DESC);

ALTER TABLE build ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user read own builds" ON build
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow user upsert own builds" ON build
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow user update own builds" ON build
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
