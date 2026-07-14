import Link from 'next/link';
import { ClubListItem, clubSlug } from '@/lib/services/clubs.service';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';

export default function ClubCard({ club }: { club: ClubListItem }) {
  return (
    <div
      className={`bg-white border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
        club.borough || ''
      )} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {club.image && (
        <Link href={`/clubs/${clubSlug(club.name)}`} tabIndex={-1} aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={club.image}
            alt=""
            loading="lazy"
            className="w-full h-36 object-cover bg-slate-100 border-b border-slate-100 hover:opacity-95 transition-opacity"
          />
        </Link>
      )}
      <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base lg:text-lg font-semibold text-slate-900">
            <Link
              href={`/clubs/${clubSlug(club.name)}`}
              className="hover:underline decoration-slate-400 underline-offset-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {club.name}
            </Link>
          </p>
          <p className="text-slate-600 text-sm lg:text-base">
            {club.address}
            {club.neighborhood && <span className="text-slate-500"> · {club.neighborhood}</span>}
          </p>
        </div>
        {club.borough && (
          <span
            className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBoroughBadgeClasses(
              club.borough
            )}`}
          >
            {getBoroughDisplayShort(club.borough)}
          </span>
        )}
      </div>
      {club.description && (
        <p className="pt-2 text-sm leading-6 text-slate-600">{club.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-2 pt-3">
        {club.website && (
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Website
          </a>
        )}
        {club.instagram && (
          <a
            href={`https://instagram.com/${club.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`${club.name} on Instagram`}
          >
            @{club.instagram}
          </a>
        )}
        {club.address && (
          <a
            href={`https://maps.google.com/maps?q=${encodeURIComponent(`${club.name}, ${club.address}, New York NY ${club.zipcode || ''}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Directions
          </a>
        )}
      </div>
      </div>
    </div>
  );
}
