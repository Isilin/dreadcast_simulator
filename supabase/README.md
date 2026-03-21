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

-- Table Builds
019_table_build.sql              -- Snapshots de builds utilisateur
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
```

## Statistiques

### Schemas

- **19 fichiers** de schémas SQL
- 3 enums (stat_property, item_type, race_type)
- 14 tables avec indexes et RLS policies

### Seeds

- **17 fichiers** de seeds SQL
- 13 drogues + modificateurs
- 11 races
- 30 implants + ~200 valeurs par niveau
- **405 items** au total (head: 58, chest: 94, legs: 58, feet: 33, secondary: 57, weapons: 105)
- **200 kits** au total (32 par catégorie × 5 + 40 weapons)

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

Toutes les tables incluent `created_at` et `updated_at` avec gestion automatique via trigger.

### Indexes

Indexes optimisés sur :

- Clés étrangères
- Colonnes de recherche fréquentes (type, tech, etc.)
- Colonnes de tri- Unique constraints pour éviter les doublons

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
