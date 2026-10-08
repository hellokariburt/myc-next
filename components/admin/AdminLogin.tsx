import AdminShell from './AdminShell';
import { login } from '@/app/admin/auth-actions';

/** Shown on any admin page when the request has no valid admin cookie. */
export default function AdminLogin({ next }: { next: string }) {
  return (
    <AdminShell showNav={false}>
      <form action={login} className="flex flex-col gap-3 max-w-xs">
        <input type="hidden" name="next" value={next} />
        <label htmlFor="password" className="text-sm font-semibold text-slate-700">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-colors"
        >
          Sign in
        </button>
      </form>
    </AdminShell>
  );
}

/** Shown when ADMIN_TOKEN isn't configured at all. */
export function AdminNotConfigured() {
  return (
    <AdminShell showNav={false}>
      <p className="text-slate-700">
        Admin is not configured. Set the <code className="font-mono">ADMIN_TOKEN</code> environment
        variable to enable this page.
      </p>
    </AdminShell>
  );
}
