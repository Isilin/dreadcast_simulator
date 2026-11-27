import { defineConfig } from 'drizzle-kit';

// yarn db:generate --name <change>: writes the next migration of
// server/db/migrations from the changes of schema.ts (offline). Policies and
// SQL functions are written by hand in the generated file.
export default defineConfig({
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  schemaFilter: ['public', 'auth'],
});
