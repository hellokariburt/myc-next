'use client';

import { useState } from 'react';
import Link from 'next/link';
import Filter from '../filter/Filter';
import { HeaderDrawer } from '../header-drawer/header-drawer';
import { BackButton } from '../buttons/BackButton';

const links = [
  { link: '/about', label: 'About' },
  { link: '/submit', label: 'Submit a Mic' },
];

const Header = ({ hasFilter, hasBackButton }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-30 bg-white shadow-sm">
      {/* Main nav bar */}
      <div className="flex h-14 w-full justify-between items-center px-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-0.5 text-xl md:text-2xl font-extrabold">
          <span>Open</span>
          <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-transparent bg-clip-text">
            MYC
          </span>
        </Link>
        <HeaderDrawer opened={drawerOpen} close={() => setDrawerOpen(false)} />
        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden flex flex-col gap-1 p-2"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
        >
          <span className={`block w-5 h-0.5 bg-slate-700 transition-transform ${drawerOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-opacity ${drawerOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-transform ${drawerOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.link}
              className="py-1.5 px-3 rounded-md text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {/* Secondary bar: filter or back button */}
      {hasBackButton && (
        <div className="border-t border-slate-100 bg-white px-4 py-2">
          <BackButton />
        </div>
      )}
      {hasFilter && <Filter />}
    </header>
  );
};

export default Header;

export type HeaderProps = {
  hasFilter?: boolean;
  hasBackButton?: boolean;
};
