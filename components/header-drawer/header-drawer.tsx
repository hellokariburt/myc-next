'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export function HeaderDrawer({ opened, close }: HeaderDrawerProps) {
  useEffect(() => {
    if (!opened) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
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
        className="fixed top-0 left-0 w-[55%] h-full bg-white z-50 shadow-xl p-6 pt-20"
      >
        <Link
          href="/about"
          className="block text-slate-700 hover:text-blue-600 py-2"
          onClick={close}
        >
          About
        </Link>
        <Link
          href="/submit"
          className="block text-slate-700 hover:text-blue-600 py-2"
          onClick={close}
        >
          Submit a mic
        </Link>
      </nav>
    </>
  );
}

export type HeaderDrawerProps = {
  opened: boolean;
  close: () => void;
};
