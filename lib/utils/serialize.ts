/**
 * Converts BigInt values to numbers (or strings if above MAX_SAFE_INTEGER)
 * so they can be passed to JSON.stringify / NextResponse.json().
 */
export function serialize<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'bigint') {
        return value > BigInt(Number.MAX_SAFE_INTEGER) ? value.toString() : Number(value);
      }
      return value;
    })
  );
}
