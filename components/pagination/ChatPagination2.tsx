'use client';

import { useContext } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MicListingContext } from '@/lib/context/MicListingContext';

const ChatPagination2 = () => {
  const { mics } = useContext(MicListingContext);
  const currentPage = Number(useSearchParams().get('pageNo')) || 1;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(Number(mics?.totalMics) / Number(mics?.limit)) || 1;

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNo', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <nav className="flex items-center gap-1 justify-center pb-32" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handleChange(currentPage - 1)}
        className="px-3 py-1.5 text-sm rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 text-slate-400">...</span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => handleChange(page as number)}
            className={`px-3 py-1.5 text-sm rounded border transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => handleChange(currentPage + 1)}
        className="px-3 py-1.5 text-sm rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </nav>
  );
};

export default ChatPagination2;
