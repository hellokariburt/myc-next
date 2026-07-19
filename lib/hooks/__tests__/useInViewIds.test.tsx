import { useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { useInViewIds } from '../useInViewIds';

/**
 * Regression cover for the render loop this hook used to cause on /clubs.
 *
 * The stub below delivers its callback synchronously on observe(), which a
 * real IntersectionObserver does not do — the real one is async, so in a
 * browser the old bug showed up as sustained CPU churn rather than a hang.
 * Firing synchronously is what makes the loop *countable* in a test: if the
 * bail-outs regress, the render count runs away instead of settling.
 */
class SyncIO {
  private cb: IntersectionObserverCallback;

  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
  }

  observe(target: Element) {
    this.cb(
      [{ target, isIntersecting: true } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }

  unobserve() {}

  disconnect() {}
}

let renders = 0;

function Harness({ items }: { items: { id: string }[] }) {
  renders += 1;
  const ref = useRef<HTMLDivElement>(null);
  // Mirrors useInfiniteChunks: a new array identity on every render.
  const visible = items.slice(0, items.length);
  const inView = useInViewIds(ref, visible);
  return (
    <div ref={ref} data-testid="list">
      {visible.map((c) => (
        <div key={c.id} data-pin={c.id}>
          {inView.has(c.id) ? 'in' : 'out'}
        </div>
      ))}
    </div>
  );
}

describe('useInViewIds', () => {
  const original = global.IntersectionObserver;

  beforeEach(() => {
    renders = 0;
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = SyncIO;
  });

  afterEach(() => {
    (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = original;
  });

  it('settles instead of re-rendering unboundedly when dep identity changes each render', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    render(<Harness items={items} />);

    // Pre-fix this ran into the hundreds of thousands until Jest timed out.
    // A handful of renders is the expected settle; the assertion only needs to
    // separate "converges" from "runs away".
    expect(renders).toBeLessThan(15);
  });

  it('reports the intersecting ids', () => {
    render(<Harness items={[{ id: 'a' }, { id: 'b' }]} />);
    expect(screen.getAllByText('in')).toHaveLength(2);
  });
});
