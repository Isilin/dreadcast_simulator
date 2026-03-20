-- Migration additive pour prendre en charge les armes de soin
-- sans perdre les donnees existantes de la table item.

ALTER TABLE item
  ADD COLUMN IF NOT EXISTS min_heal INTEGER,
  ADD COLUMN IF NOT EXISTS max_heal INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_min_heal'
      AND conrelid = 'item'::regclass
  ) THEN
    ALTER TABLE item
      ADD CONSTRAINT valid_min_heal CHECK (min_heal IS NULL OR min_heal >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_max_heal'
      AND conrelid = 'item'::regclass
  ) THEN
    ALTER TABLE item
      ADD CONSTRAINT valid_max_heal CHECK (max_heal IS NULL OR max_heal >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_heal_range'
      AND conrelid = 'item'::regclass
  ) THEN
    ALTER TABLE item
      ADD CONSTRAINT valid_heal_range CHECK (
        (min_heal IS NULL AND max_heal IS NULL)
        OR (
          min_heal IS NOT NULL
          AND max_heal IS NOT NULL
          AND min_heal <= max_heal
        )
      );
  END IF;
END $$;