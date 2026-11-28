import bcrypt from 'bcryptjs';
import { and, asc, eq, sql } from 'drizzle-orm';
import { randomBytes } from 'node:crypto';

import type { Db } from '../db/client.js';
import { sessionInPrivate, subscription, usersInAuth } from '../db/schema.js';

// Admin tasks of the Supabase dashboard era, for our own Postgres. They run
// as the server's role, outside row level security.

export const USAGE = `Usage: node dist-server/admin.js <command>

  user:create <email>          Creates an account, prints its password
  user:password <email>        New password (printed), signs every session out
  subscription:pending         Lists the subscriptions to validate
  subscription:validate <id>   Validates a pending subscription`;

/** Readable once, given to the user, who keeps it (no password reset yet). */
const newPassword = () => randomBytes(12).toString('base64url');

const hashPassword = (password: string) => bcrypt.hash(password, 10);

const byEmail = (email: string) =>
  sql`lower(${usersInAuth.email}) = lower(${email})`;

const createUser = async (db: Db, email: string) => {
  const password = newPassword();
  const [user] = await db
    .insert(usersInAuth)
    .values({
      email: email.toLowerCase(),
      encrypted_password: await hashPassword(password),
      raw_app_meta_data: { provider: 'email', providers: ['email'] },
    })
    .returning({ id: usersInAuth.id });
  return [`Account ${email} created (${user?.id}).`, `Password: ${password}`];
};

const resetPassword = async (db: Db, email: string) => {
  const password = newPassword();
  const [user] = await db
    .update(usersInAuth)
    .set({
      encrypted_password: await hashPassword(password),
      updated_at: sql`now()`,
    })
    .where(byEmail(email))
    .returning({ id: usersInAuth.id });
  if (!user) {
    throw new Error(`No account ${email}.`);
  }
  await db
    .delete(sessionInPrivate)
    .where(eq(sessionInPrivate.user_id, user.id));
  return [`New password for ${email}: ${password}`, 'Sessions signed out.'];
};

const listPending = async (db: Db) => {
  const rows = await db
    .select({
      id: subscription.id,
      email: usersInAuth.email,
      plan: subscription.plan_name,
      price_cents: subscription.price_cents,
      created_at: subscription.created_at,
    })
    .from(subscription)
    .innerJoin(usersInAuth, eq(usersInAuth.id, subscription.user_id))
    .where(eq(subscription.status, 'pending'))
    .orderBy(asc(subscription.created_at));
  return rows.length === 0
    ? ['No pending subscription.']
    : rows.map(
        (row) =>
          `${row.id}  ${row.email}  ${row.plan}  ${row.price_cents / 100} crédits  ${row.created_at}`,
      );
};

const validate = async (db: Db, id: string) => {
  const [row] = await db
    .update(subscription)
    .set({ status: 'validated', validated_at: sql`now()` })
    .where(and(eq(subscription.id, id), eq(subscription.status, 'pending')))
    .returning({ ends_at: subscription.ends_at });
  if (!row) {
    throw new Error(`No pending subscription ${id}.`);
  }
  return [`Subscription ${id} validated, until ${row.ends_at}.`];
};

/** Runs one command and returns the lines to print; throws on misuse. */
export const runAdminCommand = async (
  db: Db,
  [command, argument]: ReadonlyArray<string>,
): Promise<ReadonlyArray<string>> => {
  switch (command) {
    case 'user:create':
      if (argument) return createUser(db, argument);
      break;
    case 'user:password':
      if (argument) return resetPassword(db, argument);
      break;
    case 'subscription:pending':
      return listPending(db);
    case 'subscription:validate':
      if (argument) return validate(db, argument);
      break;
  }
  throw new Error(USAGE);
};
