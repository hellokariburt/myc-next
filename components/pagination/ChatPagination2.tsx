'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMicSearch } from '@/lib/hooks/useMicSearch';

const ChatPagination2 = () => {
  const { mics } = useMicSearch();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('pageNo')) || 1;
  const router = useRouter();
  const pathname = usePathname();
  const totalPages = Math.ceil(Number(mics?.totalMics) / Number(mics?.limit)) || 1;

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('pageNo', String(page));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <nav className="flex items-center gap-1 justify-center pb-16" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => handleChange(currentPage - 1)}
        aria-label="Previous page"
        className="px-3 py-2 text-sm rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-1 text-slate-400" aria-hidden="true">...</span>
        ) : (
          <button
            type="button"
            key={page}
            onClick={() => handleChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`px-3 py-2 text-sm rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        aria-label="Next page"
        className="px-3 py-2 text-sm rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </nav>
  );
};

export default ChatPagination2;
