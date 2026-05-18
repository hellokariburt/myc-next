import Link from 'next/link';
import { MicListItem } from '@/lib/types/mic';
import MicListCard from '../mic/MicListCard';

interface Props {
  mics: MicListItem[];
}

export default function UpcomingMics({ mics }: Props) {
  if (mics.length === 0) return null;

  return (
    <section
      aria-labelledby="upcoming-mics-heading"
      className="w-full max-w-5xl mt-20"
    >
      <div className="flex flex-col items-center text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Up next
        </p>
        <h2
          id="upcoming-mics-heading"
          className="font-bold text-xl md:text-2xl text-slate-900 mt-1"
        >
          The next mics in NYC
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {mics.map((mic) => (
          <MicListCard key={mic.id} mic={mic} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Link
          href="/mics/tonight"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-400 hover:decoration-slate-700"
        >
          See all mics tonight →
        </Link>
      </div>
    </section>
  );
}
