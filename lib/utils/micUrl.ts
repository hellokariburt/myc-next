import { MicListItem } from '../types/mic';

type MicUrlSource = Omit<Pick<MicListItem, 'id' | 'borough' | 'day' | 'name'>, 'id'> & {
  id: number | bigint | string;
  mic_address?: Pick<NonNullable<MicListItem['mic_address']>, 'venue' | 'neighborhood'> | null;
};

const BASE_URL = 'https://findopenmyc.com';
const FALLBACK_SLUG = 'open-mic';
const MAX_SLUG_LENGTH = 80;

function slugifyPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildMicSlug(mic: MicUrlSource): string {
  const candidates = [
    mic.name,
    mic.mic_address?.venue,
    mic.mic_address?.neighborhood,
    mic.borough,
    mic.day,
  ].filter((value): value is string => Boolean(value && value.trim()));

  const tokens = candidates
    .flatMap((value) => slugifyPart(value).split('-'))
    .filter(Boolean);

  const deduped = tokens.filter((token, index) => tokens.indexOf(token) === index);
  const joined = deduped.join('-').slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');

  return joined || FALLBACK_SLUG;
}

export function buildMicPathSegment(mic: MicUrlSource): string {
  return `${mic.id}-${buildMicSlug(mic)}`;
}

export function buildMicPath(mic: MicUrlSource): string {
  return `/mics/${buildMicPathSegment(mic)}`;
}

export function buildMicUrl(mic: MicUrlSource): string {
  return `${BASE_URL}${buildMicPath(mic)}`;
}

export function buildMicOgImageUrl(mic: MicUrlSource): string {
  return `${buildMicUrl(mic)}/opengraph-image`;
}

export function parseMicIdParam(segment: string): bigint | null {
  const match = segment.match(/^(\d+)(?:-[^/]+)?$/);
  if (!match) return null;

  try {
    const id = BigInt(match[1]);
    return id > BigInt(0) ? id : null;
  } catch {
    return null;
  }
}

export function isCanonicalMicPathSegment(segment: string, mic: MicUrlSource): boolean {
  return segment === buildMicPathSegment(mic);
}

export type { MicUrlSource };
