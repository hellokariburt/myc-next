import { formatTimeText } from '../formatTimeText';

describe('formatTimeText', () => {
  it('passes through clean single times', () => {
    expect(formatTimeText('8:00 PM')).toBe('8:00 PM');
    expect(formatTimeText('10:30 AM')).toBe('10:30 AM');
  });

  it('normalizes messy multi-time strings', () => {
    expect(formatTimeText('5:30,8, 10pm')).toBe('5:30, 8:00 & 10:00 PM');
    expect(formatTimeText('8 and 10pm')).toBe('8:00 & 10:00 PM');
    expect(formatTimeText('7, 830, and 10:30pm')).toBe('7:00, 8:30 & 10:30 PM');
  });

  it('normalizes bare single times with suffix', () => {
    expect(formatTimeText('8pm')).toBe('8:00 PM');
  });

  it('leaves unparseable strings alone', () => {
    expect(formatTimeText('8:00 and 10:15pm-ish late')).toBe('8:00 and 10:15pm-ish late');
    expect(formatTimeText('doors at dark')).toBe('doors at dark');
    expect(formatTimeText(null)).toBe('');
  });
});
