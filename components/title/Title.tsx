import { t } from '@/lib/i18n';

const BOROUGH_DOTS = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-rose-500', 'bg-teal-500'];

export const Title = () => (
  <div className="container flex flex-col items-center">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
      <span className="flex gap-1" aria-hidden="true">
        {BOROUGH_DOTS.map((c) => (
          <span key={c} className={`inline-block h-2 w-2 rounded-full ${c}`} />
        ))}
      </span>
      {t('home.eyebrow')}
    </p>
    <h1 className="mt-4 font-display uppercase text-5xl md:text-7xl lg:text-8xl text-center leading-[0.95] tracking-tight text-slate-900">
      {t('home.headlinePlain')}{' '}
      <span className="bg-gradient-to-r from-blue-500 to-orange-500 inline-block text-transparent bg-clip-text pb-1">
        {t('home.headlineGradient')}
      </span>
      <br />
      {t('home.headlineRest')}
    </h1>
    <h2 className="font-light text-lg lg:text-2xl md:text-xl px-2 text-center text-slate-700 mt-5 max-w-2xl">
      {t('home.subhead')}
    </h2>
  </div>
);
