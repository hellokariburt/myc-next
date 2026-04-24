'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Filter from '../filter/Filter';
import MobileFilterButton from '../filter/MobileFilterButton';
import { HeaderDrawer } from '../header-drawer/header-drawer';
import { BackButton } from '../buttons/BackButton';

const links = [
  { link: '/about', label: 'About' },
  { link: 'https://forms.gle/xAaTnwZNi2mq3UDE9', label: 'Submit a Mic' },
];

const Header = ({ hasFilter, hasMobileFilter, hasBackButton }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [active, setActive] = useState(links[0].link);
  const router = useRouter();

  return (
    <header className="h-[50px] mb-[120px] bg-white border-b border-slate-200 fixed w-full z-10">
      <div className="flex h-[56px] w-full justify-between items-center px-4 max-w-5xl mx-auto">
        <h2 className="font-extrabold whitespace-nowrap text-xl md:text-2xl">
          <a href="/" className="flex flex-row">
            <span>Open</span>
            <span className="font-extrabold bg-gradient-to-r from-blue-400 to-orange-600 text-transparent bg-clip-text">
              MYC
            </span>
          </a>
        </h2>
        <HeaderDrawer opened={drawerOpen} close={() => setDrawerOpen(false)} />
        {/* Mobile hamburger */}
        <button
          type="button"
          className="xs:hidden flex flex-col gap-1 p-2"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-700 transition-transform ${drawerOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-opacity ${drawerOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-transform ${drawerOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
        {/* Desktop nav */}
        <nav className="hidden xs:flex gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.link}
              className="block leading-none py-2 px-3 rounded text-sm font-medium text-slate-600 hover:text-blue-600 hover:underline"
              data-active={active === link.link || undefined}
              onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                router.push(link.link);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      {hasBackButton ? (
        <div className="block">
          <BackButton />
        </div>
      ) : null}
      {hasFilter ? <Filter /> : null}
      {hasMobileFilter ? (
        <div className="block md:hidden">
          <MobileFilterButton />
        </div>
      ) : null}
    </header>
  );
};

export default Header;

export type HeaderProps = {
  hasFilter?: boolean;
  hasMobileFilter?: boolean;
  hasBackButton?: boolean;
};
