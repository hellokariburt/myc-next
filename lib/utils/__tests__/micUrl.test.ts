import {
  buildMicOgImageUrl,
  buildMicPath,
  buildMicPathSegment,
  buildMicSlug,
  buildMicUrl,
  isCanonicalMicPathSegment,
  parseMicIdParam,
} from '../micUrl';
import { MicListItem } from '../../types/mic';

const mic: MicListItem = {
  id: 100,
  borough: 'manhattan',
  confirmed: null,
  day: 'monday',
  name: 'Comedy Cellar Open Mic',
  start_time: '1970-01-01T19:00:00.000Z',
  end_time: null,
  instagram: null,
  website: null,
  email_address: null,
  venue_type: null,
  stage_time: null,
  other_rules: null,
  mic_address: {
    venue: 'Comedy Cellar',
    street_name: '117 MacDougal St',
    unit_number: 0,
    latitude: null,
    longitude: null,
    neighborhood: 'Greenwich Village',
  },
  mic_cost: {
    cost_amount: 'Free',
  },
  mic_occurrence: {
    schedule: 'Weekly',
  },
};

describe('micUrl', () => {
  it('builds a stable keyword-rich slug', () => {
    expect(buildMicSlug(mic)).toBe(
      'comedy-cellar-open-mic-greenwich-village-manhattan-monday'
    );
  });

  it('builds path, URL, and og image URL from the slugged segment', () => {
    expect(buildMicPathSegment(mic)).toBe(
      '100-comedy-cellar-open-mic-greenwich-village-manhattan-monday'
    );
    expect(buildMicPath(mic)).toBe(
      '/mics/100-comedy-cellar-open-mic-greenwich-village-manhattan-monday'
    );
    expect(buildMicUrl(mic)).toBe(
      'https://findopenmyc.com/mics/100-comedy-cellar-open-mic-greenwich-village-manhattan-monday'
    );
    expect(buildMicOgImageUrl(mic)).toBe(
      'https://findopenmyc.com/mics/100-comedy-cellar-open-mic-greenwich-village-manhattan-monday/opengraph-image'
    );
  });

  it('parses IDs from numeric-only and slugged segments', () => {
    expect(parseMicIdParam('100')).toBe(BigInt(100));
    expect(parseMicIdParam('100-comedy-cellar')).toBe(BigInt(100));
    expect(parseMicIdParam('100-ANY-OLD-SLUG')).toBe(BigInt(100));
  });

  it('rejects invalid segments', () => {
    expect(parseMicIdParam('comedy-cellar')).toBeNull();
    expect(parseMicIdParam('0-comedy-cellar')).toBeNull();
    expect(parseMicIdParam('100/other')).toBeNull();
  });

  it('detects canonical and stale variants', () => {
    expect(isCanonicalMicPathSegment(buildMicPathSegment(mic), mic)).toBe(true);
    expect(isCanonicalMicPathSegment('100', mic)).toBe(false);
    expect(isCanonicalMicPathSegment('100-old-slug', mic)).toBe(false);
  });

  it('falls back to a default slug when content is missing', () => {
    const minimalMic: MicListItem = {
      ...mic,
      name: null,
      borough: null,
      day: null,
      mic_address: {
        ...mic.mic_address!,
        venue: null,
        neighborhood: null,
      },
    };

    expect(buildMicSlug(minimalMic)).toBe('open-mic');
    expect(buildMicPathSegment(minimalMic)).toBe('100-open-mic');
  });
});
