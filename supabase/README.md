# Supabase Database Schema & Seeds

Ce répertoire contient tous les schémas et seeds pour la base de données Dreadcast Simulator.

## Structure

```text
supabase/
├── schemas/     # Définitions des types, tables, indexes et RLS policies
└── seeds/       # Données initiales pour peupler la DB
```

## Ordre d'exécution

### 1. Schemas (dans l'ordre numérique)

Les schémas doivent être exécutés dans l'ordre pour respecter les dépendances :

```sql
-- Enums
001_enum_stat_property.sql       -- Propriétés de stats (strength, agility, etc.)
004_enum_item_type.sql           -- Types d'items (head, chest, weapons, etc.)
005_enum_race_type.sql           -- Types de races (Humain, Elfe, Orc, etc.)

-- Tables Drug (existantes)
002_table_drug.sql               -- Table des drogues
003_table_stat_modifier.sql      -- Modificateurs de stats pour drogues

-- Tables Race
006_table_race.sql               -- Table des races avec stats de base

-- Tables Implant
007_table_implant.sql            -- Table des implants
008_table_implant_attribute.sql  -- Attributs des implants (many-to-many)
009_table_implant_value.sql      -- Valeurs par niveau des implants

-- Tables Item
010_table_item.sql               -- Table des items (équipements et armes)
011_table_item_prerequisite.sql  -- Prérequis des items
012_table_item_effect.sql        -- Effets des items sur les stats

-- Tables Kit
013_table_kit.sql                -- Table des kits
014_table_kit_effect.sql         -- Effets des kits sur les stats

-- Tables Abonnement
015_table_subscription.sql       -- Abonnements utilisateur relies a auth.users
016_table_subscription_plan.sql  -- Plans abonnement dynamiques
017_subscription_plan_fk.sql     -- Cle etrangere subscription.plan_code -> subscription_plan.code
018_alter_subscription_status.sql -- Statut abonnement (pending/validated)

-- Armes de soin
018_alter_table_item_add_heal_range.sql -- Colonnes min_heal / max_heal (requis par 029)

-- Table Builds
019_table_build.sql              -- Snapshots de builds utilisateur
020_table_shared_build.sql       -- Liens de partage publics

-- Securite (P0)
021_private_helpers.sql          -- Schema private : has_active_subscription, owns_build...
022_fix_subscription_insert.sql  -- Insertion abonnement forcee en pending + prix/dates recalcules
023a_harden_shared_build.sql     -- Partages : user_id, policies proprietaire, RPC get_shared_build
023b_drop_legacy_shared_policies.sql -- APRES deploiement de l'API : retire les policies permissives

-- Communaute
024_table_game_version.sql       -- Versions du jeu (v15 courante)
025_table_user_profile.sql       -- Pseudo de compte (definitif)
026_table_community_build.sql    -- Publications (metadonnees + contenu reserve abonnes)
027_table_community_review.sql   -- Notes et avis
028_table_community_favorite.sql -- Favoris
029_rpc_community_write.sql      -- RPC community_publish / community_update_publication
030_rpc_community_search.sql     -- RPC community_search (filtres, tris, pagination)
031_rpc_community_similar.sql    -- RPC community_similar / community_for_you
032_index_community_content_author.sql -- Index de community_build_content.author_id

-- Performance
033_optimize_legacy_rls.sql      -- Policies build/subscription : (SELECT auth.uid()) + index FK subscription

-- Integrite
034_unique_stat_modifiers.sql    -- Dedoublonne effets/prerequis/modificateurs + UNIQUE (<owner>_id, property)

-- Builds
035_build_delete_policy.sql      -- Suppression d'un build par son proprietaire

-- Prerequis
036_table_title.sql              -- Titres du jeu (prerequis, sans stats)
037_table_prerequisites.sql      -- Prerequis titre/implant des items, prerequis stat/titre/implant des kits
038_table_race_prerequisites.sql -- Prerequis de race des items et des kits (une des races listees)
```

### Procedure d'application en production

Chaque script 021+ est transactionnel (`BEGIN; ... COMMIT;`) et possede un
script d'annulation dans `rollbacks/` (meme nom, suffixe `.rollback.sql`).

1. Sauvegarder la base avant chaque lot (le dossier `backups/` est ignore
   par git) :

   ```bash
   supabase db dump --db-url "$SUPABASE_DB_URL" -f backups/<date>_schema.sql
   supabase db dump --db-url "$SUPABASE_DB_URL" --data-only -f backups/<date>_data.sql
   ```

2. Prerequis : `018_alter_table_item_add_heal_range` (colonnes nullables,
   sans risque). L'API lit desormais `min_heal`/`max_heal` : `/api/items`
   echoue si ces colonnes manquent.
3. Lot P0 : `021`, `022`, `023a`, puis deploiement de l'API (lecture des
   partages via `get_shared_build`), puis `023b`. Lancer ensuite la requete
   d'audit en fin de `022` (les validations faites a la main dans l'editeur
   SQL ont `validated_by` vide : les verifier, pas les supprimer).
4. Lot Communaute : `024` a `032` dans l'ordre, puis deploiement de l'API et
   du front. `024` declare `v15` comme version courante : l'ajuster si la
   Communaute ouvre avant le passage des donnees en v15.
