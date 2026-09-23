import type {
  PublishBuildPayload,
  Specialization,
  UpdatePublicationPayload,
} from './community.types';

import { StatValues, type Stat } from '@/domain';

/** Same limits as lib/community.validation.ts and the SQL constraints. */
export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 64;
export const DESCRIPTION_MAX_LENGTH = 1000;
export const REVIEW_BODY_MAX_LENGTH = 280;

const STAT_KEYS = Object.keys(StatValues) as Stat[];

/**
 * All 20 stats, rounded to 2 decimals (implant values are decimals).
 */
export const roundStats = (
  stats: Partial<Record<Stat, number>>,
): Record<Stat, number> =>
  Object.fromEntries(
    STAT_KEYS.map((stat) => [
      stat,
      Math.round((Number.isFinite(stats[stat]) ? stats[stat]! : 0) * 100) / 100,
    ]),
  ) as Record<Stat, number>;

export const validatePublicationTitle = (title: string): string | null => {
  const length = title.trim().length;
  if (length < TITLE_MIN_LENGTH || length > TITLE_MAX_LENGTH) {
    return `Le titre doit contenir entre ${TITLE_MIN_LENGTH} et ${TITLE_MAX_LENGTH} caractères.`;
  }
  return null;
};

export const validatePublicationDescription = (
  description: string,
): string | null =>
  description.trim().length > DESCRIPTION_MAX_LENGTH
    ? `La description ne doit pas dépasser ${DESCRIPTION_MAX_LENGTH} caractères.`
    : null;

const normalizeDescription = (description: string): string | null =>
  description.trim() || null;

interface PublicationFormInput {
  title: string;
  description: string;
  specialization: Specialization;
  detectedSpecialization: Specialization;
  stats: Partial<Record<Stat, number>>;
}

export const buildPublishPayload = (
  slot: string,
  input: PublicationFormInput,
): PublishBuildPayload => ({
  slot,
  title: input.title.trim(),
  description: normalizeDescription(input.description),
  specialization: input.specialization,
  detectedSpecialization: input.detectedSpecialization,
  stats: roundStats(input.stats),
});

/**
 * "Mettre à jour la publication": metadata plus a fresh copy of the build.
 */
export const buildRefreshPayload = (
  input: PublicationFormInput,
): UpdatePublicationPayload => ({
  title: input.title.trim(),
  description: normalizeDescription(input.description),
  specialization: input.specialization,
  refresh: true,
  detectedSpecialization: input.detectedSpecialization,
  stats: roundStats(input.stats),
});
