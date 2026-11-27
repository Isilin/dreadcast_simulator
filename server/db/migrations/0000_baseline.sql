-- Baseline: the schema of the Supabase era, on a plain Postgres.
--
-- 1. Auth shim: what the schema needed from Supabase (roles, auth.users,
--    auth.uid() / auth.jwt() / auth.role()).
-- 2. supabase/schemas/001 to 040, unchanged and in order: the history of the
--    production schema. Checked against production on 2026-11-27: same
--    columns, constraints, indexes, policies, grants, triggers and enums;
--    functions identical once comments are left out.
--
-- Executed as a whole (simple query protocol) by server/db/migrate.ts.

-- =============================================================================
-- Auth shim
-- =============================================================================

-- What the schema needs from Supabase, on a plain Postgres: the anon and
-- authenticated roles, auth.users and the auth.uid() / auth.jwt() /
-- auth.role() functions, which read the claims set by the server for each
-- transaction (server/db/client.ts), as PostgREST does. Policies and SQL
-- functions written for Supabase then run unchanged.
--
-- Every statement is idempotent: on Supabase itself all of this already
-- exists, and the roles may be created beforehand by the database admin
-- (they are cluster-wide, creating them needs CREATEROLE).

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
END
$$;

-- The server connects as the owner of the schema and switches to one of these
-- roles in each transaction (SET LOCAL ROLE). Granting needs the ADMIN option
-- on the role: skipped when the admin already granted it.
DO $$
BEGIN
  IF NOT pg_has_role(current_user, 'anon', 'MEMBER') THEN
    GRANT anon TO CURRENT_USER;
  END IF;
  IF NOT pg_has_role(current_user, 'authenticated', 'MEMBER') THEN
    GRANT authenticated TO CURRENT_USER;
  END IF;
END
$$;

CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated;

-- Supabase grants everything in public to its API roles and lets row level
-- security decide: same defaults here.
GRANT USAGE ON SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT EXECUTE ON FUNCTIONS TO anon, authenticated;

CREATE SCHEMA IF NOT EXISTS auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;

-- The columns of Supabase's auth.users that the application uses (sign-in,
-- admin role in app metadata). Rows are copied as is from Supabase.
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  encrypted_password TEXT,
  role TEXT DEFAULT 'authenticated',
  raw_app_meta_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_sign_in_at TIMESTAMPTZ
);

-- Same definitions as Supabase. A custom setting reads as '' (not NULL) once
-- a transaction that set it has ended, hence the nullif.
CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')
  )::jsonb
$$;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
  )::uuid
$$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'
  )::text
$$;

-- =============================================================================
-- 001_enum_stat_property.sql
-- =============================================================================

-- Enum pour les propriétés de stats
CREATE TYPE stat_property AS ENUM (
  'strength',
  'agility',
  'robustness',
  'perception',
  'stealth',
  'computing',
  'medicine',
  'engineering',
  'health',
  'stamina',
  'integrity',
  'speed',
  'raceDamage',
  'hitRating',
  'teamHeal',
  'cacDamage',
  'criticalCacChance',
  'criticalCacDamage',
  'hitDamages',
  'criticalHitDamage'
);

-- =============================================================================
-- 002_table_drug.sql
-- =============================================================================

