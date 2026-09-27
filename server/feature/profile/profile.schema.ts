import { Schema } from 'effect';

import { isPseudoValid } from './profile.rules.js';

export const Profile = Schema.Struct({
  /** null until the user picks one (definitive). */
  pseudo: Schema.NullOr(Schema.String),
});

export const PseudoPayload = Schema.Struct({
  pseudo: Schema.Trim.check(Schema.makeFilter(isPseudoValid)),
});
