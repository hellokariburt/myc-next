'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_COOKIE, adminTokenHash, verifyAdminPassword } from '@/lib/auth/admin';

export async function login(formData: FormData) {
  const password = String(formData.get('password') || '');
  const hash = adminTokenHash();
  const next = String(formData.get('next') || '/admin/submissions');
  if (hash && verifyAdminPassword(password)) {
    cookies().set(ADMIN_COOKIE, hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  redirect(next);
}

export async function logout() {
  // Path must match the one the cookie was set with, or the browser keeps it.
  cookies().delete({ name: ADMIN_COOKIE, path: '/admin' });
  redirect('/admin/submissions');
}
