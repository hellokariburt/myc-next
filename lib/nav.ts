import { t } from '@/lib/i18n';

/**
 * Single source of truth for primary nav. Both the desktop bar in
 * components/header/Header.tsx and the mobile drawer read from this —
 * they used to keep separate hardcoded copies, which is how /clubs
 * went missing from the drawer.
 */
export const navLinks = [
  { link: '/mics', label: t('nav.browseMics') },
  { link: '/clubs', label: t('nav.clubs') },
  { link: '/about', label: t('nav.about') },
  { link: '/submit', label: t('nav.submit') },
];
