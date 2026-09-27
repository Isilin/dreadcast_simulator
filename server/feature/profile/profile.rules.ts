/** Same rule as the valid_user_profile_pseudo / reserved constraints (025). */
const PSEUDO_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9_.-]{3,24}$/u;

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