-- Table des drugs
CREATE TABLE IF NOT EXISTS drug (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Politique de sécurité (RLS)
ALTER TABLE drug ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read drug to authenticated users" ON drug
  FOR SELECT
  USING (true);

-- =============================================================================
-- 003_table_stat_modifier.sql
-- =============================================================================

-- Table des modificateurs de stats pour les drugs
CREATE TABLE IF NOT EXISTS stat_modifier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_id TEXT NOT NULL REFERENCES drug(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0),
  UNIQUE(drug_id, property)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_stat_modifier_drug_id ON stat_modifier(drug_id);
CREATE INDEX IF NOT EXISTS idx_stat_modifier_property ON stat_modifier(property);

-- Politique de sécurité (RLS)
ALTER TABLE stat_modifier ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read stat_modifier to authenticated users" ON stat_modifier
  FOR SELECT
  USING (true);

-- =============================================================================
-- 004_enum_item_type.sql
-- =============================================================================

-- Enum pour les types d'items
CREATE TYPE item_type AS ENUM (
  'head',
  'chest',
  'legs',
  'feet',
  'secondary',
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee'
);

-- =============================================================================
-- 005_enum_race_type.sql
-- =============================================================================

-- Enum pour les types de race
CREATE TYPE race_type AS ENUM (
  'Humain',
  'Elfe',
  'Nain',
  'Orc',
  'Troll',
  'Outrilien',
  'Vautour',
  'Gobelin',
  'Kobold',
  'Gnoll',
  'Androide'
);

-- =============================================================================
-- 006_table_race.sql
-- =============================================================================

-- Table des races
CREATE TABLE IF NOT EXISTS race (
  type race_type PRIMARY KEY,
  strength INTEGER NOT NULL DEFAULT 100,
  agility INTEGER NOT NULL DEFAULT 100,
  robustness INTEGER NOT NULL DEFAULT 100,
  perception INTEGER NOT NULL DEFAULT 100,
  stealth INTEGER NOT NULL DEFAULT 100,
  computing INTEGER NOT NULL DEFAULT 100,
  medicine INTEGER NOT NULL DEFAULT 100,
  engineering INTEGER NOT NULL DEFAULT 100,
  health INTEGER NOT NULL DEFAULT 100,
  stamina INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Politique de sécurité (RLS)
ALTER TABLE race ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read race to authenticated users" ON race
  FOR SELECT
  USING (true);

-- =============================================================================
-- 007_table_implant.sql
-- =============================================================================

-- Table des implants
CREATE TABLE IF NOT EXISTS implant (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  level_max INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_implant_id CHECK (id >= 0),
  CONSTRAINT valid_level_max CHECK (level_max > 0 AND level_max <= 10)
);

-- Politique de sécurité (RLS)
ALTER TABLE implant ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant to authenticated users" ON implant
  FOR SELECT
  USING (true);

-- =============================================================================
-- 008_table_implant_attribute.sql
-- =============================================================================

-- Table des attributs d'implants (relation many-to-many)
CREATE TABLE IF NOT EXISTS implant_attribute (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  attribute stat_property NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(implant_id, attribute)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_implant_attribute_implant_id ON implant_attribute(implant_id);

-- Politique de sécurité (RLS)
ALTER TABLE implant_attribute ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant_attribute to authenticated users" ON implant_attribute
  FOR SELECT
  USING (true);

-- =============================================================================
-- 009_table_implant_value.sql
-- =============================================================================

-- Table des valeurs par niveau d'implant
CREATE TABLE IF NOT EXISTS implant_value (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  value DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_level CHECK (level >= 1 AND level <= 10),
  UNIQUE(implant_id, level)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_implant_value_implant_id ON implant_value(implant_id);
CREATE INDEX IF NOT EXISTS idx_implant_value_level ON implant_value(level);

-- Politique de sécurité (RLS)
ALTER TABLE implant_value ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read implant_value to authenticated users" ON implant_value
  FOR SELECT
  USING (true);

-- =============================================================================
-- 010_table_item.sql
-- =============================================================================

-- Table des items
CREATE TABLE IF NOT EXISTS item (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  tech INTEGER NOT NULL,
  integrity INTEGER NOT NULL,
  type item_type NOT NULL,
  min_damage INTEGER,
  max_damage INTEGER,
  damage_bonus INTEGER,
  hands INTEGER,
  reach INTEGER,
  hits_per_round INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_tech CHECK (tech >= 0),
  CONSTRAINT valid_integrity CHECK (integrity >= 0),
  CONSTRAINT valid_damage_bonus CHECK (damage_bonus IS NULL OR (damage_bonus >= 0 AND damage_bonus <= 5)),
  CONSTRAINT valid_hands CHECK (hands IS NULL OR hands IN (1, 2)),
  CONSTRAINT valid_reach CHECK (reach IS NULL OR reach >= 0),
  CONSTRAINT valid_hits_per_round CHECK (hits_per_round IS NULL OR hits_per_round > 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_type ON item(type);
CREATE INDEX IF NOT EXISTS idx_item_tech ON item(tech);

-- Politique de sécurité (RLS)
ALTER TABLE item ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item to authenticated users" ON item
  FOR SELECT
  USING (true);

-- =============================================================================
-- 011_table_item_prerequisite.sql
-- =============================================================================

-- Table des prérequis d'items
CREATE TABLE IF NOT EXISTS item_prerequisite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value > 0),
  UNIQUE(item_id, property)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_item_id ON item_prerequisite(item_id);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_property ON item_prerequisite(property);

-- Politique de sécurité (RLS)
ALTER TABLE item_prerequisite ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item_prerequisite to authenticated users" ON item_prerequisite
  FOR SELECT
  USING (true);

-- =============================================================================
-- 012_table_item_effect.sql
-- =============================================================================

-- Table des effets d'items
CREATE TABLE IF NOT EXISTS item_effect (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0),
  UNIQUE(item_id, property)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_item_effect_item_id ON item_effect(item_id);
CREATE INDEX IF NOT EXISTS idx_item_effect_property ON item_effect(property);

-- Politique de sécurité (RLS)
ALTER TABLE item_effect ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read item_effect to authenticated users" ON item_effect
  FOR SELECT
  USING (true);

-- =============================================================================
-- 013_table_kit.sql
-- =============================================================================

-- Table des kits
CREATE TABLE IF NOT EXISTS kit (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tech INTEGER NOT NULL,
  type item_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_tech CHECK (tech >= 0)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_kit_type ON kit(type);
CREATE INDEX IF NOT EXISTS idx_kit_tech ON kit(tech);

-- Politique de sécurité (RLS)
ALTER TABLE kit ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read kit to authenticated users" ON kit
  FOR SELECT
  USING (true);

-- =============================================================================
-- 014_table_kit_effect.sql
-- =============================================================================

-- Table des effets de kits
CREATE TABLE IF NOT EXISTS kit_effect (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_value CHECK (value != 0),
  UNIQUE(kit_id, property)
);

-- Index pour les recherches courantes
CREATE INDEX IF NOT EXISTS idx_kit_effect_kit_id ON kit_effect(kit_id);
CREATE INDEX IF NOT EXISTS idx_kit_effect_property ON kit_effect(property);

-- Politique de sécurité (RLS)
ALTER TABLE kit_effect ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read kit_effect to authenticated users" ON kit_effect
  FOR SELECT
  USING (true);

-- =============================================================================
-- 015_table_subscription.sql
-- =============================================================================

-- Table des abonnements utilisateur
CREATE TABLE IF NOT EXISTS subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_subscription_dates CHECK (ends_at > starts_at),
  CONSTRAINT valid_subscription_plan_code CHECK (
    plan_code IN ('annual_1', 'annual_6', 'annual_12', 'lifetime')
  ),
  CONSTRAINT valid_subscription_price CHECK (price_cents > 0)
);

-- Index pour l'historique utilisateur et la recherche d'abonnement actif
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON subscription(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_ends_at ON subscription(ends_at);

-- Politique de securite (RLS)
ALTER TABLE subscription ENABLE ROW LEVEL SECURITY;

-- Un utilisateur authentifie peut lire uniquement ses abonnements
CREATE POLICY "Allow user read own subscriptions" ON subscription
  FOR SELECT
  USING (auth.uid() = user_id);

-- Un utilisateur authentifie peut creer uniquement ses abonnements
CREATE POLICY "Allow user create own subscriptions" ON subscription
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- 016_table_subscription_plan.sql
-- =============================================================================

-- Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plan (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  duration_ingame_years INTEGER NULL,
  price_cents INTEGER NOT NULL,
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_subscription_plan_price CHECK (price_cents > 0),
  CONSTRAINT valid_subscription_plan_duration CHECK (duration_ingame_years IS NULL OR duration_ingame_years > 0)
);

CREATE INDEX IF NOT EXISTS idx_subscription_plan_sort_order ON subscription_plan(sort_order);

ALTER TABLE subscription_plan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read subscription_plan to authenticated users" ON subscription_plan
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- =============================================================================
-- 017_subscription_plan_fk.sql
-- =============================================================================

-- Liaison de subscription.plan_code vers subscription_plan.code
ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_plan_code;

ALTER TABLE subscription
  ADD CONSTRAINT subscription_plan_code_fk
  FOREIGN KEY (plan_code)
  REFERENCES subscription_plan(code)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

-- =============================================================================
-- 018_alter_subscription_status.sql
-- =============================================================================

-- Statut des abonnements: pending a la creation, validated apres confirmation admin
ALTER TABLE subscription
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS validated_by UUID NULL REFERENCES auth.users(id);

ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_status;

ALTER TABLE subscription
  ADD CONSTRAINT valid_subscription_status CHECK (status IN ('pending', 'validated'));

ALTER TABLE subscription
  DROP CONSTRAINT IF EXISTS valid_subscription_validation_fields;

ALTER TABLE subscription
  ADD CONSTRAINT valid_subscription_validation_fields CHECK (
    (status = 'pending' AND validated_at IS NULL AND validated_by IS NULL)
    OR (status = 'validated' AND validated_at IS NOT NULL)
  );

-- Les abonnements existants avant cette migration sont consideres valides
UPDATE subscription
SET
  status = 'validated',
  validated_at = COALESCE(validated_at, updated_at, created_at)
WHERE status IS DISTINCT FROM 'validated';

DROP POLICY IF EXISTS "Allow admin validate subscriptions" ON subscription;

CREATE POLICY "Allow admin validate subscriptions" ON subscription
  FOR UPDATE
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- =============================================================================
-- 018_alter_table_item_add_heal_range.sql
-- =============================================================================

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
-- =============================================================================
-- 019_table_build.sql
-- =============================================================================

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

-- =============================================================================
-- 020_table_shared_build.sql
-- =============================================================================

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

-- Permet aux visiteurs de lire un partage public par identifiant.
CREATE POLICY "Allow public read shared builds" ON shared_build
  FOR SELECT
  USING (true);

-- L'ownership est valide cote API (verification user/session avant insert/update).
-- Evite la recursion RLS en ne reliant pas les policies shared_build vers build.
CREATE POLICY "Allow user insert own shared builds" ON shared_build
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow user update own shared builds" ON shared_build
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

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

-- =============================================================================
-- 021_private_helpers.sql
-- =============================================================================

-- Helpers internes utilises par les policies RLS et les RPC.
-- Le schema "private" n'est pas expose par PostgREST : ces fonctions ne sont
-- appelables que depuis SQL (policies, triggers, autres fonctions).
BEGIN;

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

-- Trigger generique de mise a jour de updated_at.
CREATE OR REPLACE FUNCTION private.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Role admin porte par le JWT (app_metadata.role), comme la policy 018.
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Abonnement actif de l'utilisateur courant. Sans parametre : impossible de
-- sonder l'abonnement d'un autre utilisateur.
CREATE OR REPLACE FUNCTION private.has_active_subscription()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscription s
    WHERE s.user_id = auth.uid()
      AND s.status = 'validated'
      AND s.ends_at >= now()
  );
$$;

-- Propriete d'un build par l'utilisateur courant. SECURITY DEFINER : lit la
-- table build sans passer par ses policies, ce qui evite la recursion RLS
-- entre build et shared_build.
CREATE OR REPLACE FUNCTION private.owns_build(p_build_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.build b
    WHERE b.id = p_build_id
      AND b.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.set_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.has_active_subscription() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.owns_build(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_active_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION private.owns_build(UUID) TO authenticated;

COMMIT;

-- =============================================================================
-- 022_fix_subscription_insert.sql
-- =============================================================================

-- Correctif securite : un utilisateur ne peut plus s'inserer un abonnement
-- deja valide, ni choisir son prix ou sa date de fin.
--
-- Avant : la policy INSERT ne verifiait que user_id, donc un appel REST direct
-- (anon key + JWT) pouvait creer status = 'validated' avec ends_at en 9999.
BEGIN;

DROP POLICY IF EXISTS "Allow user create own subscriptions" ON subscription;
DROP POLICY IF EXISTS "Allow user create own pending subscriptions" ON subscription;

-- Defense en profondeur : un visiteur non connecte n'ecrit jamais.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON subscription FROM anon;

CREATE POLICY "Allow user create own pending subscriptions" ON subscription
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND status = 'pending'
    AND validated_at IS NULL
    AND validated_by IS NULL
  );

-- Recalcule nom, prix et dates depuis subscription_plan pour toute insertion
-- faite par un utilisateur. Meme regle que lib/subscription.api.ts
-- (buildSubscriptionDateRange) : 1 an en jeu = 1 mois reel, NULL = illimite.
-- Les insertions depuis l'editeur SQL (pas de JWT) et par un admin sont
-- laissees telles quelles.
CREATE OR REPLACE FUNCTION private.subscription_normalize_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_plan public.subscription_plan%ROWTYPE;
BEGIN
  IF coalesce(auth.role(), '') <> 'authenticated' OR private.is_admin() THEN
    RETURN NEW;
  END IF;

  SELECT *
  INTO v_plan
  FROM public.subscription_plan p
  WHERE p.code = NEW.plan_code
    AND p.is_active;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Plan abonnement introuvable.' USING ERRCODE = '22023';
  END IF;

  NEW.plan_name := v_plan.label;
  NEW.price_cents := v_plan.price_cents;
  NEW.starts_at := now();
  NEW.ends_at := CASE
    WHEN v_plan.duration_ingame_years IS NULL
      THEN '9999-12-31T23:59:59.999Z'::TIMESTAMPTZ
    ELSE now() + make_interval(months => v_plan.duration_ingame_years)
  END;
  NEW.status := 'pending';
  NEW.validated_at := NULL;
  NEW.validated_by := NULL;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.subscription_normalize_insert() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_subscription_normalize_insert ON subscription;
CREATE TRIGGER trg_subscription_normalize_insert
  BEFORE INSERT ON subscription
  FOR EACH ROW
  EXECUTE FUNCTION private.subscription_normalize_insert();

COMMIT;

-- ---------------------------------------------------------------------------
-- Audit a executer une fois apres application (lecture seule).
-- Abonnements valides sans validateur : candidats a une auto-validation.
-- La migration 018 a valide sans validateur les abonnements anterieurs :
-- remplacer <date_018> par la date d'application de 018 pour les exclure.
--
-- SELECT id, user_id, plan_code, price_cents, starts_at, ends_at, created_at
-- FROM subscription
-- WHERE status = 'validated'
--   AND validated_by IS NULL
--   AND created_at > '<date_018>'
-- ORDER BY created_at DESC;
--
-- Abonnements dont la duree ne correspond pas au plan.
--
-- SELECT s.id, s.user_id, s.plan_code, s.starts_at, s.ends_at,
--        p.duration_ingame_years, s.price_cents, p.price_cents AS plan_price
-- FROM subscription s
-- JOIN subscription_plan p ON p.code = s.plan_code
-- WHERE s.price_cents <> p.price_cents
--    OR (p.duration_ingame_years IS NULL AND s.ends_at < '9999-01-01')
--    OR (p.duration_ingame_years IS NOT NULL
--        AND s.ends_at > s.starts_at
--          + make_interval(months => p.duration_ingame_years)
--          + INTERVAL '1 day');
-- ---------------------------------------------------------------------------

-- =============================================================================
-- 023a_harden_shared_build.sql
-- =============================================================================

-- Durcissement des liens de partage — etape A (additive).
--
-- Avant : tout utilisateur connecte pouvait inserer ou repointer n'importe
-- quel shared_build, et la table (avec les snapshots et user_id des builds
-- partages) etait listable par tous via l'anon key.
--
-- Ordre de deploiement obligatoire :
--   1. cette etape A (les anciennes policies restent actives, rien ne casse)
--   2. deploiement de l'API qui lit via get_shared_build() et ecrit user_id
--   3. etape B (023b) qui supprime les anciennes policies permissives
BEGIN;

ALTER TABLE shared_build
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE shared_build sb
SET user_id = b.user_id
FROM build b
WHERE b.id = sb.build_id
  AND sb.user_id IS NULL;

ALTER TABLE shared_build ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE shared_build ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_shared_build_user_id ON shared_build(user_id);

-- Defense en profondeur : un visiteur non connecte n'ecrit jamais.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON shared_build FROM anon;

DROP POLICY IF EXISTS "Allow owner read shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow subscriber share own builds" ON shared_build;
DROP POLICY IF EXISTS "Allow subscriber update own shared builds" ON shared_build;

CREATE POLICY "Allow owner read shared builds" ON shared_build
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber share own builds" ON shared_build
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND private.owns_build(build_id)
    AND (SELECT private.has_active_subscription())
  );

CREATE POLICY "Allow subscriber update own shared builds" ON shared_build
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND private.owns_build(build_id)
    AND (SELECT private.has_active_subscription())
  );

-- Lecture publique d'un partage par son identifiant uniquement. Le slot est
-- la position du build parmi ceux de son proprietaire (meme ordre que
-- api/builds). user_id n'est jamais renvoye.
CREATE OR REPLACE FUNCTION public.get_shared_build(p_id UUID)
RETURNS TABLE (
  id UUID,
  slot INTEGER,
  snapshot JSONB,
  saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    sb.id,
    ranked.slot::INTEGER,
    ranked.snapshot,
    ranked.saved_at,
    sb.created_at
  FROM public.shared_build sb
  JOIN LATERAL (
    SELECT o.id, o.slot, o.snapshot, o.saved_at
    FROM (
      SELECT
        b.id,
        b.snapshot,
        b.saved_at,
        row_number() OVER (ORDER BY b.created_at ASC, b.id ASC) AS slot
      FROM public.build b
      WHERE b.user_id = sb.user_id
    ) o
    WHERE o.id = sb.build_id
  ) ranked ON true
  WHERE sb.id = p_id;
$$;

REVOKE ALL ON FUNCTION public.get_shared_build(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_build(UUID) TO anon, authenticated;

COMMIT;

-- =============================================================================
-- 023b_drop_legacy_shared_policies.sql
-- =============================================================================

-- Durcissement des liens de partage — etape B.
-- A appliquer UNIQUEMENT apres le deploiement de l'API qui lit les partages
-- via public.get_shared_build() (voir 023a).
BEGIN;

DROP POLICY IF EXISTS "Allow public read shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user insert own shared builds" ON shared_build;
DROP POLICY IF EXISTS "Allow user update own shared builds" ON shared_build;

-- Les snapshots partages ne sont plus lisibles directement : la lecture
-- publique passe par get_shared_build(), qui ne renvoie pas user_id.
DROP POLICY IF EXISTS "Allow public read shared snapshots" ON build;

COMMIT;

-- =============================================================================
-- 024_table_game_version.sql
-- =============================================================================

-- Versions du jeu. Chaque publication de la Communaute est rattachee a la
-- version courante au moment de sa publication ou de sa mise a jour.
--
-- Passage a une nouvelle version :
--   UPDATE game_version SET is_current = false WHERE is_current;
--   INSERT INTO game_version (code, label, released_at, is_current)
--   VALUES ('v16', 'Version 16', CURRENT_DATE, true);
BEGIN;

CREATE TABLE IF NOT EXISTS game_version (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  released_at DATE NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_game_version_code CHECK (code ~ '^[a-z0-9._-]{1,16}$')
);

-- Une seule version courante.
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_version_single_current
  ON game_version(is_current)
  WHERE is_current;

ALTER TABLE game_version ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read game_version" ON game_version;
CREATE POLICY "Allow read game_version" ON game_version
  FOR SELECT
  USING (true);

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON game_version FROM anon, authenticated;

INSERT INTO game_version (code, label, released_at, is_current)
VALUES ('v15', 'Version 15', NULL, true)
ON CONFLICT (code) DO NOTHING;

CREATE OR REPLACE FUNCTION private.current_game_version()
RETURNS TEXT
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT gv.code
  FROM public.game_version gv
  WHERE gv.is_current
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION private.current_game_version() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.current_game_version() TO authenticated;

COMMIT;

-- =============================================================================
-- 025_table_user_profile.sql
-- =============================================================================

-- Pseudo public du compte, affiche sur les publications et avis de la
-- Communaute. Choisi une fois, definitif (pas d'UPDATE ni de DELETE cote
-- utilisateur ; correction possible uniquement via l'editeur SQL).
BEGIN;

CREATE TABLE IF NOT EXISTS user_profile (
  user_id UUID PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Meme regle que src/feature/account/model/account.rules.ts
  CONSTRAINT valid_user_profile_pseudo CHECK (
    pseudo ~ '^[A-Za-zÀ-ÖØ-öø-ÿ0-9_.-]{3,24}$'
  ),
  CONSTRAINT reserved_user_profile_pseudo CHECK (
    lower(pseudo) NOT IN (
      'admin',
      'administrateur',
      'administrator',
      'anonyme',
      'dreadcast',
      'moderateur',
      'modérateur',
      'moderator',
      'modo',
      'root',
      'staff',
      'support',
      'system',
      'systeme',
      'système'
    )
    AND lower(pseudo) !~ '^(admin|mod[eé]rat)'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_pseudo_lower
  ON user_profile (lower(pseudo));

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read user profiles" ON user_profile;
DROP POLICY IF EXISTS "Allow user create own profile" ON user_profile;

CREATE POLICY "Allow authenticated read user profiles" ON user_profile
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow user create own profile" ON user_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE ALL ON user_profile FROM anon;
REVOKE UPDATE, DELETE, TRUNCATE ON user_profile FROM authenticated;

CREATE OR REPLACE FUNCTION private.has_pseudo()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profile up
    WHERE up.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.has_pseudo() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_pseudo() TO authenticated;

COMMIT;

-- =============================================================================
-- 026_table_community_build.sql
-- =============================================================================

-- Publications de la Communaute.
--
-- Les donnees sont separees par audience :
--   community_build          metadonnees, lisibles par tout utilisateur connecte
--                            (apercu non-abonne : titre, spe, note, stats cles)
--   community_build_content  snapshot fige, 20 stats, facettes detaillees,
--                            lisibles uniquement par un abonne actif ou l'auteur
--
-- Aucune policy INSERT/UPDATE : les ecritures passent exclusivement par les
-- RPC community_publish / community_update_publication (029), qui copient le
-- snapshot depuis la table build et derivent les facettes cote serveur.
BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS community_build (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_build_id UUID NULL REFERENCES build(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NULL,
  specialization TEXT NOT NULL,
  detected_specialization TEXT NOT NULL,
  game_version TEXT NOT NULL REFERENCES game_version(code),
  race race_type NOT NULL,
  gender TEXT NOT NULL,
  weapon_types item_type[] NOT NULL DEFAULT '{}',
  has_heal_weapon BOOLEAN NOT NULL DEFAULT false,
  key_stats JSONB NOT NULL DEFAULT '[]',
  rating_count INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_avg NUMERIC(3, 2) GENERATED ALWAYS AS (
    CASE
      WHEN rating_count > 0 THEN round(rating_sum::NUMERIC / rating_count, 2)
    END
  ) STORED,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  content_updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT community_build_source_unique UNIQUE (source_build_id),
  CONSTRAINT valid_community_build_title CHECK (
    char_length(btrim(title)) BETWEEN 3 AND 64
  ),
  CONSTRAINT valid_community_build_description CHECK (
    description IS NULL OR char_length(description) <= 1000
  ),
  CONSTRAINT valid_community_build_specialization CHECK (
    specialization IN (
      'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
      'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
    )
  ),
  CONSTRAINT valid_community_build_detected_specialization CHECK (
    detected_specialization IN (
      'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
      'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
    )
  ),
  CONSTRAINT valid_community_build_gender CHECK (gender IN ('male', 'female')),
  CONSTRAINT valid_community_build_rating CHECK (
    rating_count >= 0 AND rating_sum >= 0
  )
);

CREATE INDEX IF NOT EXISTS idx_community_build_version_published
  ON community_build(game_version, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_build_version_updated
  ON community_build(game_version, content_updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_build_version_specialization
  ON community_build(game_version, specialization);
CREATE INDEX IF NOT EXISTS idx_community_build_author
  ON community_build(author_id);
CREATE INDEX IF NOT EXISTS idx_community_build_weapon_types
  ON community_build USING GIN (weapon_types);
CREATE INDEX IF NOT EXISTS idx_community_build_title_trgm
  ON community_build USING GIN (lower(title) extensions.gin_trgm_ops);

DROP TRIGGER IF EXISTS trg_community_build_updated_at ON community_build;
CREATE TRIGGER trg_community_build_updated_at
  BEFORE UPDATE ON community_build
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE TABLE IF NOT EXISTS community_build_content (
  publication_id UUID PRIMARY KEY REFERENCES community_build(id) ON DELETE CASCADE,
  -- Denormalise pour une policy sans jointure.
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  stats JSONB NOT NULL,
  -- 20 stats dans l'ordre canonique de private.community_stat_keys().
  stat_vec DOUBLE PRECISION[] NOT NULL,
  item_ids TEXT[] NOT NULL DEFAULT '{}',
  kit_ids TEXT[] NOT NULL DEFAULT '{}',
  implant_names TEXT[] NOT NULL DEFAULT '{}',
  drug_id TEXT NULL,
  CONSTRAINT valid_community_build_content_stat_vec CHECK (
    array_length(stat_vec, 1) = 20
  )
);

CREATE INDEX IF NOT EXISTS idx_community_build_content_items
  ON community_build_content USING GIN (item_ids);
CREATE INDEX IF NOT EXISTS idx_community_build_content_implants
  ON community_build_content USING GIN (implant_names);
CREATE INDEX IF NOT EXISTS idx_community_build_content_drug
  ON community_build_content(drug_id);

ALTER TABLE community_build ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_build_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read community builds" ON community_build;
DROP POLICY IF EXISTS "Allow author delete community builds" ON community_build;
DROP POLICY IF EXISTS "Allow subscriber or author read community content" ON community_build_content;

CREATE POLICY "Allow authenticated read community builds" ON community_build
  FOR SELECT
  TO authenticated
  USING (true);

-- Depublier reste possible apres expiration de l'abonnement.
CREATE POLICY "Allow author delete community builds" ON community_build
  FOR DELETE
  TO authenticated
  USING (author_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber or author read community content" ON community_build_content
  FOR SELECT
  TO authenticated
  USING (
    author_id = (SELECT auth.uid())
    OR (SELECT private.has_active_subscription())
  );

REVOKE ALL ON community_build FROM anon;
REVOKE INSERT, UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_build FROM authenticated;
REVOKE ALL ON community_build_content FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON community_build_content FROM authenticated;

COMMIT;

-- =============================================================================
-- 027_table_community_review.sql
-- =============================================================================

-- Notes (1 a 5 etoiles) et avis courts sur les publications.
-- Une note par abonne et par publication, modifiable et supprimable par son
-- auteur. Pas d'auto-notation. Aucune moderation.
BEGIN;

CREATE TABLE IF NOT EXISTS community_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES community_build(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stars SMALLINT NOT NULL,
  body TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT community_review_unique_reviewer UNIQUE (publication_id, reviewer_id),
  CONSTRAINT valid_community_review_stars CHECK (stars BETWEEN 1 AND 5),
  CONSTRAINT valid_community_review_body CHECK (
    body IS NULL OR char_length(body) BETWEEN 1 AND 280
  )
);

CREATE INDEX IF NOT EXISTS idx_community_review_publication_updated
  ON community_review(publication_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_review_updated
  ON community_review(updated_at);
CREATE INDEX IF NOT EXISTS idx_community_review_reviewer
  ON community_review(reviewer_id);

DROP TRIGGER IF EXISTS trg_community_review_updated_at ON community_review;
CREATE TRIGGER trg_community_review_updated_at
  BEFORE UPDATE ON community_review
  FOR EACH ROW
  EXECUTE FUNCTION private.set_updated_at();

CREATE OR REPLACE FUNCTION private.is_publication_author(p_publication_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.community_build cb
    WHERE cb.id = p_publication_id
      AND cb.author_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION private.is_publication_author(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_publication_author(UUID) TO authenticated;

-- Recalcule (sans incrementer) les agregats de note de la publication.
-- SECURITY DEFINER : un votant ne peut pas modifier community_build lui-meme.
CREATE OR REPLACE FUNCTION private.community_review_refresh_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_publication_id UUID;
  v_count INTEGER;
  v_sum INTEGER;
BEGIN
  v_publication_id := CASE
    WHEN TG_OP = 'DELETE' THEN OLD.publication_id
    ELSE NEW.publication_id
  END;

  -- Verrouille la ligne avant d'agreger : deux votes concurrents ne peuvent
  -- pas ecraser mutuellement leurs totaux.
  PERFORM 1
  FROM public.community_build cb
  WHERE cb.id = v_publication_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT count(*)::INTEGER, coalesce(sum(r.stars), 0)::INTEGER
  INTO v_count, v_sum
  FROM public.community_review r
  WHERE r.publication_id = v_publication_id;

  UPDATE public.community_build cb
  SET rating_count = v_count,
      rating_sum = v_sum
  WHERE cb.id = v_publication_id;

  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION private.community_review_refresh_rating() FROM PUBLIC;

DROP TRIGGER IF EXISTS trg_community_review_refresh_rating ON community_review;
CREATE TRIGGER trg_community_review_refresh_rating
  AFTER INSERT OR DELETE OR UPDATE OF stars ON community_review
  FOR EACH ROW
  EXECUTE FUNCTION private.community_review_refresh_rating();

ALTER TABLE community_review ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow subscriber read community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow subscriber create community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow reviewer update community reviews" ON community_review;
DROP POLICY IF EXISTS "Allow reviewer delete community reviews" ON community_review;

CREATE POLICY "Allow subscriber read community reviews" ON community_review
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.has_active_subscription())
    OR reviewer_id = (SELECT auth.uid())
    OR private.is_publication_author(publication_id)
  );

CREATE POLICY "Allow subscriber create community reviews" ON community_review
  FOR INSERT
  TO authenticated
  WITH CHECK (
    reviewer_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
    AND (SELECT private.has_pseudo())
    AND NOT private.is_publication_author(publication_id)
  );

CREATE POLICY "Allow reviewer update community reviews" ON community_review
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (
    reviewer_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
  );

-- Supprimer son avis reste possible apres expiration de l'abonnement.
CREATE POLICY "Allow reviewer delete community reviews" ON community_review
  FOR DELETE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

REVOKE ALL ON community_review FROM anon;
REVOKE UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_review FROM authenticated;
GRANT UPDATE (stars, body) ON community_review TO authenticated;

COMMIT;

-- =============================================================================
-- 028_table_community_favorite.sql
-- =============================================================================

-- Favoris de la Communaute (abonnes uniquement).
BEGIN;

CREATE TABLE IF NOT EXISTS community_favorite (
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  publication_id UUID NOT NULL REFERENCES community_build(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, publication_id)
);

CREATE INDEX IF NOT EXISTS idx_community_favorite_publication
  ON community_favorite(publication_id);

ALTER TABLE community_favorite ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow user read own favorites" ON community_favorite;
DROP POLICY IF EXISTS "Allow subscriber create own favorites" ON community_favorite;
DROP POLICY IF EXISTS "Allow user delete own favorites" ON community_favorite;

CREATE POLICY "Allow user read own favorites" ON community_favorite
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Allow subscriber create own favorites" ON community_favorite
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (SELECT private.has_active_subscription())
  );

CREATE POLICY "Allow user delete own favorites" ON community_favorite
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON community_favorite FROM anon;
REVOKE UPDATE, TRUNCATE, REFERENCES, TRIGGER ON community_favorite FROM authenticated;

COMMIT;

-- =============================================================================
-- 029_rpc_community_write.sql
-- =============================================================================

-- RPC d'ecriture de la Communaute (seul chemin d'ecriture des publications).
--
-- Erreurs levees (message = code, lu par lib/community.api.ts) :
--   NOT_AUTHENTICATED, SUBSCRIPTION_REQUIRED, PSEUDO_REQUIRED,
--   BUILD_NOT_FOUND, ALREADY_PUBLISHED, PUBLICATION_NOT_FOUND, FROZEN,
--   SOURCE_BUILD_MISSING, INVALID_TITLE, INVALID_DESCRIPTION,
--   INVALID_SPECIALIZATION, INVALID_STATS, INVALID_SNAPSHOT
BEGIN;

-- Ordre canonique des stats : identique a src/domain/stats.ts,
-- lib/community.validation.ts et a l'enum stat_property.
CREATE OR REPLACE FUNCTION private.community_stat_keys()
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT ARRAY[
    'strength', 'agility', 'robustness', 'perception', 'stealth',
    'computing', 'medicine', 'engineering', 'health', 'stamina',
    'integrity', 'speed', 'raceDamage', 'hitRating', 'teamHeal',
    'cacDamage', 'criticalCacChance', 'criticalCacDamage', 'hitDamages',
    'criticalHitDamage'
  ]::TEXT[];
$$;

CREATE OR REPLACE FUNCTION private.community_specializations()
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT ARRAY[
    'medecin', 'informaticien', 'ingenieur', 'combattant_cac',
    'tireur', 'furtif', 'tank', 'soutien', 'polyvalent'
  ]::TEXT[];
$$;

-- Verifie les 20 stats (cles exactes, nombres finis, bornes larges) et les
-- arrondit a 2 decimales. Les stats viennent du client : ce controle ne
-- garantit que leur coherence, pas leur exactitude.
CREATE OR REPLACE FUNCTION private.community_validate_stats(p_stats JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_keys TEXT[] := private.community_stat_keys();
  v_key TEXT;
  v_value JSONB;
  v_number NUMERIC;
  v_result JSONB := '{}'::JSONB;
BEGIN
  IF p_stats IS NULL OR jsonb_typeof(p_stats) <> 'object' THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
  END IF;

  IF (SELECT count(*) FROM jsonb_object_keys(p_stats)) <> array_length(v_keys, 1) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
  END IF;

  FOREACH v_key IN ARRAY v_keys LOOP
    v_value := p_stats -> v_key;

    IF v_value IS NULL OR jsonb_typeof(v_value) <> 'number' THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
    END IF;

    v_number := round((v_value #>> '{}')::NUMERIC, 2);

    IF v_number < -1000 OR v_number > 10000 THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_STATS';
    END IF;

    v_result := v_result || jsonb_build_object(v_key, v_number);
  END LOOP;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_stats_to_vec(p_stats JSONB)
RETURNS DOUBLE PRECISION[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT array_agg(
    coalesce((p_stats ->> k.key)::DOUBLE PRECISION, 0)
    ORDER BY k.ord
  )
  FROM unnest(private.community_stat_keys()) WITH ORDINALITY AS k(key, ord);
$$;

-- Stats mises en avant sur les cartes (visibles des non-abonnes), sous forme
-- de tableau ordonne [{ "stat": ..., "value": ... }].
CREATE OR REPLACE FUNCTION private.community_key_stats(
  p_specialization TEXT,
  p_stats JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_keys TEXT[];
BEGIN
  v_keys := CASE p_specialization
    WHEN 'medecin' THEN ARRAY['medicine', 'health', 'stamina', 'teamHeal']
    WHEN 'informaticien' THEN ARRAY['computing', 'health', 'stamina', 'stealth']
    WHEN 'ingenieur' THEN ARRAY['engineering', 'health', 'stamina', 'integrity']
    WHEN 'combattant_cac' THEN ARRAY['strength', 'cacDamage', 'criticalCacChance', 'health']
    WHEN 'tireur' THEN ARRAY['perception', 'hitDamages', 'criticalHitDamage', 'hitRating']
    WHEN 'furtif' THEN ARRAY['stealth', 'agility', 'perception', 'health']
    WHEN 'tank' THEN ARRAY['robustness', 'health', 'integrity', 'stamina']
    WHEN 'soutien' THEN ARRAY['teamHeal', 'medicine', 'health', 'stamina']
    ELSE NULL
  END;

  -- Polyvalent : les 3 meilleures competences + la sante.
  IF v_keys IS NULL THEN
    SELECT array_agg(s.key ORDER BY s.value DESC, s.ord)
    INTO v_keys
    FROM (
      SELECT k.key, k.ord, coalesce((p_stats ->> k.key)::NUMERIC, 0) AS value
      FROM unnest((private.community_stat_keys())[1:8]) WITH ORDINALITY AS k(key, ord)
      ORDER BY value DESC, k.ord
      LIMIT 3
    ) s;

    v_keys := v_keys || ARRAY['health'];
  END IF;

  RETURN (
    SELECT coalesce(
      jsonb_agg(
        jsonb_build_object(
          'stat', k.key,
          'value', coalesce((p_stats ->> k.key)::NUMERIC, 0)
        )
        ORDER BY k.ord
      ),
      '[]'::JSONB
    )
    FROM unnest(v_keys) WITH ORDINALITY AS k(key, ord)
  );
END;
$$;

-- Lit et valide un snapshot de build (JSON non fiable) et en derive les
-- facettes de recherche a partir des tables du jeu.
CREATE OR REPLACE FUNCTION private.community_derive_facets(
  p_snapshot JSONB,
  OUT race public.race_type,
  OUT gender TEXT,
  OUT weapon_types public.item_type[],
  OUT has_heal_weapon BOOLEAN,
  OUT item_ids TEXT[],
  OUT kit_ids TEXT[],
  OUT implant_names TEXT[],
  OUT drug_id TEXT
)
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  v_items JSONB := coalesce(p_snapshot -> 'items', '{}'::JSONB);
  v_kits JSONB := coalesce(p_snapshot -> 'kits', '{}'::JSONB);
  v_implants JSONB := coalesce(p_snapshot -> 'implants', '{}'::JSONB);
  v_drug JSONB := p_snapshot -> 'drug';
  v_arm_ids TEXT[];
BEGIN
  IF p_snapshot IS NULL
    OR jsonb_typeof(p_snapshot) <> 'object'
    OR jsonb_typeof(p_snapshot -> 'profile') IS DISTINCT FROM 'object'
    OR jsonb_typeof(v_items) <> 'object'
    OR jsonb_typeof(v_kits) <> 'object'
    OR jsonb_typeof(v_implants) <> 'object'
  THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  race := (p_snapshot #>> '{profile,race}')::public.race_type;
  gender := p_snapshot #>> '{profile,gender}';

  IF race IS NULL OR gender IS NULL OR gender NOT IN ('male', 'female') THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Equipements : { spot: { id, damageBonus? } | null }
  SELECT coalesce(array_agg(DISTINCT e.value ->> 'id'), '{}')
  INTO item_ids
  FROM jsonb_each(v_items) AS e(spot, value)
  WHERE jsonb_typeof(e.value) = 'object'
    AND e.value ->> 'id' IS NOT NULL;

  IF EXISTS (
    SELECT 1
    FROM unnest(item_ids) AS i(id)
    WHERE NOT EXISTS (SELECT 1 FROM public.item it WHERE it.id = i.id)
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  v_arm_ids := ARRAY[
    v_items #>> '{leftArm,id}',
    v_items #>> '{rightArm,id}'
  ];

  SELECT
    coalesce(array_agg(DISTINCT it.type ORDER BY it.type), '{}'),
    coalesce(bool_or(it.min_heal IS NOT NULL), false)
  INTO weapon_types, has_heal_weapon
  FROM public.item it
  WHERE it.id = ANY (v_arm_ids);

  -- Kits : { spot: [{ id, number }] }
  SELECT coalesce(array_agg(DISTINCT k.value ->> 'id'), '{}')
  INTO kit_ids
  FROM jsonb_each(v_kits) AS e(spot, value)
  CROSS JOIN LATERAL jsonb_array_elements(
    CASE WHEN jsonb_typeof(e.value) = 'array' THEN e.value ELSE '[]'::JSONB END
  ) AS k(value)
  WHERE jsonb_typeof(k.value) = 'object'
    AND k.value ->> 'id' IS NOT NULL;

  IF EXISTS (
    SELECT 1
    FROM unnest(kit_ids) AS i(id)
    WHERE NOT EXISTS (SELECT 1 FROM public.kit kt WHERE kt.id = i.id)
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Implants : { nom: niveau }
  IF EXISTS (
    SELECT 1
    FROM jsonb_each(v_implants) AS e(name, value)
    WHERE jsonb_typeof(e.value) <> 'number'
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  SELECT coalesce(array_agg(e.name ORDER BY e.name), '{}')
  INTO implant_names
  FROM jsonb_each(v_implants) AS e(name, value)
  WHERE (e.value #>> '{}')::NUMERIC > 0;

  IF EXISTS (
    SELECT 1
    FROM jsonb_each(v_implants) AS e(name, value)
    WHERE (e.value #>> '{}')::NUMERIC <> 0
      AND NOT EXISTS (
        SELECT 1
        FROM public.implant im
        WHERE im.name = e.name
          AND (e.value #>> '{}')::NUMERIC BETWEEN 0 AND im.level_max
          AND (e.value #>> '{}')::NUMERIC = trunc((e.value #>> '{}')::NUMERIC)
      )
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  -- Drogue : id | null
  IF v_drug IS NULL OR jsonb_typeof(v_drug) = 'null' THEN
    drug_id := NULL;
  ELSIF jsonb_typeof(v_drug) = 'string' THEN
    drug_id := v_drug #>> '{}';
    IF NOT EXISTS (SELECT 1 FROM public.drug d WHERE d.id = drug_id) THEN
      RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
    END IF;
  ELSE
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;
EXCEPTION
  WHEN data_exception THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
END;
$$;

-- Snapshot stocke tel quel ou, pour d'anciennes lignes, sous forme de chaine
-- JSON. savedAt est retire de la copie figee.
CREATE OR REPLACE FUNCTION private.community_normalize_snapshot(p_snapshot JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_snapshot JSONB := p_snapshot;
BEGIN
  IF jsonb_typeof(v_snapshot) = 'string' THEN
    v_snapshot := (v_snapshot #>> '{}')::JSONB;
  END IF;

  IF jsonb_typeof(v_snapshot) <> 'object' THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
  END IF;

  RETURN v_snapshot - 'savedAt';
EXCEPTION
  WHEN data_exception THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SNAPSHOT';
END;
$$;

CREATE OR REPLACE FUNCTION private.community_normalize_title(p_title TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_title TEXT := btrim(coalesce(p_title, ''));
BEGIN
  IF char_length(v_title) NOT BETWEEN 3 AND 64 THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_TITLE';
  END IF;

  RETURN v_title;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_normalize_description(p_description TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  v_description TEXT := nullif(btrim(coalesce(p_description, '')), '');
BEGIN
  IF v_description IS NOT NULL AND char_length(v_description) > 1000 THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_DESCRIPTION';
  END IF;

  RETURN v_description;
END;
$$;

CREATE OR REPLACE FUNCTION private.community_check_specialization(p_specialization TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF p_specialization IS NULL
    OR NOT (p_specialization = ANY (private.community_specializations()))
  THEN
    RAISE EXCEPTION USING MESSAGE = 'INVALID_SPECIALIZATION';
  END IF;

  RETURN p_specialization;
END;
$$;

-- Publie une copie figee du build du slot p_slot (1-based, meme ordre que
-- api/builds). Retourne l'identifiant de la publication.
CREATE OR REPLACE FUNCTION public.community_publish(
  p_slot INTEGER,
  p_title TEXT,
  p_description TEXT,
  p_specialization TEXT,
  p_detected_specialization TEXT,
  p_stats JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_build_id UUID;
  v_build_snapshot JSONB;
  v_snapshot JSONB;
  v_stats JSONB;
  v_facets RECORD;
  v_title TEXT;
  v_description TEXT;
  v_specialization TEXT;
  v_detected TEXT;
  v_publication_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'NOT_AUTHENTICATED';
  END IF;

  IF NOT private.has_active_subscription() THEN
    RAISE EXCEPTION USING MESSAGE = 'SUBSCRIPTION_REQUIRED';
  END IF;

  IF NOT private.has_pseudo() THEN
    RAISE EXCEPTION USING MESSAGE = 'PSEUDO_REQUIRED';
  END IF;

  v_title := private.community_normalize_title(p_title);
  v_description := private.community_normalize_description(p_description);
  v_specialization := private.community_check_specialization(p_specialization);
  v_detected := private.community_check_specialization(p_detected_specialization);
  v_stats := private.community_validate_stats(p_stats);

  IF p_slot IS NULL OR p_slot < 1 THEN
    RAISE EXCEPTION USING MESSAGE = 'BUILD_NOT_FOUND';
  END IF;

  SELECT b.id, b.snapshot
  INTO v_build_id, v_build_snapshot
  FROM public.build b
  WHERE b.user_id = v_user_id
  ORDER BY b.created_at ASC, b.id ASC
  OFFSET p_slot - 1
  LIMIT 1;

  IF v_build_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'BUILD_NOT_FOUND';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.community_build cb WHERE cb.source_build_id = v_build_id
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'ALREADY_PUBLISHED';
  END IF;

  v_snapshot := private.community_normalize_snapshot(v_build_snapshot);
  SELECT * INTO v_facets FROM private.community_derive_facets(v_snapshot);

  BEGIN
    INSERT INTO public.community_build (
      author_id,
      source_build_id,
      title,
      description,
      specialization,
      detected_specialization,
      game_version,
      race,
      gender,
      weapon_types,
      has_heal_weapon,
      key_stats
    )
    VALUES (
      v_user_id,
      v_build_id,
      v_title,
      v_description,
      v_specialization,
      v_detected,
      private.current_game_version(),
      v_facets.race,
      v_facets.gender,
      v_facets.weapon_types,
      v_facets.has_heal_weapon,
      private.community_key_stats(v_specialization, v_stats)
    )
    RETURNING id INTO v_publication_id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE EXCEPTION USING MESSAGE = 'ALREADY_PUBLISHED';
  END;

  INSERT INTO public.community_build_content (
    publication_id,
    author_id,
    snapshot,
    stats,
    stat_vec,
    item_ids,
    kit_ids,
    implant_names,
    drug_id
  )
  VALUES (
    v_publication_id,
    v_user_id,
    v_snapshot,
    v_stats,
    private.community_stats_to_vec(v_stats),
    v_facets.item_ids,
    v_facets.kit_ids,
    v_facets.implant_names,
    v_facets.drug_id
  );

  RETURN v_publication_id;
END;
$$;

-- Met a jour une publication. p_refresh = true recopie le build source
-- (« Mettre a jour la publication ») et exige p_stats ; sinon seules les
-- metadonnees changent. Les notes sont conservees dans les deux cas.
CREATE OR REPLACE FUNCTION public.community_update_publication(
  p_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_specialization TEXT,
  p_refresh BOOLEAN,
  p_detected_specialization TEXT DEFAULT NULL,
  p_stats JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_publication public.community_build%ROWTYPE;
  v_build_snapshot JSONB;
  v_snapshot JSONB;
  v_stats JSONB;
  v_facets RECORD;
  v_title TEXT;
  v_description TEXT;
  v_specialization TEXT;
  v_detected TEXT;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'NOT_AUTHENTICATED';
  END IF;

  SELECT *
  INTO v_publication
  FROM public.community_build cb
  WHERE cb.id = p_id
  FOR UPDATE;

  IF NOT FOUND OR v_publication.author_id <> v_user_id THEN
    RAISE EXCEPTION USING MESSAGE = 'PUBLICATION_NOT_FOUND';
  END IF;

  -- Abonnement expire : publication gelee (visible, notable, depubliable).
  IF NOT private.has_active_subscription() THEN
    RAISE EXCEPTION USING MESSAGE = 'FROZEN';
  END IF;

  v_title := private.community_normalize_title(p_title);
  v_description := private.community_normalize_description(p_description);
  v_specialization := private.community_check_specialization(p_specialization);

  IF coalesce(p_refresh, false) THEN
    v_detected := private.community_check_specialization(p_detected_specialization);
    v_stats := private.community_validate_stats(p_stats);

    IF v_publication.source_build_id IS NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'SOURCE_BUILD_MISSING';
    END IF;

    SELECT b.snapshot
    INTO v_build_snapshot
    FROM public.build b
    WHERE b.id = v_publication.source_build_id
      AND b.user_id = v_user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION USING MESSAGE = 'SOURCE_BUILD_MISSING';
    END IF;

    v_snapshot := private.community_normalize_snapshot(v_build_snapshot);
    SELECT * INTO v_facets FROM private.community_derive_facets(v_snapshot);

    UPDATE public.community_build_content c
    SET snapshot = v_snapshot,
        stats = v_stats,
        stat_vec = private.community_stats_to_vec(v_stats),
        item_ids = v_facets.item_ids,
        kit_ids = v_facets.kit_ids,
        implant_names = v_facets.implant_names,
        drug_id = v_facets.drug_id
    WHERE c.publication_id = p_id;

    UPDATE public.community_build cb
    SET title = v_title,
        description = v_description,
        specialization = v_specialization,
        detected_specialization = v_detected,
        game_version = private.current_game_version(),
        race = v_facets.race,
        gender = v_facets.gender,
        weapon_types = v_facets.weapon_types,
        has_heal_weapon = v_facets.has_heal_weapon,
        key_stats = private.community_key_stats(v_specialization, v_stats),
        content_updated_at = now()
    WHERE cb.id = p_id;

    RETURN;
  END IF;

  SELECT c.stats
  INTO v_stats
  FROM public.community_build_content c
  WHERE c.publication_id = p_id;

  UPDATE public.community_build cb
  SET title = v_title,
      description = v_description,
      specialization = v_specialization,
      key_stats = private.community_key_stats(v_specialization, v_stats)
  WHERE cb.id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION private.community_stat_keys() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_specializations() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_validate_stats(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_stats_to_vec(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_key_stats(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_derive_facets(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_snapshot(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_title(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_normalize_description(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_check_specialization(TEXT) FROM PUBLIC;

-- Utilisees par les RPC de lecture (SECURITY INVOKER, 030/031).
GRANT EXECUTE ON FUNCTION private.community_stat_keys() TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_validate_stats(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_stats_to_vec(JSONB) TO authenticated;

REVOKE ALL ON FUNCTION public.community_publish(INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.community_update_publication(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.community_publish(INTEGER, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.community_update_publication(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT, JSONB) TO authenticated;

COMMIT;

-- =============================================================================
-- 030_rpc_community_search.sql
-- =============================================================================

-- Recherche de la Communaute (SECURITY INVOKER : la RLS decide de ce que
-- l'appelant voit). Pour un non-abonne, community_build_content est
-- invisible : "stats" vaut NULL et les filtres avances ne renvoient rien.
--
-- Tris :
--   trending       (defaut) notes recentes ponderees dans le temps
--   top            moyenne bayesienne
--   recent         date de publication
--   most_reviewed  nombre d'avis
--   updated        date de derniere mise a jour du contenu
BEGIN;

CREATE OR REPLACE FUNCTION private.escape_like(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT replace(replace(replace(p_value, '\', '\\'), '%', '\%'), '_', '\_');
$$;

-- Score de tendance par publication. SECURITY DEFINER : les avis ne sont
-- lisibles que par les abonnes, mais le score agrege (un nombre) sert aussi
-- au tri par defaut des non-abonnes.
--   Somme sur les avis des 30 derniers jours de (etoiles - 2) * 0.5^(age_j / 7)
--   + bonus de fraicheur 1.5 * 0.5^(jours depuis publication / 3)
CREATE OR REPLACE FUNCTION private.community_trend_scores()
RETURNS TABLE (publication_id UUID, score DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    cb.id,
    (
      coalesce(r.score, 0)
      + 1.5 * power(
        0.5,
        extract(EPOCH FROM (now() - cb.published_at)) / 86400.0 / 3
      )
    )::DOUBLE PRECISION
  FROM public.community_build cb
  LEFT JOIN (
    SELECT
      rv.publication_id,
      sum(
        (rv.stars - 2) * power(
          0.5,
          extract(EPOCH FROM (now() - rv.updated_at)) / 86400.0 / 7
        )
      ) AS score
    FROM public.community_review rv
    WHERE rv.updated_at >= now() - INTERVAL '30 days'
    GROUP BY rv.publication_id
  ) r ON r.publication_id = cb.id;
$$;

REVOKE ALL ON FUNCTION private.escape_like(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_trend_scores() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.escape_like(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_trend_scores() TO authenticated;

DROP FUNCTION IF EXISTS public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
);

-- p_game_version : NULL = version courante, '*' = toutes les versions.
-- p_stat_min     : { "medicine": 200, "health": 900 }.
-- p_ids          : restreint aux publications donnees (hydratation des
--                  recommandations).
CREATE FUNCTION public.community_search(
  p_query TEXT DEFAULT NULL,
  p_specializations TEXT[] DEFAULT NULL,
  p_min_rating NUMERIC DEFAULT NULL,
  p_races public.race_type[] DEFAULT NULL,
  p_genders TEXT[] DEFAULT NULL,
  p_weapon_types public.item_type[] DEFAULT NULL,
  p_heal_only BOOLEAN DEFAULT false,
  p_game_version TEXT DEFAULT NULL,
  p_stat_min JSONB DEFAULT NULL,
  p_implants TEXT[] DEFAULT NULL,
  p_drug_ids TEXT[] DEFAULT NULL,
  p_item_ids TEXT[] DEFAULT NULL,
  p_author_id UUID DEFAULT NULL,
  p_favorites_only BOOLEAN DEFAULT false,
  p_ids UUID[] DEFAULT NULL,
  p_sort TEXT DEFAULT 'trending',
  p_limit INTEGER DEFAULT 24,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  specialization TEXT,
  detected_specialization TEXT,
  game_version TEXT,
  race public.race_type,
  gender TEXT,
  weapon_types public.item_type[],
  has_heal_weapon BOOLEAN,
  key_stats JSONB,
  rating_count INTEGER,
  rating_avg NUMERIC,
  published_at TIMESTAMPTZ,
  content_updated_at TIMESTAMPTZ,
  author_id UUID,
  author_pseudo TEXT,
  stats JSONB,
  is_mine BOOLEAN,
  is_favorite BOOLEAN,
  bayes_score NUMERIC,
  trend_score DOUBLE PRECISION,
  total_count BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH params AS (
    SELECT
      CASE
        WHEN p_game_version = '*' THEN NULL
        ELSE coalesce(p_game_version, private.current_game_version())
      END AS version,
      nullif(btrim(lower(coalesce(p_query, ''))), '') AS query,
      least(greatest(coalesce(p_limit, 24), 1), 50) AS page_limit,
      greatest(coalesce(p_offset, 0), 0) AS page_offset,
      coalesce(p_sort, 'trending') AS sort
  ),
  filtered AS (
    SELECT
      cb.*,
      up.pseudo AS author_pseudo,
      c.stats AS content_stats,
      (cb.author_id = auth.uid()) AS is_mine,
      EXISTS (
        SELECT 1
        FROM public.community_favorite f
        WHERE f.publication_id = cb.id
          AND f.user_id = auth.uid()
      ) AS is_favorite,
      -- Moyenne bayesienne : 5 votes fictifs a 3 etoiles (a priori neutre).
      -- Un a priori egal a la moyenne globale classerait un build jamais
      -- note au niveau des mieux notes tant que les notes sont rares.
      round((5 * 3 + cb.rating_sum)::NUMERIC / (5 + cb.rating_count), 4)
        AS bayes_score,
      coalesce(t.score, 0) AS trend_score
    FROM public.community_build cb
    CROSS JOIN params p
    JOIN public.user_profile up ON up.user_id = cb.author_id
    LEFT JOIN public.community_build_content c ON c.publication_id = cb.id
    LEFT JOIN private.community_trend_scores() t ON t.publication_id = cb.id
    WHERE (p.version IS NULL OR cb.game_version = p.version)
      AND (p_ids IS NULL OR cb.id = ANY (p_ids))
      AND (
        p.query IS NULL
        OR lower(cb.title) LIKE '%' || private.escape_like(p.query) || '%'
        OR lower(up.pseudo) LIKE '%' || private.escape_like(p.query) || '%'
      )
      AND (
        p_specializations IS NULL
        OR cardinality(p_specializations) = 0
        OR cb.specialization = ANY (p_specializations)
      )
      AND (p_min_rating IS NULL OR cb.rating_avg >= p_min_rating)
      AND (
        p_races IS NULL
        OR cardinality(p_races) = 0
        OR cb.race = ANY (p_races)
      )
      AND (
        p_genders IS NULL
        OR cardinality(p_genders) = 0
        OR cb.gender = ANY (p_genders)
      )
      AND (
        p_weapon_types IS NULL
        OR cardinality(p_weapon_types) = 0
        OR cb.weapon_types && p_weapon_types
      )
      AND (NOT coalesce(p_heal_only, false) OR cb.has_heal_weapon)
      AND (p_author_id IS NULL OR cb.author_id = p_author_id)
      AND (
        NOT coalesce(p_favorites_only, false)
        OR EXISTS (
          SELECT 1
          FROM public.community_favorite f
          WHERE f.publication_id = cb.id
            AND f.user_id = auth.uid()
        )
      )
      -- Filtres avances : exigent le contenu (abonne ou auteur).
      AND (
        p_stat_min IS NULL
        OR NOT EXISTS (
          SELECT 1
          FROM jsonb_each_text(p_stat_min) AS m(key, value)
          WHERE coalesce((c.stats ->> m.key)::NUMERIC, -1e9) < m.value::NUMERIC
        )
      )
      AND (
        p_implants IS NULL
        OR cardinality(p_implants) = 0
        OR c.implant_names @> p_implants
      )
      AND (
        p_drug_ids IS NULL
        OR cardinality(p_drug_ids) = 0
        OR c.drug_id = ANY (p_drug_ids)
      )
      AND (
        p_item_ids IS NULL
        OR cardinality(p_item_ids) = 0
        OR c.item_ids @> p_item_ids
      )
  )
  SELECT
    f.id,
    f.title,
    f.description,
    f.specialization,
    f.detected_specialization,
    f.game_version,
    f.race,
    f.gender,
    f.weapon_types,
    f.has_heal_weapon,
    f.key_stats,
    f.rating_count,
    f.rating_avg,
    f.published_at,
    f.content_updated_at,
    f.author_id,
    f.author_pseudo,
    f.content_stats,
    f.is_mine,
    f.is_favorite,
    f.bayes_score,
    f.trend_score,
    count(*) OVER () AS total_count
  FROM filtered f
  CROSS JOIN params p
  ORDER BY
    CASE WHEN p.sort = 'top' THEN f.bayes_score END DESC NULLS LAST,
    CASE WHEN p.sort = 'top' THEN f.rating_count END DESC NULLS LAST,
    CASE WHEN p.sort = 'most_reviewed' THEN f.rating_count END DESC NULLS LAST,
    CASE WHEN p.sort = 'recent' THEN f.published_at END DESC NULLS LAST,
    CASE WHEN p.sort = 'updated' THEN f.content_updated_at END DESC NULLS LAST,
    CASE
      WHEN p.sort NOT IN ('top', 'most_reviewed', 'recent', 'updated')
        THEN f.trend_score
    END DESC NULLS LAST,
    f.published_at DESC,
    f.id
  LIMIT (SELECT page_limit FROM params)
  OFFSET (SELECT page_offset FROM params);
$$;

REVOKE ALL ON FUNCTION public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.community_search(
  TEXT, TEXT[], NUMERIC, public.race_type[], TEXT[], public.item_type[],
  BOOLEAN, TEXT, JSONB, TEXT[], TEXT[], TEXT[], UUID, BOOLEAN, UUID[],
  TEXT, INTEGER, INTEGER
) TO authenticated;

COMMIT;

-- =============================================================================
-- 031_rpc_community_similar.sql
-- =============================================================================

-- Recommandations par similitude de stats (SECURITY INVOKER : seules les
-- publications dont le contenu est lisible, donc abonne ou auteur, servent
-- de base de comparaison).
--
-- Chaque stat est centree-reduite (z-score) sur les publications de la
-- version, puis on compare par cosinus. Sans centrage, toutes les stats
-- etant positives (~100+), le cosinus brut vaut ~0.95 pour toutes les paires.
-- L'ecart-type est borne par un plancher par stat pour les petits
-- echantillons et les stats presque toujours nulles.
BEGIN;

CREATE OR REPLACE FUNCTION private.community_stat_scale_floors()
RETURNS DOUBLE PRECISION[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  -- Meme ordre que private.community_stat_keys().
  SELECT ARRAY[
    15, 15, 15, 15, 15, 15, 15, 15, -- competences
    50, 50,                         -- sante, forme
    10, 5,                          -- etat max, vitesse
    5, 5, 5,                        -- degats races, score de toucher, soin equipe
    5, 5, 5, 5, 5                   -- degats et critiques CaC / tir
  ]::DOUBLE PRECISION[];
$$;

-- Publications les plus proches d'un vecteur de stats, hors publications de
-- l'appelant et hors p_exclude_ids.
CREATE OR REPLACE FUNCTION private.community_similar_to_vec(
  p_vec DOUBLE PRECISION[],
  p_exclude_ids UUID[],
  p_game_version TEXT,
  p_limit INTEGER
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH version AS (
    SELECT CASE
      WHEN p_game_version = '*' THEN NULL
      ELSE coalesce(p_game_version, private.current_game_version())
    END AS code
  ),
  pool AS (
    SELECT c.publication_id, c.stat_vec, cb.author_id
    FROM public.community_build_content c
    JOIN public.community_build cb ON cb.id = c.publication_id
    CROSS JOIN version v
    WHERE v.code IS NULL OR cb.game_version = v.code
  ),
  floors AS (
    SELECT f.value AS floor_value, f.ord::INTEGER AS dim
    FROM unnest(private.community_stat_scale_floors()) WITH ORDINALITY AS f(value, ord)
  ),
  dims AS (
    SELECT
      fl.dim,
      avg(p.stat_vec[fl.dim]) AS mu,
      greatest(coalesce(stddev_pop(p.stat_vec[fl.dim]), 0), fl.floor_value) AS sigma
    FROM pool p
    CROSS JOIN floors fl
    GROUP BY fl.dim, fl.floor_value
  ),
  scored AS (
    SELECT
      p.publication_id,
      sum(
        ((p.stat_vec[d.dim] - d.mu) / d.sigma)
        * ((p_vec[d.dim] - d.mu) / d.sigma)
      ) AS dot,
      sqrt(sum(power((p.stat_vec[d.dim] - d.mu) / d.sigma, 2))) AS pool_norm,
      sqrt(sum(power((p_vec[d.dim] - d.mu) / d.sigma, 2))) AS target_norm
    FROM pool p
    CROSS JOIN dims d
    WHERE p.author_id <> auth.uid()
      AND NOT (p.publication_id = ANY (coalesce(p_exclude_ids, '{}'::UUID[])))
    GROUP BY p.publication_id
  )
  SELECT
    s.publication_id,
    CASE
      WHEN s.pool_norm = 0 OR s.target_norm = 0 THEN 0
      ELSE s.dot / (s.pool_norm * s.target_norm)
    END AS similarity
  FROM scored s
  WHERE p_vec IS NOT NULL
    AND array_length(p_vec, 1) = 20
  ORDER BY similarity DESC, s.publication_id
  LIMIT least(greatest(coalesce(p_limit, 12), 1), 50);
$$;

-- « Builds proches du mien » : p_stats = stats calculees du build de l'atelier.
CREATE OR REPLACE FUNCTION public.community_similar(
  p_stats JSONB,
  p_exclude_ids UUID[] DEFAULT NULL,
  p_game_version TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT s.publication_id, s.similarity
  FROM private.community_similar_to_vec(
    private.community_stats_to_vec(private.community_validate_stats(p_stats)),
    p_exclude_ids,
    p_game_version,
    p_limit
  ) s;
$$;

-- « Pour vous » : centroide des publications de l'appelant, de ses favoris et
-- des builds qu'il a notes 4 etoiles ou plus. Vide sans signal (l'API se
-- rabat alors sur le tri Tendance).
CREATE OR REPLACE FUNCTION public.community_for_you(
  p_limit INTEGER DEFAULT 12
)
RETURNS TABLE (publication_id UUID, similarity DOUBLE PRECISION)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  WITH signals AS (
    SELECT c.publication_id, c.stat_vec
    FROM public.community_build_content c
    WHERE c.author_id = auth.uid()
    UNION
    SELECT c.publication_id, c.stat_vec
    FROM public.community_favorite f
    JOIN public.community_build_content c ON c.publication_id = f.publication_id
    WHERE f.user_id = auth.uid()
    UNION
    SELECT c.publication_id, c.stat_vec
    FROM public.community_review r
    JOIN public.community_build_content c ON c.publication_id = r.publication_id
    WHERE r.reviewer_id = auth.uid()
      AND r.stars >= 4
  ),
  centroid AS (
    SELECT array_agg(x.mean ORDER BY x.dim) AS vec
    FROM (
      SELECT d.dim, avg(s.stat_vec[d.dim]) AS mean
      FROM signals s
      CROSS JOIN generate_series(1, 20) AS d(dim)
      GROUP BY d.dim
    ) x
  )
  SELECT s.publication_id, s.similarity
  FROM centroid ce
  CROSS JOIN LATERAL private.community_similar_to_vec(
    ce.vec,
    (SELECT array_agg(sg.publication_id) FROM signals sg),
    NULL,
    p_limit
  ) s
  WHERE ce.vec IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION private.community_stat_scale_floors() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.community_similar_to_vec(DOUBLE PRECISION[], UUID[], TEXT, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.community_stat_scale_floors() TO authenticated;
GRANT EXECUTE ON FUNCTION private.community_similar_to_vec(DOUBLE PRECISION[], UUID[], TEXT, INTEGER) TO authenticated;

REVOKE ALL ON FUNCTION public.community_similar(JSONB, UUID[], TEXT, INTEGER) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.community_for_you(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.community_similar(JSONB, UUID[], TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.community_for_you(INTEGER) TO authenticated;

COMMIT;

-- =============================================================================
-- 032_index_community_content_author.sql
-- =============================================================================

-- Index de la cle etrangere author_id de community_build_content : utilisee
-- par la policy de lecture (auteur) et par community_for_you (signaux).
-- Signale par l'advisor Supabase "unindexed_foreign_keys".
BEGIN;

CREATE INDEX IF NOT EXISTS idx_community_build_content_author
  ON community_build_content(author_id);

COMMIT;

-- =============================================================================
-- 033_optimize_legacy_rls.sql
-- =============================================================================

-- Performance des policies anterieures a la Communaute : auth.uid() et
-- auth.jwt() sont evalues une seule fois par requete via (SELECT ...) au lieu
-- d'une fois par ligne. Memes noms, roles et regles d'acces.
-- Ajoute aussi les index des cles etrangeres de subscription.
-- Signales par les advisors Supabase "auth_rls_initplan" et
-- "unindexed_foreign_keys".
BEGIN;

ALTER POLICY "Allow user read own builds" ON build
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user update own builds" ON build
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user upsert own builds" ON build
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow user read own subscriptions" ON subscription
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY "Allow admin validate subscriptions" ON subscription
  USING (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

ALTER POLICY "Allow read subscription_plan to authenticated users" ON subscription_plan
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_subscription_plan_code ON subscription(plan_code);
CREATE INDEX IF NOT EXISTS idx_subscription_validated_by ON subscription(validated_by);

COMMIT;

-- =============================================================================
-- 034_unique_stat_modifiers.sql
-- =============================================================================

-- Unicite des modificateurs de stats : (item_id, property) pour item_effect et
-- item_prerequisite, (kit_id, property) pour kit_effect, (drug_id, property)
-- pour stat_modifier.
-- Sans cle naturelle, le ON CONFLICT DO NOTHING des seeds ne se declenchait
-- jamais (seule la PK UUID generee etait unique) : chaque re-execution d'un
-- seed dupliquait ses lignes. Le seed des armes (010) passe deux fois le
-- 2026-03-08 a double 59 effets et 86 prerequis, et le simulateur
-- additionnait les effets en double.
-- Supprime les doublons (garde la ligne la plus ancienne, echoue si deux copies
-- ont des valeurs differentes) puis ajoute les contraintes. Rejouable.
BEGIN;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM item_effect GROUP BY item_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM item_prerequisite GROUP BY item_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM kit_effect GROUP BY kit_id, property HAVING count(DISTINCT value) > 1)
    OR EXISTS (SELECT 1 FROM stat_modifier GROUP BY drug_id, property HAVING count(DISTINCT value) > 1)
  THEN
    RAISE EXCEPTION 'Doublons avec des valeurs differentes : choisir la bonne valeur a la main avant cette migration';
  END IF;
END $$;

DELETE FROM item_effect t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY item_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM item_effect
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM item_prerequisite t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY item_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM item_prerequisite
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM kit_effect t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY kit_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM kit_effect
) d
WHERE t.id = d.id AND d.rn > 1;

DELETE FROM stat_modifier t
USING (
  SELECT id, row_number() OVER (
    PARTITION BY drug_id, property ORDER BY created_at NULLS LAST, id
  ) AS rn
  FROM stat_modifier
) d
WHERE t.id = d.id AND d.rn > 1;

-- Memes noms que les UNIQUE des schemas 003, 011, 012 et 014 (nom par defaut
-- de Postgres), pour qu'une base neuve et une base migree convergent.
ALTER TABLE item_effect DROP CONSTRAINT IF EXISTS item_effect_item_id_property_key;
ALTER TABLE item_effect
  ADD CONSTRAINT item_effect_item_id_property_key UNIQUE (item_id, property);

ALTER TABLE item_prerequisite DROP CONSTRAINT IF EXISTS item_prerequisite_item_id_property_key;
ALTER TABLE item_prerequisite
  ADD CONSTRAINT item_prerequisite_item_id_property_key UNIQUE (item_id, property);

ALTER TABLE kit_effect DROP CONSTRAINT IF EXISTS kit_effect_kit_id_property_key;
ALTER TABLE kit_effect
  ADD CONSTRAINT kit_effect_kit_id_property_key UNIQUE (kit_id, property);

ALTER TABLE stat_modifier DROP CONSTRAINT IF EXISTS stat_modifier_drug_id_property_key;
ALTER TABLE stat_modifier
  ADD CONSTRAINT stat_modifier_drug_id_property_key UNIQUE (drug_id, property);

COMMIT;

-- =============================================================================
-- 035_build_delete_policy.sql
-- =============================================================================

-- Suppression d'un build par son proprietaire (bouton de l'atelier, via
-- DELETE /api/builds). Les slots suivants remontent d'un rang : ils sont
-- derives de l'ordre de creation.
-- En cascade : les liens de partage du build (shared_build) sont supprimes ;
-- une publication Communaute garde son contenu, source_build_id passe a NULL.
BEGIN;

CREATE POLICY "Allow user delete own builds" ON build
  FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

COMMIT;

-- =============================================================================
-- 036_table_title.sql
-- =============================================================================

-- Titres du jeu (debloques par le personnage). Un titre ne donne aucune stat :
-- il sert de prerequis a des equipements et des kits (037).
-- Table vide a la creation : les titres seront ajoutes par seed.
BEGIN;

CREATE TABLE IF NOT EXISTS title (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Politique de sécurité (RLS)
ALTER TABLE title ENABLE ROW LEVEL SECURITY;

-- Lecture publique, comme les autres catalogues (item, kit, implant)
CREATE POLICY "Allow read title to authenticated users" ON title
  FOR SELECT
  USING (true);

COMMIT;

-- =============================================================================
-- 037_table_prerequisites.sql
-- =============================================================================

-- Prerequis complets des equipements et des kits. Un prerequis est :
-- - une stat minimum (item_prerequisite existant, kit_prerequisite) ;
-- - un titre debloque (*_prerequisite_title) ;
-- - un implant installe, au moins un niveau (*_prerequisite_implant).
-- Tables additives : item_prerequisite et les seeds existants ne changent pas.
-- Requiert 036_table_title.sql.
BEGIN;

-- Equipements : titre debloque
CREATE TABLE IF NOT EXISTS item_prerequisite_title (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL REFERENCES title(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, title_id)
);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_title_title_id
  ON item_prerequisite_title(title_id);

-- Equipements : implant installe
CREATE TABLE IF NOT EXISTS item_prerequisite_implant (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, implant_id)
);
CREATE INDEX IF NOT EXISTS idx_item_prerequisite_implant_implant_id
  ON item_prerequisite_implant(implant_id);

-- Kits : stat minimum (calque de item_prerequisite)
CREATE TABLE IF NOT EXISTS kit_prerequisite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  property stat_property NOT NULL,
  value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT kit_prerequisite_valid_value CHECK (value > 0),
  CONSTRAINT kit_prerequisite_kit_id_property_key UNIQUE (kit_id, property)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_property
  ON kit_prerequisite(property);

-- Kits : titre debloque
CREATE TABLE IF NOT EXISTS kit_prerequisite_title (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  title_id TEXT NOT NULL REFERENCES title(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, title_id)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_title_title_id
  ON kit_prerequisite_title(title_id);

-- Kits : implant installe
CREATE TABLE IF NOT EXISTS kit_prerequisite_implant (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  implant_id INTEGER NOT NULL REFERENCES implant(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, implant_id)
);
CREATE INDEX IF NOT EXISTS idx_kit_prerequisite_implant_implant_id
  ON kit_prerequisite_implant(implant_id);

-- Politique de sécurité (RLS) : lecture publique, comme item_prerequisite
ALTER TABLE item_prerequisite_title ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prerequisite_implant ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_title ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_implant ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read item_prerequisite_title" ON item_prerequisite_title
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read item_prerequisite_implant" ON item_prerequisite_implant
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite" ON kit_prerequisite
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_title" ON kit_prerequisite_title
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_implant" ON kit_prerequisite_implant
  FOR SELECT
  USING (true);

COMMIT;

-- =============================================================================
-- 038_table_race_prerequisites.sql
-- =============================================================================

-- Prerequis de race des equipements et des kits (ex. les kits a son nom
-- sont exclusifs a une race). Plusieurs lignes pour un meme element se
-- lisent "une de ces races" : ce prerequis est rempli par l'une d'elles.
-- Requiert 037_table_prerequisites.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS item_prerequisite_race (
  item_id TEXT NOT NULL REFERENCES item(id) ON DELETE CASCADE,
  race race_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, race)
);

CREATE TABLE IF NOT EXISTS kit_prerequisite_race (
  kit_id TEXT NOT NULL REFERENCES kit(id) ON DELETE CASCADE,
  race race_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (kit_id, race)
);

-- Politique de sécurité (RLS) : lecture publique, comme les autres prerequis
ALTER TABLE item_prerequisite_race ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_prerequisite_race ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read item_prerequisite_race" ON item_prerequisite_race
  FOR SELECT
  USING (true);
CREATE POLICY "Allow read kit_prerequisite_race" ON kit_prerequisite_race
  FOR SELECT
  USING (true);

COMMIT;

-- =============================================================================
-- 039_rpc_community_preview.sql
-- =============================================================================

-- Apercu public d'une publication de la Communaute : un lien de partage
-- /communaute/:id s'ouvre aussi pour un visiteur non connecte.
--
-- SECURITY DEFINER : community_build et user_profile ne sont pas lisibles par
-- anon. Seules les metadonnees de l'apercu non-abonne sont renvoyees : ni
-- author_id, ni contenu (snapshot, stats completes), ni avis.
--
-- Additif : a appliquer AVANT le deploiement de l'API qui l'appelle.
BEGIN;

CREATE OR REPLACE FUNCTION public.community_get_preview(p_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  specialization TEXT,
  detected_specialization TEXT,
  game_version TEXT,
  race public.race_type,
  gender TEXT,
  weapon_types public.item_type[],
  has_heal_weapon BOOLEAN,
  key_stats JSONB,
  rating_count INTEGER,
  rating_avg NUMERIC,
  published_at TIMESTAMPTZ,
  content_updated_at TIMESTAMPTZ,
  author_pseudo TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    cb.id,
    cb.title,
    cb.description,
    cb.specialization,
    cb.detected_specialization,
    cb.game_version,
    cb.race,
    cb.gender,
    cb.weapon_types,
    cb.has_heal_weapon,
    cb.key_stats,
    cb.rating_count,
    cb.rating_avg,
    cb.published_at,
    cb.content_updated_at,
    up.pseudo
  FROM public.community_build cb
  JOIN public.user_profile up ON up.user_id = cb.author_id
  WHERE cb.id = p_id;
$$;

REVOKE ALL ON FUNCTION public.community_get_preview(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.community_get_preview(UUID) TO anon, authenticated;

COMMIT;

-- =============================================================================
-- 040_drop_shared_build.sql
-- =============================================================================

-- Suppression des liens de partage /shared/:id : le partage passe par les
-- publications de la Communaute (/communaute/:id, apercu public via 039).
--
-- Destructif : a appliquer APRES le deploiement de l'API qui ne sert plus
-- /api/shared, et apres une sauvegarde des donnees.
BEGIN;

DROP FUNCTION IF EXISTS public.get_shared_build(UUID);
DROP TABLE IF EXISTS public.shared_build;

COMMIT;
