import Link from 'next/link';

export function HeaderDrawer({ opened, close }: HeaderDrawerProps) {
  if (!opened) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={close}
        onKeyDown={(e) => e.key === 'Escape' && close()}
        role="button"
        tabIndex={0}
        aria-label="Close menu"
      />
      {/* Drawer */}
      <div className="fixed top-0 left-0 w-[55%] h-full bg-white z-50 shadow-xl p-6 pt-20">
        <Link
          href="/about"
          className="block text-slate-700 hover:text-blue-600 py-2"
          onClick={close}
        >
          About
        </Link>
        <Link
          href="https://forms.gle/xAaTnwZNi2mq3UDE9"
          className="block text-slate-700 hover:text-blue-600 py-2"
          onClick={close}
        >
          Submit a mic
        </Link>
      </div>
    </>
  );
}

export type HeaderDrawerProps = {
  opened: boolean;
  close: () => void;
};
