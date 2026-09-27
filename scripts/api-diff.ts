/**
 * Compares the public GET endpoints of two API deployments (status, JSON body,
 * Cache-Control). Used to check that a migration keeps the HTTP contract.
 *
 * Usage: tsx scripts/api-diff.ts <reference-origin> <candidate-origin> [--no-cache-check]
 * e.g.   tsx scripts/api-diff.ts https://dreadcast-simulator-kappa.vercel.app http://localhost:3001 --no-cache-check
 *
 * --no-cache-check skips Cache-Control: the Vercel CDN rewrites it, so only
 * compare it between two Vercel deployments.
 *
 * VERCEL_BYPASS_TOKEN (optional) is sent as x-vercel-protection-bypass to reach
 * SSO-protected previews.
 */
/* eslint-disable no-console -- CLI report */
import { isDeepStrictEqual } from 'node:util';

const PATHS = [
  '/api/items',
  '/api/kits',
  '/api/implants',
  '/api/races',
  '/api/titles',
  '/api/drugs',
  '/api/drugs?id=0',
  '/api/drugs?id=unknown',
];

interface Snapshot {
  status: number;
  cacheControl: string | null;
  body: unknown;
}

const headers: Record<string, string> = process.env.VERCEL_BYPASS_TOKEN
  ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS_TOKEN }
  : {};

const snapshot = async (origin: string, path: string): Promise<Snapshot> => {
  const response = await fetch(new URL(path, origin), { headers });
  const text = await response.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Non-JSON body: compared as text.
  }
  return {
    status: response.status,
    cacheControl: response.headers.get('cache-control'),
    body,
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  const checkCache = !args.includes('--no-cache-check');
  const [reference, candidate] = args.filter((arg) => !arg.startsWith('--'));
  if (!reference || !candidate) {
    console.error(
      'Usage: tsx scripts/api-diff.ts <reference> <candidate> [--no-cache-check]',
    );
    process.exit(2);
  }

  let failures = 0;
  for (const path of PATHS) {
    const [a, b] = await Promise.all([
      snapshot(reference, path),
      snapshot(candidate, path),
    ]);
    const problems = [
      a.status !== b.status && `status ${a.status} != ${b.status}`,
      checkCache &&
        a.cacheControl !== b.cacheControl &&
        `cache-control "${a.cacheControl}" != "${b.cacheControl}"`,
      !isDeepStrictEqual(a.body, b.body) && 'body differs',
    ].filter(Boolean);

    failures += problems.length > 0 ? 1 : 0;
    console.log(
      `${problems.length === 0 ? 'OK  ' : 'DIFF'} ${path}${problems.length ? ` (${problems.join(', ')})` : ''}`,
    );
  }

  process.exit(failures === 0 ? 0 : 1);
};

void main();
