import { jsonLdHtml } from '../jsonLd';

describe('jsonLdHtml', () => {
  it('neutralizes a script-breakout payload in a DB text field', () => {
    const hostile = '</script><script>alert(1)</script>';
    const out = jsonLdHtml({ '@type': 'Event', name: hostile });

    // The literal sequence that would terminate the ld+json block must not survive.
    expect(out).not.toContain('</script>');
    expect(out).not.toContain('<');
    expect(out).toContain('\\u003c');
  });

  it('round-trips to the identical object, so consumers see the same data', () => {
    const payload = {
      '@context': 'https://schema.org',
      name: 'Bar & Grill </script> "quoted" \u2028 line',
      nested: { list: [1, 2, 'three <b>'] },
    };
    expect(JSON.parse(jsonLdHtml(payload))).toEqual(payload);
  });

  it('escapes the JS line terminators that are legal inside JSON strings', () => {
    const out = jsonLdHtml({ name: 'a\u2028b\u2029c' });
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
  });
});
