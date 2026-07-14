import { t } from '@/lib/i18n';

const NoMicFound = () => (
  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[800px] text-center">
    <h1 className="text-6xl font-bold">
      <span className="bg-gradient-to-r from-blue-500 to-orange-500 inline-block text-transparent bg-clip-text">
        {t('mics.noResults.bummer')}
      </span>{' '}
      {t('mics.noResults.noMics')}
    </h1>
    <p className="text-xl text-slate-600 mt-4">
      {t('mics.noResults.tryBroadening')}{' '}
      <a
        className="text-blue-600 underline decoration-dashed hover:decoration-solid font-semibold"
        href="/"
      >
        {t('mics.noResults.homeLink')}
      </a>.
    </p>
  </div>
);

export default NoMicFound;
