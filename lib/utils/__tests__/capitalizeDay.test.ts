import capitalizeDay from '../capitalizeDay';

describe('capitalizeDay', () => {
  it('capitalizes first letter', () => {
    expect(capitalizeDay('monday')).toBe('Monday');
  });

  it('handles already capitalized input', () => {
    expect(capitalizeDay('Tuesday')).toBe('Tuesday');
  });

  it('handles single character', () => {
    expect(capitalizeDay('a')).toBe('A');
  });

  it('handles multi-word strings', () => {
    expect(capitalizeDay('staten-island')).toBe('Staten-island');
  });
});
