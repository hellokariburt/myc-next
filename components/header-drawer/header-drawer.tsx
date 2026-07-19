'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { navLinks } from '@/lib/nav';

export function HeaderDrawer({ opened, close }: HeaderDrawerProps) {
  useEffect(() => {
    if (!opened) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);

    // Lock the page behind the drawer. Restore the prior value rather than
    // clearing it, so we don't stomp an overflow set by something else.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = previousOverflow;
    };
  }, [opened, close]);

  if (!opened) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={close}
        role="presentation"
      />
      {/* Drawer */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed top-0 left-0 w-[80%] max-w-xs h-full bg-white z-50 shadow-xl p-6 pt-20"
      >
        {navLinks.map((link) => (
          <Link
            key={link.link}
            href={link.link}
            className="block text-slate-700 hover:text-blue-600 py-2"
            onClick={close}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

export type HeaderDrawerProps = {
  opened: boolean;
  close: () => void;
};
