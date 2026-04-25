'use client';

import { useState, FormEvent } from 'react';
import PageLayout from '../pagelayout/PageLayout';

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
            <h1 className="font-bold text-4xl">Thanks!</h1>
            <p className="pt-4 text-slate-600">
              Your mic submission has been received. We&apos;ll review it and add it to the list if
              everything checks out.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-36 min-h-[100vh]">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-[600px] w-full">
          <h1 className="font-bold text-4xl">Submit a Mic</h1>
          <p className="pt-2 text-slate-500 text-sm">
            Know of an open mic that&apos;s not on the list? Let us know and we&apos;ll get it added.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Mic info */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1">
              Mic Info
            </h2>

            <div>
              <label htmlFor="name" className={labelClass}>Mic Name *</label>
              <input id="name" name="name" type="text" required className={inputClass} placeholder="e.g. Tuesday Night Comedy" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="borough" className={labelClass}>Borough *</label>
                <select id="borough" name="borough" required className={selectClass} defaultValue="">
                  <option value="" disabled>Select borough</option>
                  {boroughs.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="day" className={labelClass}>Day *</label>
                <select id="day" name="day" required className={selectClass} defaultValue="">
                  <option value="" disabled>Select day</option>
                  {days.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className={labelClass}>Start Time *</label>
                <input id="start_time" name="start_time" type="time" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="end_time" className={labelClass}>End Time</label>
                <input id="end_time" name="end_time" type="time" className={inputClass} />
              </div>
            </div>

            <div>
              <label htmlFor="cost" className={labelClass}>Cost *</label>
              <input id="cost" name="cost" type="text" required className={inputClass} placeholder="e.g. Free, $5, 2 drink minimum" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue_type" className={labelClass}>Venue Type</label>
                <input id="venue_type" name="venue_type" type="text" className={inputClass} placeholder="e.g. Bar, Comedy Club, Cafe" />
              </div>
              <div>
                <label htmlFor="stage_time" className={labelClass}>Stage Time</label>
                <input id="stage_time" name="stage_time" type="text" className={inputClass} placeholder="e.g. 5 minutes" />
              </div>
            </div>

            <div>
              <label htmlFor="signup_info" className={labelClass}>Signup Info</label>
              <input id="signup_info" name="signup_info" type="text" className={inputClass} placeholder="e.g. Sign up at the door, Bucket pull" />
            </div>

            <div>
              <label htmlFor="schedule" className={labelClass}>Schedule</label>
              <input id="schedule" name="schedule" type="text" className={inputClass} placeholder="e.g. Weekly, Every other week, First Tuesday of month" />
            </div>

            {/* Venue info */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              Venue
            </h2>

            <div>
              <label htmlFor="venue" className={labelClass}>Venue Name *</label>
              <input id="venue" name="venue" type="text" required className={inputClass} placeholder="e.g. The Stand" />
            </div>

            <div>
              <label htmlFor="street_address" className={labelClass}>Street Address *</label>
              <input id="street_address" name="street_address" type="text" required className={inputClass} placeholder="e.g. 239 3rd Ave" />
            </div>

            <div>
              <label htmlFor="neighborhood" className={labelClass}>Neighborhood</label>
              <input id="neighborhood" name="neighborhood" type="text" className={inputClass} placeholder="e.g. East Village, Williamsburg" />
            </div>

            {/* Host & social */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              Host & Social
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="host_name" className={labelClass}>Host Name</label>
                <input id="host_name" name="host_name" type="text" className={inputClass} />
              </div>
              <div>
                <label htmlFor="host_instagram" className={labelClass}>Host Instagram</label>
                <input id="host_instagram" name="host_instagram" type="text" className={inputClass} placeholder="@handle" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="instagram" className={labelClass}>Mic Instagram</label>
                <input id="instagram" name="instagram" type="text" className={inputClass} placeholder="@handle" />
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>Website</label>
                <input id="website" name="website" type="text" className={inputClass} placeholder="https://" />
              </div>
            </div>

            {/* Extra */}
            <h2 className="font-bold text-lg text-slate-800 border-b border-slate-200 pb-1 mt-2">
              Anything Else
            </h2>

            <div>
              <label htmlFor="notes" className={labelClass}>Notes</label>
              <textarea id="notes" name="notes" rows={3} className={inputClass} placeholder="Anything else we should know about this mic?" />
            </div>

            <div>
              <label htmlFor="submitter_email" className={labelClass}>Your Email (optional)</label>
              <input id="submitter_email" name="submitter_email" type="email" className={inputClass} placeholder="In case we have questions" />
            </div>

            {status === 'error' && (
              <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 px-6 rounded-lg font-semibold transition-colors mt-2"
            >
              {status === 'submitting' ? 'Submitting...' : 'Submit Mic'}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default SubmitMicForm;
