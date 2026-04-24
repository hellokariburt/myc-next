import { serialize } from '../serialize';

describe('serialize', () => {
  it('converts BigInt to number when safe', () => {
    const data = { id: BigInt(42), name: 'test' };
    const result = serialize(data);
    expect(result).toEqual({ id: 42, name: 'test' });
    expect(typeof result.id).toBe('number');
  });

  it('converts BigInt to string when above MAX_SAFE_INTEGER', () => {
    const big = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    const data = { id: big };
    const result = serialize(data);
    expect(typeof result.id).toBe('string');
    expect(result.id).toBe(big.toString());
  });

  it('handles nested BigInt values', () => {
    const data = {
      mic: { id: BigInt(36), address: { address_id: BigInt(37) } },
    };
    const result = serialize(data);
    expect(result.mic.id).toBe(36);
    expect(result.mic.address.address_id).toBe(37);
  });

  it('preserves non-BigInt values', () => {
    const data = { name: 'test', count: 5, active: true, items: [1, 2] };
    expect(serialize(data)).toEqual(data);
  });

  it('handles null and undefined', () => {
    const data = { a: null, b: undefined };
    const result = serialize(data);
    expect(result.a).toBeNull();
    // undefined is dropped by JSON.stringify
    expect(result.b).toBeUndefined();
  });

  it('handles arrays with BigInt', () => {
    const data = [{ id: BigInt(1) }, { id: BigInt(2) }];
    const result = serialize(data);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
