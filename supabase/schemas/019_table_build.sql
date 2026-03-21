-- Table des builds utilisateur (snapshot du simulateur)
CREATE TABLE IF NOT EXISTS build (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_build_saved_at ON build(saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_build_user_created_at ON build(user_id, created_at ASC);

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
