import { describe, expect, it } from 'vitest';

import { validatePseudo } from './account.rules';
import {
  isPseudoValid,
  RESERVED_PSEUDOS,
} from '../../../../lib/community.validation';

describe('validatePseudo', () => {
  it('accepts letters, accents, digits and _ . -', () => {
    expect(validatePseudo('Néo_Kobold-42')).toBeNull();
    expect(validatePseudo('  Zoé.v2  ')).toBeNull();
  });

  it('rejects lengths outside 3 to 24 characters', () => {
    expect(validatePseudo('ab')).not.toBeNull();
    expect(validatePseudo('a'.repeat(25))).not.toBeNull();
  });

  it('rejects spaces and symbols', () => {
    expect(validatePseudo('Jean Dupont')).not.toBeNull();
    expect(validatePseudo('<script>')).not.toBeNull();
  });

  it('rejects reserved names and prefixes', () => {
    expect(validatePseudo('Admin')).not.toBeNull();
    expect(validatePseudo('administrateur2')).not.toBeNull();
    expect(validatePseudo('Modérateur')).not.toBeNull();
  });

  it('matches the API validation', () => {
    const samples = [
      'Néo_Kobold-42',
      'ab',
      'Jean Dupont',
      'modo',
      'Moderatrice',
      ...RESERVED_PSEUDOS,
    ];

    samples.forEach((pseudo) => {
      expect(validatePseudo(pseudo) === null).toBe(isPseudoValid(pseudo));
    });
  });
});
