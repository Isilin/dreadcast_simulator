import { z } from 'zod';

/**
 * Canonical stat order. Must stay identical to src/domain/stats.ts, the
 * stat_property enum and private.community_stat_keys() (parity-tested).
 */
export const STAT_KEYS = [
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
  'criticalHitDamage',
] as const;

export const SPECIALIZATION_CODES = [
  'medecin',
  'informaticien',
  'ingenieur',
  'combattant_cac',
  'tireur',
  'furtif',
  'tank',
  'soutien',
  'polyvalent',
] as const;

export const COMMUNITY_SORTS = [
  'trending',
  'top',
  'recent',
  'most_reviewed',
  'updated',
] as const;

export const RACE_TYPES = [
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
  'Androide',
] as const;

export const WEAPON_ITEM_TYPES = [
  '1handShot',
  '2handsShot',
  '1handMelee',
  '2handsMelee',
] as const;

/** Sanity bounds only: stats are computed client-side. */
export const STAT_MIN = -1000;
export const STAT_MAX = 10000;

export const TITLE_MIN_LENGTH = 3;
export const TITLE_MAX_LENGTH = 64;
export const DESCRIPTION_MAX_LENGTH = 1000;
export const REVIEW_BODY_MAX_LENGTH = 280;

export const SEARCH_PAGE_SIZE_DEFAULT = 24;
export const SEARCH_PAGE_SIZE_MAX = 48;

/** Same rule as the valid_user_profile_pseudo / reserved constraints (025). */
export const PSEUDO_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9_.-]{3,24}$/u;
export const RESERVED_PSEUDOS = [
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
  'système',
] as const;
const RESERVED_PSEUDO_PREFIX = /^(admin|mod[eé]rat)/u;

export const isPseudoValid = (pseudo: string): boolean => {
  const lower = pseudo.toLowerCase();
  return (
    PSEUDO_PATTERN.test(pseudo) &&
    !(RESERVED_PSEUDOS as readonly string[]).includes(lower) &&
    !RESERVED_PSEUDO_PREFIX.test(lower)
  );
};

// z.number() rejects NaN and Infinity in zod 4.
const statValueSchema = z.number().min(STAT_MIN).max(STAT_MAX);

export const statsSchema = z
  .object(
    Object.fromEntries(STAT_KEYS.map((key) => [key, statValueSchema])) as {
      [K in (typeof STAT_KEYS)[number]]: typeof statValueSchema;
    },
  )
  .strict()
  .transform(
    (stats) =>
      Object.fromEntries(
        Object.entries(stats).map(([key, value]) => [
          key,
          Math.round(value * 100) / 100,
        ]),
      ) as Record<(typeof STAT_KEYS)[number], number>,
  );

const titleSchema = z
  .string()
  .trim()
  .min(TITLE_MIN_LENGTH)
  .max(TITLE_MAX_LENGTH);

const descriptionSchema = z
  .string()
  .trim()
  .max(DESCRIPTION_MAX_LENGTH)
  .nullish()
  .transform((value) => (value ? value : null));

const specializationSchema = z.enum(SPECIALIZATION_CODES);

export const publishPayloadSchema = z.object({
  slot: z.coerce.number().int().min(1),
  title: titleSchema,
  description: descriptionSchema,
  specialization: specializationSchema,
  detected_specialization: specializationSchema,
  stats: statsSchema,
});

export const updatePayloadSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    specialization: specializationSchema,
    refresh: z.boolean().default(false),
    detected_specialization: specializationSchema.optional(),
    stats: statsSchema.optional(),
  })
  .refine(
    (payload) =>
      !payload.refresh ||
      (payload.stats !== undefined &&
        payload.detected_specialization !== undefined),
    { message: 'Stats et specialisation detectee requises.' },
  );

export const reviewPayloadSchema = z.object({
  stars: z.number().int().min(1).max(5),
  body: z
    .string()
    .trim()
    .max(REVIEW_BODY_MAX_LENGTH)
    .nullish()
    .transform((value) => (value ? value : null)),
});

export const pseudoPayloadSchema = z.object({
  pseudo: z
    .string()
    .trim()
    .refine(isPseudoValid, { message: 'Pseudo invalide.' }),
});

export const similarPayloadSchema = z.object({
  stats: statsSchema,
  exclude_ids: z.array(z.uuid()).max(50).optional(),
  version: z.string().max(16).optional(),
  limit: z.number().int().min(1).max(24).optional(),
});

const csv = <T extends z.ZodType<string, string>>(item: T) =>
  z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(',')
            .map((entry) => entry.trim())
            .filter((entry) => entry.length > 0)
        : [],
    )
    .pipe(z.array(item).max(30));

const flag = z
  .string()
  .optional()
  .transform((value) => value === '1' || value === 'true');

const statMinSchema = z
  .string()
  .optional()
  .transform((value, context) => {
    if (!value) return {} as Record<string, number>;

    const entries: Array<[string, number]> = [];
    for (const part of value.split(',')) {
      const [key, raw] = part.split(':');
      const threshold = Number(raw);
      if (
        !(STAT_KEYS as readonly string[]).includes(key) ||
        !Number.isFinite(threshold)
      ) {
        context.addIssue({
          code: 'custom',
          message: 'Seuil de stat invalide.',
        });
        return z.NEVER;
      }
      entries.push([key, threshold]);
    }

    return Object.fromEntries(entries);
  });

export const searchQuerySchema = z.object({
  q: z.string().trim().max(64).optional(),
  spec: csv(specializationSchema),
  minRating: z.coerce.number().min(1).max(5).optional(),
  race: csv(z.enum(RACE_TYPES)),
  gender: csv(z.enum(['male', 'female'])),
  weapon: csv(z.enum(WEAPON_ITEM_TYPES)),
  heal: flag,
  version: z.string().trim().max(16).optional(),
  minStats: statMinSchema,
  implants: csv(z.string().max(64)),
  drugs: csv(z.string().max(32)),
  items: csv(z.string().max(32)),
  favorites: flag,
  sort: z.enum(COMMUNITY_SORTS).default('trending'),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(SEARCH_PAGE_SIZE_MAX)
    .default(SEARCH_PAGE_SIZE_DEFAULT),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

/** Filters that require reading the publication content (subscribers). */
export const hasAdvancedFilters = (query: SearchQuery): boolean =>
  Object.keys(query.minStats).length > 0 ||
  query.implants.length > 0 ||
  query.drugs.length > 0 ||
  query.items.length > 0 ||
  query.favorites;
