'use client';

import {
  IconExternalLink,
  IconMapPin,
  IconMail,
} from '@tabler/icons-react';

import { MicDetail } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import {
  getBoroughBorderColor,
  getBoroughEyebrow,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';
import extractHandles from '@/lib/utils/extractHandles';
import { isFreeCost } from '@/lib/utils/isFree';
import { linkifyText } from '@/lib/utils/linkifyText';
import MicHosts from './MicHosts';

const labelClass =
  'text-xs font-semibold uppercase tracking-wider text-slate-500 shrink-0';

const MicPage = ({ mic }: { mic: MicDetail }) => {
  const directionsUrl = mic?.mic_address?.street_name
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${mic.mic_address.venue}, ${mic.mic_address.street_name}, New York, NY`
      )}`
    : null;

  const isFree = isFreeCost(mic?.mic_cost?.cost_amount);

  return (
    <div className="flex flex-col w-full pt-6 pb-16 px-4 lg:px-8">
      <div
        className={`bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 border-l-[6px] ${getBoroughBorderColor(
          mic.borough || ''
        )} p-6 md:p-8`}
      >
        {/* Eyebrow */}
        <p
          className={`text-xs font-semibold uppercase tracking-wider mb-2 ${getBoroughEyebrow(
            mic.borough || ''
          )}`}
        >
          {capitalizeDay(mic.day || '')} · {getBoroughDisplayShort(mic.borough || '')} Open Mic
        </p>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900">
          {mic?.name}
        </h1>
        <p className="text-base lg:text-lg text-slate-600 mt-2">
          {mic?.mic_address?.venue}
          {mic?.mic_address?.neighborhood && (
            <span className="text-slate-500"> · {mic.mic_address.neighborhood}</span>
          )}
        </p>

        {/* Showtime hero */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <p className={labelClass}>When</p>
            <p className="mt-1 text-2xl md:text-3xl font-bold text-slate-900 tabular-nums leading-tight">
              {capitalizeDay(mic.day || '')}s · {changeTime(mic.start_time || '')}
            </p>
            {mic?.mic_occurrence?.schedule && (
              <p className="text-sm text-slate-600 mt-1">{mic.mic_occurrence.schedule}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center self-start sm:self-end px-3 py-1 rounded-full text-sm font-semibold ring-1 ${
              isFree
                ? 'bg-green-50 text-green-700 ring-green-200'
                : 'bg-amber-50 text-amber-700 ring-amber-200'
            }`}
          >
            {isFree ? 'Free' : mic?.mic_cost?.cost_amount}
          </span>
        </div>

        {/* Address + directions */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-slate-600">
            {mic.mic_address && mic.mic_address.unit_number > 0 && (
              <span>{mic.mic_address.unit_number} </span>
            )}
            <span>{mic?.mic_address?.street_name}</span>
          </div>
          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors w-fit"
            >
              <IconMapPin size={18} />
              Get Directions
            </a>
          )}
        </div>

        <div className="my-8 h-px bg-slate-200" />

        {/* Detail rows — label-on-left grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-y-5 gap-x-6">
          <MicHosts mic={mic} labelClass={labelClass} />

          {mic?.signup_instructions?.instructions && (
            <>
              <dt className={`${labelClass} pt-0.5`}>Signup</dt>
              <dd className="text-slate-800 leading-relaxed">
                {linkifyText(mic.signup_instructions.instructions)}
              </dd>
            </>
          )}

          {mic?.email_address && (
            <>
              <dt className={`${labelClass} pt-0.5`}>Email</dt>
              <dd>
                <a
                  href={`mailto:${mic.email_address}`}
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline underline-offset-2"
                >
                  <IconMail size={16} />
                  {mic.email_address}
                </a>
              </dd>
            </>
          )}

          {mic?.instagram && (
            <>
              <dt className={`${labelClass} pt-0.5`}>Instagram</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1">
                {extractHandles(mic.instagram).map((handle) => (
                  <a
                    key={handle}
                    href={`https://instagram.com/${handle.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  >
                    @{handle.replace(/^@/, '')}
                  </a>
                ))}
              </dd>
            </>
          )}

          {mic?.website && /^https?:\/\//i.test(mic.website) && (
            <>
              <dt className={`${labelClass} pt-0.5`}>Website</dt>
              <dd>
                <a
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 underline underline-offset-2"
                  href={mic.website}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconExternalLink size={16} />
                  Visit site
                </a>
              </dd>
            </>
          )}
        </dl>

        {mic?.confirmed && (
          <p className="text-xs text-slate-500 mt-8">{mic.confirmed}</p>
        )}
      </div>
    </div>
  );
};

export default MicPage;
