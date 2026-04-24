export const request = async <T>(input: RequestInfo | URL): Promise<T> => {
  const res = await fetch(input, {
    headers: { 'content-type': 'application/json' },
  });

  if (!res.ok) {
    throw Error(`Request failed: ${res.status}`);
  }

  return res.json();
};
