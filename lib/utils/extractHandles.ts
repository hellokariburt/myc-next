/** Pull @handles out of a messy instagram field like "@foo or @bar insta" */
const extractHandles = (raw: string): string[] => {
  const matches = raw.match(/@[\w.]+/g);
  return matches ? [...new Set(matches)] : [];
};

export default extractHandles;
