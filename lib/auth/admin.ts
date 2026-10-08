import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

/**
 * Minimal shared-secret gate for the /admin area. There is no user system in
 * this app, so admin access is a single token stored in the ADMIN_TOKEN env
 * var. The browser never holds the token itself — on login we set a cookie to
 * its SHA-256, and checks compare that hash in constant time.
 */

export const ADMIN_COOKIE = 'myc_admin';

/** SHA-256 of the configured admin token, or null when ADMIN_TOKEN is unset. */
export function adminTokenHash(): string | null {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return null;
  return createHash('sha256').update(token).digest('hex');
}

/** Whether the current request carries a valid admin cookie. */
export function isAdmin(): boolean {
  const expected = adminTokenHash();
  if (!expected) return false;
  const value = cookies().get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
