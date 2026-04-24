'use client';

import { useState, useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';
import MobileFilter from './MobileFilter';

const MobileFilterButton = () => {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (!opened) return undefined;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpened(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [opened]);

  return (
    <div>
      <button
        type="button"
        aria-label="Update mic search"
        onClick={() => setOpened(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
      >
        <IconSearch size={18} />
        Update search
      </button>
      {opened && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setOpened(false)}
            role="presentation"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Update mic search"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 w-[90vw] max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Update Mic Search</h2>
              <button
                type="button"
                onClick={() => setOpened(false)}
                className="text-slate-400 hover:text-slate-600 text-xl"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <MobileFilter onSubmit={() => setOpened(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default MobileFilterButton;
