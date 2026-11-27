import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { makeProfileRepo } from './profile.repo.postgres.js';
import {
  createUser,
  makeTestDb,
  userClaims,
  type TestDb,
} from '../../db/testing/test-db.js';

let testDb: TestDb;
let alice: string;
let bob: string;
let carol: string;

beforeAll(async () => {
  testDb = await makeTestDb({ seed: false });
  alice = await createUser(testDb, 'alice@example.com');
  bob = await createUser(testDb, 'bob@example.com');
  carol = await createUser(testDb, 'carol@example.com');
}, 60_000);

afterAll(() => testDb.close());

const profilesOf = (userId: string) =>
  makeProfileRepo(testDb.db)(userClaims(userId));

describe('profile repository (Postgres)', () => {
  it('creates the pseudo once and reads it back', async () => {
    expect(await profilesOf(alice).pseudo()).toBeNull();
    expect(await profilesOf(alice).createPseudo('Alice')).toBe('Alice');
    expect(await profilesOf(alice).pseudo()).toBe('Alice');

    await expect(profilesOf(alice).createPseudo('Other')).rejects.toMatchObject(
      { code: '23505' },
    );
  });

  it('refuses a pseudo taken by someone else (any case)', async () => {
    await expect(profilesOf(bob).createPseudo('ALICE')).rejects.toMatchObject({
      code: '23505',
    });
  });

  it('refuses an invalid pseudo', async () => {
    await expect(profilesOf(carol).createPseudo('a')).rejects.toMatchObject({
      code: '23514',
    });
  });

  it('reads the pseudos of other users', async () => {
    await profilesOf(bob).createPseudo('Bob');
    const pseudos = await profilesOf(carol).pseudosOf([alice, bob, carol]);
    expect(Object.fromEntries(pseudos)).toEqual({
      [alice]: 'Alice',
      [bob]: 'Bob',
    });
    expect((await profilesOf(carol).pseudosOf([])).size).toBe(0);
  });
});
