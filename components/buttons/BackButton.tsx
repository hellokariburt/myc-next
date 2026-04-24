'use client';

import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium py-1 text-sm transition-colors"
    >
      <IconArrowLeft size={18} />
      Back to listings
    </button>
  );
}
