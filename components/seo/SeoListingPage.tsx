import Link from 'next/link';
import { getMics } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { MicListItem } from '@/lib/types/mic';
import { ALL_BOROUGHS, ALL_DAYS } from '@/lib/types/api';
import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { getBoroughColor, getBoroughBorderColor } from '@/lib/utils/boroughColor';
import PageLayout from '../pagelayout/PageLayout';

interface SeoListingProps {
  title: string;
  subtitle: string;
  borough?: string[];
  day?: string[];
  free?: boolean;
}

export async function SeoListingPage({ title, subtitle, borough, day, free }: SeoListingProps) {
  const { mics, count } = await getMics({
    borough: borough ?? [...ALL_BOROUGHS],
    day: day ?? [...ALL_DAYS],
    limit: 100,
    offset: 0,
    start_time: '00:00:00',
    cost: free ? 'true' : 'false',
  });

  const serialized = serialize(mics) as unknown as MicListItem[];

  return (
    <PageLayout className="bg-[#F5F5F5]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 mb-1">{subtitle}</p>
        <p className="text-base font-semibold text-slate-800 mb-6">
          {count} {free ? 'free ' : ''}mic{count !== 1 ? 's' : ''} found
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {serialized.map((mic) => (
            <Link
              key={mic.id}
              href={`/mics/${mic.id}`}
              className={`flex group bg-white border border-slate-200 border-l-4 ${getBoroughBorderColor(mic.borough || '')} rounded-xl p-4 hover:shadow-lg hover:border-blue-500 shadow-sm transition-all`}
            >
              <div className="flex flex-row gap-3 lg:gap-6 min-w-0">
                <div className={`pr-2 lg:pr-4 pt-1 border-r-2 ${getBoroughBorderColor(mic.borough || '')} text-sm lg:text-base shrink-0 w-[80px] lg:w-auto`}>
                  <p className="font-bold">{capitalizeDay(mic.day || '')}</p>
                  <p>{changeTime(mic.start_time || '')}</p>
                  {mic.mic_occurrence?.schedule && (
                    <p className="text-slate-500 text-xs lg:text-sm pt-4">{mic.mic_occurrence.schedule}</p>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="lg:text-2xl text-lg font-bold text-blue-700 group-hover:underline group-hover:decoration-dashed truncate">
                    {mic.name}
                  </p>
                  <p className="text-slate-700 font-bold text-sm lg:text-base truncate">{mic.mic_address?.venue}</p>
                  <div className="flex flex-row flex-wrap text-slate-600 text-sm lg:text-base">
                    {mic.mic_address && mic.mic_address.unit_number > 0 && (
                      <span className="pr-1">{mic.mic_address.unit_number} </span>
                    )}
                    <span className="pr-1">{mic.mic_address?.street_name},</span>
                    <span className={`font-bold ${getBoroughColor(mic.borough || '')}`}>{capitalizeDay(mic.borough || '')}</span>
                  </div>
                  <div className="pt-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ${
                      !mic.mic_cost?.cost_amount || mic.mic_cost.cost_amount.includes('Free')
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {mic.mic_cost?.cost_amount || 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {serialized.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            No mics found matching these filters. <Link href="/mics" className="text-blue-600 underline">Browse all mics</Link>.
          </p>
        )}

        <div className="text-center pt-4">
          <Link
            href="/mics"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
          >
            Search all mics with filters
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
