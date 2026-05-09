import { isFreeCost } from '../isFree';

describe('isFreeCost', () => {
  it('returns true for null/undefined/empty', () => {
    expect(isFreeCost(null)).toBe(true);
    expect(isFreeCost(undefined)).toBe(true);
    expect(isFreeCost('')).toBe(true);
    expect(isFreeCost('   ')).toBe(true);
  });

  it('returns true when cost starts with "free"', () => {
    expect(isFreeCost('Free')).toBe(true);
    expect(isFreeCost('free')).toBe(true);
    expect(isFreeCost('FREE')).toBe(true);
    expect(isFreeCost('Free + 1 item minimum')).toBe(true);
    expect(isFreeCost('Free (buy something at the bar)')).toBe(true);
  });

  it('returns false when cost is paid even if "free" appears later', () => {
    expect(isFreeCost('$7.62 but you get a free drink or fries')).toBe(false);
    expect(isFreeCost('$10 with a free drink')).toBe(false);
    expect(isFreeCost('$5')).toBe(false);
    expect(isFreeCost('$5 cash')).toBe(false);
    expect(isFreeCost('$6+ booking fee')).toBe(false);
  });

  it('returns false for item/drink minimums and other non-free costs', () => {
    expect(isFreeCost('1 item minimum')).toBe(false);
    expect(isFreeCost('Drink')).toBe(false);
    expect(isFreeCost('1 drink')).toBe(false);
  });
});
