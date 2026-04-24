export const ALL_BOROUGHS = [
  'manhattan',
  'queens',
  'staten-island',
  'bronx',
  'brooklyn',
] as const;

export const ALL_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export interface MicQueryParams {
  day: string[];
  borough: string[];
  limit: number;
  offset: number;
  start_time: string;
  cost: string;
}

// HH:MM:SS with valid hour (00-23), minute (00-59), second (00-59)
export const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
