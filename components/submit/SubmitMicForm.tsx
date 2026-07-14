'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import PageLayout from '../pagelayout/PageLayout';
import { t } from '@/lib/i18n';

const boroughs = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
  { value: 'staten-island', label: 'Staten Island' },
];

const days = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

const labelClass = 'block text-sm font-semibold text-slate-700 mb-1';
const inputClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400 transition-colors';
const selectClass = `${inputClass} appearance-none`;

const SubmitMicForm = () => {
  const [status, setStatus] = useState<Status>('idle');
  // shows section dormant — form is mic-only; API still accepts submission_type
  const type = 'mic';
  const isShow = false;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(formData.entries()), submission_type: type };

    try {
      const res = await fetch('/api/submit-mic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Submission failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-36 min-h-[100vh]">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[600px] text-center">
            <h1 className="font-bold text-4xl">{t('submit.messages.thanksTitle')}</h1>
            <p className="pt-4 text-slate-600">
              {t('submit.messages.thanksBody')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-lg font-semibold transition-colors"
              >
                {t('submit.messages.browseMics')}
              </Link>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 py-2.5 px-6 rounded-lg font-semibold transition-colors"
              >
                {t('submit.messages.submitAnother')}
              </button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-start pt-16 pb-24 px-4 min-h-[100vh]">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[600px] w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            {t('submit.eyebrow')}
          </p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl tracking-normal leading-[1.02] text-slate-900">
            {isShow ? t('submit.titleShow') : t('submit.titleMic')}
          </h1>
          <p className="pt-3 text-slate-700 text-sm">
            {isShow ? t('submit.introShow') : t('submit.introMic')}
          </p>

          {/* mic/show toggle removed while the shows section is dormant;
              the API still accepts submission_type for revival */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Honeypot - hidden from real users, bots will fill it */}
            <div className="absolute opacity-0 -z-10" aria-hidden="true">
              <label htmlFor="website_url">{t('submit.fields.website')}</label>
              <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Mic info */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1">
              {isShow ? t('submit.sections.showInfo') : t('submit.sections.micInfo')}
            </h2>

            <div>
              <label htmlFor="name" className={labelClass}>{isShow ? t('submit.fields.showName') : t('submit.fields.micName')}</label>
              <input id="name" name="name" type="text" required className={inputClass} placeholder={t('submit.fields.namePlaceholder')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="borough" className={labelClass}>{t('submit.fields.borough')}</label>
                <select id="borough" name="borough" required className={selectClass} defaultValue="">
                  <option value="" disabled>{t('submit.fields.boroughPlaceholder')}</option>
                  {boroughs.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="day" className={labelClass}>{t('submit.fields.day')}</label>
                <select id="day" name="day" required className={selectClass} defaultValue="">
                  <option value="" disabled>{t('submit.fields.dayPlaceholder')}</option>
                  {days.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className={labelClass}>{t('submit.fields.startTime')}</label>
                <input id="start_time" name="start_time" type="time" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="end_time" className={labelClass}>{t('submit.fields.endTime')}</label>
                <input id="end_time" name="end_time" type="time" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="cost" className={labelClass}>{isShow ? t('submit.fields.costShow') : t('submit.fields.cost')}</label>
              <input id="cost" name="cost" type="text" required={!isShow} className={inputClass} placeholder={isShow ? t('submit.fields.costShowPlaceholder') : t('submit.fields.costPlaceholder')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue_type" className={labelClass}>{t('submit.fields.venueType')}</label>
                <input id="venue_type" name="venue_type" type="text" className={inputClass} placeholder={t('submit.fields.venueTypePlaceholder')} />
              </div>
              {!isShow && (
                <div>
                  <label htmlFor="stage_time" className={labelClass}>{t('submit.fields.stageTime')}</label>
                  <input id="stage_time" name="stage_time" type="text" className={inputClass} placeholder={t('submit.fields.stageTimePlaceholder')} />
                </div>
              )}
            </div>

            {!isShow && (
              <div>
                <label htmlFor="signup_info" className={labelClass}>{t('submit.fields.signupInfo')}</label>
                <input id="signup_info" name="signup_info" type="text" className={inputClass} placeholder={t('submit.fields.signupInfoPlaceholder')} />
              </div>
            )}

            <div>
              <label htmlFor="schedule" className={labelClass}>{t('submit.fields.schedule')}</label>
              <input id="schedule" name="schedule" type="text" className={inputClass} placeholder={t('submit.fields.schedulePlaceholder')} />
            </div>

            {/* Venue info */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              {t('submit.sections.venue')}
            </h2>

            <div>
              <label htmlFor="venue" className={labelClass}>{t('submit.fields.venueName')}</label>
              <input id="venue" name="venue" type="text" required className={inputClass} placeholder={t('submit.fields.venueNamePlaceholder')} />
            </div>

            <div>
              <label htmlFor="street_address" className={labelClass}>
                {isShow ? t('submit.fields.streetAddressOptional') : t('submit.fields.streetAddress')}
              </label>
              <input id="street_address" name="street_address" type="text" required={!isShow} className={inputClass} placeholder={t('submit.fields.streetAddressPlaceholder')} />
            </div>

            <div>
              <label htmlFor="neighborhood" className={labelClass}>{t('submit.fields.neighborhood')}</label>
              <input id="neighborhood" name="neighborhood" type="text" className={inputClass} placeholder={t('submit.fields.neighborhoodPlaceholder')} />
            </div>

            {/* Host & social */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              {t('submit.sections.hostSocial')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="host_name" className={labelClass}>{t('submit.fields.hostName')}</label>
                <input id="host_name" name="host_name" type="text" className={inputClass} />
              </div>
              <div>
                <label htmlFor="host_instagram" className={labelClass}>{t('submit.fields.hostInstagram')}</label>
                <input id="host_instagram" name="host_instagram" type="text" className={inputClass} placeholder="@handle" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagram" className={labelClass}>{isShow ? t('submit.fields.instagramShow') : t('submit.fields.instagramMic')}</label>
                <input id="instagram" name="instagram" type="text" className={inputClass} placeholder="@handle" />
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>{t('submit.fields.website')}</label>
                <input id="website" name="website" type="text" className={inputClass} placeholder={t('submit.fields.websitePlaceholder')} />
              </div>
            </div>

            {/* Extra */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              {t('submit.sections.extra')}
            </h2>

            <div>
              <label htmlFor="notes" className={labelClass}>{t('submit.fields.notes')}</label>
              <textarea id="notes" name="notes" rows={3} className={inputClass} placeholder={t('submit.fields.notesPlaceholder')} />
            </div>

            <div>
              <label htmlFor="submitter_email" className={labelClass}>{t('submit.fields.email')}</label>
              <input id="submitter_email" name="submitter_email" type="email" className={inputClass} placeholder={t('submit.fields.emailPlaceholder')} />
            </div>

            {status === 'error' && (
              <p className="text-red-600 text-sm">{t('submit.messages.error')}</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-6 rounded-lg font-semibold transition-colors mt-2"
            >
              {status === 'submitting' ? t('submit.buttons.submitting') : isShow ? t('submit.buttons.submitShow') : t('submit.buttons.submitMic')}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmitMicForm;
