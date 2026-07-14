import Link from 'next/link';

const linkClass = 'text-sm text-slate-600 hover:text-blue-600 hover:underline';

const Footer = () => (
  <footer className="w-full bg-white border-t border-slate-200 mt-auto">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Browse</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/mics" className={linkClass}>All Mics</Link></li>
            <li><Link href="/mics/tonight" className={linkClass}>Tonight</Link></li>
            <li><Link href="/mics/free" className={linkClass}>Free Mics</Link></li>
            <li><Link href="/clubs" className={linkClass}>Comedy Clubs</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Boroughs</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/mics/manhattan" className={linkClass}>Manhattan</Link></li>
            <li><Link href="/mics/brooklyn" className={linkClass}>Brooklyn</Link></li>
            <li><Link href="/mics/queens" className={linkClass}>Queens</Link></li>
            <li><Link href="/mics/bronx" className={linkClass}>Bronx</Link></li>
            <li><Link href="/mics/staten-island" className={linkClass}>Staten Island</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">OpenMYC</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/about" className={linkClass}>About</Link></li>
            <li><Link href="/guides" className={linkClass}>Guides</Link></li>
            <li><Link href="/submit" className={linkClass}>Submit a Mic</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Legal</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
            <li><Link href="/terms" className={linkClass}>Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-sm text-slate-500 border-t border-slate-100 pt-4">
        &copy; {new Date().getFullYear()} OpenMYC
      </p>
    </div>
  </footer>
);

export default Footer;
