-- Correctif : images d'items manquantes sur les bases déjà peuplées.
-- Les seeds d'items utilisent ON CONFLICT DO NOTHING : corriger 009 ne met
-- pas à jour une base existante. Idempotent.

BEGIN;

UPDATE item
SET image = '/assets/items/Diamant_jaune.webp'
WHERE id = '438' AND image = '/assets/items/';

COMMIT;
