/**
 * Same rules as lib/community.validation.ts and the user_profile constraints
 * (supabase/schemas/025_table_user_profile.sql).
 */
export const PSEUDO_MIN_LENGTH = 3;
export const PSEUDO_MAX_LENGTH = 24;

const PSEUDO_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9_.-]{3,24}$/u;
const RESERVED_PSEUDOS = [
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

/**
 * Returns a French error message, or null when the pseudo is valid.
 */
export const validatePseudo = (rawPseudo: string): string | null => {
  const pseudo = rawPseudo.trim();

  if (pseudo.length < PSEUDO_MIN_LENGTH || pseudo.length > PSEUDO_MAX_LENGTH) {
    return `Le pseudo doit contenir entre ${PSEUDO_MIN_LENGTH} et ${PSEUDO_MAX_LENGTH} caractères.`;
  }

  if (!PSEUDO_PATTERN.test(pseudo)) {
    return 'Caractères autorisés : lettres, chiffres, « _ », « . » et « - ».';
  }

  const lower = pseudo.toLowerCase();
  if (
    (RESERVED_PSEUDOS as readonly string[]).includes(lower) ||
    RESERVED_PSEUDO_PREFIX.test(lower)
  ) {
    return 'Ce pseudo est réservé.';
  }

  return null;
};
