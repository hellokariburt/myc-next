'use client';

import {
  IconExternalLink,
  IconMapPin,
  IconBrandInstagram,
  IconMail,
  IconClock,
  IconCalendar,
  IconCurrencyDollar,
} from '@tabler/icons-react';

import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import MicHosts from './MicHosts';

const MicPage = ({ mic }: { mic: any }) => {
  const directionsUrl = mic?.mic_address?.street_name
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${mic.mic_address.venue}, ${mic.mic_address.street_name}, New York, NY`
      )}`
    : null;

  return (
    <div className="flex flex-col w-full lg:w-[50%] pt-24 pb-16 px-4 lg:px-8 lg:min-h-[100vh]">
      {/* Main card */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8">
        {/* Mic name + venue */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 leading-tight">
          {mic?.name}
        </h1>
        <p className="text-lg font-semibold text-slate-700 mt-1">{mic?.mic_address?.venue}</p>
        {mic?.neighborhood && (
          <p className="text-sm text-slate-500">{mic.neighborhood}</p>
        )}

        {/* Quick info row */}
        <div className="flex flex-wrap gap-3 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
            <IconCalendar size={16} />
            {capitalizeDay(mic.day.toString())}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
            <IconClock size={16} />
            {changeTime(mic?.start_time)}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            mic?.cost_id === 1
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
          >
            <IconCurrencyDollar size={16} />
            {mic?.cost_id === 1 ? 'Free' : mic?.mic_cost?.cost_amount}
          </span>
          {mic?.mic_occurrence?.schedule && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 text-sm">
              {mic.mic_occurrence.schedule}
            </span>
          )}
        </div>

        {/* Address */}
        <div className="mt-5 text-slate-600">
          <div className="flex flex-wrap gap-1 text-base">
            {mic?.mic_address?.unit_number && (
              <span>{mic.mic_address.unit_number}</span>
            )}
            <span>{mic?.mic_address?.street_name},</span>
            <span className="font-semibold">{capitalizeDay(mic.borough.toString())}</span>
          </div>
        </div>

        {/* Get Directions CTA */}
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors w-fit mt-5"
          >
            <IconMapPin size={20} />
            Get Directions
          </a>
        )}

        {/* Divider */}
        <hr className="my-6 border-slate-200" />

        {/* Details section */}
        <div className="flex flex-col gap-3 text-base">
          <MicHosts mic={mic} />

          {mic?.signup_instructions && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Signup</span>
              <span className="text-slate-700">{mic.signup_instructions.instructions}</span>
            </div>
          )}

          {mic?.email_address && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Email</span>
              <a
                href={`mailto:${mic.email_address}`}
                className="text-blue-600 hover:text-blue-800 underline underline-offset-2 flex items-center gap-1"
              >
                <IconMail size={16} />
                {mic.email_address}
              </a>
            </div>
          )}

          {mic?.instagram && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Instagram</span>
              <a
                href={`https://instagram.com/${mic.instagram.replace(/^@/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline underline-offset-2 flex items-center gap-1"
              >
                <IconBrandInstagram size={16} />
                {mic.instagram}
              </a>
            </div>
          )}

          {mic?.website && /^https?:\/\//i.test(mic.website) && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide shrink-0">Website</span>
              <a
                className="text-blue-600 hover:text-blue-800 underline underline-offset-2 flex items-center gap-1"
                href={mic.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                <IconExternalLink size={16} />
                Visit site
              </a>
            </div>
          )}
        </div>

        {/* Confirmed badge */}
        {mic?.confirmed && (
          <p className="text-xs text-slate-400 mt-6">
            Verified: {mic.confirmed.slice(0, 10)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MicPage;
