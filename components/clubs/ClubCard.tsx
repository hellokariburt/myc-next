import Image from 'next/image';
import Link from 'next/link';
import type { ClubListItem } from '@/lib/services/clubs.service';
import { nameSlug as clubSlug } from '@/lib/utils/nameSlug';
import { t } from '@/lib/i18n';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
  getBoroughBanner,
} from '@/lib/utils/boroughColor';

export default function ClubCard({ club }: { club: ClubListItem }) {
  const micLabel =
    club.micCount === 1
      ? t('clubs.card.micCountOne', { count: club.micCount })
      : t('clubs.card.micCountMany', { count: club.micCount });
  const stageTimeBits = [club.micCount > 0 && micLabel].filter(Boolean);

  return (
    <Link
      href={`/clubs/${clubSlug(club.name)}`}
      aria-label={`${club.name} — ${club.address || ''}${
        stageTimeBits.length ? `, ${stageTimeBits.join(', ')}` : ''
      }`}
      className={`group flex flex-col bg-white border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
        club.borough || ''
      )} rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      {club.image ? (
        <div
          className={`relative w-full h-36 border-b border-slate-100 ${
            club.image.includes('.logo.') ? getBoroughBanner(club.borough || '') : 'bg-slate-100'
          }`}
        >
          <Image
            src={club.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 45vw, 100vw"
            className={club.image.includes('.logo.') ? 'object-contain p-5' : 'object-cover'}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className={`w-full h-36 flex items-center justify-center px-6 ${getBoroughBanner(club.borough || '')}`}
        >
          <span className="font-display uppercase text-2xl text-white/95 text-center leading-none">
            {club.name}
          </span>
        </div>
      )}
      <div className="px-5 py-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-base lg:text-lg font-semibold text-slate-900 group-hover:underline decoration-slate-400 underline-offset-2">
            {club.name}
          </p>
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
        <p className="text-slate-600 text-sm lg:text-base">
          {club.address}
          {club.neighborhood && <span className="text-slate-500"> · {club.neighborhood}</span>}
        </p>
        {club.description && (
          <p className="pt-2 text-sm leading-6 text-slate-600 line-clamp-2">{club.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-3 mt-auto">
          {club.micCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-200">
              {micLabel}
            </span>
          )}
          {club.showCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
              {club.showCount} show{club.showCount === 1 ? '' : 's'}
            </span>
          )}
          <span className="ml-auto text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
            {t('clubs.card.details')}
          </span>
        </div>
      </div>
    </Link>
  );
}
