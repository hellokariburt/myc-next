import Link from 'next/link';

const Footer = () => (
  <footer className="w-full bg-white border-t border-slate-200 mt-auto">
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-slate-500">
        &copy; {new Date().getFullYear()} OpenMYC
      </p>
      <nav
        aria-label="Footer"
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-600"
      >
        <Link href="/about" className="hover:text-blue-600 hover:underline">
          About
        </Link>
        <Link href="/mics" className="hover:text-blue-600 hover:underline">
          Browse Mics
        </Link>
        <Link href="/submit" className="hover:text-blue-600 hover:underline">
          Submit a Mic
        </Link>
        <Link href="/privacy" className="hover:text-blue-600 hover:underline">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-blue-600 hover:underline">
          Terms
        </Link>
        <Link href="/contact" className="hover:text-blue-600 hover:underline">
          Contact
        </Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
