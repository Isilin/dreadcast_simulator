import { describe, expect, it } from 'vitest';

import { readDatabaseConfig } from './config.js';

describe('readDatabaseConfig', () => {
  it('reads DATABASE_URL first, then the Vercel integration URL', () => {
    expect(
      readDatabaseConfig({
        DATABASE_URL: 'postgres://app@db:5432/app',
        SIMULATOR_POSTGRES_URL: 'postgres://other@pooler:6543/postgres',
      }).url,
    ).toBe('postgres://app@db:5432/app');
    expect(
      readDatabaseConfig({
        SIMULATOR_POSTGRES_URL: 'postgres://other@pooler:6543/postgres',
      }).url,
    ).toBe('postgres://other@pooler:6543/postgres');
  });

  it('gives sslmode=require its libpq meaning', () => {
    expect(
      readDatabaseConfig({
        DATABASE_URL:
          'postgres://u:p@pooler:6543/postgres?sslmode=require&supa=x',
      }).url,
    ).toBe(
      'postgres://u:p@pooler:6543/postgres?sslmode=require&supa=x&uselibpqcompat=true',
    );
    expect(
      readDatabaseConfig({
        DATABASE_URL: 'postgres://u@h/db?sslmode=verify-full',
      }).url,
    ).toBe('postgres://u@h/db?sslmode=verify-full');
  });

  it('fails without database URL or with a bad pool size', () => {
    expect(() => readDatabaseConfig({})).toThrow('SIMULATOR_POSTGRES_URL');
    expect(() =>
      readDatabaseConfig({
        DATABASE_URL: 'postgres://h/db',
        DATABASE_POOL_MAX: '0',
      }),
    ).toThrow('DATABASE_POOL_MAX');
  });
});
