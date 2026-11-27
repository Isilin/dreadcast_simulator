/** Profiles, read and written under one user's session. */
export interface ProfileRepo {
  /** Pseudo of the current user, null until chosen. */
  readonly pseudo: () => Promise<string | null>;
  /** Pseudo of each given user that has one. */
  readonly pseudosOf: (
    userIds: ReadonlyArray<string>,
  ) => Promise<ReadonlyMap<string, string>>;
  /** Fails with 23505 (already set or taken) or 23514 (invalid). */
  readonly createPseudo: (pseudo: string) => Promise<string>;
}
