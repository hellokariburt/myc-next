import en from './en.json';
import es from './es.json';

/**
 * Minimal locale layer. Keys mirror the route/layout structure
 * (home.*, clubs.*, submit.* …) — locatability over DRY: repeated
 * strings stay repeated per section so each can change independently.
 *
 * es.json currently mirrors en.json verbatim; translated values (and
 * hand-written Spanish guides in lib/content/guides/es.ts) can land
 * later without touching components.
 */
export type Locale = 'en' | 'es';

const DICTS: Record<Locale, unknown> = { en, es };

function lookup(dict: unknown, path: string): string | undefined {
  let node: unknown = dict;
  for (const part of path.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : undefined;
}

export function t(
  key: string,
  vars?: Record<string, string | number>,
  locale: Locale = 'en'
): string {
  const raw = lookup(DICTS[locale], key) ?? lookup(DICTS.en, key);
  if (raw === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] missing key: ${key}`);
    }
    return key;
  }
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`
  );
}
