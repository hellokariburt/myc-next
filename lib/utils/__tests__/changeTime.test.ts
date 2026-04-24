import changeTime from '../changeTime';

describe('changeTime', () => {
  // The input format is an ISO datetime string like "1970-01-01T14:00:00.000Z"
  // changeTime extracts HH:MM from position 11-16

  it('converts afternoon time to 12hr format', () => {
    expect(changeTime('1970-01-01T14:00:00.000Z')).toBe('2:00pm');
  });

  it('converts morning time to 12hr format', () => {
    expect(changeTime('1970-01-01T09:30:00.000Z')).toBe('9:30am');
  });

  it('converts noon correctly', () => {
    expect(changeTime('1970-01-01T12:00:00.000Z')).toBe('12:00pm');
  });

  it('converts midnight correctly', () => {
    expect(changeTime('1970-01-01T00:00:00.000Z')).toBe('12:00am');
  });

  it('converts late evening time', () => {
    expect(changeTime('1970-01-01T21:30:00.000Z')).toBe('9:30pm');
  });

  it('handles single-digit minutes with leading zero', () => {
    expect(changeTime('1970-01-01T18:05:00.000Z')).toBe('6:05pm');
  });
});