5. Lot Integrite : `034` supprime les doublons d'effets et de prerequis laisses
   par une double execution des seeds, puis ajoute les contraintes d'unicite
   qui rendent les seeds rejouables (`ON CONFLICT (<owner>_id, property)`).
6. Lot Prerequis : `036`, `037` puis `038` (+ seed `020`), **avant** le
   deploiement de l'API (`/api/items` et `/api/kits` embarquent les nouvelles
   tables et echouent si elles manquent).
7. Verifier les advisors Supabase (securite et performance).
8. En cas de probleme : executer les rollbacks en ordre inverse.

Ces scripts ont ete valides sur une base Supabase locale (schemas 001-020 +
seeds, puis 021-031, puis rollbacks et re-application) avec des tests RLS
simulant `anon` et `authenticated`.

### Maintenance Communaute (pas de moderation integree)

```sql
-- Supprimer un avis
DELETE FROM community_review WHERE id = '<review_id>';

-- Depublier une publication
DELETE FROM community_build WHERE id = '<publication_id>';

-- Corriger un pseudo (definitif cote utilisateur)
UPDATE user_profile SET pseudo = '<nouveau>' WHERE user_id = '<user_id>';

-- Passer a une nouvelle version du jeu
UPDATE game_version SET is_current = false WHERE is_current;
INSERT INTO game_version (code, label, released_at, is_current)
VALUES ('v16', 'Version 16', CURRENT_DATE, true);
```

### 2. Seeds (dans l'ordre numérique)

Les seeds peuvent être exécutés après les schémas :

```sql
-- Drugs (existant)
001_seed_drugs.sql               -- 13 drogues avec leurs modificateurs

-- Races
002_seed_races.sql               -- 11 races avec leurs stats de base

-- Implants
003_seed_implants.sql            -- 30 implants avec leurs attributs
004_seed_implants_values.sql     -- Valeurs progressives (niveaux 1-10)

-- Items par catégorie
005_seed_items_head.sql          -- 58 items de tête
006_seed_items_chest.sql         -- 94 items de torse
007_seed_items_legs.sql          -- 58 items de jambes
008_seed_items_feet.sql          -- 33 items de pieds
009_seed_items_secondary.sql     -- 57 items secondaires
010_seed_items_weapons.sql       -- 105 armes

-- Kits par catégorie
011_seed_kits_head.sql           -- 32 kits de tête
012_seed_kits_chest.sql          -- 32 kits de torse
013_seed_kits_legs.sql           -- 32 kits de jambes
014_seed_kits_feet.sql           -- 32 kits de pieds
015_seed_kits_secondary.sql      -- 32 kits secondaires
016_seed_kits_weapons.sql        -- 40 kits d'armes

-- Plans d'abonnement
017_seed_subscription_plans.sql  -- Plans d'abonnement dynamiques

-- MaJ v15
018_seed_v15.sql                -- 1 arme de soin + 20 kits + ajustements v15

-- Prerequis
020_seed_kit_race_prerequisites.sql -- Kits exclusifs a une race (requiert 038)

-- Correctifs de données
019_fix_item_images.sql          -- Images d'items manquantes (bases existantes)
```

## Statistiques

### Schemas

- **19 fichiers** de schémas SQL
- 3 enums (stat_property, item_type, race_type)
- 14 tables avec indexes et RLS policies

### Seeds

- **19 fichiers** de seeds SQL
- 13 drogues + modificateurs
- 11 races
- 30 implants + ~200 valeurs par niveau
- **406 items** au total (head: 58, chest: 94, legs: 58, feet: 33, secondary: 57, weapons: 106)
- **210 kits** au total (head: 34, chest: 34, legs: 34, feet: 34, secondary: 34, weapons: 40)

## Génération automatique

Les seeds pour items et kits ont été générés automatiquement à partir des mocks TypeScript :

```bash
node scripts/generate-sql-seeds.mjs
```

Le script parse les fichiers `*.mock.ts` et génère les fichiers SQL correspondants avec :

- Insertion des entités principales (items/kits)
- Insertion des relations (prerequisites, effects)
- Gestion de l'idempotence (`ON CONFLICT DO NOTHING`)
- Échappement SQL correct des apostrophes

## Fonctionnalités SQL

### RLS (Row Level Security)

Toutes les tables incluent des policies RLS pour sécuriser l'accès aux données.

### Timestamps

Toutes les tables incluent `created_at` et `updated_at`. Seules les tables de
la Communaute (`community_build`, `community_review`) mettent `updated_at` a
jour automatiquement via le trigger `private.set_updated_at()`.

### Indexes

Indexes optimisés sur :

- Clés étrangères
- Colonnes de recherche fréquentes (type, tech, etc.)
- Colonnes de tri
- Contraintes d'unicité pour éviter les doublons

## Utilisation avec Supabase

1. Créer un nouveau projet Supabase
2. Exécuter les schemas dans l'ordre via SQL Editor
3. Exécuter les seeds dans l'ordre
4. Vérifier que les RLS policies sont actives

## Notes

- Les IDs sont des strings (UUIDs pour futurs usages)
- Les valeurs de stats peuvent être négatives (malus)
- Les images pointent vers `/assets/items/*.webp` (chemins locaux)
- Les drogues, races et implants n'ont pas d'images dans les seeds actuels
