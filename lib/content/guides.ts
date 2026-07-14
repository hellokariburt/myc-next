import type { Locale } from '../i18n';
import { guideArticles as en } from './guides-locale/en';

export type { GuideArticle } from './guides-locale/en';

/**
 * Locale-keyed guide content. Guides are long-form editorial and live as
 * per-locale TS modules (not in the i18n JSON): to add Spanish guides,
 * hand-write lib/content/guides-locale/es.ts with the same shape and add
 * it to the map — machine translation is not worth publishing.
 */
const byLocale = { en } as const;

export function getGuideArticles(locale: Locale = 'en') {
  return byLocale[locale as keyof typeof byLocale] ?? en;
}

// existing imports keep working
export const guideArticles = en;
export { guideArticleMap } from './guides-locale/en';
