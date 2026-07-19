/**
 * Serializes a JSON-LD payload for injection into a <script type="application/ld+json">.
 *
 * JSON.stringify does NOT escape `<`, so a DB string containing
 * `</script><script>...` would close the ld+json block early and execute as
 * markup on the page. Mic and club text originates in `mic_submissions`, which
 * anonymous users can write to, so this is reachable once an operator promotes
 * a submission.
 *
 * Escaping to \\uXXXX is valid JSON and parses back to the identical string, so
 * consumers (Google's parser included) see exactly the same data.
 */
export function jsonLdHtml(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    // U+2028/U+2029 are valid in JSON strings but are line terminators in JS,
    // which breaks the script block for anything that evaluates it.
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
