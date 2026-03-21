-- Table de partage public de builds
-- Chaque ligne pointe vers un build utilisateur (build.id)
CREATE TABLE IF NOT EXISTS shared_build (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  build_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shared_build_build FOREIGN KEY (build_id)
    REFERENCES build(id)
    ON DELETE CASCADE,
  CONSTRAINT unique_shared_build_per_build UNIQUE (build_id)
);

CREATE INDEX IF NOT EXISTS idx_shared_build_build_ref
  ON shared_build(build_id);

ALTER TABLE shared_build ENABLE ROW LEVEL SECURITY;

-- Permet a un utilisateur connecte de lire ses propres liens de partage.
CREATE POLICY "Allow user read own shared builds" ON shared_build
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM build
      WHERE build.id = shared_build.build_id
        AND build.user_id = auth.uid()
    )
  );

-- Permet aux visiteurs de lire un partage public par identifiant.
CREATE POLICY "Allow public read shared builds" ON shared_build
  FOR SELECT
  USING (true);

CREATE POLICY "Allow user insert own shared builds" ON shared_build
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM build
      WHERE build.id = shared_build.build_id
        AND build.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow user update own shared builds" ON shared_build
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM build
      WHERE build.id = shared_build.build_id
        AND build.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM build
      WHERE build.id = shared_build.build_id
        AND build.user_id = auth.uid()
    )
  );

-- Autorise la lecture publique des builds explicitement partages.
CREATE POLICY "Allow public read shared snapshots" ON build
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM shared_build
      WHERE shared_build.build_id = build.id
    )
  );
