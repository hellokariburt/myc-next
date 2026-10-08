import Link from 'next/link';
import { logout } from '@/app/admin/auth-actions';

type Tab = 'submissions' | 'reports';

const tabs: { key: Tab; href: string; label: string }[] = [
  { key: 'submissions', href: '/admin/submissions', label: 'Submissions' },
  { key: 'reports', href: '/admin/reports', label: 'Reports' },
];

/** Shared chrome for the admin area: title, tab nav, and sign-out. */
export default function AdminShell({
  active,
  children,
  showNav = true,
}: {
  active?: Tab;
  children: React.ReactNode;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
          {showNav && (
            <form action={logout}>
              <button type="submit" className="text-sm text-slate-500 hover:text-slate-800">
                Sign out
              </button>
            </form>
          )}
        </div>

        {showNav && (
          <nav className="flex gap-1 border-b border-slate-200 mb-6">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
                  active === tab.key
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        )}

        {children}
      </div>
    </div>
  );
}
