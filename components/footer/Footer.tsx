import Link from 'next/link';
import { t } from '@/lib/i18n';

const linkClass = 'text-sm text-slate-600 hover:text-blue-600 hover:underline';

const Footer = () => (
  <footer className="w-full bg-white border-t border-slate-200 mt-auto">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">{t('footer.browse.heading')}</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/mics" className={linkClass}>{t('footer.browse.allMics')}</Link></li>
            <li><Link href="/mics/tonight" className={linkClass}>{t('footer.browse.tonight')}</Link></li>
            <li><Link href="/mics/free" className={linkClass}>{t('footer.browse.freeMics')}</Link></li>
            <li><Link href="/clubs" className={linkClass}>{t('footer.browse.comedyClubs')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">{t('footer.boroughs.heading')}</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/mics/manhattan" className={linkClass}>{t('footer.boroughs.manhattan')}</Link></li>
            <li><Link href="/mics/brooklyn" className={linkClass}>{t('footer.boroughs.brooklyn')}</Link></li>
            <li><Link href="/mics/queens" className={linkClass}>{t('footer.boroughs.queens')}</Link></li>
            <li><Link href="/mics/bronx" className={linkClass}>{t('footer.boroughs.bronx')}</Link></li>
            <li><Link href="/mics/staten-island" className={linkClass}>{t('footer.boroughs.statenIsland')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">{t('footer.site.heading')}</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/about" className={linkClass}>{t('footer.site.about')}</Link></li>
            <li><Link href="/submit" className={linkClass}>{t('footer.site.submit')}</Link></li>
            <li><Link href="/contact" className={linkClass}>{t('footer.site.contact')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">{t('footer.legal.heading')}</p>
          <ul className="flex flex-col gap-2">
            <li><Link href="/privacy" className={linkClass}>{t('footer.legal.privacy')}</Link></li>
            <li><Link href="/terms" className={linkClass}>{t('footer.legal.terms')}</Link></li>
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
